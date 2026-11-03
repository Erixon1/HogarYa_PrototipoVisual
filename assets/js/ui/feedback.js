/* ============================================================
   HogarYa · mensajes
   Avisos al usuario: el toast visible y la región "live" que
   leen los lectores de pantalla.
   ============================================================ */
(function (HY) {
  'use strict';

  var liveT;

  /* Anuncio para lectores de pantalla */
  HY.say = function (msg) {
    var l = HY.$('#live');
    l.textContent = '';
    setTimeout(function () { l.textContent = msg; }, 30);
  };

  /* Aviso visible en pantalla + anuncio simultáneo.
     Dura 9 s, se pausa mientras el puntero o el foco están encima
     y se puede cerrar con el botón × (WCAG 2.2.1, tiempo ajustable). */
  var TOAST_MS = 9000;

  function armToast(t) {
    clearTimeout(liveT);
    liveT = setTimeout(function () { t.hidden = true; }, TOAST_MS);
  }

  HY.toast = function (msg) {
    var t = HY.$('#toast');
    t.innerHTML = '';
    t.insertAdjacentHTML('afterbegin', HY.ic('check'));
    t.appendChild(HY.el('span', null, msg));
    var x = HY.el('button', 'toast-x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Cerrar aviso');
    x.addEventListener('click', function () { clearTimeout(liveT); t.hidden = true; });
    t.appendChild(x);
    t.hidden = false;
    HY.say(msg);
    armToast(t);
    t.onmouseenter = t.onfocusin = function () { clearTimeout(liveT); };
    t.onmouseleave = t.onfocusout = function () { armToast(t); };
  };

})(window.HY);
