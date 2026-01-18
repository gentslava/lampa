(function () {
  "use strict";

  Lampa.Lang.add({
    name_plugin: { ru: "Настройка шапки", en: "Header settings" },
    plugin_description: {
      ru: "Плагин для настройки шапки",
      en: "Plugin for customizing the header",
    },
    name_menu: { ru: "Отображать в шапке", en: "Display in header" },
    search: { ru: "Поиск", en: "Search" },
    settings: { ru: "Настройки", en: "Settings" },
    profile: { ru: "Профиль", en: "Profile" },
    fullscreen: { ru: "Полный экран", en: "Fullscreen" },
    fullscreen: { ru: "Полный экран", en: "Fullscreen" },
    notice: { ru: "Уведомления", en: "Notifications" },
    aisearch: { ru: "ИИ поиск", en: "AI search" },
    time: { ru: "Время", en: "Clock" },
  });

  function startPlugin() {
    var manifest = {
      type: "other",
      version: "0.3.3",
      name: Lampa.Lang.translate("name_plugin"),
      description: Lampa.Lang.translate("plugin_description"),
      component: "head_filter",
    };
    Lampa.Manifest.plugins = manifest;

    const head = {
      head_filter_show_search: {
        name: Lampa.Lang.translate("search"),
        element: ".open--search",
      },
      head_filter_show_settings: {
        name: Lampa.Lang.translate("settings"),
        element: ".open--settings",
      },
      head_filter_show_profile: {
        name: Lampa.Lang.translate("profile"),
        element: ".open--profile",
      },
      head_filter_show_fullscreen: {
        name: Lampa.Lang.translate("fullscreen"),
        element: ".full--screen",
      },
      head_filter_show_notice: {
        name: Lampa.Lang.translate("notice"),
        element: ".notice--icon",
      },
      head_filter_show_aisearch: {
        name: Lampa.Lang.translate("aisearch"),
        element: ".ai-search-header-btn",
      },
      head_filter_show_time: {
        name: Lampa.Lang.translate("time"),
        element: ".head__time",
      },
    };

    function showHideElement(selector, show) {
      const headElement = Lampa.Head.render();
      if (!headElement || !headElement.length) return;

      const el = headElement.find(selector);
      if (el.length) {
        if (show) {
          el.removeClass("hide").css("display", "");
        } else {
          el.addClass("hide").css("display", "none");
        }
      }
    }

    function handleDynamicElement(selector, show) {
      let attempts = 0;
      const maxAttempts = 100;

      const checkInterval = setInterval(function () {
        const headElement = Lampa.Head.render();

        if (headElement && headElement.length) {
          const element = headElement.find(selector);

          if (element.length) {
            if (show) {
              element.removeClass("hide").css("display", "");
            } else {
              element.addClass("hide").css("display", "none");
            }
            clearInterval(checkInterval);
            return;
          }
        }

        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
        }
      }, 100);
    }

    function applySettings() {
      Object.keys(head).forEach((key) => {
        const show = Lampa.Storage.get(key, true);
        const selector = head[key].element;

        if (
          key === "head_filter_show_notice" ||
          key === "head_filter_show_profile"
        ) {
          handleDynamicElement(selector, show);
        } else {
          showHideElement(selector, show);
        }
      });
    }

    Lampa.Storage.listener.follow("change", (event) => {
      if (event.name === "activity") {
        setTimeout(applySettings, 500);
      } else if (event.name in head) {
        const show = Lampa.Storage.get(event.name, true);
        const selector = head[event.name].element;

        if (
          event.name === "head_filter_show_notice" ||
          event.name === "head_filter_show_profile"
        ) {
          handleDynamicElement(selector, show);
        } else {
          showHideElement(selector, show);
        }
      }
    });

    setTimeout(applySettings, 1500);

    Lampa.Template.add("settings_head_filter", `<div></div>`);

    Lampa.SettingsApi.addParam({
      component: "interface",
      param: { type: "button" },
      field: {
        name: Lampa.Lang.translate("name_plugin"),
        description: Lampa.Lang.translate("plugin_description"),
      },
      onChange: () => {
        Lampa.Settings.create("head_filter", {
          onBack: () => {
            Lampa.Settings.create("interface");
          },
        });
      },
    });

    Lampa.SettingsApi.addParam({
      component: "head_filter",
      param: { type: "title" },
      field: { name: Lampa.Lang.translate("name_menu") },
    });

    Object.keys(head).forEach((key) => {
      Lampa.SettingsApi.addParam({
        component: "head_filter",
        param: { name: key, type: "trigger", default: true },
        field: { name: head[key].name },
      });
    });
  }

  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow("app", (e) => {
      if (e.type === "ready") {
        startPlugin();
      }
    });
  }
})();
