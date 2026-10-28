/* ============================================================
   HogarYa · tema de la interfaz
   Tres preferencias: claro, oscuro y automático (sigue al
   sistema). La preferencia se guarda; el tema efectivo se
   aplica como atributo data-theme en <html>.
   ============================================================ */
(function (HY) {
  'use strict';

  var THEME_KEY = 'hogarya-theme';
  var THEME_BG = { light: '#FAF7F3', dark: '#171210' };

  var mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  var themePref = (function () {
    var p = 'auto';
    try { p = localStorage.getItem(THEME_KEY) || 'auto'; } catch (e) { }
    return /^(light|dark|auto)$/.test(p) ? p : 'auto';
  })();

  HY.themeNow = function () {
    return themePref === 'dark' || (themePref === 'auto' && !!(mql && mql.matches)) ? 'dark' : 'light';
  };

  HY.applyTheme = function () {
    var r = HY.themeNow(), h = document.documentElement;
    h.setAttribute('data-theme', r);
    h.setAttribute('data-theme-pref', themePref);
    HY.$$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', THEME_BG[r]); });
  };

  HY.setTheme = function (p) {
    themePref = p;
    try { localStorage.setItem(THEME_KEY, p); } catch (e) { }
    HY.applyTheme();
    HY.render();
    HY.say(p === 'auto'
      ? 'Apariencia automática: ahora en modo ' + (HY.themeNow() === 'dark' ? 'oscuro' : 'claro') + ', como tu sistema'
      : 'Modo ' + (p === 'dark' ? 'oscuro' : 'claro') + ' activado');
  };

  /* En modo automático, si el sistema cambia de tema se actualiza la vista. */
  if (mql) {
    var onSys = function () {
      if (themePref === 'auto') { HY.applyTheme(); HY.render(); }
    };
    if (mql.addEventListener) mql.addEventListener('change', onSys);
    else if (mql.addListener) mql.addListener(onSys);
  }

  /* ============================================================
     Ajustes de accesibilidad inclusiva
     - Daltonismo: deuteranopia, protanopia, tritanopia, monochrome, none
     - Tamaño de fuente: normal, large, xlarge
     - Vibración háptica
     ============================================================ */
  var CB_KEY = 'hogarya-colorblind';
  var FONT_KEY = 'hogarya-fontsize';
  var VIB_KEY = 'hogarya-vibration';

  var colorblindPref = (function () {
    try { return localStorage.getItem(CB_KEY) || 'none'; } catch (e) { return 'none'; }
  })();

  var fontPref = (function () {
    try { return localStorage.getItem(FONT_KEY) || 'normal'; } catch (e) { return 'normal'; }
  })();

  var vibrationPref = (function () {
    try { return localStorage.getItem(VIB_KEY) === 'true'; } catch (e) { return false; }
  })();

  HY.colorblindNow = function () { return colorblindPref; };
  HY.fontNow = function () { return fontPref; };
  HY.vibrationNow = function () { return vibrationPref; };

  HY.setColorblind = function (cb) {
    colorblindPref = cb;
    try { localStorage.setItem(CB_KEY, cb); } catch (e) { }
    document.documentElement.setAttribute('data-colorblind', cb);
    HY.say('Paleta de daltonismo cambiada a: ' + cb);
  };

  HY.setFontSize = function (size) {
    fontPref = size;
    try { localStorage.setItem(FONT_KEY, size); } catch (e) { }
    document.documentElement.setAttribute('data-font-size', size);
    HY.say('Tamaño de texto ajustado a: ' + size);
  };

  HY.setVibration = function (enable) {
    vibrationPref = !!enable;
    try { localStorage.setItem(VIB_KEY, String(vibrationPref)); } catch (e) { }
    if (vibrationPref && navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
    HY.say(vibrationPref ? 'Vibración táctil activada' : 'Vibración táctil desactivada');
  };

  HY.vibratePulse = function (pattern) {
    if (vibrationPref && navigator.vibrate) {
      try { navigator.vibrate(pattern || [120, 60, 120]); } catch (e) { }
    }
  };

  HY.applyA11y = function () {
    document.documentElement.setAttribute('data-colorblind', colorblindPref);
    document.documentElement.setAttribute('data-font-size', fontPref);
  };

  /* Inicialización combinada */
  HY.applyTheme();
  HY.applyA11y();

})(window.HY);
