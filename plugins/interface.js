(function () {
  "use strict";

  function create() {
    var html;
    var timer;
    var network = new Lampa.Reguest();
    var loaded = {};

    this.create = function () {
      html = $(
        `<div class="new-interface-info">
        <div class="new-interface-info__body">
        <div class="new-interface-info__head"></div>
        <div class="new-interface-info__title"></div>
        <div class="new-interface-info__details"></div>
        <div class="new-interface-info__description"></div>
        </div>
        </div>`
      );
    };

    this.update = function (data) {
      html
        .find(".new-interface-info__head,.new-interface-info__details")
        .text("---");

      html
        .find(".new-interface-info__title")
        .text(data.title || data.name || "");

      html
        .find(".new-interface-info__description")
        .text(data.overview || Lampa.Lang.translate("full_notext"));

      if (data.backdrop_path) {
        Lampa.Background.change(Lampa.Api.img(data.backdrop_path, "w200"));
      }

      if (data.id) this.load(data);
    };

    this.draw = function (data) {
      var create = (
        (data.release_date || data.first_air_date || "0000") + ""
      ).slice(0, 4);
      var vote = parseFloat((data.vote_average || 0) + "").toFixed(1);
      var head = [];
      var details = [];
      var countries = Lampa.Api.sources.tmdb.parseCountries(data);
      var pg = Lampa.Api.sources.tmdb.parsePG(data);

      if (create !== "0000") head.push("<span>" + create + "</span>");
      if (countries.length > 0) head.push(countries.join(", "));
      if (vote > 0)
        details.push(
          '<div class="full-start__rate"><div>' +
            vote +
            "</div><div>TMDB</div></div>"
        );

      if (data.genres && data.genres.length > 0)
        details.push(
          data.genres
            .map(function (item) {
              return Lampa.Utils.capitalizeFirstLetter(item.name);
            })
            .join(" | ")
        );

      if (data.runtime)
        details.push(Lampa.Utils.secondsToTime(data.runtime * 60, true));

      if (pg)
        details.push(
          '<span class="full-start__pg" style="font-size: 0.9em;">' +
            pg +
            "</span>"
        );

      html.find(".new-interface-info__head").empty().append(head.join(", "));
      html
        .find(".new-interface-info__details")
        .html(
          details.join('<span class="new-interface-info__split">&#9679;</span>')
        );
    };

    this.load = function (data) {
      var _this = this;

      clearTimeout(timer);
      if (!data || !data.id) return;

      var url = Lampa.TMDB.api(
        (data.name ? "tv" : "movie") +
          "/" +
          data.id +
          "?api_key=" +
          Lampa.TMDB.key() +
          "&append_to_response=content_ratings,release_dates&language=" +
          Lampa.Storage.get("language")
      );

      if (loaded[url]) return this.draw(loaded[url]);

      timer = setTimeout(function () {
        network.clear();
        network.timeout(5000);
        network.silent(url, function (movie) {
          loaded[url] = movie;
          _this.draw(movie);
        });
      }, 300);
    };

    this.render = function () {
      return html;
    };

    this.empty = function () {};

    this.destroy = function () {
      if (html) html.remove();
      loaded = {};
      html = null;
    };
  }

  function normalizeEpisodeThumb(it) {
    if (!it) return;

    var still = it.still_path || (it.episode && it.episode.still_path) || null;
    var card = it.card || (it.episode && it.episode.card) || null;

    if (!it.backdrop_path) {
      it.backdrop_path =
        still ||
        (card && (card.backdrop_path || card.poster_path)) ||
        it.poster_path ||
        null;
    }

    if (!it.poster_path) {
      it.poster_path =
        still ||
        (card && (card.poster_path || card.backdrop_path)) ||
        it.backdrop_path ||
        null;
    }
  }

  function normalizeShotsThumb(it) {
    if (!it) return;

    // главное превью
    if (!it.backdrop_path && it.screen) it.backdrop_path = it.screen;
    if (!it.poster_path && it.screen) it.poster_path = it.screen;

    // fallback: если вдруг где-то нужен постер фильма (TMDB-относительный путь)
    if (!it.poster_path && it.card_poster) it.poster_path = it.card_poster;

    // иногда Card ожидает title/year
    if (!it.title && it.card_title) it.title = it.card_title;
    if (!it.release_date && it.card_year)
      it.release_date = String(it.card_year) + "-01-01";
  }

  function component(object) {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true,
      scroll_by_item: true,
    });

    var items = [];
    var html = $(
      '<div class="new-interface"><img class="full-start__background"><div class="full-start__overlay"></div></div>'
    );
    var active = 0;
    var newlampa = Lampa.Manifest.app_digital >= 166;

    var info;
    var lezydata;

    var viewall =
      Lampa.Storage.field("card_views_type") == "view" ||
      Lampa.Storage.field("navigation_type") == "mouse";

    var background_img = html.find(".full-start__background");
    var background_last = "";
    var background_timer;

    this.emit = {};
    this.use = function (emit) {
      emit = emit || {};
      for (var k in emit) this.emit[k] = emit[k];

      if (typeof this.emit.onNext === "function") {
        var _this = this;
        this.next = function (resolve, reject) {
          return _this.emit.onNext.call(_this, resolve, reject);
        };
      }

      return this;
    };

    this.create = function () {
      if (this.emit && typeof this.emit.onCreate === "function") {
        this.emit.onCreate.call(this);
      }
    };

    this.empty = function () {
      var button;

      if (object.source == "tmdb") {
        button = $(
          '<div class="empty__footer"><div class="simple-button selector">' +
            Lampa.Lang.translate("change_source_on_cub") +
            "</div></div>"
        );
        button.find(".selector").on("hover:enter", function () {
          Lampa.Storage.set("source", "cub");
          Lampa.Activity.replace({ source: "cub" });
        });
      }

      var empty = new Lampa.Empty();
      html.append(empty.render(button));
      this.start = empty.start;
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.loadNext = function () {
      var _this = this;

      if (this.next && !this.next_wait && items.length) {
        this.next_wait = true;
        this.next(
          function (new_data) {
            _this.next_wait = false;
            new_data.forEach(_this.append.bind(_this));
            if (items[active + 1])
              Lampa.Layer.visible(items[active + 1].render(true));
          },
          function () {
            _this.next_wait = false;
          }
        );
      }
    };

    this.build = function (data) {
      var _this2 = this;

      lezydata = data;

      info = new create(object);
      info.create();

      scroll.minus(info.render());

      data.slice(0, viewall ? data.length : 2).forEach(this.append.bind(this));

      html.append(info.render());
      html.append(scroll.render());

      if (newlampa) {
        Lampa.Layer.update(html);
        Lampa.Layer.visible(scroll.render(true));
        scroll.onEnd = this.loadNext.bind(this);

        scroll.onWheel = function (step) {
          if (!Lampa.Controller.own(_this2)) _this2.start();
          if (step > 0) _this2.down();
          else if (active > 0) _this2.up();
        };
      }

      this.activity.loader(false);
      this.activity.toggle();
    };

    this.background = function (elem) {
      var base = elem && elem.card ? elem.card : elem;
      if (!base || !base.backdrop_path) return;

      var new_background = Lampa.Api.img(base.backdrop_path, "w1280");
      clearTimeout(background_timer);
      if (new_background == background_last) return;

      background_timer = setTimeout(function () {
        background_img.removeClass("loaded");

        background_img[0].onload = function () {
          background_img.addClass("loaded");
        };

        background_img[0].onerror = function () {
          background_img.removeClass("loaded");
        };

        background_last = new_background;

        setTimeout(function () {
          background_img[0].src = background_last;
        }, 300);
      }, 1000);
    };

    this.append = function (element) {
      var _this3 = this;

      if (element.ready) return;
      element.ready = true;

      if (element && Array.isArray(element.results)) {
        element.results.forEach(function (r) {
          if (r && (r.still_path || r.card || r.episode))
            normalizeEpisodeThumb(r);
        });
      }

      var isShots =
        element &&
        (String(element.title || "").toLowerCase() === "shots" ||
          String(element.name || "").toLowerCase() === "shots");

      if (isShots && element.results && Array.isArray(element.results)) {
        element.results.forEach(normalizeShotsThumb);
      }

      var item = new Lampa.InteractionLine(element, {
        url: element.url,
        card_small: true,
        cardClass: element.cardClass,
        genres: object.genres,
        object: object,
        card_wide: true,
        nomore: element.nomore,
      });

      if (item && typeof item.use !== "function") {
        item.use = function (payload) {
          payload = payload || {};
          this._emit = this._emit || {};
          for (var k in payload) this._emit[k] = payload[k];

          if (typeof payload.onMore === "function")
            this.onMore = payload.onMore;
          if (typeof payload.onInstance === "function")
            this.onInstance = payload.onInstance;
          if (typeof payload.module !== "undefined")
            this.module = payload.module;

          return this;
        };
      }

      if (this.emit && typeof this.emit.onInstance === "function") {
        try {
          this.emit.onInstance.call(this, item, element);
        } catch (e) {
          console.error(e);
        }
      }

      item.create();

      item.onDown = this.down.bind(this);
      item.onUp = this.up.bind(this);
      item.onBack = this.back.bind(this);

      item.onToggle = function () {
        active = items.indexOf(item);
      };

      var prevFocus = item.onFocus;
      var prevHover = item.onHover;

      item.onFocus = function (elem) {
        if (typeof prevFocus === "function") prevFocus(elem);
        var base = elem && elem.card ? elem.card : elem;
        info.update(base || {});
        _this3.background(elem || base || {});
      };

      item.onHover = function (elem) {
        if (typeof prevHover === "function") prevHover(elem);
        var base = elem && elem.card ? elem.card : elem;
        info.update(base || {});
        _this3.background(elem || base || {});
      };

      item.onFocusMore = info.empty.bind(info);

      scroll.append(item.render());
      items.push(item);
    };

    this.back = function () {
      Lampa.Activity.backward();
    };

    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      if (!viewall)
        lezydata.slice(0, active + 2).forEach(this.append.bind(this));
      items[active].toggle();
      scroll.update(items[active].render());
    };

    this.up = function () {
      active--;
      if (active < 0) {
        active = 0;
        Lampa.Controller.toggle("head");
      } else {
        items[active].toggle();
        scroll.update(items[active].render());
      }
    };

    this.start = function () {
      var _this4 = this;

      Lampa.Controller.add("content", {
        link: this,
        toggle: function () {
          if (_this4.activity.canRefresh()) return false;
          if (items.length) items[active].toggle();
        },
        update: function () {},
        left: function () {
          if (Navigator.canmove("left")) Navigator.move("left");
          else Lampa.Controller.toggle("menu");
        },
        right: function () {
          Navigator.move("right");
        },
        up: function () {
          if (Navigator.canmove("up")) Navigator.move("up");
          else Lampa.Controller.toggle("head");
        },
        down: function () {
          if (Navigator.canmove("down")) Navigator.move("down");
        },
        back: this.back,
      });

      Lampa.Controller.toggle("content");
    };

    this.refresh = function () {
      this.activity.loader(true);
      this.activity.need_refresh = true;
    };

    this.pause = function () {};
    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      network.clear();
      Lampa.Arrays.destroy(items);
      scroll.destroy();
      if (info) info.destroy();
      html.remove();
      items = null;
      network = null;
      lezydata = null;
    };
  }

  function isRootScreenObject(element) {
    if (!element || typeof element !== "object") return false;
    if (!(element.source === "tmdb" || element.source === "cub")) return false;
    if (!(element.component === "main" || element.component === "category"))
      return false;
    if (window.innerWidth < 767) return false;
    if (Lampa.Manifest.app_digital < 153) return false;
    return true;
  }

  function startPlugin() {
    window.plugin_interface_ready = true;

    function makeAbsUrlSafe(fn) {
      if (typeof fn !== "function") return fn;
      if (fn.__abs_url_safe) return fn;

      function patched(path, size) {
        if (typeof path === "string") {
          if (path.indexOf("http://") === 0 || path.indexOf("https://") === 0)
            return path;
          if (path.indexOf("//") === 0) return location.protocol + path;
        }
        return fn.call(this, path, size);
      }

      patched.__abs_url_safe = true;
      patched.__orig = fn;
      return patched;
    }

    function reactiveWrap(obj, key) {
      if (!obj) return false;

      let wrapped = makeAbsUrlSafe(obj[key]);

      try {
        Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: true,
          get() {
            return wrapped;
          },
          set(next) {
            wrapped = makeAbsUrlSafe(next);
          },
        });
        wrapped = makeAbsUrlSafe(obj[key]);
        return true;
      } catch (e) {
        obj[key] = wrapped;
        return false;
      }
    }

    reactiveWrap(Lampa.Api, "img");
    reactiveWrap(Lampa.TMDB, "image");
    reactiveWrap(Lampa.TMDB, "img");

    function reactiveWrapObject(root, objKey, onSet) {
      if (!root) return;
      let current = root[objKey];

      try {
        Object.defineProperty(root, objKey, {
          configurable: true,
          enumerable: true,
          get() {
            return current;
          },
          set(next) {
            current = next;
            try {
              onSet(next);
            } catch (e) {}
          },
        });
        if (current) onSet(current);
      } catch (e) {}
    }

    reactiveWrapObject(Lampa, "TMDB", (tmdb) => {
      reactiveWrap(tmdb, "image");
      reactiveWrap(tmdb, "img");
    });

    reactiveWrapObject(Lampa, "Api", (api) => {
      reactiveWrap(api, "img");
    });

    // --- PR #281: main создается через Utils.createInstance ---
    if (Lampa.Utils && typeof Lampa.Utils.createInstance === "function") {
      var originalCreateInstance = Lampa.Utils.createInstance;

      Lampa.Utils.createInstance = function (
        BaseClass,
        element,
        add_params,
        replace
      ) {
        element = element || {};
        add_params = add_params || {};

        if (isRootScreenObject(element)) {
          add_params = Object.assign({}, add_params, {
            createInstance: function (el) {
              return new component(el);
            },
          });
          replace = true;
        }

        return originalCreateInstance.call(
          this,
          BaseClass,
          element,
          add_params,
          replace
        );
      };
    } else {
      var old_interface = Lampa.InteractionMain;
      var new_interface = component;

      Lampa.InteractionMain = function (object) {
        var use = new_interface;
        if (!(object.source == "tmdb" || object.source == "cub"))
          use = old_interface;
        if (window.innerWidth < 767) use = old_interface;
        if (Lampa.Manifest.app_digital < 153) use = old_interface;
        return new use(object);
      };
    }

    Lampa.Template.add(
      "new_interface_style",
      `
      <style>
      .new-interface .card--small.card--wide { width: 18.3em; }
      .new-interface-info { position: relative; padding: 1.5em; height: 24em; }
      .new-interface-info__body { width: 80%; padding-top: 1.1em; }
      .new-interface-info__head { color: rgba(255,255,255,0.6); margin-bottom: 1em; font-size: 1.3em; min-height: 1em; }
      .new-interface-info__head span { color: #fff; }
      .new-interface-info__title {
        font-size: 4em; font-weight: 600; margin-bottom: 0.3em; overflow: hidden;
        -o-text-overflow: "."; text-overflow: "."; display: -webkit-box;
        -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical;
        margin-left: -0.03em; line-height: 1.3;
      }
      .new-interface-info__details {
        margin-bottom: 1.6em; display: flex; align-items: center; flex-wrap: wrap;
        min-height: 1.9em; font-size: 1.1em;
      }
      .new-interface-info__split { margin: 0 1em; font-size: 0.7em; }
      .new-interface-info__description {
        font-size: 1.2em; font-weight: 300; line-height: 1.5; overflow: hidden;
        -o-text-overflow: "."; text-overflow: "."; display: -webkit-box;
        -webkit-line-clamp: 4; line-clamp: 4; -webkit-box-orient: vertical;
        width: 70%;
      }
      .new-interface .card-more__box { padding-bottom: 95%; }
      .new-interface .full-start__background { height: calc(100vh + 6em); top: -6em; }
      .new-interface .full-start__overlay {
        position: absolute;
        width: 100%;
        height: calc(100vh + 6em);
        background: #0006; top: -6em;

        width: 90vw;
        background:
          linear-gradient(to right,
            rgba(0, 0, 0, 0.792) 0%,
            rgba(0, 0, 0, 0.504) 50%,
            rgba(0, 0, 0, 0.264) 70%, 
            rgba(0, 0, 0, 0.12) 80%, 
            rgba(0, 0, 0, 0) 100%
          );
      }
      .new-interface .full-start__rate { font-size: 1.3em; margin-right: 0; }
      .new-interface .card__promo { display: none; }
      .new-interface .card.card--wide+.card-more .card-more__box { padding-bottom: 95%; }
      .new-interface .card.card--wide .card-watched { display: none !important; }
      body.light--version .new-interface-info__body { width: 69%; padding-top: 1.5em; }
      body.light--version .new-interface-info { height: 25.3em; }
      body.advanced--animation:not(.no--animation) .new-interface .card--small.card--wide.focus .card__view{
        animation: animation-card-focus 0.2s
      }
      body.advanced--animation:not(.no--animation) .new-interface .card--small.card--wide.animate-trigger-enter .card__view{
        animation: animation-trigger-enter 0.2s forwards
      }
      </style>
      `
    );
    $("body").append(Lampa.Template.get("new_interface_style", {}, true));
  }

  if (!window.plugin_interface_ready) startPlugin();
})();
