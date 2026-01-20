(function () {
  "use strict";

  /**
   * =========================
   *  Small helpers
   * =========================
   */
  function isAbsoluteUrl(s) {
    return (
      typeof s === "string" &&
      (s.indexOf("http://") === 0 ||
        s.indexOf("https://") === 0 ||
        s.indexOf("//") === 0)
    );
  }

  // Локализованная дата как в Episode: Utils.parseTime(...).full
  // Нужно "8 Апреля" (без года) -> убираем год в конце если это YYYY.
  function formatDayMonthFromLampa(iso) {
    if (!iso) return "";
    try {
      var full = Lampa.Utils.parseTime(iso).full || "";
      full = String(full).trim();
      if (!full) return "";

      var parts = full.split(/\s+/);
      if (parts.length >= 3 && /^\d{4}$/.test(parts[parts.length - 1])) {
        parts.pop();
        return parts.join(" ");
      }
      return full;
    } catch (e) {
      return String(iso);
    }
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

  function isTimetableRow(element) {
    if (!element || !Array.isArray(element.results) || !element.results.length)
      return false;

    var r = element.results[0];
    return !!(
      r &&
      (r.episode ||
        (r.season_number != null && r.episode_number != null && r.air_date))
    );
  }

  function isShotsRow(element) {
    if (!element) return false;
    var t = String(element.title || element.name || "").toLowerCase();
    return t === "shots";
  }

  /**
   * =========================
   *  Normalizers
   * =========================
   */

  // Episodes row: ensure poster/backdrop exists (can use episode still or series poster/backdrop).
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

  // Shots row: screen is absolute URL — must remain absolute.
  function normalizeShotsThumb(it) {
    if (!it) return;

    if (!it.backdrop_path && it.screen) it.backdrop_path = it.screen;
    if (!it.poster_path && it.screen) it.poster_path = it.screen;

    // fallback: tmdb relative poster for movie/series
    if (!it.poster_path && it.card_poster) it.poster_path = it.card_poster;

    // some cards expect title/year
    if (!it.title && it.card_title) it.title = it.card_title;
    if (!it.release_date && it.card_year)
      it.release_date = String(it.card_year) + "-01-01";
  }

  /**
   * =========================
   *  Episodes overlay (only: "Эпизод N" + "8 Апреля")
   * =========================
   */
  function decorateTimetableRowReactive(rowNode, results) {
    var root = rowNode && rowNode.jquery ? rowNode[0] : rowNode;
    if (!root || !results || !results.length) return;

    function apply() {
      var $root = $(root);
      var $cards = $root.find(".card");
      if (!$cards.length) return false;

      $cards.each(function (i) {
        var r = results[i];
        if (!r) return;

        var ep = r.episode || r;
        var air = ep.air_date;
        var epNum = ep.episode_number;

        if (!air || epNum == null) return;

        var $card = $(this);
        var $view = $card.find(".card__view");
        if (!$view.length) $view = $card;

        // idempotent
        $view.find(".plugin-epmeta--episode").remove();
        $view.css("position", "relative");

        var epTitle = (ep.name || "").trim() || "Эпизод " + epNum;
        var dateText = formatDayMonthFromLampa(air);

        var $meta = $(
          '<div class="plugin-epmeta--episode">' +
            '<div class="plugin-epmeta__ep"></div>' +
            '<div class="plugin-epmeta__date"></div>' +
            "</div>"
        );

        $meta.find(".plugin-epmeta__ep").text(epTitle);
        $meta.find(".plugin-epmeta__date").text(dateText);

        $view.append($meta);
      });

      return true;
    }

    if (apply()) return;

    var obs = new MutationObserver(function () {
      if (apply()) obs.disconnect();
    });

    obs.observe(root, { childList: true, subtree: true });
  }

  /**
   * =========================
   *  Safe wrapper for Lampa.Api.img / TMDB.img / TMDB.image
   *  - keep absolute URLs intact (Shots)
   * =========================
   */
  function absUrlSafe(fn) {
    if (typeof fn !== "function") return fn;
    if (fn.__abs_url_safe) return fn;

    function patched(path, size) {
      if (isAbsoluteUrl(path)) return path;
      return fn.call(this, path, size);
    }

    patched.__abs_url_safe = true;
    patched.__orig = fn;
    return patched;
  }

  function reactiveWrap(obj, key) {
    if (!obj) return;
    var wrapped = absUrlSafe(obj[key]);

    try {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function () {
          return wrapped;
        },
        set: function (next) {
          wrapped = absUrlSafe(next);
        },
      });

      // ensure current is wrapped
      wrapped = absUrlSafe(obj[key]);
    } catch (e) {
      // fallback: just assign
      obj[key] = wrapped;
    }
  }

  function reactiveWrapObject(root, key, onSet) {
    if (!root) return;
    var current = root[key];

    try {
      Object.defineProperty(root, key, {
        configurable: true,
        enumerable: true,
        get: function () {
          return current;
        },
        set: function (next) {
          current = next;
          try {
            onSet(next);
          } catch (e) {}
        },
      });

      if (current) onSet(current);
    } catch (e) {
      // ignore
    }
  }

  /**
   * =========================
   *  Info panel: title + overview + head/details
   *  - shows "loading" if overview empty until TMDB response
   *  - cache updates description (fix "description becomes empty on second focus")
   * =========================
   */
  function InfoPanel() {
    var html;
    var timer;
    var network = new Lampa.Reguest();
    var cache = {};
    var last_url = "";
    var $desc = null;

    function setDescription(text) {
      if (!$desc) $desc = html.find(".new-interface-info__description");
      $desc.text(text == null ? "" : String(text));
    }

    function setLoading() {
      setDescription(Lampa.Lang.translate("loading"));
    }

    function applyDescription(details) {
      var ov =
        details && details.overview ? String(details.overview).trim() : "";
      if (ov) setDescription(ov);
      else setDescription(Lampa.Lang.translate("full_notext"));
    }

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
      $desc = html.find(".new-interface-info__description");
    };

    this.update = function (data) {
      data = data || {};

      html
        .find(".new-interface-info__head,.new-interface-info__details")
        .text("---");

      html
        .find(".new-interface-info__title")
        .text(data.title || data.name || "");

      var baseDesc = (data.overview || "").trim();
      if (baseDesc) setDescription(baseDesc);
      else setLoading();

      if (data.backdrop_path) {
        Lampa.Background.change(Lampa.Api.img(data.backdrop_path, "w200"));
      }

      if (data.id) this.load(data);
    };

    this.draw = function (data) {
      var year = (
        (data.release_date || data.first_air_date || "0000") + ""
      ).slice(0, 4);
      var vote = parseFloat((data.vote_average || 0) + "").toFixed(1);

      var head = [];
      var details = [];

      var countries = Lampa.Api.sources.tmdb.parseCountries(data);
      var pg = Lampa.Api.sources.tmdb.parsePG(data);

      if (year !== "0000") head.push("<span>" + year + "</span>");
      if (countries.length > 0) head.push(countries.join(", "));

      if (vote > 0) {
        details.push(
          '<div class="full-start__rate"><div>' +
            vote +
            "</div><div>TMDB</div></div>"
        );
      }

      if (data.genres && data.genres.length > 0) {
        details.push(
          data.genres
            .map(function (item) {
              return Lampa.Utils.capitalizeFirstLetter(item.name);
            })
            .join(" | ")
        );
      }

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

      last_url = url;

      if (cache[url]) {
        applyDescription(cache[url]);
        return this.draw(cache[url]);
      }

      timer = setTimeout(function () {
        network.clear();
        network.timeout(5000);

        var localUrl = url;

        network.silent(localUrl, function (details) {
          cache[localUrl] = details || {};

          if (last_url !== localUrl) return;

          applyDescription(details);
          _this.draw(details);
        });
      }, 250);
    };

    // needed: InteractionLine expects it in some flows
    this.empty = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      if (html) html.remove();
      cache = {};
      html = null;
      $desc = null;
    };
  }

  /**
   * =========================
   *  New interface component
   * =========================
   */
  function component(object) {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true,
      scroll_by_item: true,
    });

    var items = [];
    var html = $(
      '<div class="new-interface">' +
        '<img class="full-start__background">' +
        '<div class="full-start__overlay"></div>' +
        "</div>"
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

    // Utils.createInstance emit compatibility
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

      info = new InfoPanel(object);
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
      if (new_background === background_last) return;

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
        }, 250);
      }, 650);
    };

    this.append = function (element) {
      var _this3 = this;

      if (element.ready) return;
      element.ready = true;

      // normalize special rows
      var timetable = isTimetableRow(element);
      if (timetable && Array.isArray(element.results)) {
        element.results.forEach(normalizeEpisodeThumb);
      }

      var shots = isShotsRow(element);
      if (shots && Array.isArray(element.results)) {
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

      // Some builds/plugins expect .use on row instance
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

      // Let host inject hooks if any
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

      // ✅ fix: info.empty exists, but keep guard anyway
      if (info && typeof info.empty === "function") {
        item.onFocusMore = info.empty.bind(info);
      }

      var rowNode = item.render();
      scroll.append(rowNode);
      items.push(item);

      if (timetable) {
        decorateTimetableRowReactive(rowNode, element.results);
      }
    };

    this.back = function () {
      Lampa.Activity.backward();
    };

    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);

      if (!viewall) {
        lezydata.slice(0, active + 2).forEach(this.append.bind(this));
      }

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

  /**
   * =========================
   *  Plugin start
   * =========================
   */
  function startPlugin() {
    window.plugin_interface_ready = true;

    // Keep absolute URLs for posters/backdrops (Shots)
    reactiveWrap(Lampa.Api, "img");
    reactiveWrap(Lampa.TMDB, "image");
    reactiveWrap(Lampa.TMDB, "img");

    reactiveWrapObject(Lampa, "TMDB", function (tmdb) {
      reactiveWrap(tmdb, "image");
      reactiveWrap(tmdb, "img");
    });

    reactiveWrapObject(Lampa, "Api", function (api) {
      reactiveWrap(api, "img");
    });

    // PR #281: replace via Utils.createInstance
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
            createInstance: function () {
              return new component(element);
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
      // fallback for older Lampa
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

    // styles
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
        .new-interface .card.card--wide + .card-more .card-more__box { padding-bottom: 95%; }
        .new-interface .card.card--wide .card-watched { display: none !important; }

        /* Episode overlay: only episode name + day/month */
        .new-interface .plugin-epmeta--episode{
          position:absolute;
          left:0;
          right:0;
          bottom:0;
          padding:0.6em 0.75em;
          background: linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,0));
        }
        .new-interface .plugin-epmeta--episode .plugin-epmeta__ep{
          font-size: 1.05em;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 0.15em;
        }
        .new-interface .plugin-epmeta--episode .plugin-epmeta__date{
          font-size: 0.95em;
          line-height: 1.15;
          opacity: 0.9;
        }

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
