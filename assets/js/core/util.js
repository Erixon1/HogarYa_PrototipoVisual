/* ============================================================
   HogarYa · utilidades
   Funciones generales: consulta del DOM, escape de texto,
   formato de cifras y validación de correo.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.$ = function (s, r) { return (r || document).querySelector(s); };
  HY.$$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  HY.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  HY.initials = function (n) {
    return n.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('');
  };

  /* La puntuación se muestra con coma decimal (formato peruano). */
  HY.fmtRating = function (r) { return String(r.toFixed(1)).replace('.', ','); };

  /* Días disponibles para agendar: hoy, mañana y los dos siguientes. */
  HY.dayOptions = function () {
    var WD = HY.data.WD, MON = HY.data.MON;
    var out = [{ v: 'Hoy', t: 'Hoy' }, { v: 'Mañana', t: 'Mañana' }];
    for (var i = 2; i < 4; i++) {
      var d = new Date(); d.setDate(d.getDate() + i);
      var w = WD[d.getDay()];
      var t = w.charAt(0).toUpperCase() + w.slice(1) + ' ' + d.getDate() + ' ' + MON[d.getMonth()];
      out.push({ v: t, t: t });
    }
    return out;
  };

  HY.validateEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };

})(window.HY);
