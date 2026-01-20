!(function () {
  "use strict";
  const n = "1.1.2";
  function e(n) {
    return n && !n.__destroyed;
  }
  function t() {
    (console.log("Applecation", "v" + n),
      Lampa.Platform.screen("tv")
        ? ((function () {
            const n = Lampa.Api.sources.tmdb,
              e = Lampa.Template.js;
            Lampa.Template.js = function (n, t) {
              if (
                "full_episode" === n &&
                t &&
                (t.runtime > 0
                  ? (t.time = Lampa.Utils.secondsToTimeHuman(
                      60 * t.runtime
                    ).replace(/\./g, ""))
                  : (t.time = ""),
                t.air_date)
              ) {
                const n = new Date(t.air_date.replace(/-/g, "/")),
                  e = n.getMonth() + 1,
                  a = Lampa.Lang.translate("month_" + e + "_e"),
                  o = i("year_short");
                t.date = n.getDate() + " " + a + " " + n.getFullYear() + o;
              }
              return e.call(Lampa.Template, n, t);
            };
            const t = n.img;
            ((n.img = function (e, a) {
              const i = Lampa.Storage.field("poster_size"),
                o = Lampa.Storage.get("applecation_poster_quality", "medium"),
                r = "string" == typeof a && -1 !== a.indexOf("_face"),
                l =
                  [
                    "w92",
                    "w154",
                    "w185",
                    "w342",
                    "w500",
                    "w780",
                    "original",
                    "w300",
                    "w200",
                  ].includes(a) || r,
                s = ["w300", "w780", "w1280", "original"].includes(a) && !r;
              let p = !1;
              return (
                l &&
                  ("low" === o
                    ? ((a = r ? "w276_and_h350_face" : "w300"), (p = !0))
                    : "medium" === o
                      ? ((a = r ? "w600_and_h900_face" : "w780"), (p = !0))
                      : "high" === o && ((a = "original"), (p = !0))),
                s &&
                  ("low" === o || "medium" === o
                    ? ((a = "w1280"), (p = !0))
                    : "high" === o && ((a = "original"), (p = !0))),
                p ||
                  "w1280" !== a ||
                  (a =
                    { w200: "w780", w300: "w1280", w500: "original" }[i] ||
                    "w1280"),
                p ||
                  "w300" !== a ||
                  (a =
                    { w200: "w300", w300: "w780", w500: "w780" }[i] || "w300"),
                p ||
                  "w276_and_h350_face" !== a ||
                  "w500" !== i ||
                  (a = "w600_and_h900_face"),
                t.call(n, e, a)
              );
            }),
              (Lampa.Api.img = n.img));
          })(),
          l(),
          r(),
          Lampa.Template.add(
            "applecation_css",
            `<style>

            /* Основной контейнер */
            .applecation {
              transition: all .3s;
            }
            .applecation .full-start-new__body {
              height: 80vh;
            }
            .applecation .full-start-new__right {
              display: flex;
              align-items: flex-end;
            }
            .applecation .full-start-new__title {
              font-size: 2.5em;
              font-weight: 700;
              line-height: 1.2;
              margin-bottom: 0.5em;
              text-shadow: 0 0 .1em rgba(0, 0, 0, 0.3);
            }

            /* Логотип */
            .applecation__logo {
              margin-bottom: 0.5em;
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.4s ease-out, transform 0.4s ease-out;
            }
            .applecation__logo.loaded {
              opacity: 1;
              transform: translateY(0);
            }
            .applecation__logo img {
              display: block;
              max-width: 35vw;
              max-height: 180px;
              width: auto;
              height: auto;
              object-fit: contain;
              object-position: left center;
            }

            /* Контейнер для масштабируемого контента */
            .applecation__content-wrapper {
              font-size: 100%;
            }

            /* Мета информация (Тип/Жанр/поджанр) */
            .applecation__meta {
              display: flex;
              align-items: center;
              color: #fff;
              font-size: 1.1em;
              margin-bottom: 0.5em;
              line-height: 1;
              opacity: 0;
              transform: translateY(15px);
              transition: opacity 0.4s ease-out, transform 0.4s ease-out;
              transition-delay: 0.05s;
            }
            .applecation__meta.show {
              opacity: 1;
              transform: translateY(0);
            }
            .applecation__meta-left {
              display: flex;
              align-items: center;
              line-height: 1;
            }
            .applecation__network {
              position: relative;
              display: inline-flex;
              align-items: center;
              line-height: 1;
            }
            .applecation__network img {
              display: block;
              max-height: 0.8em;
              width: auto;
              object-fit: contain;
              filter: brightness(0) invert(1);
            }
            .applecation__meta-text {
              margin-left: 1em;
              line-height: 1;
            }
            .applecation__meta .full-start__pg {
              margin: 0 0 0 0.6em;
              padding: 0.2em 0.5em;
              font-size: 0.85em;
              font-weight: 600;
              border: 1.5px solid rgba(255, 255, 255, 0.4);
              border-radius: 0.3em;
              background: rgba(255, 255, 255, 0.1);
              color: rgba(255, 255, 255, 0.9);
              line-height: 1;
              vertical-align: middle;

              border: unset;
              background: unset;
              padding: 0;
              opacity: 0.8;
              margin: 0.3em 0 0 1em;
              font-size: 0.7em;
            }

            /* Рейтинги */
            .applecation__ratings {
              display: flex;
              align-items: center;
              gap: 0.8em;
              margin-bottom: 0.5em;
              opacity: 0;
              transform: translateY(15px);
              transition: opacity 0.4s ease-out, transform 0.4s ease-out;
              transition-delay: 0.08s;
            }
            .applecation__ratings.show {
              opacity: 1;
              transform: translateY(0);
            }
            .applecation__ratings .rate--imdb,
            .applecation__ratings .rate--kp {
              display: flex;
              align-items: center;
              gap: 0.35em;
            }
            .applecation__ratings svg {
              width: 1.8em;
              height: auto;
              flex-shrink: 0;
              color: rgba(255, 255, 255, 0.85);
            }
            .applecation__ratings .rate--kp svg {
              width: 1.5em;
            }
            .applecation__ratings > div > div {
              font-size: 0.95em;
              font-weight: 600;
              line-height: 1;
              color: #fff;
            }

            /* Управление видимостью рейтингов через настройки */
            body.applecation--hide-ratings .applecation__ratings {
              display: none !important;
            }

            /* Расположение рейтингов - в правом нижнем углу */
            body.applecation--ratings-corner .applecation__right {
              gap: 1em;
            }

            body.applecation--ratings-corner .applecation__ratings {
              margin-bottom: 0;
            }

            /* Обертка для описания */
            .applecation__description-wrapper {
              background-color: transparent;
              padding: 0;
              border-radius: 1em;
              width: fit-content;
              opacity: 0;
              transform: translateY(15px);
              transition:
              padding 0.25s ease,
              transform 0.25s ease,
              opacity 0.4s ease-out;
              transition-delay: 0.1s;
            }
            .applecation__description-wrapper.show {
              opacity: 1;
              transform: translateY(0);
            }
            .applecation__description-wrapper.focus {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.28),
                rgba(255, 255, 255, 0.18)
              );
              padding: .15em .4em 0 .7em;
              border-radius: 1em;
              width: fit-content;
              box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.35);
              transform: scale(1.07) translateY(0);
              transition-delay: 0s;
            }

            /* Описание */
            .applecation__description {
              color: rgba(255, 255, 255, 0.6);
              font-size: 0.95em;
              line-height: 1.5;
              margin-bottom: 0.5em;
              max-width: 35vw;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .focus .applecation__description {
              color: rgba(255, 255, 255, 0.92);
            }

            /* Дополнительная информация (Год/длительность) */
            .applecation__info {
              color: rgba(255, 255, 255, 0.75);
              font-size: 1em;
              line-height: 1.4;
              margin-bottom: 0.5em;
              opacity: 0;
              transform: translateY(15px);
              transition: opacity 0.4s ease-out, transform 0.4s ease-out;
              transition-delay: 0.15s;
            }
            .applecation__info.show {
              opacity: 1;
              transform: translateY(0);
            }

            /* Левая и правая части */
            .applecation__left {
              flex-grow: 1;
            }
            .applecation__right {
              display: flex;
              align-items: center;
              flex-shrink: 0;
              position: relative;
            }

            /* Выравнивание по baseline если рейтинги в углу */
            body.applecation--ratings-corner .applecation__right {
              align-items: last baseline;
            }

            /* Реакции */
            .applecation .full-start-new__reactions {
              margin: 0;
              display: flex;
              align-items: flex-end;
              gap: 0.5em;
            }
            .applecation .full-start-new__reactions > div {
              align-self: flex-end;
              padding: 0;
            }
            .applecation .full-start-new__reactions:not(.focus) {
              margin: 0;
            }
            .applecation .full-start-new__reactions:not(.focus) > div:not(:first-child) {
              display: none;
            }

            /* Стили первой реакции (всегда видимой) */
            .applecation .full-start-new__reactions:not(.focus) > div:first-child .reaction {
              display: flex;
              align-items: center;
              background-color: transparent;
              padding: 0;
            }
            .applecation .full-start-new__reactions:not(.focus) > div:first-child .reaction__icon {
              background-color: rgba(0, 0, 0, 0.3);
              -webkit-border-radius: 5em;
              -moz-border-radius: 5em;
              border-radius: 5em;
              padding: 0.5em;
              width: 2.6em !important;
              height: 2.6em !important;
            }
            .applecation .full-start-new__reactions:not(.focus) > div:first-child .reaction__count {
              font-size: 1.2em !important;
              font-weight: 500 !important;
            }

            /* При фокусе реакции раскрываются вверх */
            .applecation .full-start-new__reactions.focus > div {
              display: block;
            }

            /* Скрываем стандартный rate-line (используется только для статуса) */
            .applecation .full-start-new__rate-line {
              margin: 0;
              height: 0;
              overflow: hidden;
              opacity: 0;
              pointer-events: none;
            }

            /* Фон - переопределяем стандартную анимацию на fade */
            .full-start__background {
              height: calc(100vh + 6em);
              left: 0 !important;
              opacity: 0 !important;
              transition: opacity 0.6s ease-out, filter 0.3s ease-out !important;
              animation: none !important;
              transform: none !important;
              will-change: opacity, filter;
            }
            .full-start__background.loaded:not(.dim) {
              opacity: 1 !important;
            }
            .full-start__background.dim {
              filter: blur(30px);
            }

            /* Удерживаем opacity при загрузке нового фона */
            .full-start__background.loaded.applecation-animated {
              opacity: 1 !important;
            }
            body:not(.menu--open) .full-start__background {
              mask-image: none;
            }

            /* Отключаем стандартную анимацию Lampa для фона */
            body.advanced--animation:not(.no--animation) .full-start__background.loaded {
              animation: none !important;
            }

            /* Скрываем статус для предотвращения выхода реакций за экран */
            .applecation .full-start__status {
              display: none;
            }

            /* Оверлей для затемнения левого края */
            .applecation__overlay {
              width: 90vw;
              background: linear-gradient(to right, rgba(0, 0, 0, 0.792) 0%, rgba(0, 0, 0, 0.504) 25%, rgba(0, 0, 0, 0.264) 45%, rgba(0, 0, 0, 0.12) 55%, rgba(0, 0, 0, 0.043) 60%, rgba(0, 0, 0, 0) 65%);
            }

            /* Бейджи качества */
            .applecation__quality-badges {
              display: inline-flex;
              align-items: center;
              gap: 0.4em;
              margin-left: 0.6em;
              opacity: 0;
              transform: translateY(10px);
              transition: opacity 0.3s ease-out, transform 0.3s ease-out;
            }
            .applecation__quality-badges.show {
              opacity: 1;
              transform: translateY(0);
            }
            .quality-badge {
              display: inline-flex;
              height: 0.8em;
            }
            .quality-badge svg {
              height: 100%;
              width: auto;
              display: block;
            }
            .quality-badge--res svg {
              filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
            }
            .quality-badge--dv svg,
            .quality-badge--hdr svg,
            .quality-badge--sound svg,
            .quality-badge--dub svg {
              color: rgba(255, 255, 255, 0.85);
              filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
            }

            /* Эпизоды Apple TV */
            .applecation .full-episode--small {
              width: 20em !important;
              height: auto !important;
              margin-right: 1.5em !important;
              background: none !important;
              display: flex !important;
              flex-direction: column !important;
              transition: transform 0.3s !important;
            }
            .applecation .full-episode--small.focus {
              transform: scale(1.02);
            }
            .applecation .full-episode--next .full-episode__img::after {
              border: none !important;
            }
            .applecation .full-episode__img {
              padding-bottom: 56.25% !important;
              border-radius: 0.8em !important;
              margin-bottom: 1em !important;
              background-color: rgba(255,255,255,0.05) !important;
              position: relative !important;
              overflow: visible !important;
            }
            .applecation .full-episode__img img {
              border-radius: 0.8em !important;
              object-fit: cover !important;
            }
            .applecation .full-episode__time {
              position: absolute;
              bottom: 0.8em;
              left: 0.8em;
              background: rgba(0,0,0,0.6);
              padding: 0.2em 0.5em;
              border-radius: 0.4em;
              font-size: 0.75em;
              font-weight: 600;
              color: #fff;
              backdrop-filter: blur(5px);
              z-index: 2;
            }
            .applecation .full-episode__time:empty {
              display: none;
            }
            .applecation .full-episode__body {
              position: static !important;
              display: flex !important;
              flex-direction: column !important;
              background: none !important;
              padding: 0 0.5em !important;
              opacity: 0.6;
              transition: opacity 0.3s;
            }
            .applecation .full-episode.focus .full-episode__body {
              opacity: 1;
            }
            .applecation .full-episode__num {
              font-size: 0.75em !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              color: rgba(255,255,255,0.4) !important;
              margin-bottom: 0.2em !important;
              letter-spacing: 0.05em !important;
            }
            .applecation .full-episode__name {
              font-size: 1.1em !important;
              font-weight: 600 !important;
              color: #fff !important;
              margin-bottom: 0.4em !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              line-height: 1.4 !important;
              padding-bottom: 0.1em !important;
            }
            .applecation .full-episode__overview {
              font-size: 0.85em !important;
              line-height: 1.4 !important;
              color: rgba(255,255,255,0.5) !important;
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              overflow: hidden !important;
              margin-bottom: 0.6em !important;
              height: 2.8em !important;
            }
            .applecation .full-episode__date {
              font-size: 0.8em !important;
              color: rgba(255,255,255,0.3) !important;
            }

            /* =========================================================
               БАЗА: ничего не блюрим/не затемняем без фокуса
               ========================================================= */

            .applecation .full-episode{
              position: relative;
              z-index: 1;
              opacity: 1;
              filter: none;
            
              transition: transform .6s cubic-bezier(.16,1,.3,1);
            }

            /* без фокуса — вообще без эффектов */
            .applecation .full-episode:not(.focus){
              transform: none;
            }

            /* фокус — мягкий “apple” подъём */
            .applecation .full-episode.focus{
              z-index: 10;
              transform: scale(1.03) translateY(-6px);
            }

            /* =========================================================
               КАРТИНКА
               ========================================================= */

            .applecation .full-episode__img{
              position: relative;
              overflow: hidden;
              border-radius: inherit;
              transition:
              box-shadow .6s cubic-bezier(.16,1,.3,1),
              backdrop-filter .6s cubic-bezier(.16,1,.3,1),
              transform .6s cubic-bezier(.16,1,.3,1);
            }

            /* =========================================================
               ЖИДКОЕ СТЕКЛО — ТОЛЬКО НА ФОКУСЕ
               ========================================================= */

            .applecation .full-episode.focus .full-episode__img{
              box-shadow:
                0 0 0 1px rgba(255,255,255,.18),
                0 26px 65px rgba(0,0,0,.4) !important;
            
              -webkit-backdrop-filter: blur(14px) saturate(1.25) contrast(1.05);
              backdrop-filter: blur(14px) saturate(1.25) contrast(1.05);
              background: rgba(255,255,255,.06);
            }

            /* толщина стекла */
            .applecation .full-episode.focus .full-episode__img::before{
              content: '';
              position: absolute;
              inset: 0;
              border-radius: inherit;
              pointer-events: none;
              z-index: 2;

              box-shadow:
                inset 0 0 0 1px rgba(255,255,255,.22),
                inset 0 0 18px rgba(255,255,255,.12),
                inset 0 -14px 22px rgba(0,0,0,.18);

              filter: blur(.35px);
              opacity: 1;
              transition: opacity .45s ease;
            }

            /* блик */
            .applecation .full-episode.focus .full-episode__img::after{
              content: '';
              position: absolute;
              inset: 0;
              border-radius: inherit;
              pointer-events: none;
              z-index: 3;

              background:
                radial-gradient(120% 85% at 18% 10%,
                  rgba(255,255,255,.38),
                  rgba(255,255,255,.10) 38%,
                  transparent 62%),
                linear-gradient(135deg,
                  rgba(255,255,255,.20),
                  rgba(255,255,255,0) 52%,
                  rgba(255,255,255,.06));

              mix-blend-mode: screen;
              opacity: .95;

              transition:
                opacity .45s ease,
                transform .65s cubic-bezier(.16,1,.3,1);
            }

            /* когда фокуса нет — просто не показываем слои стекла */
            .applecation .full-episode:not(.focus) .full-episode__img::before,
            .applecation .full-episode:not(.focus) .full-episode__img::after{
              opacity: 0;
            }

            /* убрать старый оверлей */
            .applecation .full-episode.focus::after{
              display: none !important;
            }
            .applecation .full-episode__viewed {
              top: 0.8em !important;
              right: 0.8em !important;
              background: rgba(0,0,0,0.5) !important;
              border-radius: 50% !important;
              padding: 0.3em !important;
              backdrop-filter: blur(10px) !important;
            }

            /* Статус следующей серии */
            .applecation .full-episode--next .full-episode__img:after {
              border-radius: 0.8em !important;
            }

            /* Оверлей для полного описания */
            .applecation-description-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
              transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .applecation-description-overlay.show {
              opacity: 1;
              visibility: visible;
              pointer-events: all;
            }
            .applecation-description-overlay__bg {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              -webkit-backdrop-filter: blur(100px);
              backdrop-filter: blur(100px);
            }
            .applecation-description-overlay__content {
              position: relative;
              z-index: 1;
              max-width: 60vw;
              max-height: 90vh;
              overflow-y: auto;
            }
            .applecation-description-overlay__logo {
              text-align: center;
              margin-bottom: 1.5em;
              display: none;
            }
            .applecation-description-overlay__logo img {
              max-width: 40vw;
              max-height: 150px;
              width: auto;
              height: auto;
              object-fit: contain;
            }
            .applecation-description-overlay__title {
              font-size: 2em;
              font-weight: 600;
              margin-bottom: 1em;
              color: #fff;
              text-align: center;
            }
            .applecation-description-overlay__text {
              font-size: 1.2em;
              line-height: 1.6;
              color: rgba(255, 255, 255, 0.9);
              white-space: pre-wrap;
              margin-bottom: 1.5em;
            }
            .applecation-description-overlay__details {
              display: flex;
              flex-wrap: wrap;
              margin: -1em;
            }
            .applecation-description-overlay__details > * {
              margin: 1em;
            }
            .applecation-description-overlay__info-name {
              font-size: 1.1em;
              margin-bottom: 0.5em;
            }
            .applecation-description-overlay__info-body {
              font-size: 1.2em;
              opacity: 0.6;
            }

            /* Скроллбар для описания */
            .applecation-description-overlay__content::-webkit-scrollbar {
              width: 0.5em;
            }
            .applecation-description-overlay__content::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 1em;
            }
            .applecation-description-overlay__content::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 1em;
            }
            .applecation-description-overlay__content::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
            
            /* =========================================================
               ПЕРСОНЫ (АКТЕРЫ И СЪЕМОЧНАЯ ГРУППА) - APPLE TV СТИЛЬ
               ========================================================= */
            
            .applecation .full-person {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              width: 10.7em !important;
              background: none !important;
              transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
              will-change: transform;
              -webkit-animation: none !important;
              animation: none !important;
              margin-left: 0;
            }
            .applecation .full-person.focus {
              transform: scale(1.08) translateY(-6px) !important;
              z-index: 10;
            }
            
            /* Фото персоны - круглое */
            .applecation .full-person__photo {
              position: relative !important;
              width: 9.4em !important;
              height: 9.4em !important;
              margin: 0 0 .3em 0 !important;
              border-radius: 50% !important;
              overflow: hidden !important;
              background: rgba(255, 255, 255, 0.05) !important;
              flex-shrink: 0 !important;
              transition: 
              box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              backdrop-filter 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              -webkit-backdrop-filter 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
              will-change: transform, box-shadow, backdrop-filter;
              -webkit-animation: none !important;
              animation: none !important;
            }
            .applecation .full-person__photo img {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              border-radius: 50% !important;
            }

            /* Смещаем лицо только при высоком качестве (w500), так как там другой кроп у TMDB */
            .applecation.applecation--poster-high .full-person__photo img {
              object-position: center calc(50% + 20px) !important;
            }

            /* Дефолтные заглушки оставляем по центру, чтобы не ломать симметрию иконок */
            .applecation .full-person__photo img[src*=\"actor.svg\"],
            .applecation .full-person__photo img[src*=\"img_broken.svg\"] {
              object-position: center !important;
            }

            /* ЖИДКОЕ СТЕКЛО — БАЗОВЫЕ СЛОИ (скрыты) */
            .applecation .full-person__photo::before,
            .applecation .full-person__photo::after {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 50%;
              pointer-events: none;
              opacity: 0;
              transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
              will-change: opacity;
            }

            /* толщина стекла */
            .applecation .full-person__photo::before {
              z-index: 2;
              box-shadow:
              inset 2px 2px 1px rgba(255, 255, 255, 0.30),
              inset -2px -2px 2px rgba(255, 255, 255, 0.30);
            }

            /* ореол и блик */
            .applecation .full-person__photo::after {
              z-index: 3;
              background:
              radial-gradient(circle at center,
              transparent 58%,
              rgba(255, 255, 255, 0.22) 75%,
              rgba(255, 255, 255, 0.38) 90%),
              radial-gradient(120% 85% at 18% 10%,
              rgba(255, 255, 255, 0.35),
              rgba(255, 255, 255, 0.10) 38%,
              transparent 62%);
              mix-blend-mode: screen;
            }

            /* ЭФФЕКТЫ ПРИ ФОКУСЕ */
            .applecation .full-person.focus .full-person__photo::before,
            .applecation .full-person.focus .full-person__photo::after {
              opacity: 1;
            }
            .applecation .full-person.focus .full-person__photo::after {
              opacity: 0.9;
            }

            /* Текстовая информация */
            .applecation .full-person__body {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
              width: 100% !important;
              padding: 0 0.3em !important;
            }

            /* Имя персоны */
            .applecation .full-person__name {
              font-size: 1em !important;
              font-weight: 600 !important;
              color: #fff !important;
              line-height: 1.3 !important;
              width: 100% !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              position: relative !important;
            }

            /* Бегущая строка для длинных имен */
            .applecation .full-person__name.marquee-active {
              text-overflow: clip !important;
              mask-image: linear-gradient(to right, #000 92%, transparent 100%);
              -webkit-mask-image: linear-gradient(to right, #000 92%, transparent 100%);
            }

            /* При фокусе (когда строка едет) прозрачность с обеих сторон */
            .applecation .full-person.focus .full-person__name.marquee-active {
              mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
              -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
            }
            .applecation .marquee__inner {
              display: inline-block;
              white-space: nowrap;
            }
            .applecation .marquee__inner span {
              padding-right: 2.5em;
              display: inline-block;
            }

            /* Запуск анимации при фокусе */
            .applecation .full-person.focus .full-person__name.marquee-active .marquee__inner {
              animation: marquee var(--marquee-duration, 5s) linear infinite;
            }
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }

            /* Роль персоны */
            .applecation .full-person__role {
              font-size: 0.8em !important;
              font-weight: 400 !important;
              color: rgba(255, 255, 255, 0.5) !important;
              line-height: 1.3 !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              width: 100% !important;
              margin-top: 0;
            }
            .applecation .full-person.focus .full-person__role {
              color: rgb(255, 255, 255) !important;
            }
            </style>`
          ),
          $("body").append(Lampa.Template.get("applecation_css", {}, !0)),
          void 0 === Lampa.Storage.get("applecation_show_ratings") &&
            Lampa.Storage.set("applecation_show_ratings", !1),
          void 0 === Lampa.Storage.get("applecation_ratings_position") &&
            Lampa.Storage.set("applecation_ratings_position", "card"),
          void 0 === Lampa.Storage.get("applecation_logo_scale") &&
            Lampa.Storage.set("applecation_logo_scale", "100"),
          void 0 === Lampa.Storage.get("applecation_text_scale") &&
            Lampa.Storage.set("applecation_text_scale", "100"),
          void 0 === Lampa.Storage.get("applecation_spacing_scale") &&
            Lampa.Storage.set("applecation_spacing_scale", "100"),
          void 0 === Lampa.Storage.get("applecation_reverse_episodes") &&
            Lampa.Storage.set("applecation_reverse_episodes", !0),
          void 0 === Lampa.Storage.get("applecation_description_overlay") &&
            Lampa.Storage.set("applecation_description_overlay", !0),
          Lampa.SettingsApi.addComponent({
            component: "applecation_settings",
            name: "AppleTV",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="14" fill="none" stroke="currentColor" stroke-width="4"/><path d="M22 18l20 12-10 2 2 10-12-24z" fill="currentColor"/><path d="M44 20l6-6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
          }),
          void 0 === Lampa.Storage.get("applecation_poster_quality") &&
            Lampa.Storage.set("applecation_poster_quality", "medium"),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: { name: "applecation_display_title", type: "title" },
            field: { name: i("settings_title_display") },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "applecation_poster_quality",
              type: "select",
              values: {
                low: "Низкое - 720p (HD): 1280 x 720",
                medium: "Среднее - 1080p (HD): 1920 x 1080",
                high: "Высокое - 4320p (8K): 7680 x 4320",
              },
              default: "medium",
            },
            field: {
              name: "Качество постера",
              description: "Выберите качество изображений постеров и фона",
            },
            onChange: function (n) {
              Lampa.Storage.set("applecation_poster_quality", n);
            },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "applecation_show_ratings",
              type: "trigger",
              default: !1,
            },
            field: {
              name: i("show_ratings"),
              description: i("show_ratings_desc"),
            },
            onChange: function (n) {
              n
                ? $("body").removeClass("applecation--hide-ratings")
                : $("body").addClass("applecation--hide-ratings");
            },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "applecation_ratings_position",
              type: "select",
              values: {
                card: i("position_card"),
                corner: i("position_corner"),
              },
              default: "card",
            },
            field: {
              name: i("ratings_position"),
              description: i("ratings_position_desc"),
            },
            onChange: function (n) {
              (Lampa.Storage.set("applecation_ratings_position", n),
                $("body").removeClass(
                  "applecation--ratings-card applecation--ratings-corner"
                ),
                $("body").addClass("applecation--ratings-" + n),
                l(),
                r(),
                Lampa.Activity.back());
            },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "card_interfice_reactions",
              type: "trigger",
              default: !0,
            },
            field: {
              name: i("show_reactions"),
              description: i("show_reactions_desc"),
            },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "applecation_reverse_episodes",
              type: "trigger",
              default: !0,
            },
            field: {
              name: i("reverse_episodes"),
              description: i("reverse_episodes_desc"),
            },
            onChange: function (n) {
              Lampa.Storage.set("applecation_reverse_episodes", n);
            },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "applecation_description_overlay",
              type: "trigger",
              default: !0,
            },
            field: {
              name: i("description_overlay"),
              description: i("description_overlay_desc"),
            },
            onChange: function (n) {
              Lampa.Storage.set("applecation_description_overlay", n);
            },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: { name: "applecation_scaling_title", type: "title" },
            field: { name: i("settings_title_scaling") },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "applecation_logo_scale",
              type: "select",
              values: {
                50: "50%",
                60: "60%",
                70: "70%",
                80: "80%",
                90: "90%",
                100: i("scale_default"),
                110: "110%",
                120: "120%",
                130: "130%",
                140: "140%",
                150: "150%",
                160: "160%",
                170: "170%",
                180: "180%",
              },
              default: "100",
            },
            field: { name: i("logo_scale"), description: i("logo_scale_desc") },
            onChange: function (n) {
              (Lampa.Storage.set("applecation_logo_scale", n), o());
            },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "applecation_text_scale",
              type: "select",
              values: {
                50: "50%",
                60: "60%",
                70: "70%",
                80: "80%",
                90: "90%",
                100: i("scale_default"),
                110: "110%",
                120: "120%",
                130: "130%",
                140: "140%",
                150: "150%",
                160: "160%",
                170: "170%",
                180: "180%",
              },
              default: "100",
            },
            field: { name: i("text_scale"), description: i("text_scale_desc") },
            onChange: function (n) {
              (Lampa.Storage.set("applecation_text_scale", n), o());
            },
          }),
          Lampa.SettingsApi.addParam({
            component: "applecation_settings",
            param: {
              name: "applecation_spacing_scale",
              type: "select",
              values: {
                50: "50%",
                60: "60%",
                70: "70%",
                80: "80%",
                90: "90%",
                100: i("scale_default"),
                110: "110%",
                120: "120%",
                130: "130%",
                140: "140%",
                150: "150%",
                160: "160%",
                170: "170%",
                180: "180%",
                200: "200%",
                250: "250%",
                300: "300%",
              },
              default: "100",
            },
            field: {
              name: i("spacing_scale"),
              description: i("spacing_scale_desc"),
            },
            onChange: function (n) {
              (Lampa.Storage.set("applecation_spacing_scale", n), o());
            },
          }),
          Lampa.Storage.get("applecation_show_ratings", !1) ||
            $("body").addClass("applecation--hide-ratings"),
          $("body").addClass(
            "applecation--ratings-" +
              Lampa.Storage.get("applecation_ratings_position", "card")
          ),
          o(),
          Lampa.Listener.follow("full", (n) => {
            if (
              (Lampa.Storage.get("applecation_description_overlay", !0) &&
                (function (n) {
                  if ("start" === n.type && n.link) {
                    const e = n.link.rows,
                      t = e.indexOf("description");
                    t > -1 && e.splice(t, 1);
                  }
                })(n),
              "complite" === n.type)
            ) {
              const a = n.object.activity,
                i = a.render();
              (i.addClass("applecation"), (a.__destroyed = !1));
              var t = a.destroy;
              a.destroy = function () {
                ((a.__destroyed = !0), t && t.apply(a, arguments));
              };
              const o = Lampa.Storage.field("poster_size");
              (i.toggleClass("applecation--poster-high", "w500" === o),
                (function (n) {
                  const e = n.render().find(".full-start__background");
                  e.length &&
                    !e.next(".applecation__overlay").length &&
                    e.after(
                      '<div class="full-start__background loaded applecation__overlay"></div>'
                    );
                })(a),
                (function (n) {
                  const t = n.data.movie,
                    a = n.object.activity;
                  if (!t || !a) return;
                  ((function (n, e) {
                    const t = n.render().find(".applecation__meta-text"),
                      a = [];
                    if (
                      (a.push(
                        (function (n) {
                          const e = Lampa.Storage.get("language", "ru"),
                            t = !!n.name,
                            a = {
                              ru: t ? "Сериал" : "Фильм",
                              en: t ? "TV Series" : "Movie",
                              uk: t ? "Серіал" : "Фільм",
                              be: t ? "Серыял" : "Фільм",
                              bg: t ? "Сериал" : "Филм",
                              cs: t ? "Seriál" : "Film",
                              he: t ? "סדרה" : "סרט",
                              pt: t ? "Série" : "Filme",
                              zh: t ? "电视剧" : "电影",
                            };
                          return a[e] || a.en;
                        })(e)
                      ),
                      e.genres && e.genres.length)
                    ) {
                      const n = e.genres
                        .slice(0, 2)
                        .map((n) => Lampa.Utils.capitalizeFirstLetter(n.name));
                      a.push(...n);
                    }
                    (t.html(a.join(" · ")),
                      (function (n, e) {
                        const t = n.render().find(".applecation__network");
                        if (e.networks && e.networks.length) {
                          const n = e.networks[0];
                          if (n.logo_path) {
                            const e = Lampa.Api.img(n.logo_path, "w200");
                            return void t.html(
                              `<img src="${e}" alt="${n.name}">`
                            );
                          }
                        }
                        if (
                          e.production_companies &&
                          e.production_companies.length
                        ) {
                          const n = e.production_companies[0];
                          if (n.logo_path) {
                            const e = Lampa.Api.img(n.logo_path, "w200");
                            return void t.html(
                              `<img src="${e}" alt="${n.name}">`
                            );
                          }
                        }
                        t.remove();
                      })(n, e));
                  })(a, t),
                    (function (n, e) {
                      const t = n.render().find(".applecation__description"),
                        a = n
                          .render()
                          .find(".applecation__description-wrapper"),
                        i = e.overview || "",
                        o = Lampa.Storage.get(
                          "applecation_description_overlay",
                          !0
                        );
                      (t.text(i),
                        o
                          ? ((function (n, e) {
                              const t = e.overview || "",
                                a = e.title || e.name;
                              if (!t) return;
                              $(".applecation-description-overlay").remove();
                              const i =
                                  (e.release_date || e.first_air_date || "") +
                                  "",
                                o =
                                  i.length > 3
                                    ? Lampa.Utils.parseTime(i).full
                                    : i.length > 0
                                      ? i
                                      : Lampa.Lang.translate("player_unknown"),
                                r =
                                  "$ " +
                                  Lampa.Utils.numberWithSpaces(e.budget || 0),
                                l = (function (n) {
                                  return n.production_countries
                                    ? n.production_countries.map((n) => {
                                        const e =
                                            "country_" +
                                            n.iso_3166_1.toLowerCase(),
                                          t = Lampa.Lang.translate(e);
                                        return t !== e ? t : n.name;
                                      })
                                    : [];
                                })(e),
                                s = l.join(", "),
                                p = $(
                                  Lampa.Template.get("applecation_overlay", {
                                    title: a,
                                    text: t,
                                    relise: o,
                                    budget: r,
                                    countries: s,
                                  })
                                );
                              ((e.budget && 0 !== e.budget) ||
                                p.find(".applecation--budget").remove(),
                                s || p.find(".applecation--countries").remove(),
                                $("body").append(p),
                                p.data("controller-created", !1));
                            })(0, e),
                            a.off("hover:enter").on("hover:enter", function () {
                              !(function () {
                                const n = $(".applecation-description-overlay");
                                if (n.length) {
                                  if (
                                    (setTimeout(() => n.addClass("show"), 10),
                                    !n.data("controller-created"))
                                  ) {
                                    const e = {
                                      toggle: function () {
                                        (Lampa.Controller.collectionSet(n),
                                          Lampa.Controller.collectionFocus(
                                            n.find(
                                              ".applecation-description-overlay__content"
                                            ),
                                            n
                                          ));
                                      },
                                      back: function () {
                                        !(function () {
                                          const n = $(
                                            ".applecation-description-overlay"
                                          );
                                          n.length &&
                                            (n.removeClass("show"),
                                            setTimeout(() => {
                                              Lampa.Controller.toggle(
                                                "content"
                                              );
                                            }, 300));
                                        })();
                                      },
                                    };
                                    (Lampa.Controller.add(
                                      "applecation_description",
                                      e
                                    ),
                                      n.data("controller-created", !0));
                                  }
                                  Lampa.Controller.toggle(
                                    "applecation_description"
                                  );
                                }
                              })();
                            }))
                          : (a.off("hover:enter"),
                            $(".applecation-description-overlay").remove()));
                    })(a, t),
                    (function (n, e) {
                      const t = n.render().find(".applecation__info"),
                        a = [],
                        i = e.release_date || e.first_air_date || "";
                      if (i) {
                        const n = i.split("-")[0];
                        a.push(n);
                      }
                      if (e.name) {
                        if (e.episode_run_time && e.episode_run_time.length) {
                          const n = e.episode_run_time[0],
                            t = Lampa.Lang.translate("time_m").replace(".", "");
                          a.push(`${n} ${t}`);
                        }
                        const n = Lampa.Utils.countSeasons(e);
                        n &&
                          a.push(
                            (function (n) {
                              const e = Lampa.Storage.get("language", "ru");
                              if (["ru", "uk", "be", "bg"].includes(e)) {
                                const t = [2, 0, 1, 1, 1, 2],
                                  a = {
                                    ru: ["сезон", "сезона", "сезонов"],
                                    uk: ["сезон", "сезони", "сезонів"],
                                    be: ["сезон", "сезоны", "сезонаў"],
                                    bg: ["сезон", "сезона", "сезона"],
                                  };
                                return `${n} ${(a[e] || a.ru)[n % 100 > 4 && n % 100 < 20 ? 2 : t[Math.min(n % 10, 5)]]}`;
                              }
                              if ("en" === e)
                                return 1 === n ? `${n} Season` : `${n} Seasons`;
                              if ("cs" === e)
                                return 1 === n || (n >= 2 && n <= 4)
                                  ? `${n} série`
                                  : `${n} sérií`;
                              if ("pt" === e)
                                return 1 === n
                                  ? `${n} Temporada`
                                  : `${n} Temporadas`;
                              if ("he" === e)
                                return 1 === n ? `עונה ${n}` : `${n} עונות`;
                              if ("zh" === e) return `${n} 季`;
                              const t = Lampa.Lang.translate("full_season");
                              return 1 === n ? `${n} ${t}` : `${n} ${t}s`;
                            })(n)
                          );
                      } else if (e.runtime && e.runtime > 0) {
                        const n = Math.floor(e.runtime / 60),
                          t = e.runtime % 60,
                          i = Lampa.Lang.translate("time_h").replace(".", ""),
                          o = Lampa.Lang.translate("time_m").replace(".", ""),
                          r = n > 0 ? `${n} ${i} ${t} ${o}` : `${t} ${o}`;
                        a.push(r);
                      }
                      const o = a.length > 0 ? a.join(" · ") : "";
                      t.html(
                        o + '<span class="applecation__quality-badges"></span>'
                      );
                    })(a, t),
                    s(a, () => {
                      if (!e(a)) return;
                      a.render().find(".applecation__meta").addClass("show");
                      const n = Lampa.Storage.get(
                          "applecation_description_overlay",
                          !0
                        ),
                        t = a
                          .render()
                          .find(".applecation__description-wrapper")
                          .addClass("show");
                      (n &&
                        (t.addClass("selector"),
                        window.Lampa &&
                          Lampa.Controller &&
                          Lampa.Controller.collectionAppend(t)),
                        a.render().find(".applecation__info").addClass("show"),
                        a
                          .render()
                          .find(".applecation__ratings")
                          .addClass("show"));
                    }));
                  const i = t.name ? "tv" : "movie",
                    o = Lampa.TMDB.api(
                      `${i}/${t.id}/images?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get("language")}`
                    );
                  $.get(o, (n) => {
                    if (!e(a)) return;
                    const t = a.render().find(".applecation__logo"),
                      i = a.render().find(".full-start-new__title");
                    if (n.logos && n.logos[0]) {
                      const i = n.logos[0].file_path,
                        o = (function () {
                          const n = Lampa.Storage.get(
                            "applecation_poster_quality",
                            "medium"
                          );
                          if ("low" === n) return "w300";
                          if ("medium" === n) return "w500";
                          if ("high" === n) return "original";
                          return (
                            { w200: "w300", w300: "w500", w500: "original" }[
                              Lampa.Storage.field("poster_size")
                            ] || "w500"
                          );
                        })(),
                        r = Lampa.TMDB.image(`/t/p/${o}${i}`),
                        l = new Image();
                      ((l.onload = () => {
                        e(a) &&
                          (t.html(`<img src="${r}" alt="" />`),
                          s(a, () => {
                            e(a) && t.addClass("loaded");
                          }),
                          (function (n) {
                            const e = $(".applecation-description-overlay");
                            if (e.length && n) {
                              const t = $("<img>").attr("src", n);
                              (e
                                .find(".applecation-description-overlay__logo")
                                .html(t)
                                .css("display", "block"),
                                e
                                  .find(
                                    ".applecation-description-overlay__title"
                                  )
                                  .css("display", "none"));
                            }
                          })(r));
                      }),
                        (l.src = r));
                    } else
                      (i.show(),
                        s(a, () => {
                          t.addClass("loaded");
                        }));
                  }).fail(() => {
                    (a.render().find(".full-start-new__title").show(),
                      s(a, () => {
                        a.render()
                          .find(".applecation__logo")
                          .addClass("loaded");
                      }));
                  });
                })(n),
                (function (n) {
                  const e = n
                      .render()
                      .find(
                        ".full-start__background:not(.applecation__overlay)"
                      )[0],
                    t = n.render().find(".scroll__body")[0];
                  if (!e || !t) return;
                  let a = !1;
                  const i =
                    Object.getOwnPropertyDescriptor(
                      t.style,
                      "-webkit-transform"
                    ) ||
                    Object.getOwnPropertyDescriptor(
                      CSSStyleDeclaration.prototype,
                      "webkitTransform"
                    );
                  Object.defineProperty(t.style, "-webkit-transform", {
                    set: function (n) {
                      if (n) {
                        const t = n.indexOf(",") + 1,
                          i = n.indexOf(",", t);
                        if (t > 0 && i > t) {
                          const o = parseFloat(n.substring(t, i)) < 0;
                          o !== a && ((a = o), e.classList.toggle("dim", o));
                        }
                      }
                      i && i.set
                        ? i.set.call(this, n)
                        : this.setProperty("-webkit-transform", n);
                    },
                    get: function () {
                      return i && i.get
                        ? i.get.call(this)
                        : this.getPropertyValue("-webkit-transform");
                    },
                    configurable: !0,
                  });
                })(a),
                (function (n) {
                  const t = n.render().find(".full-person__name");
                  (t.each(function () {
                    const n = $(this);
                    if (n.hasClass("marquee-processed")) {
                      const e = n.find("span").first().text();
                      e &&
                        (n.text(e),
                        n.removeClass("marquee-processed marquee-active"),
                        n.css("--marquee-duration", ""));
                    }
                  }),
                    setTimeout(() => {
                      e(n) &&
                        t.each(function () {
                          const n = $(this),
                            e = n.text().trim();
                          if (e)
                            if (
                              (function (n) {
                                return n.scrollWidth > n.clientWidth + 1;
                              })(n[0])
                            ) {
                              const t = Math.min(
                                Math.max(0.25 * e.length, 5),
                                20
                              );
                              (n.addClass("marquee-processed marquee-active"),
                                n.css("--marquee-duration", t + "s"));
                              const a = $("<span>").text(e),
                                i = $("<span>").text(e),
                                o = $('<div class="marquee__inner">')
                                  .append(a)
                                  .append(i);
                              n.empty().append(o);
                            } else n.addClass("marquee-processed");
                        });
                    }, 100));
                })(a));
              const r = n.data,
                l = r && r.movie;
              l &&
                (function (n, t) {
                  if (!n || !Lampa.Storage.field("parser_use")) return;
                  if (!Lampa.Parser || "function" != typeof Lampa.Parser.get)
                    return;
                  const a = n.title || n.name || "Неизвестно",
                    i = (
                      (n.first_air_date || n.release_date || "0000") + ""
                    ).slice(0, 4),
                    o =
                      {
                        df: n.original_title,
                        df_year: n.original_title + " " + i,
                        df_lg: n.original_title + " " + n.title,
                        df_lg_year: n.original_title + " " + n.title + " " + i,
                        lg: n.title,
                        lg_year: n.title + " " + i,
                        lg_df: n.title + " " + n.original_title,
                        lg_df_year: n.title + " " + n.original_title + " " + i,
                      }[Lampa.Storage.field("parse_lang")] || n.title;
                  Lampa.Parser.get(
                    { search: o, movie: n, page: 1 },
                    (n) => {
                      if (!e(t)) return;
                      if (!n || !n.Results || 0 === n.Results.length) return;
                      const i = {
                        resolutions: new Set(),
                        hdr: new Set(),
                        audio: new Set(),
                        hasDub: !1,
                      };
                      n.Results.forEach((n) => {
                        if (n.ffprobe && Array.isArray(n.ffprobe)) {
                          const e = (function (n) {
                            if (!n || !Array.isArray(n)) return null;
                            const e = {
                                resolution: null,
                                hdr: !1,
                                dolbyVision: !1,
                                audio: null,
                              },
                              t = n.find((n) => "video" === n.codec_type);
                            if (t) {
                              if (
                                (t.width &&
                                  t.height &&
                                  ((e.resolution = `${t.width}x${t.height}`),
                                  t.height >= 2160 || t.width >= 3840
                                    ? (e.resolutionLabel = "4K")
                                    : t.height >= 1440 || t.width >= 2560
                                      ? (e.resolutionLabel = "2K")
                                      : t.height >= 1080 || t.width >= 1920
                                        ? (e.resolutionLabel = "FULL HD")
                                        : (t.height >= 720 ||
                                            t.width >= 1280) &&
                                          (e.resolutionLabel = "HD")),
                                t.side_data_list)
                              ) {
                                const n = t.side_data_list.some(
                                    (n) =>
                                      "Mastering display metadata" ===
                                      n.side_data_type
                                  ),
                                  a = t.side_data_list.some(
                                    (n) =>
                                      "Content light level metadata" ===
                                      n.side_data_type
                                  );
                                t.side_data_list.some(
                                  (n) =>
                                    "DOVI configuration record" ===
                                      n.side_data_type ||
                                    "Dolby Vision RPU" === n.side_data_type
                                )
                                  ? ((e.dolbyVision = !0), (e.hdr = !0))
                                  : (n || a) && (e.hdr = !0);
                              }
                              (!e.hdr &&
                                t.color_transfer &&
                                ["smpte2084", "arib-std-b67"].includes(
                                  t.color_transfer.toLowerCase()
                                ) &&
                                (e.hdr = !0),
                                !e.dolbyVision &&
                                  t.codec_name &&
                                  (t.codec_name
                                    .toLowerCase()
                                    .includes("dovi") ||
                                    t.codec_name
                                      .toLowerCase()
                                      .includes("dolby")) &&
                                  ((e.dolbyVision = !0), (e.hdr = !0)));
                            }
                            const a = n.filter((n) => "audio" === n.codec_type);
                            let i = 0;
                            return (
                              a.forEach((n) => {
                                n.channels &&
                                  n.channels > i &&
                                  (i = n.channels);
                              }),
                              i >= 8
                                ? (e.audio = "7.1")
                                : i >= 6
                                  ? (e.audio = "5.1")
                                  : i >= 4
                                    ? (e.audio = "4.0")
                                    : i >= 2 && (e.audio = "2.0"),
                              e
                            );
                          })(n.ffprobe);
                          (e &&
                            (e.resolutionLabel &&
                              i.resolutions.add(e.resolutionLabel),
                            e.audio && i.audio.add(e.audio)),
                            i.hasDub ||
                              n.ffprobe
                                .filter(
                                  (n) => "audio" === n.codec_type && n.tags
                                )
                                .forEach((n) => {
                                  const e = (
                                      n.tags.language || ""
                                    ).toLowerCase(),
                                    t = (
                                      n.tags.title ||
                                      n.tags.handler_name ||
                                      ""
                                    ).toLowerCase();
                                  ("rus" !== e &&
                                    "ru" !== e &&
                                    "russian" !== e) ||
                                    ((t.includes("dub") ||
                                      t.includes("дубляж") ||
                                      t.includes("дублир") ||
                                      "d" === t) &&
                                      (i.hasDub = !0));
                                }));
                        }
                        const e = n.Title.toLowerCase();
                        ((e.includes("dolby vision") ||
                          e.includes("dovi") ||
                          e.match(/\bdv\b/)) &&
                          i.hdr.add("Dolby Vision"),
                          e.includes("hdr10+") && i.hdr.add("HDR10+"),
                          e.includes("hdr10") && i.hdr.add("HDR10"),
                          e.includes("hdr") && i.hdr.add("HDR"));
                      });
                      const o = {
                        title: a,
                        torrents_found: n.Results.length,
                        quality: null,
                        dv: !1,
                        hdr: !1,
                        hdr_type: null,
                        sound: null,
                        dub: i.hasDub,
                      };
                      if (i.resolutions.size > 0) {
                        const n = ["8K", "4K", "2K", "FULL HD", "HD"];
                        for (const e of n)
                          if (i.resolutions.has(e)) {
                            o.quality = e;
                            break;
                          }
                      }
                      if (
                        (i.hdr.has("Dolby Vision") &&
                          ((o.dv = !0), (o.hdr = !0)),
                        i.hdr.size > 0)
                      ) {
                        o.hdr = !0;
                        const n = ["HDR10+", "HDR10", "HDR"];
                        for (const e of n)
                          if (i.hdr.has(e)) {
                            o.hdr_type = e;
                            break;
                          }
                      }
                      if (i.audio.size > 0) {
                        const n = ["7.1", "5.1", "4.0", "2.0"];
                        for (const e of n)
                          if (i.audio.has(e)) {
                            o.sound = e;
                            break;
                          }
                      }
                      (console.log("Applecation", o),
                        t &&
                          void 0 === t.applecation_quality &&
                          ((t.applecation_quality = o),
                          (function (n, e) {
                            const t = n
                              .render()
                              .find(".applecation__quality-badges");
                            if (!t.length) return;
                            const a = [];
                            if (e.quality) {
                              let n = "";
                              ("4K" === e.quality
                                ? (n =
                                    '<svg viewBox="0 0 311 134" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M291 0C302.046 3.57563e-06 311 8.95431 311 20V114C311 125.046 302.046 134 291 134H20C8.95431 134 0 125.046 0 114V20C0 8.95431 8.95431 0 20 0H291ZM113 20.9092L74.1367 82.1367V97.6367H118.818V114H137.637V97.6367H149.182V81.8633H137.637V20.9092H113ZM162.841 20.9092V114H182.522V87.5459L192.204 75.7275L217.704 114H241.25L206.296 62.5908L240.841 20.9092H217.25L183.75 61.9541H182.522V20.9092H162.841ZM119.182 81.8633H93.9541V81.1367L118.454 42.3633H119.182V81.8633Z" fill="white"/></svg>')
                                : "2K" === e.quality
                                  ? (n =
                                      '<svg viewBox="0 0 311 134" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M291 0C302.046 3.57563e-06 311 8.95431 311 20V114C311 125.046 302.046 134 291 134H20C8.95431 134 0 125.046 0 114V20C0 8.95431 8.95431 0 20 0H291ZM110.608 19.6367C104.124 19.6367 98.3955 20.8638 93.4258 23.3184C88.4563 25.7729 84.5925 29.2428 81.835 33.7275C79.0775 38.2123 77.6992 43.5001 77.6992 49.5908H96.3809C96.3809 46.6212 96.9569 44.0607 98.1084 41.9092C99.2599 39.7578 100.896 38.1056 103.017 36.9541C105.138 35.8026 107.623 35.2275 110.472 35.2275C113.199 35.2276 115.639 35.7724 117.79 36.8633C119.941 37.9238 121.638 39.4542 122.881 41.4541C124.123 43.4238 124.744 45.7727 124.744 48.5C124.744 50.9545 124.244 53.2421 123.244 55.3633C122.244 57.4542 120.774 59.5906 118.835 61.7725C116.926 63.9543 114.562 66.4094 111.744 69.1367L78.6084 99.8184V114H144.972V97.9092H105.881V97.2725L119.472 83.9541C125.865 78.1361 130.82 73.1514 134.335 69C137.85 64.8182 140.29 61.0151 141.653 57.5908C143.047 54.1666 143.744 50.6968 143.744 47.1816C143.744 41.8182 142.366 37.0606 139.608 32.9092C136.851 28.7577 132.986 25.515 128.017 23.1816C123.077 20.8182 117.275 19.6368 110.608 19.6367ZM159.778 20.9092V114H179.46V87.5459L189.142 75.7275L214.642 114H238.188L203.233 62.5908L237.778 20.9092H214.188L180.688 61.9541H179.46V20.9092H159.778Z" fill="white"/></svg>')
                                  : "FULL HD" === e.quality
                                    ? (n =
                                        '<svg viewBox="331 0 311 134" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M622 0C633.046 3.57563e-06 642 8.95431 642 20V114C642 125.046 633.046 134 622 134H351C339.954 134 331 125.046 331 114V20C331 8.95431 339.954 0 351 0H622ZM362.341 20.9092V114H382.022V75.5459H419.887V59.3184H382.022V37.1367H423.978V20.9092H362.341ZM437.216 20.9092V114H456.897V75.5459H496.853V114H516.488V20.9092H496.853V59.3184H456.897V20.9092H437.216ZM532.716 20.9092V114H565.716C575.17 114 583.291 112.136 590.079 108.409C596.897 104.682 602.125 99.333 605.762 92.3633C609.428 85.3937 611.262 77.0601 611.262 67.3633C611.262 57.6968 609.428 49.3934 605.762 42.4541C602.125 35.5149 596.928 30.1969 590.171 26.5C583.413 22.7727 575.352 20.9092 565.988 20.9092H532.716ZM564.943 37.7725C570.761 37.7725 575.655 38.8027 579.625 40.8633C583.595 42.9239 586.579 46.1364 588.579 50.5C590.609 54.8636 591.625 60.4847 591.625 67.3633C591.625 74.3026 590.609 79.9694 588.579 84.3633C586.579 88.7269 583.579 91.955 579.579 94.0459C575.609 96.1063 570.715 97.1367 564.897 97.1367H552.397V37.7725H564.943Z" fill="white"/></svg>')
                                    : "HD" === e.quality &&
                                      (n =
                                        '<svg viewBox="662 0 311 134" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M953 0C964.046 3.57563e-06 973 8.95431 973 20V114C973 125.046 964.046 134 953 134H682C670.954 134 662 125.046 662 114V20C662 8.95431 670.954 0 682 0H953ZM731.278 20.9092V114H750.96V75.5459H790.915V114H810.551V20.9092H790.915V59.3184H750.96V20.9092H731.278ZM826.778 20.9092V114H859.778C869.233 114 877.354 112.136 884.142 108.409C890.96 104.682 896.188 99.333 899.824 92.3633C903.491 85.3937 905.324 77.0601 905.324 67.3633C905.324 57.6968 903.491 49.3934 899.824 42.4541C896.188 35.5149 890.991 30.1969 884.233 26.5C877.476 22.7727 869.414 20.9092 860.051 20.9092H826.778ZM859.006 37.7725C864.824 37.7725 869.718 38.8027 873.688 40.8633C877.657 42.9239 880.642 46.1364 882.642 50.5C884.672 54.8636 885.687 60.4847 885.688 67.3633C885.688 74.3026 884.672 79.9694 882.642 84.3633C880.642 88.7269 877.642 91.955 873.642 94.0459C869.672 96.1063 864.778 97.1367 858.96 97.1367H846.46V37.7725H859.006Z" fill="white"/></svg>'),
                                n &&
                                  a.push(
                                    `<div class="quality-badge quality-badge--res">${n}</div>`
                                  ));
                            }
                            if (
                              (e.dv &&
                                a.push(
                                  '<div class="quality-badge quality-badge--dv"><svg viewBox="0 0 1051 393" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0,393) scale(0.1,-0.1)" fill="currentColor"><path d="M50 2905 l0 -1017 223 5 c146 4 244 11 287 21 361 85 638 334 753 677 39 116 50 211 44 366 -7 200 -52 340 -163 511 -130 199 -329 344 -574 419 -79 24 -102 26 -327 31 l-243 4 0 -1017z"/><path d="M2436 3904 c-443 -95 -762 -453 -806 -905 -30 -308 86 -611 320 -832 104 -99 212 -165 345 -213 133 -47 253 -64 468 -64 l177 0 0 1015 0 1015 -217 -1 c-152 0 -239 -5 -287 -15z"/><path d="M3552 2908 l3 -1013 425 0 c309 0 443 4 490 13 213 43 407 148 550 299 119 124 194 255 247 428 25 84 27 103 27 270 1 158 -2 189 -22 259 -72 251 -221 458 -424 590 -97 63 -170 97 -288 134 l-85 26 -463 4 -462 3 2 -1013z m825 701 c165 -22 283 -81 404 -199 227 -223 279 -550 133 -831 -70 -133 -176 -234 -319 -304 -132 -65 -197 -75 -490 -75 l-245 0 0 703 c0 387 3 707 7 710 11 11 425 8 510 -4z"/><path d="M7070 2905 l0 -1015 155 0 155 0 0 1015 0 1015 -155 0 -155 0 0 -1015z"/><path d="M7640 2905 l0 -1015 150 0 150 0 0 60 c0 33 2 60 5 60 2 0 33 -15 67 -34 202 -110 433 -113 648 -9 79 38 108 59 180 132 72 71 95 102 134 181 102 207 102 414 1 625 -120 251 -394 411 -670 391 -115 -8 -225 -42 -307 -93 -21 -13 -42 -23 -48 -23 -7 0 -10 125 -10 370 l0 370 -150 0 -150 0 0 -1015z m832 95 c219 -67 348 -310 280 -527 -62 -198 -268 -328 -466 -295 -96 15 -168 52 -235 119 -131 132 -164 311 -87 478 27 60 101 145 158 181 100 63 234 80 350 44z"/><path d="M6035 3286 c-253 -49 -460 -232 -542 -481 -23 -70 -26 -96 -26 -210 0 -114 3 -140 26 -210 37 -113 90 -198 177 -286 84 -85 170 -138 288 -177 67 -22 94 -26 207 -26 113 0 140 4 207 26 119 39 204 92 288 177 87 89 140 174 177 286 22 67 26 99 27 200 1 137 -14 207 -69 320 -134 277 -457 440 -760 381z m252 -284 c117 -37 206 -114 260 -229 121 -253 -38 -548 -321 -595 -258 -43 -503 183 -483 447 20 271 287 457 544 377z"/><path d="M9059 3258 c10 -24 138 -312 285 -642 l266 -598 -72 -162 c-39 -88 -78 -171 -86 -183 -37 -58 -132 -80 -208 -48 l-35 14 -18 -42 c-10 -23 -37 -84 -60 -135 -23 -52 -39 -97 -36 -102 3 -4 40 -23 83 -41 70 -31 86 -34 177 -34 93 0 105 2 167 33 76 37 149 104 180 166 29 57 799 1777 805 1799 5 16 -6 17 -161 15 l-167 -3 -185 -415 c-102 -228 -192 -431 -200 -450 l-15 -35 -201 453 -201 452 -168 0 -168 0 18 -42z"/><path d="M2650 968 c0 -2 81 -211 179 -463 l179 -460 59 -3 59 -3 178 453 c98 249 180 459 183 466 4 9 -13 12 -65 12 -47 0 -71 -4 -74 -12 -3 -7 -65 -176 -138 -375 -73 -200 -136 -363 -139 -363 -3 0 -67 168 -142 373 l-136 372 -72 3 c-39 2 -71 1 -71 0z"/><path d="M3805 958 c-3 -7 -4 -215 -3 -463 l3 -450 63 -3 62 -3 0 466 0 465 -60 0 c-39 0 -62 -4 -65 -12z"/><path d="M4580 960 c-97 -16 -178 -72 -211 -145 -23 -50 -24 -143 -3 -193 32 -77 91 -117 244 -167 99 -32 146 -64 166 -112 28 -65 -11 -149 -83 -179 -78 -33 -212 -1 -261 61 l-19 24 -48 -43 -48 -42 43 -37 c121 -103 347 -112 462 -17 54 44 88 120 88 194 -1 130 -79 213 -242 256 -24 7 -71 25 -104 41 -48 22 -66 37 -79 65 -32 67 -5 138 65 174 73 37 193 18 244 -39 l20 -22 43 43 c41 40 42 43 25 61 -27 30 -102 64 -167 76 -64 12 -70 12 -135 1z"/><path d="M5320 505 l0 -465 65 0 65 0 0 465 0 465 -65 0 -65 0 0 -465z"/><path d="M6210 960 c-147 -25 -264 -114 -328 -249 -32 -65 -36 -84 -40 -175 -7 -161 33 -271 135 -367 140 -132 360 -164 541 -77 227 108 316 395 198 634 -88 177 -290 271 -506 234z m232 -132 c100 -46 165 -136 188 -261 20 -106 -18 -237 -88 -310 -101 -105 -245 -132 -377 -73 -74 33 -120 79 -157 154 -31 62 -33 74 -33 167 0 87 4 107 26 155 64 137 173 204 320 196 43 -2 85 -12 121 -28z"/><path d="M7135 958 c-3 -7 -4 -215 -3 -463 l3 -450 63 -3 62 -3 0 376 c0 207 3 374 8 371 4 -2 115 -171 247 -375 l240 -371 78 0 77 0 0 465 0 465 -60 0 -60 0 -2 -372 -3 -372 -241 370 -241 369 -82 3 c-59 2 -83 -1 -86 -10z"/></g></svg></div>'
                                ),
                              e.hdr &&
                                e.hdr_type &&
                                a.push(
                                  '<div class="quality-badge quality-badge--hdr"><svg viewBox="-1 178 313 136" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="181.5" width="306" height="129" rx="17.5" stroke="currentColor" stroke-width="5" fill="none"/><path d="M27.2784 293V199.909H46.9602V238.318H86.9148V199.909H106.551V293H86.9148V254.545H46.9602V293H27.2784ZM155.778 293H122.778V199.909H156.051C165.415 199.909 173.475 201.773 180.233 205.5C186.991 209.197 192.188 214.515 195.824 221.455C199.491 228.394 201.324 236.697 201.324 246.364C201.324 256.061 199.491 264.394 195.824 271.364C192.188 278.333 186.96 283.682 180.142 287.409C173.354 291.136 165.233 293 155.778 293ZM142.46 276.136H154.96C160.778 276.136 165.672 275.106 169.642 273.045C173.642 270.955 176.642 267.727 178.642 263.364C180.672 258.97 181.688 253.303 181.688 246.364C181.688 239.485 180.672 233.864 178.642 229.5C176.642 225.136 173.657 221.924 169.688 219.864C165.718 217.803 160.824 216.773 155.006 216.773H142.46V276.136ZM215.903 293V199.909H252.631C259.661 199.909 265.661 201.167 270.631 203.682C275.631 206.167 279.434 209.697 282.04 214.273C284.676 218.818 285.994 224.167 285.994 230.318C285.994 236.5 284.661 241.818 281.994 246.273C279.328 250.697 275.464 254.091 270.403 256.455C265.373 258.818 259.282 260 252.131 260H227.54V244.182H248.949C252.706 244.182 255.828 243.667 258.312 242.636C260.797 241.606 262.646 240.061 263.858 238C265.1 235.939 265.722 233.379 265.722 230.318C265.722 227.227 265.1 224.621 263.858 222.5C262.646 220.379 260.782 218.773 258.267 217.682C255.782 216.561 252.646 216 248.858 216H235.585V293H215.903ZM266.176 250.636L289.312 293H267.585L244.949 250.636H266.176Z" fill="currentColor"/></svg></div>'
                                ),
                              e.sound)
                            ) {
                              let n = "";
                              ("7.1" === e.sound
                                ? (n =
                                    '<svg viewBox="-1 368 313 136" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="371.5" width="306" height="129" rx="17.5" stroke="currentColor" stroke-width="5" fill="none"/><path d="M91.6023 483L130.193 406.636V406H85.2386V389.909H150.557V406.227L111.92 483H91.6023ZM159.545 484.182C156.545 484.182 153.97 483.121 151.818 481C149.697 478.848 148.636 476.273 148.636 473.273C148.636 470.303 149.697 467.758 151.818 465.636C153.97 463.515 156.545 462.455 159.545 462.455C162.455 462.455 165 463.515 167.182 465.636C169.364 467.758 170.455 470.303 170.455 473.273C170.455 475.273 169.939 477.106 168.909 478.773C167.909 480.409 166.591 481.727 164.955 482.727C163.318 483.697 161.515 484.182 159.545 484.182ZM215.045 389.909V483H195.364V408.591H194.818L173.5 421.955V404.5L196.545 389.909H215.045Z" fill="currentColor"/></svg>')
                                : "5.1" === e.sound
                                  ? (n =
                                      '<svg viewBox="330 368 313 136" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="333.5" y="371.5" width="306" height="129" rx="17.5" stroke="currentColor" stroke-width="5" fill="none"/><path d="M443.733 484.273C437.309 484.273 431.581 483.091 426.551 480.727C421.551 478.364 417.581 475.106 414.642 470.955C411.703 466.803 410.172 462.045 410.051 456.682H429.142C429.354 460.288 430.869 463.212 433.688 465.455C436.506 467.697 439.854 468.818 443.733 468.818C446.824 468.818 449.551 468.136 451.915 466.773C454.309 465.379 456.172 463.455 457.506 461C458.869 458.515 459.551 455.667 459.551 452.455C459.551 449.182 458.854 446.303 457.46 443.818C456.097 441.333 454.203 439.394 451.778 438C449.354 436.606 446.581 435.894 443.46 435.864C440.733 435.864 438.081 436.424 435.506 437.545C432.96 438.667 430.975 440.197 429.551 442.136L412.051 439L416.46 389.909H473.369V406H432.688L430.278 429.318H430.824C432.46 427.015 434.93 425.106 438.233 423.591C441.536 422.076 445.233 421.318 449.324 421.318C454.93 421.318 459.93 422.636 464.324 425.273C468.718 427.909 472.188 431.53 474.733 436.136C477.278 440.712 478.536 445.985 478.506 451.955C478.536 458.227 477.081 463.803 474.142 468.682C471.233 473.53 467.157 477.348 461.915 480.136C456.703 482.894 450.642 484.273 443.733 484.273ZM500.733 484.182C497.733 484.182 495.157 483.121 493.006 481C490.884 478.848 489.824 476.273 489.824 473.273C489.824 470.303 490.884 467.758 493.006 465.636C495.157 463.515 497.733 462.455 500.733 462.455C503.642 462.455 506.188 463.515 508.369 465.636C510.551 467.758 511.642 470.303 511.642 473.273C511.642 475.273 511.127 477.106 510.097 478.773C509.097 480.409 507.778 481.727 506.142 482.727C504.506 483.697 502.703 484.182 500.733 484.182ZM556.233 389.909V483H536.551V408.591H536.006L514.688 421.955V404.5L537.733 389.909H556.233Z" fill="currentColor"/></svg>')
                                  : "2.0" === e.sound &&
                                    (n =
                                      '<svg viewBox="661 368 313 136" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="664.5" y="371.5" width="306" height="129" rx="17.5" stroke="currentColor" stroke-width="5" fill="none"/><path d="M722.983 483V468.818L756.119 438.136C758.938 435.409 761.301 432.955 763.21 430.773C765.15 428.591 766.619 426.455 767.619 424.364C768.619 422.242 769.119 419.955 769.119 417.5C769.119 414.773 768.498 412.424 767.256 410.455C766.013 408.455 764.316 406.924 762.165 405.864C760.013 404.773 757.574 404.227 754.847 404.227C751.998 404.227 749.513 404.803 747.392 405.955C745.271 407.106 743.634 408.758 742.483 410.909C741.331 413.061 740.756 415.621 740.756 418.591H722.074C722.074 412.5 723.453 407.212 726.21 402.727C728.968 398.242 732.831 394.773 737.801 392.318C742.771 389.864 748.498 388.636 754.983 388.636C761.65 388.636 767.453 389.818 772.392 392.182C777.362 394.515 781.225 397.758 783.983 401.909C786.741 406.061 788.119 410.818 788.119 416.182C788.119 419.697 787.422 423.167 786.028 426.591C784.665 430.015 782.225 433.818 778.71 438C775.195 442.152 770.241 447.136 763.847 452.955L750.256 466.273V466.909H789.347V483H722.983ZM815.108 484.182C812.108 484.182 809.532 483.121 807.381 481C805.259 478.848 804.199 476.273 804.199 473.273C804.199 470.303 805.259 467.758 807.381 465.636C809.532 463.515 812.108 462.455 815.108 462.455C818.017 462.455 820.563 463.515 822.744 465.636C824.926 467.758 826.017 470.303 826.017 473.273C826.017 475.273 825.502 477.106 824.472 478.773C823.472 480.409 822.153 481.727 820.517 482.727C818.881 483.697 817.078 484.182 815.108 484.182ZM874.483 485.045C866.665 485.015 859.938 483.091 854.301 479.273C848.695 475.455 844.377 469.924 841.347 462.682C838.347 455.439 836.862 446.727 836.892 436.545C836.892 426.394 838.392 417.742 841.392 410.591C844.422 403.439 848.741 398 854.347 394.273C859.983 390.515 866.695 388.636 874.483 388.636C882.271 388.636 888.968 390.515 894.574 394.273C900.21 398.03 904.544 403.485 907.574 410.636C910.604 417.758 912.104 426.394 912.074 436.545C912.074 446.758 910.559 455.485 907.528 462.727C904.528 469.97 900.225 475.5 894.619 479.318C889.013 483.136 882.301 485.045 874.483 485.045ZM874.483 468.727C879.816 468.727 884.074 466.045 887.256 460.682C890.438 455.318 892.013 447.273 891.983 436.545C891.983 429.485 891.256 423.606 889.801 418.909C888.377 414.212 886.347 410.682 883.71 408.318C881.104 405.955 878.028 404.773 874.483 404.773C869.18 404.773 864.938 407.424 861.756 412.727C858.574 418.03 856.968 425.97 856.938 436.545C856.938 443.697 857.65 449.667 859.074 454.455C860.528 459.212 862.574 462.788 865.21 465.182C867.847 467.545 870.938 468.727 874.483 468.727Z" fill="currentColor"/></svg>'),
                                n &&
                                  a.push(
                                    `<div class="quality-badge quality-badge--sound">${n}</div>`
                                  ));
                            }
                            (e.dub &&
                              a.push(
                                '<div class="quality-badge quality-badge--dub"><svg viewBox="-1 558 313 136" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="561.5" width="306" height="129" rx="17.5" stroke="currentColor" stroke-width="5" fill="none"/><path d="M60.5284 673H27.5284V579.909H60.8011C70.1648 579.909 78.2254 581.773 84.983 585.5C91.7405 589.197 96.9375 594.515 100.574 601.455C104.241 608.394 106.074 616.697 106.074 626.364C106.074 636.061 104.241 644.394 100.574 651.364C96.9375 658.333 91.7102 663.682 84.892 667.409C78.1042 671.136 69.983 673 60.5284 673ZM47.2102 656.136H59.7102C65.5284 656.136 70.4223 655.106 74.392 653.045C78.392 650.955 81.392 647.727 83.392 643.364C85.4223 638.97 86.4375 633.303 86.4375 626.364C86.4375 619.485 85.4223 613.864 83.392 609.5C81.392 605.136 78.4072 601.924 74.4375 599.864C70.4678 597.803 65.5739 596.773 59.7557 596.773H47.2102V656.136ZM178.153 579.909H197.835V640.364C197.835 647.152 196.214 653.091 192.972 658.182C189.759 663.273 185.259 667.242 179.472 670.091C173.684 672.909 166.941 674.318 159.244 674.318C151.517 674.318 144.759 672.909 138.972 670.091C133.184 667.242 128.684 663.273 125.472 658.182C122.259 653.091 120.653 647.152 120.653 640.364V579.909H140.335V638.682C140.335 642.227 141.108 645.379 142.653 648.136C144.229 650.894 146.441 653.061 149.29 654.636C152.138 656.212 155.456 657 159.244 657C163.063 657 166.381 656.212 169.199 654.636C172.047 653.061 174.244 650.894 175.79 648.136C177.366 645.379 178.153 642.227 178.153 638.682V579.909ZM214.028 673V579.909H251.301C258.15 579.909 263.862 580.924 268.438 582.955C273.013 584.985 276.453 587.803 278.756 591.409C281.059 594.985 282.21 599.106 282.21 603.773C282.21 607.409 281.483 610.606 280.028 613.364C278.574 616.091 276.574 618.333 274.028 620.091C271.513 621.818 268.634 623.045 265.392 623.773V624.682C268.938 624.833 272.256 625.833 275.347 627.682C278.468 629.53 280.998 632.121 282.938 635.455C284.877 638.758 285.847 642.697 285.847 647.273C285.847 652.212 284.619 656.621 282.165 660.5C279.741 664.348 276.15 667.394 271.392 669.636C266.634 671.879 260.771 673 253.801 673H214.028ZM233.71 656.909H249.756C255.241 656.909 259.241 655.864 261.756 653.773C264.271 651.652 265.528 648.833 265.528 645.318C265.528 642.742 264.907 640.47 263.665 638.5C262.422 636.53 260.65 634.985 258.347 633.864C256.074 632.742 253.362 632.182 250.21 632.182H233.71V656.909ZM233.71 618.864H248.301C250.998 618.864 253.392 618.394 255.483 617.455C257.604 616.485 259.271 615.121 260.483 613.364C261.725 611.606 262.347 609.5 262.347 607.045C262.347 603.682 261.15 600.97 258.756 598.909C256.392 596.848 253.028 595.818 248.665 595.818H233.71V618.864Z" fill="currentColor"/></svg></div>'
                              ),
                              a.length > 0 &&
                                (t.html(a.join("")), t.addClass("show")));
                          })(t, o)));
                    },
                    (n) => {
                      console.log("Applecation", { error: n });
                    }
                  );
                })(l, a);
            }
          }),
          (function () {
            try {
              if (window.applecation_episodes_core_patch) return;
              if (
                ((window.applecation_episodes_core_patch = !0),
                (window.episodes_order_fix = !0),
                (window.episodes_core_patch = !0),
                !window.Lampa ||
                  !Lampa.Utils ||
                  "function" != typeof Lampa.Utils.createInstance)
              )
                return;
              if (Lampa.Utils.__applecation_episodes_core_patch_applied) return;
              function e(n) {
                try {
                  if (!n) return !1;
                  if (!n.movie) return !1;
                  if (!Array.isArray(n.results) || !n.results.length) return !1;
                  for (var e = 0, t = 0; t < n.results.length; t++) {
                    var a = n.results[t];
                    a &&
                      ("number" == typeof a.episode_number && e++,
                      "number" == typeof a.season_number && e++,
                      a.comeing && e++,
                      a.air_date && e++);
                  }
                  return e >= 3;
                } catch (n) {
                  return !1;
                }
              }
              function t(n) {
                const e = n;
                try {
                  for (
                    var t = e.results || [], a = [], i = [], o = 0;
                    o < t.length;
                    o++
                  ) {
                    var r = t[o];
                    r && (r.comeing ? a.push(r) : i.push(r));
                  }
                  (i.sort(function (n, e) {
                    return (n.episode_number || 0) - (e.episode_number || 0);
                  }),
                    (e.results = i.concat(a)));
                } catch (e) {}
              }
              function a(n) {
                try {
                  if (!n || !n.scroll || "function" != typeof n.scroll.append)
                    return;
                  if (n.__applecation_episodes_scroll_append_patched) return;
                  n.__applecation_episodes_scroll_append_patched = !0;
                  var e = n.scroll.append.bind(n.scroll);
                  n.scroll.append = function (t) {
                    var a = t instanceof jQuery ? t[0] : t;
                    if (a && a.classList && a.classList.contains("card-more"))
                      return e(t);
                    var i =
                      "function" == typeof n.scroll.body
                        ? n.scroll.body(!0)
                        : null;
                    if (i) {
                      var o = i.querySelector(".card-more");
                      if (o && a && a !== o) return void i.insertBefore(a, o);
                    }
                    return e(t);
                  };
                } catch (n) {}
              }
              function i(n) {
                try {
                  if (!n || "function" != typeof n.create) return;
                  if (n.__applecation_episodes_create_patched) return;
                  n.__applecation_episodes_create_patched = !0;
                  var e = n.create.bind(n);
                  n.create = function () {
                    a(n);
                    var t = e();
                    return (
                      setTimeout(function () {
                        try {
                          var e =
                              n &&
                              n.scroll &&
                              "function" == typeof n.scroll.body
                                ? n.scroll.body(!0)
                                : null,
                            t = e ? e.querySelector(".card-more") : null;
                          t && t.classList.remove("card-more--first");
                        } catch (n) {}
                      }, 0),
                      t
                    );
                  };
                } catch (n) {}
              }
              Lampa.Utils.__applecation_episodes_core_patch_applied = !0;
              var n = Lampa.Utils.createInstance;
              Lampa.Utils.createInstance = function (a, o, r, l) {
                var s = e(o),
                  p = Lampa.Storage.get("applecation_reverse_episodes", !0);
                s && p && t(o);
                var c = n.call(this, a, o, r, l);
                return (s && p && i(c), c);
              };
            } catch (o) {}
          })())
        : console.log("Applecation", "TV mode only"));
  }
  const a = {
    show_ratings: {
      ru: "Показывать рейтинги",
      en: "Show ratings",
      uk: "Показувати рейтинги",
      be: "Паказваць рэйтынгі",
      bg: "Показване на рейтинги",
      cs: "Zobrazit hodnocení",
      he: "הצג דירוגים",
      pt: "Mostrar classificações",
      zh: "显示评分",
    },
    show_ratings_desc: {
      ru: "Отображать рейтинги IMDB и КиноПоиск",
      en: "Display IMDB and KinoPoisk ratings",
      uk: "Відображати рейтинги IMDB та КіноПошук",
      be: "Адлюстроўваць рэйтынгі IMDB і КіноПошук",
      bg: "Показване на рейтинги IMDB и КиноПоиск",
      cs: "Zobrazit hodnocení IMDB a KinoPoisk",
      he: "הצג דירוגי IMDB וקינופויסק",
      pt: "Exibir classificações IMDB e KinoPoisk",
      zh: "显示 IMDB 和 KinoPoisk 评分",
    },
    show_reactions: {
      ru: "Показывать реакции Lampa",
      en: "Show Lampa Reactions",
      uk: "Показувати реакції Lampa",
      be: "Паказваць рэакцыі Lampa",
      bg: "Показване на реакции Lampa",
      cs: "Zobrazit reakce Lampa",
      he: "הצג תגובות Lampa",
      pt: "Mostrar reações Lampa",
      zh: "显示 Lampa 反应",
    },
    show_reactions_desc: {
      ru: "Отображать блок с реакциями на карточке",
      en: "Display reactions block on card",
      uk: "Відображати блок з реакціями на картці",
      be: "Адлюстроўваць блок з рэакцыямі на картцы",
      bg: "Показване на блока с реакции на картата",
      cs: "Zobrazit blok s reakcemi na kartě",
      he: "הצג בלוק תגובות בכרטיס",
      pt: "Exibir bloco de reações no cartão",
      zh: "在卡片上显示反应块",
    },
    ratings_position: {
      ru: "Расположение рейтингов",
      en: "Ratings position",
      uk: "Розташування рейтингів",
      be: "Размяшчэнне рэйтынгаў",
      bg: "Позиция на рейтингите",
      cs: "Umístění hodnocení",
      he: "מיקום דירוגים",
      pt: "Posição das classificações",
      zh: "评分位置",
    },
    ratings_position_desc: {
      ru: "Выберите где отображать рейтинги",
      en: "Choose where to display ratings",
      uk: "Виберіть де відображати рейтинги",
      be: "Выберыце дзе адлюстроўваць рэйтынгі",
      bg: "Изберете къде да се показват рейтингите",
      cs: "Vyberte, kde zobrazit hodnocení",
      he: "בחר היכן להציג דירוגים",
      pt: "Escolha onde exibir classificações",
      zh: "选择评分显示位置",
    },
    position_card: {
      ru: "В карточке",
      en: "In card",
      uk: "У картці",
      be: "У картцы",
      bg: "В картата",
      cs: "Na kartě",
      he: "בכרטיס",
      pt: "No cartão",
      zh: "在卡片中",
    },
    position_corner: {
      ru: "В правом нижнем углу",
      en: "Bottom right corner",
      uk: "У правому нижньому куті",
      be: "У правым ніжнім куце",
      bg: "В долния десен ъгъл",
      cs: "V pravém dolním rohu",
      he: "בפינה הימנית התחתונה",
      pt: "Canto inferior direito",
      zh: "右下角",
    },
    year_short: {
      ru: " г.",
      en: "",
      uk: " р.",
      be: " г.",
      bg: " г.",
      cs: "",
      he: "",
      pt: "",
      zh: "年",
    },
    logo_scale: {
      ru: "Размер логотипа",
      en: "Logo Size",
      uk: "Розмір логотипу",
      be: "Памер лагатыпа",
      bg: "Размер на логото",
      cs: "Velikost loga",
      he: "גודל לוגו",
      pt: "Tamanho do logotipo",
      zh: "徽标大小",
    },
    logo_scale_desc: {
      ru: "Масштаб логотипа фильма",
      en: "Movie logo scale",
      uk: "Масштаб логотипу фільму",
      be: "Маштаб лагатыпа фільма",
      bg: "Мащаб на логото на филма",
      cs: "Měřítko loga filmu",
      he: "קנה מידה של לוגו הסרט",
      pt: "Escala do logotipo do filme",
      zh: "电影徽标比例",
    },
    text_scale: {
      ru: "Размер текста",
      en: "Text Size",
      uk: "Розмір тексту",
      be: "Памер тэксту",
      bg: "Размер на текста",
      cs: "Velikost textu",
      he: "גודל טקסט",
      pt: "Tamanho do texto",
      zh: "文本大小",
    },
    text_scale_desc: {
      ru: "Масштаб текста данных о фильме",
      en: "Movie data text scale",
      uk: "Масштаб тексту даних про фільм",
      be: "Маштаб тэксту даных пра фільм",
      bg: "Мащаб на текста с данни за филма",
      cs: "Měřítko textu dat filmu",
      he: "קנה מידה של טקסט נתוני הסרט",
      pt: "Escala do texto de dados do filme",
      zh: "电影数据文本比例",
    },
    scale_default: {
      ru: "По умолчанию",
      en: "Default",
      uk: "За замовчуванням",
      be: "Па змаўчанні",
      bg: "По подразбиране",
      cs: "Výchozí",
      he: "ברירת מחדל",
      pt: "Padrão",
      zh: "默认",
    },
    spacing_scale: {
      ru: "Отступы между строками",
      en: "Spacing Between Lines",
      uk: "Відступи між рядками",
      be: "Адступы паміж радкамі",
      bg: "Разстояние между редовете",
      cs: "Mezery mezi řádky",
      he: "מרווח בין שורות",
      pt: "Espaçamento entre linhas",
      zh: "行间距",
    },
    spacing_scale_desc: {
      ru: "Расстояние между элементами информации",
      en: "Distance between information elements",
      uk: "Відстань між елементами інформації",
      be: "Адлегласць паміж элементамі інфармацыі",
      bg: "Разстояние между информационни елементи",
      cs: "Vzdálenost mezi informačními prvky",
      he: "מרחק בין אלמנטי מידע",
      pt: "Distância entre elementos de informação",
      zh: "信息元素之间的距离",
    },
    settings_title_display: {
      ru: "Отображение",
      en: "Display",
      uk: "Відображення",
      be: "Адлюстраванне",
      bg: "Показване",
      cs: "Zobrazení",
      he: "תצוגה",
      pt: "Exibição",
      zh: "显示",
    },
    settings_title_scaling: {
      ru: "Масштабирование",
      en: "Scaling",
      uk: "Масштабування",
      be: "Маштабаванне",
      bg: "Мащабиране",
      cs: "Škálování",
      he: "קנה מידה",
      pt: "Dimensionamento",
      zh: "缩放",
    },
    reverse_episodes: {
      ru: "Перевернуть список эпизодов",
      en: "Reverse Episodes List",
      uk: "Перевернути список епізодів",
      be: "Перавярнуць спіс эпізодаў",
      bg: "Обърни списъка с епизоди",
      cs: "Obrátit seznam epizod",
      he: "הפוך את רשימת הפרקים",
      pt: "Inverter lista de episódios",
      zh: "反转剧集列表",
    },
    reverse_episodes_desc: {
      ru: "Показывать эпизоды в обратном порядке (от новых к старым)",
      en: "Show episodes in reverse order (from newest to oldest)",
      uk: "Показувати епізоди у зворотному порядку (від нових до старих)",
      be: "Паказваць эпізоды ў адваротным парадку (ад новых да старых)",
      bg: "Показване на епизоди в обратен ред (от нови към стари)",
      cs: "Zobrazit epizody v opačném pořadí (od nejnovějších po nejstarší)",
      he: "הצג פרקים בסדר הפוך (מהחדש לישן)",
      pt: "Mostrar episódios em ordem inversa (do mais novo ao mais antigo)",
      zh: "以相反顺序显示剧集（从新到旧）",
    },
    description_overlay: {
      ru: "Описание в оверлее",
      en: "Description in Overlay",
      uk: "Опис в оверлеї",
      be: "Апісанне ў аверлеі",
      bg: "Описание в овърлей",
      cs: "Popis v překryvné vrstvě",
      he: "תיאור בשכבת על",
      pt: "Descrição em sobreposição",
      zh: "叠加层中的描述",
    },
    description_overlay_desc: {
      ru: "Показывать описание в отдельном окне при нажатии",
      en: "Show description in a separate window when clicked",
      uk: "Показувати опис в окремому вікні при натисканні",
      be: "Паказваць апісанне ў асобным акне пры націску",
      bg: "Показване на описанието в отделен прозорец при щракване",
      cs: "Při kliknutí zobrazit popis v samostatném okně",
      he: "הצг תיאور בחлון נפרд בעת לחיצה",
      pt: "Mostrar описание em uma janela separada quando clicado",
      zh: "点击时在单独的窗口中显示描述",
    },
  };
  function i(n) {
    const e = Lampa.Storage.get("language", "ru");
    return (a[n] && a[n][e]) || a[n].ru;
  }
  function o() {
    const n = parseInt(Lampa.Storage.get("applecation_logo_scale", "100")),
      e = parseInt(Lampa.Storage.get("applecation_text_scale", "100")),
      t = parseInt(Lampa.Storage.get("applecation_spacing_scale", "100"));
    $('style[data-id="applecation_scales"]').remove();
    const a = `
    <style data-id="applecation_scales">
        /* Масштаб логотипа */
        
        .applecation .applecation__logo img {
            max-width: ${(35 * n) / 100}vw !important;
            max-height: ${(180 * n) / 100}px !important;
        }
            
        /* Масштаб текста и мета-информации */
        .applecation .applecation__content-wrapper {
            font-size: ${e}% !important;
        }
            
        /* Отступы между элементами */
        .applecation .full-start-new__title {
            margin-bottom: ${(0.5 * t) / 100}em !important;
        }
        
        .applecation .applecation__meta {
            margin-bottom: ${(0.5 * t) / 100}em !important;
        }
        
        .applecation .applecation__ratings {
            margin-bottom: ${(0.5 * t) / 100}em !important;
        }
        
        .applecation .applecation__description {
            max-width: ${(35 * e) / 100}vw !important;
            margin-bottom: ${(0.5 * t) / 100}em !important;
        }
        
        .applecation .applecation__info {
            margin-bottom: ${(0.5 * t) / 100}em !important;
        }
    </style>
    `;
    $("body").append(a);
  }
  function r() {
    Lampa.Template.add(
      "applecation_overlay",
      `<div class="applecation-description-overlay">
        <div class="applecation-description-overlay__bg"></div>
        <div class="applecation-description-overlay__content selector">
          <div class="applecation-description-overlay__logo"></div>
          <div class="applecation-description-overlay__title">{title}</div>
          <div class="applecation-description-overlay__text">{text}</div>
          <div class="applecation-description-overlay__details">
            <div class="applecation-description-overlay__info">
                <div class="applecation-description-overlay__info-name">#{full_date_of_release}</div>
                <div class="applecation-description-overlay__info-body">{relise}</div>
            </div>
            <div class="applecation-description-overlay__info applecation--budget">
                <div class="applecation-description-overlay__info-name">#{full_budget}</div>
                <div class="applecation-description-overlay__info-body">{budget}</div>
            </div>
            <div class="applecation-description-overlay__info applecation--countries">
                <div class="applecation-description-overlay__info-name">#{full_countries}</div>
                <div class="applecation-description-overlay__info-body">{countries}</div>
            </div>
          </div>
        </div>
      </div>`
    );
  }
  function l() {
    const n = Lampa.Storage.get("applecation_ratings_position", "card"),
      e = `\x3c!-- Рейтинги --\x3e
        <div class="applecation__ratings">
          <div class="rate--imdb hide">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path fill="currentColor" d="M4 7c-1.103 0-2 .897-2 2v6.4c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2H4Zm1.4 2.363h1.275v5.312H5.4V9.362Zm1.962 0H9l.438 2.512.287-2.512h1.75v5.312H10.4v-3l-.563 3h-.8l-.512-3v3H7.362V9.362Zm8.313 0H17v1.2c.16-.16.516-.363.875-.363.36.04.84.283.8.763v3.075c0 .24-.075.404-.275.524-.16.04-.28.075-.6.075-.32 0-.795-.196-.875-.237-.08-.04-.163.275-.163.275h-1.087V9.362Zm-3.513.037H13.6c.88 0 1.084.078 1.325.237.24.16.35.397.35.838v3.2c0 .32-.15.563-.35.762-.2.2-.484.288-1.325.288h-1.438V9.4Zm1.275.8v3.563c.2 0 .488.04.488-.2v-3.126c0-.28-.247-.237-.488-.237Zm3.763.675c-.12 0-.2.08-.2.2v2.688c0 .159.08.237.2.237.12 0 .2-.117.2-.238l-.037-2.687c0-.12-.043-.2-.163-.2Z"/>
            </svg>
            <div>0.0</div>
          </div>
          <div class="rate--kp hide">
            <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path d="M96.5 20 66.1 75.733V20H40.767v152H66.1v-55.733L96.5 172h35.467C116.767 153.422 95.2 133.578 80 115c28.711 16.889 63.789 35.044 92.5 51.933v-30.4C148.856 126.4 108.644 115.133 85 105c23.644 3.378 63.856 7.889 87.5 11.267v-30.4L85 90c27.022-11.822 60.478-22.711 87.5-34.533v-30.4C143.789 41.956 108.711 63.11 80 80l51.967-60z" style="fill:none;stroke:currentColor;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10"/>
            </svg>
            <div>0.0</div>
          </div>
        </div>`,
      t = `<div class="full-start-new applecation">
        <div class="full-start-new__body">
          <div class="full-start-new__left hide">
            <div class="full-start-new__poster">
              <img class="full-start-new__img full--poster" />
            </div>
          </div>
          
          <div class="full-start-new__right">
            <div class="applecation__left">
              <div class="applecation__logo"></div>
              
              <div class="applecation__content-wrapper">
                <div class="full-start-new__title" style="display: none;">{title}</div>
                
                <div class="applecation__meta">
                  <div class="applecation__meta-left">
                    <span class="applecation__network"></span>
                    <span class="applecation__meta-text"></span>
                    <div class="full-start__pg hide"></div>
                  </div>
                </div>
                
                ${"card" === n ? e : ""}
                
                <div class="applecation__description-wrapper">
                    <div class="applecation__description"></div>
                </div>
                <div class="applecation__info"></div>
              </div>
              
              \x3c!-- Скрытые оригинальные элементы --\x3e
              <div class="full-start-new__head" style="display: none;"></div>
              <div class="full-start-new__details" style="display: none;"></div>
              
              <div class="full-start-new__buttons">
                <div class="full-start__button selector button--play">
                  <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="14.5" r="13" stroke="currentColor" stroke-width="2.7"/>
                    <path d="M18.0739 13.634C18.7406 14.0189 18.7406 14.9811 18.0739 15.366L11.751 19.0166C11.0843 19.4015 10.251 18.9204 10.251 18.1506L10.251 10.8494C10.251 10.0796 11.0843 9.5985 11.751 9.9834L18.0739 13.634Z" fill="currentColor"/>
                  </svg>
                  <span>#{title_watch}</span>
                </div>
                  
                <div class="full-start__button selector button--book">
                  <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z" stroke="currentColor" stroke-width="2.5"/>
                  </svg>
                  <span>#{settings_input_links}</span>
                </div>
                  
                <div class="full-start__button selector button--reaction">
                  <svg width="38" height="34" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M37.208 10.9742C37.1364 10.8013 37.0314 10.6441 36.899 10.5117C36.7666 10.3794 36.6095 10.2744 36.4365 10.2028L12.0658 0.108375C11.7166 -0.0361828 11.3242 -0.0361227 10.9749 0.108542C10.6257 0.253206 10.3482 0.530634 10.2034 0.879836L0.108666 25.2507C0.0369593 25.4236 3.37953e-05 25.609 2.3187e-08 25.7962C-3.37489e-05 25.9834 0.0368249 26.1688 0.108469 26.3418C0.180114 26.5147 0.28514 26.6719 0.417545 26.8042C0.54995 26.9366 0.707139 27.0416 0.880127 27.1131L17.2452 33.8917C17.5945 34.0361 17.9869 34.0361 18.3362 33.8917L29.6574 29.2017C29.8304 29.1301 29.9875 29.0251 30.1199 28.8928C30.2523 28.7604 30.3573 28.6032 30.4289 28.4303L37.2078 12.065C37.2795 11.8921 37.3164 11.7068 37.3164 11.5196C37.3165 11.3325 37.2796 11.1471 37.208 10.9742ZM20.425 29.9407L21.8784 26.4316L25.3873 27.885L20.425 29.9407ZM28.3407 26.0222L21.6524 23.252C21.3031 23.1075 20.9107 23.1076 20.5615 23.2523C20.2123 23.3969 19.9348 23.6743 19.79 24.0235L17.0194 30.7123L3.28783 25.0247L12.2918 3.28773L34.0286 12.2912L28.3407 26.0222Z" fill="currentColor"/>
                    <path d="M25.3493 16.976L24.258 14.3423L16.959 17.3666L15.7196 14.375L13.0859 15.4659L15.4161 21.0916L25.3493 16.976Z" fill="currentColor"/>
                  </svg>
                  <span>#{title_reactions}</span>
                </div>
                  
                <div class="full-start__button selector button--subscribe hide">
                  <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.01892 24C6.27423 27.3562 9.07836 30 12.5 30C15.9216 30 18.7257 27.3562 18.981 24H15.9645C15.7219 25.6961 14.2632 27 12.5 27C10.7367 27 9.27804 25.6961 9.03542 24H6.01892Z" fill="currentColor"/>
                    <path d="M3.81972 14.5957V10.2679C3.81972 5.41336 7.7181 1.5 12.5 1.5C17.2819 1.5 21.1803 5.41336 21.1803 10.2679V14.5957C21.1803 15.8462 21.5399 17.0709 22.2168 18.1213L23.0727 19.4494C24.2077 21.2106 22.9392 23.5 20.9098 23.5H4.09021C2.06084 23.5 0.792282 21.2106 1.9273 19.4494L2.78317 18.1213C3.46012 17.0709 3.81972 15.8462 3.81972 14.5957Z" stroke="currentColor" stroke-width="2.5"/>
                  </svg>
                  <span>#{title_subscribe}</span>
                </div>
                  
                <div class="full-start__button selector button--options">
                  <svg width="38" height="10" viewBox="0 0 38 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4.88968" cy="4.98563" r="4.75394" fill="currentColor"/>
                    <circle cx="18.9746" cy="4.98563" r="4.75394" fill="currentColor"/>
                    <circle cx="33.0596" cy="4.98563" r="4.75394" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
              
            <div class="applecation__right">
              <div class="full-start-new__reactions selector">
                <div>#{reactions_none}</div>
              </div>
              
              ${"corner" === n ? e : ""}
              
              \x3c!-- Скрытый элемент для совместимости (предотвращает выход реакций за экран) --\x3e
              <div class="full-start-new__rate-line">
                <div class="full-start__status hide"></div>
              </div>
              
              \x3c!-- Пустой маркер для предотвращения вставки элементов от modss.js --\x3e
              <div class="rating--modss" style="display: none;"></div>
            </div>
          </div>
        </div>
          
        <div class="hide buttons--container">
          <div class="full-start__button view--torrent hide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
              <path d="M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M40.5,30.963c-3.1,0-4.9-2.4-4.9-2.4 S34.1,35,27,35c-1.4,0-3.6-0.837-3.6-0.837l4.17,9.643C26.727,43.92,25.874,44,25,44c-2.157,0-4.222-0.377-6.155-1.039L9.237,16.851 c0,0-0.7-1.2,0.4-1.5c1.1-0.3,5.4-1.2,5.4-1.2s1.475-0.494,1.8,0.5c0.5,1.3,4.063,11.112,4.063,11.112S22.6,29,27.4,29 c4.7,0,5.9-3.437,5.7-3.937c-1.2-3-4.993-11.862-4.993-11.862s-0.6-1.1,0.8-1.4c1.4-0.3,3.8-0.7,3.8-0.7s1.105-0.163,1.6,0.8 c0.738,1.437,5.193,11.262,5.193,11.262s1.1,2.9,3.3,2.9c0.464,0,0.834-0.046,1.152-0.104c-0.082,1.635-0.348,3.221-0.817,4.722 C42.541,30.867,41.756,30.963,40.5,30.963z" fill="currentColor"/>
            </svg>
            <span>#{full_torrents}</span>
          </div>
          
          <div class="full-start__button selector view--trailer">
            <svg height="70" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M71.2555 2.08955C74.6975 3.2397 77.4083 6.62804 78.3283 10.9306C80 18.7291 80 35 80 35C80 35 80 51.2709 78.3283 59.0694C77.4083 63.372 74.6975 66.7603 71.2555 67.9104C65.0167 70 40 70 40 70C40 70 14.9833 70 8.74453 67.9104C5.3025 66.7603 2.59172 63.372 1.67172 59.0694C0 51.2709 0 35 0 35C0 35 0 18.7291 1.67172 10.9306C2.59172 6.62804 5.3025 3.2395 8.74453 2.08955C14.9833 0 40 0 40 0C40 0 65.0167 0 71.2555 2.08955ZM55.5909 35.0004L29.9773 49.5714V20.4286L55.5909 35.0004Z" fill="currentColor"></path>
            </svg>
            <span>#{full_trailers}</span>
          </div>
        </div>
      </div>`;
    (Lampa.Template.add("full_start_new", t),
      Lampa.Template.add(
        "full_episode",
        `<div class="full-episode selector layer--visible">
          <div class="full-episode__img">
            <img />
            <div class="full-episode__time">{time}</div>
          </div>
          
          <div class="full-episode__body">
            <div class="full-episode__num">#{full_episode} {num}</div>
            <div class="full-episode__name">{name}</div>
            <div class="full-episode__overview">{overview}</div>
            <div class="full-episode__date">{date}</div>
          </div>
        </div>`
      ));
  }
  function s(n, t) {
    const a = n
      .render()
      .find(".full-start__background:not(.applecation__overlay)");
    if (!a.length) return void t();
    if (a.hasClass("loaded") && a.hasClass("applecation-animated"))
      return void t();
    if (a.hasClass("loaded"))
      return void setTimeout(() => {
        (a.addClass("applecation-animated"), t());
      }, 350);
    const i = setInterval(() => {
      e(n)
        ? a.hasClass("loaded") &&
          (clearInterval(i),
          setTimeout(() => {
            e(n) && (a.addClass("applecation-animated"), t());
          }, 650))
        : clearInterval(i);
    }, 50);
    setTimeout(() => {
      (clearInterval(i),
        a.hasClass("applecation-animated") ||
          (a.addClass("applecation-animated"), t()));
    }, 2e3);
  }
  var p = {
    type: "other",
    version: n,
    name: "AppleTV",
    description:
      "Делает интерфейс в карточке фильма похожим на Apple TV и оптимизирует под 4K",
    author: "AppleTV",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="14" fill="none" stroke="currentColor" stroke-width="4"/><path d="M22 18l20 12-10 2 2 10-12-24z" fill="currentColor"/><path d="M44 20l6-6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
  };
  (Lampa.Manifest && Lampa.Manifest.plugins && (Lampa.Manifest.plugins = p),
    window.appready
      ? t()
      : Lampa.Listener.follow("app", (n) => {
          "ready" === n.type && t();
        }));
})();
