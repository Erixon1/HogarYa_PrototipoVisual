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

  /* Convierte textos de hora como "2:00 pm", "10:00 am", "12:00 m" a minutos desde medianoche */
  HY.hourToMinutes = function (hStr) {
    if (!hStr) return 0;
    var s = hStr.toLowerCase().trim();
    if (s === '12:00 m' || s === '12:00 pm' || s === '12:00m') return 12 * 60;
    var isPm = s.indexOf('pm') > -1;
    var clean = s.replace('am', '').replace('pm', '').replace('m', '').trim();
    var parts = clean.split(':');
    var h = parseInt(parts[0], 10) || 0;
    var m = parseInt(parts[1], 10) || 0;
    if (isPm && h < 12) h += 12;
    if (!isPm && h === 12) h = 0;
    return (h * 60) + m;
  };

})(window.HY);
