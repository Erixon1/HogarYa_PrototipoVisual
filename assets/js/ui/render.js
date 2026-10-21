/* ============================================================
   HogarYa · render
   Dibuja la pantalla activa: cabecera, contenido y navegación.
   Después de cada redibujo se restituye el foco, para que el
   recorrido con teclado no se pierda.
   ============================================================ */
(function (HY) {
  'use strict';

  /* Pantallas sin navegación inferior (formularios y confirmación). */
  var NONAV = { login: 1, req1: 1, req2: 1, req3: 1, sent: 0 };

  HY.render = function (o) {
    o = o || {};
    var ae = document.activeElement;
    var prevKey = ae && ae.getAttribute && ae.getAttribute('data-key');
    var prevId = ae && ae.id;
    var prevSel = null;
    try { if (ae && ae.selectionStart != null) prevSel = [ae.selectionStart, ae.selectionEnd]; } catch (x) { }

    var y = window.scrollY;
    var S = HY.state();
    var sc = S.screen;
    var noNav = NONAV[sc] === 1;
    var shell = HY.$('#shell');

    shell.innerHTML = '';
    shell.appendChild(HY.headerNode());

    var main = HY.el('main');
    main.setAttribute('id', 'main');
    main.setAttribute('tabindex', '-1');
    main.setAttribute('aria-label', HY.TITLES[sc]);
    var view = HY.views[sc];
    if (!view) return;   /* la plantilla de esta pantalla aún no está cargada */
    main.appendChild(view());

    var wrap = HY.el('div', 'wrap');
    wrap.appendChild(main);
    shell.appendChild(wrap);

    if (!noNav) shell.appendChild(HY.navNode());

    document.body.className = noNav ? 'no-nav' : '';
    document.title = HY.TITLES[sc] + ' · HogarYa';

    if (o.focusTitle) {
      var t = HY.$('#title');
      if (t) t.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, y);
      var el = null;
      if (prevKey) el = HY.$('[data-key="' + prevKey + '"]');
      if (!el && prevId) el = document.getElementById(prevId);
      if (el) {
        el.focus({ preventScroll: true });
        try { if (prevSel && el.setSelectionRange) el.setSelectionRange(prevSel[0], prevSel[1]); } catch (x) { }
      }
    }
    HY.save();
  };

})(window.HY);
