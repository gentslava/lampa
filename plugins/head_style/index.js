(function () {
  "use strict";

  Lampa.Lang.add({
    name_plugin: { ru: "Настройка шапки", en: "Header settings" },
    plugin_description: {
      ru: "Плагин для настройки шапки",
      en: "Plugin for customizing the header",
    },
    name_menu_filter: { ru: "Отображать в шапке", en: "Display in header" },
    name_menu_style: { ru: "Стиль шапки", en: "Header style" },
    search: { ru: "Поиск", en: "Search" },
    settings: { ru: "Настройки", en: "Settings" },
    profile: { ru: "Профиль", en: "Profile" },
    fullscreen: { ru: "Полный экран", en: "Fullscreen" },
    fullscreen: { ru: "Полный экран", en: "Fullscreen" },
    notice: { ru: "Уведомления", en: "Notifications" },
    aisearch: { ru: "ИИ поиск", en: "AI search" },
    time: { ru: "Время", en: "Clock" },
    style_background: { ru: "Подложка для шапки", en: "Header background" },
    style_compact: { ru: "Компактная шапка", en: "Elegant header" },
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
      head_filter_style_background: {
        name: Lampa.Lang.translate("style_background"),
        style: true,
        element: ".head__body",
      },
      head_filter_style_compact: {
        name: Lampa.Lang.translate("style_compact"),
        style: true,
        element: ".head__controls",
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

    function applyChange(key) {
      let selector = head[key].element;

      if (!selector) return;

      if (head[key].style) {
        const background = Lampa.Storage.get("head_filter_style_background", false);

        if (key === "head_filter_style_compact" && !background) return;

        const headElement = Lampa.Head.render();
        if (!headElement || !headElement.length) return;

        const compactMode = Lampa.Storage.get("head_filter_style_compact", false);
        if (compactMode) selector = head["head_filter_style_compact"].element;

        const el = headElement.find(selector);
        if (el.length) {
          if (background) {
            el.addClass("head__body--background");
          } else {
            el.removeClass("head__body--background");

            const children = headElement.find(head["head_filter_style_compact"].element);
            if (children.length) {
              children.removeClass("head__body--background");
              children.removeClass("head__body--padding");
            }
            return;
          }
        
          if (compactMode) {
            el.addClass("head__body--padding");

            const parent = headElement.find(head["head_filter_style_background"].element);
            if (parent.length) parent.removeClass("head__body--background");
          } else {
            el.removeClass("head__body--padding");
            el.removeClass("head__body--background");

            const parent = headElement.find(head["head_filter_style_background"].element);
            if (parent.length) parent.addClass("head__body--background");
          }
        }
        
        return;
      }

      const show = Lampa.Storage.get(key, true);
      if (
        key === "head_filter_show_notice" ||
        key === "head_filter_show_profile"
      ) {
        handleDynamicElement(selector, show);
      } else {
        showHideElement(selector, show);
      }
    }

    function applySettings() {
      Object.keys(head).forEach(applyChange);
    }

    Lampa.Storage.listener.follow("change", (event) => {
      if (event.name === "activity") {
        setTimeout(applySettings, 500);
      } else if (event.name in head) {
        applyChange(event.name);
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
      field: { name: Lampa.Lang.translate("name_menu_filter") },
    });

    Object.entries(head).forEach(([key, value]) => {
      if (!!value.style) return;
      
      Lampa.SettingsApi.addParam({
        component: "head_filter",
        param: { name: key, type: "trigger", default: true },
        field: { name: value.name },
      });
    });

    Lampa.SettingsApi.addParam({
      component: "head_filter",
      param: { type: "title" },
      field: { name: Lampa.Lang.translate("name_menu_style") },
    });

    Object.entries(head).forEach(([key, value]) => {
      if (!value.style) return;
      
      Lampa.SettingsApi.addParam({
        component: "head_filter",
        param: { name: key, type: "trigger", default: false },
        field: { name: value.name },
      });
    });


    Lampa.Template.add(
      "settings_head_style",
      `
      <style>
      .head__body--background {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 1em;
      }
      .head__body--padding {
        padding: 0.3em 1em;
      }
      </style>
      `
    );
    $("body").append(Lampa.Template.get("settings_head_style", {}, true));
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
