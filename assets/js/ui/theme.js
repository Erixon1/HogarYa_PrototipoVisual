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

  /* Tema efectivo: el que se está mostrando ahora mismo. */
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

  HY.applyTheme();

})(window.HY);
