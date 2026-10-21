/* ============================================================
   HogarYa · mensajes
   Avisos al usuario: el toast visible y la región "live" que
   leen los lectores de pantalla.
   ============================================================ */
(function (HY) {
  'use strict';

  var liveT;

  /* Anuncio para lectores de pantalla (región aria-live). */
  HY.say = function (msg) {
    var l = HY.$('#live');
    l.textContent = '';
    setTimeout(function () { l.textContent = msg; }, 30);
  };

  /* Aviso visible en pantalla + anuncio simultáneo. */
  HY.toast = function (msg) {
    var t = HY.$('#toast');
    t.innerHTML = '';
    t.insertAdjacentHTML('afterbegin', HY.ic('check'));
    t.appendChild(HY.el('span', null, msg));
    t.hidden = false;
    HY.say(msg);
    clearTimeout(liveT);
    liveT = setTimeout(function () { t.hidden = true; }, 4200);
  };

})(window.HY);
