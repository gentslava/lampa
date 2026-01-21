(function () {
  "use strict";

  /** Utils */

  function isAbsUrl(u) {
    return (
      typeof u === "string" &&
      (/^(https?:)?\/\//i.test(u) || /^data:/i.test(u) || /^blob:/i.test(u))
    );
  }

  function normalizeAbsUrl(u) {
    if (typeof u !== "string") return u;

    var m = u.match(
      /^(https?:\/\/image\.tmdb\.org\/t\/p\/[^/]+\/)(https?:\/\/.+)$/i
    );
    if (m) return m[2];

    m = u.match(/^(\/\/image\.tmdb\.org\/t\/p\/[^/]+\/)(https?:\/\/.+)$/i);
    if (m) return m[2];

    if (u.indexOf("//") === 0) return location.protocol + u;

    return u;
  }

  function extend(dst, src) {
    dst = dst || {};
    src = src || {};
    for (var k in src) dst[k] = src[k];
    return dst;
  }

  function safeCapFirst(s) {
    s = String(s || "");
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function makeAbsUrlSafe(fn) {
    if (typeof fn !== "function") return fn;
    if (fn.__abs_url_safe) return fn;

    function patched(path, size) {
      if (typeof path === "string" && isAbsUrl(path)) {
        return normalizeAbsUrl(path);
      }
      return fn.call(this, path, size);
    }

    patched.__abs_url_safe = true;
    patched.__orig = fn;
    return patched;
  }

  function reactiveWrap(obj, key) {
    if (!obj) return;
    try {
      var cur = makeAbsUrlSafe(obj[key]);
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function () {
          return cur;
        },
        set: function (next) {
          cur = makeAbsUrlSafe(next);
        },
      });
      obj[key] = obj[key];
    } catch (e) {
      obj[key] = makeAbsUrlSafe(obj[key]);
    }
  }

  function reactiveWrapObject(root, key, onSet) {
    if (!root) return;
    try {
      var cur = root[key];
      Object.defineProperty(root, key, {
        configurable: true,
        enumerable: true,
        get: function () {
          return cur;
        },
        set: function (next) {
          cur = next;
          try {
            onSet(next);
          } catch (e) {}
        },
      });
      if (cur) onSet(cur);
    } catch (e) {}
  }

  /** Shots opener */

  function initShotsModule() {
    const LABEL_RE = /^(shots|шоты)$/i;
    const FN_KEYS = [
      "onClick",
      "onSelect",
      "onEnter",
      "callback",
      "handler",
      "action",
      "run",
    ];

    function isShotsLabel(s) {
      return typeof s === "string" && LABEL_RE.test(s.trim());
    }

    function findShotsMenuHandler() {
      if (!window.Lampa || !Lampa.Menu) return null;

      const menu = Lampa.Menu;
      const seen = new Set();
      const stack = [];

      [
        menu.buttons,
        menu.items,
        menu.list,
        menu._buttons,
        menu._items,
        menu.menu,
        menu,
      ].forEach((v) => v && stack.push(v));

      while (stack.length) {
        const cur = stack.pop();
        if (!cur) continue;

        const t = typeof cur;
        if (t !== "object" && t !== "function") continue;
        if (seen.has(cur)) continue;
        seen.add(cur);

        if (Array.isArray(cur)) {
          for (const it of cur) stack.push(it);
          continue;
        }

        if (t === "object") {
          const label =
            cur.name ?? cur.title ?? cur.text ?? cur.label ?? cur.id;

          if (isShotsLabel(label)) {
            for (const k of FN_KEYS) {
              if (typeof cur[k] === "function") return cur[k];
            }
          }

          for (const k in cur) {
            if (!Object.prototype.hasOwnProperty.call(cur, k)) continue;
            const v = cur[k];
            if (v && typeof v === "object") stack.push(v);
          }
        }
      }

      return null;
    }

    function openShotsViaDomFallback() {
      if (!window.$) return false;

      const $btn = $(".selector")
        .filter(function () {
          const txt = (this.textContent || "").trim();
          const dt = (this.getAttribute("data-title") || "").trim();
          const dn = (this.getAttribute("data-name") || "").trim();
          return isShotsLabel(txt) || isShotsLabel(dt) || isShotsLabel(dn);
        })
        .first();

      if (!$btn.length) return false;

      $btn.trigger("hover:enter");
      $btn.trigger("click");

      return true;
    }

    function openShotsLenta(opts) {
      opts = opts || {};
      const triesMax = Number.isFinite(opts.tries) ? opts.tries : 12;
      const delay = Number.isFinite(opts.delay) ? opts.delay : 150;

      let tries = 0;

      function attempt() {
        tries++;

        try {
          const fn = findShotsMenuHandler();
          if (typeof fn === "function") {
            fn();
            return;
          }

          if (openShotsViaDomFallback()) return;
        } catch (e) {
          console.error("[ShotsLauncher] open error:", e);
        }

        if (tries < triesMax) return setTimeout(attempt, delay);

        if (window.Lampa && Lampa.Bell) {
          Lampa.Bell.push({
            icon: '<svg><use xlink:href="#sprite-shots"></use></svg>',
            text: "Shots: handler/button not found in menu (Shots plugin not loaded?)",
          });
        }
      }

      attempt();
    }

    window.ShotsLauncher = window.ShotsLauncher || {};
    window.ShotsLauncher.open = openShotsLenta;

    window.ShotsLauncher.bindMoreButton = function bindMoreButton(rowRoot) {
      if (!rowRoot) return;

      const btn =
        rowRoot.querySelector(".items-line__more") ||
        rowRoot.querySelector(".line__more") ||
        rowRoot.querySelector(".items-more") ||
        rowRoot.querySelector(".more");

      if (!btn) return;

      const handler = function (e) {
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch (_) {}
        openShotsLenta();
      };

      btn.addEventListener("click", handler, true);

      if (window.$)
        $(btn)
          .off("hover:enter.shots_open")
          .on("hover:enter.shots_open", handler);
    };
  }

  function openShotsViewer() {
    if (!window.ShotsLauncher || typeof ShotsLauncher.open !== "function") {
      initShotsModule();
    }
    ShotsLauncher.open();
  }

  /** Date formatting */

  function fmtDayMonth(iso) {
    if (!iso) return "";
    try {
      if (Lampa && Lampa.Utils && typeof Lampa.Utils.parseTime === "function") {
        var pt = Lampa.Utils.parseTime(iso);
        var full = pt && pt.full ? String(pt.full) : "";
        full = full.trim();
        full = full.replace(/\s+\d{4}\s*$/, "").trim();
        full = full.replace(/^(\d+\s+)(.)/, function (m, a, b) {
          return a + String(b).toUpperCase();
        });
        return full;
      }
    } catch (e) {}

    var d = new Date(String(iso).replace(/-/g, "/"));
    if (isNaN(d.getTime())) return String(iso);
    try {
      var lang =
        (Lampa.Storage && Lampa.Storage.get && Lampa.Storage.get("language")) ||
        "ru";
      var month = new Intl.DateTimeFormat(lang, { month: "long" }).format(d);
      month = safeCapFirst(month);
      return d.getDate() + " " + month;
    } catch (e2) {
      return String(iso);
    }
  }

  /** Info panel */

  function InfoPanel() {
    var html;
    var timer;
    var network = new Lampa.Reguest();
    var loaded = {};
    var last_url = "";

    function setText(sel, value) {
      html.find(sel).text(value || "");
    }

    function applyOverview(movie) {
      var ov = movie && movie.overview ? String(movie.overview).trim() : "";
      if (ov) {
        setText(".new-interface-info__description", ov);
      } else {
        var cur = html.find(".new-interface-info__description").text().trim();
        if (!cur) {
          setText(
            ".new-interface-info__description",
            Lampa.Lang.translate("full_notext")
          );
        }
      }
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
    };

    this.update = function (data) {
      data = data || {};

      html
        .find(".new-interface-info__head,.new-interface-info__details")
        .text("---");

      setText(".new-interface-info__title", data.title || data.name || "");

      var desc = String(data.overview || "").trim();
      setText(".new-interface-info__description", desc ? desc : "");

      if (data.backdrop_path) {
        Lampa.Background.change(Lampa.Api.img(data.backdrop_path, "w200"));
      }

      if (data.id) this.load(data);
    };

    this.draw = function (data) {
      var year = String(
        data.release_date || data.first_air_date || "0000"
      ).slice(0, 4);
      var vote = parseFloat(String(data.vote_average || 0)).toFixed(1);

      var head = [];
      var details = [];

      var countries = Lampa.Api.sources.tmdb.parseCountries(data);
      var pg = Lampa.Api.sources.tmdb.parsePG(data);

      if (year !== "0000") head.push("<span>" + year + "</span>");
      if (countries.length) head.push(countries.join(", "));

      if (Number(vote) > 0) {
        details.push(
          '<div class="full-start__rate"><div>' +
            vote +
            "</div><div>TMDB</div></div>"
        );
      }

      if (data.genres && data.genres.length) {
        details.push(
          data.genres
            .map(function (g) {
              return Lampa.Utils.capitalizeFirstLetter(g.name);
            })
            .join(" | ")
        );
      }

      if (data.runtime) {
        details.push(Lampa.Utils.secondsToTime(data.runtime * 60, true));
      }

      if (pg) {
        details.push(
          '<span class="full-start__pg" style="font-size: 0.9em;">' +
            pg +
            "</span>"
        );
      }

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

      if (loaded[url]) {
        applyOverview(loaded[url]);
        this.draw(loaded[url]);
        return;
      }

      timer = setTimeout(function () {
        network.clear();
        network.timeout(5000);

        network.silent(url, function (movie) {
          loaded[url] = movie;
          if (last_url !== url) return;

          applyOverview(movie);
          _this.draw(movie);
        });
      }, 200);
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

  /** Normalizers */

  function normalizeEpisodeThumb(it) {
    if (!it) return;

    var ep = it.episode || it;
    var card = it.card || (it.episode && it.episode.card) || null;

    var still = ep && ep.still_path ? ep.still_path : null;

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

    if (it.id != null && it.episode_id == null) it.episode_id = it.id;
    if (card && card.id != null) it.id = card.id;

    if (card) {
      if (!it.name && card.name) it.name = card.name;
      if (!it.title && card.title) it.title = card.title;
      if (!it.overview && card.overview) it.overview = card.overview;
      if (!it.source && card.source) it.source = card.source;
    }
  }

  function normalizeShotsThumb(it) {
    if (!it) return;

    if (!it.backdrop_path && it.screen) it.backdrop_path = it.screen;
    if (!it.poster_path && it.screen) it.poster_path = it.screen;

    if (!it.poster_path && it.card_poster) it.poster_path = it.card_poster;
    if (!it.title && it.card_title) it.title = it.card_title;

    var cid = it.card_id ? parseInt(it.card_id, 10) : null;

    if (!it.card) it.card = {};
    if (cid) it.card.id = cid;

    it.card.source = it.card.source || "tmdb";
    it.card.type = String(
      it.card.type || it.card_type || "movie"
    ).toLowerCase();
    if (it.card.type !== "tv" && it.card.type !== "movie")
      it.card.type = "movie";

    if (!it.card.poster_path && it.card_poster)
      it.card.poster_path = it.card_poster;
    if (!it.card.backdrop_path && it.backdrop_path)
      it.card.backdrop_path = it.backdrop_path;

    if (it.id != null && it.shot_id == null) it.shot_id = it.id;
    if (cid) it.id = cid;

    if (it.card.type === "movie") {
      it.card.title = it.card.title || it.card_title || it.title || "";
      if (it.card.name) delete it.card.name;
      if (it.name) delete it.name;

      if (!it.card.release_date && it.card_year)
        it.card.release_date = it.card_year + "-01-01";
      if (it.card.first_air_date) delete it.card.first_air_date;
    } else {
      it.card.name = it.card.name || it.card_title || it.name || it.title || "";
      if (it.card.title) delete it.card.title;

      if (!it.name && it.card_title) it.name = it.card_title;

      if (!it.card.first_air_date && it.card_year)
        it.card.first_air_date = it.card_year + "-01-01";
      if (it.card.release_date) delete it.card.release_date;
    }
  }

  /** Row detection */

  function isTimetableRow(row) {
    if (!row || !Array.isArray(row.results) || !row.results.length)
      return false;
    var r = row.results[0];
    if (!r) return false;
    return !!(
      r.episode ||
      (r.air_date && r.season_number != null && r.episode_number != null)
    );
  }

  function isShotsRow(row) {
    if (!row || !Array.isArray(row.results) || !row.results.length)
      return false;

    var t = String(row.title || row.name || "").toLowerCase();
    if (t === "shots") return true;

    var r = row.results[0];
    return !!(r && r.screen && r.file && r.card_id);
  }

  /** Decorators */

  function decorateTimetableRowReactive(rowNode, results) {
    var root = rowNode && rowNode.jquery ? rowNode[0] : rowNode;
    if (!root || !results || !results.length) return;

    function run() {
      var $root = $(root);
      var $cards = $root.find(".card");
      if (!$cards.length) return false;

      $cards.each(function (i) {
        var r = results[i];
        if (!r) return;

        var ep = r.episode || r;
        var season = ep.season_number;
        var episode = ep.episode_number;
        var air = ep.air_date;

        if (season == null || episode == null || !air) return;

        var $card = $(this);
        var $view = $card.find(".card__view");
        if (!$view.length) $view = $card;

        if ($view.find(".plugin-epmeta--episode").length) return;

        var epTitle = (ep.name || "").trim() || "Эпизод " + episode;
        var dateText = fmtDayMonth(air);

        var $meta = $(
          `<div class="plugin-epmeta plugin-epmeta--episode">
            <div class="plugin-epmeta__ep"></div>
            <div class="plugin-epmeta__date"></div>
          </div>`
        );

        $meta.find(".plugin-epmeta__ep").text(epTitle);
        $meta.find(".plugin-epmeta__date").text(dateText);

        $view.append($meta);
      });

      return true;
    }

    if (run()) return;

    if (typeof MutationObserver !== "undefined") {
      var obs = new MutationObserver(function () {
        run();
      });
      obs.observe(root, { childList: true, subtree: true });
    } else {
      setTimeout(run, 0);
    }
  }

  function decorateShotsHeader($rowRoot) {
    var $title = $rowRoot.find(".items-line__title").first();
    if (!$title.length) $title = $rowRoot.find(".line__title").first();
    if (!$title.length)
      $title = $rowRoot.find(".interaction-line__title").first();
    if (!$title.length) return;

    if ($title.find(".full-person").length) return;

    var $head = $(
      `<div class="full-person layer--visible full-person--small full-person--loaded full-person--svg">
        <div class="full-person__photo" style="background-color:#fff;color:rgb(253,69,24)">
          <svg><use xlink:href="#sprite-shots"></use></svg>
        </div>
        <div class="full-person__body">
          <div class="full-person__name">Shots</div>
        </div>
      </div>`
    );

    $title.empty().append($head);
  }

  function isShotItemLike(r) {
    return !!(r && r.screen && r.file && r.card_id);
  }

  function tryGetShotDataFromDom(cardEl) {
    try {
      var $c = $(cardEl);
      var d = $c.data && $c.data();
      if (!d) return null;

      for (var k in d) {
        var v = d[k];
        if (isShotItemLike(v)) return v;
        if (v && v.card && isShotItemLike(v)) return v;
      }

      if (isShotItemLike(d)) return d;
    } catch (e) {}
    return null;
  }

  function decorateShotCard($card, r) {
    if (!r) return;

    var $view = $card.find(".card__view");
    if (!$view.length) $view = $card;

    if ($view.find(".full-episode__shot-icon").length) return;

    function tagsForShot(x) {
      var list = [];
      var type = String(
        x.card_type || (x.card && x.card.type) || ""
      ).toLowerCase();

      var season = parseInt(x.season, 10);
      var episode = parseInt(x.episode, 10);

      var voice = (x.voice_name || "")
        .split(/[\s|,|.]+/)[0]
        .replace(/[\s][^a-zA-Zа-яА-Я0-9].*$/, "")
        .trim();

      if (type === "tv") {
        if (season > 0) list.push("S-" + season);
        if (episode > 0) list.push("E-" + episode);
        if (voice) list.push(voice);
      } else {
        if (voice) list.push(voice);
      }
      return list;
    }

    var $icon = $(
      `<div class="full-episode__shot-icon">
        <svg><use xlink:href="#sprite-shots"></use></svg>
      </div>`
    );

    var likeCount = r.liked == null ? 0 : r.liked;
    var tags = tagsForShot(r);

    var $tags = $('<div class="shots-tags"></div>');
    for (var t = 0; t < tags.length; t++) {
      $tags.append("<div>" + String(tags[t]) + "</div>");
    }

    var $liked = $(
      `<div class="full-episode__liked">
        <svg><use xlink:href="#sprite-love"></use></svg>
        <span></span>
      </div>`
    );
    $liked.find("span").text(String(likeCount));

    var $meta = $('<div class="full-episode__date"></div>');
    $meta.append($tags);
    $meta.append($liked);

    var $body = $('<div class="full-episode__body"></div>');
    $body.append($meta);

    $view.append($body);
    $view.append($icon);
  }

  function decorateShotsRowReactive(rowNode, row) {
    var root = rowNode && rowNode.jquery ? rowNode[0] : rowNode;
    if (!root || !row) return;

    if (root.__shots_reactive_attached) return;
    root.__shots_reactive_attached = true;

    var scheduled = false;

    function scheduleRun() {
      if (scheduled) return;
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        run();
      }, 0);
    }

    function run() {
      var $root = $(root);

      decorateShotsHeader($root);

      var $cards = $root.find(".card");
      if (!$cards.length) return;

      var results = (row && row.results) || [];

      $cards.each(function (i) {
        var r = results[i] || tryGetShotDataFromDom(this);
        if (!r) return;

        normalizeShotsThumb(r);
        decorateShotCard($(this), r);
      });
    }

    scheduleRun();

    if (typeof MutationObserver !== "undefined") {
      var obs = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i] && muts[i].addedNodes && muts[i].addedNodes.length) {
            scheduleRun();
            return;
          }
        }
      });

      obs.observe(root, { childList: true, subtree: true });
      root.__shots_obs = obs;
    }
  }

  /** New interface component */

  function NewInterface(object) {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true,
      scroll_by_item: true,
    });

    var items = [];
    var html = $(
      `<div class="new-interface">
        <img class="full-start__background">
        <div class="full-start__overlay"></div>
      </div>`
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

      info = new InfoPanel();
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
        }, 200);
      }, 600);
    };

    this.append = function (row) {
      var _this3 = this;

      if (row.ready) return;
      row.ready = true;

      if (row && Array.isArray(row.results)) {
        if (isTimetableRow(row)) {
          row.results.forEach(function (r) {
            normalizeEpisodeThumb(r);
          });
        } else if (isShotsRow(row)) {
          row.results.forEach(function (r) {
            normalizeShotsThumb(r);
          });
        }
      }

      var item = new Lampa.InteractionLine(row, {
        url: row.url,
        card_small: true,
        cardClass: row.cardClass,
        genres: object.genres,
        object: object,
        card_wide: true,
        nomore: row.nomore,
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
          this.emit.onInstance.call(this, item, row);
        } catch (e) {}
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

      var rowNode = item.render();

      if (row && Array.isArray(row.results) && isShotsRow(row)) {
        item.onMore = function () {
          openShotsViewer();
          return false;
        };

        try {
          if (item && typeof item.use === "function")
            item.use({ onMore: item.onMore });
        } catch (e) {}
      }

      scroll.append(rowNode);
      items.push(item);

      if (row && Array.isArray(row.results)) {
        if (isTimetableRow(row))
          decorateTimetableRowReactive(rowNode, row.results);
        if (isShotsRow(row)) decorateShotsRowReactive(rowNode, row);
      }
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

  /** Root screen check */

  function isRootScreenObject(el) {
    if (!el || typeof el !== "object") return false;

    if (!(el.source === "tmdb" || el.source === "cub")) return false;
    if (!(el.component === "main" || el.component === "category")) return false;

    if (window.innerWidth < 767) return false;
    if (Lampa.Manifest.app_digital < 153) return false;

    return true;
  }

  /** Plugin start */

  function startPlugin() {
    if (window.plugin_interface_ready) return;
    window.plugin_interface_ready = true;

    function patchImgHolders() {
      try {
        if (window.Api && typeof window.Api.img === "function") {
          window.Api.img = makeAbsUrlSafe(window.Api.img);
        }
      } catch (e) {}

      try {
        if (Lampa && Lampa.Api) reactiveWrap(Lampa.Api, "img");
      } catch (e2) {}

      try {
        if (Lampa && Lampa.TMDB) {
          reactiveWrap(Lampa.TMDB, "image");
          reactiveWrap(Lampa.TMDB, "img");
        }
      } catch (e3) {}
    }

    patchImgHolders();

    reactiveWrapObject(Lampa, "Api", function () {
      patchImgHolders();
    });
    reactiveWrapObject(Lampa, "TMDB", function () {
      patchImgHolders();
    });

    function patchCreateInstance(utils) {
      if (!utils || typeof utils.createInstance !== "function") return;

      if (utils.createInstance.__new_interface_patched) return;
      utils.createInstance.__new_interface_patched = true;

      var original = utils.createInstance;

      utils.createInstance = function (
        BaseClass,
        element,
        add_params,
        replace
      ) {
        element = element || {};
        add_params = add_params || {};

        if (isRootScreenObject(element)) {
          add_params = extend({}, add_params);
          add_params.createInstance = function (el) {
            return new NewInterface(el);
          };
          replace = true;
        }

        return original.call(this, BaseClass, element, add_params, replace);
      };
    }

    if (Lampa.Utils && typeof Lampa.Utils.createInstance === "function") {
      patchCreateInstance(Lampa.Utils);
    } else {
      reactiveWrapObject(Lampa, "Utils", function (utils) {
        patchCreateInstance(utils);
      });

      var old = Lampa.InteractionMain;
      Lampa.InteractionMain = function (obj) {
        var use = NewInterface;
        if (!(obj.source === "tmdb" || obj.source === "cub")) use = old;
        if (window.innerWidth < 767) use = old;
        if (Lampa.Manifest.app_digital < 153) use = old;
        return new use(obj);
      };
    }

    Lampa.Template.add(
      "new_interface_style",
      `<style>
        .new-interface .card__view { position: relative; }
        .new-interface .card--small.card--wide { width: 19.6em; }
        .new-interface-info { position: relative; padding: 1.5em; height: 24em; }
        .new-interface-info__body { width: 80%; padding-top: 1.1em; }
        .new-interface-info__head { color: rgba(255, 255, 255, 0.6); margin-bottom: 1em; font-size: 1.3em; min-height: 1em; }
        .new-interface-info__head span { color: #fff; }
        .new-interface-info__title { font-size: 4em; font-weight: 600; margin-bottom: 0.3em; overflow: hidden; text-overflow: "."; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; margin-left: -0.03em; line-height: 1.3; }
        .new-interface-info__details { margin-bottom: 1.6em; display: flex; align-items: center; flex-wrap: wrap; min-height: 1.9em; font-size: 1.1em; }
        .new-interface-info__split { margin: 0 1em; font-size: 0.7em; }
        .new-interface-info__description { font-size: 1.2em; font-weight: 300; line-height: 1.5; overflow: hidden; text-overflow: "."; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; width: 70%; }
        .new-interface .full-start__background { height: calc(100vh + 6em); top: -6em; }
        .new-interface .full-start__overlay { position: absolute; width: 90vw; height: calc(100vh + 6em); top: -6em;
          background: linear-gradient(to right, rgba(0,0,0,0.792) 0%, rgba(0,0,0,0.504) 50%, rgba(0,0,0,0.264) 70%, rgba(0,0,0,0.12) 80%, rgba(0,0,0,0) 100%); }
        .new-interface .card__promo { display: none; }
        .new-interface .card.card--wide .card-watched { display: none !important; }

        .new-interface .plugin-epmeta--episode { position: absolute; left: 0; right: 0; bottom: 0; padding: 0.6em 0.75em;
          background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0)); border-radius: 0 0 1em 1em; }
        .new-interface .plugin-epmeta--episode .plugin-epmeta__ep { font-size: 1.05em; font-weight: 700; line-height: 1.15; margin-bottom: 0.15em; }
        .new-interface .plugin-epmeta--episode .plugin-epmeta__date { font-size: 0.95em; line-height: 1.15; opacity: 0.9; }

        .new-interface .full-episode__shot-icon { position: absolute; top: 1em; left: 1em; z-index: 5; }
        .new-interface .full-episode__shot-icon svg { width: 2em !important; height: 2em !important; }
        .new-interface .full-episode__body { display: flex; background: linear-gradient(0, rgba(0,0,0,0.5) 0, rgba(0,0,0,0) 40%); }
        .new-interface .full-episode__date { display: flex; justify-content: space-between; align-items: center; gap: 0.3em; }
        .new-interface .shots-tags { display: flex; flex-wrap: wrap; }
        .new-interface .shots-tags > div { background: rgba(0,0,0,0.5); }
        .new-interface .full-episode__liked { display: flex; align-items: center; gap: 0.35em; }
        .new-interface .full-episode__liked svg { width: 1.05em; height: 1.05em; }

        body.light--version .new-interface-info__body { width: 69%; padding-top: 1.5em; }
        body.light--version .new-interface-info { height: 25.3em; }
      </style>`
    );

    $("body").append(Lampa.Template.get("new_interface_style", {}, true));
  }

  if (window.Lampa) startPlugin();
  else {
    try {
      var _l = window.Lampa;
      Object.defineProperty(window, "Lampa", {
        configurable: true,
        enumerable: true,
        get: function () {
          return _l;
        },
        set: function (v) {
          _l = v;
          try {
            startPlugin();
          } catch (e) {}
        },
      });
    } catch (e) {}
  }
})();
