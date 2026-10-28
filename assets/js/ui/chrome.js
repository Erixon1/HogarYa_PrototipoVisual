/* ============================================================
   HogarYa · cromo de la aplicación
   Cabecera, navegación inferior y piezas compartidas por todas
   las pantallas: barra de título y pie.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.TITLES = {
    home: 'Inicio', search: 'Resultados de búsqueda', list: 'Profesionales',
    compare: 'Comparar profesionales', profile: 'Perfil del profesional',
    login: 'Ingresar', req1: 'Solicitud, paso 1 de 3', req2: 'Solicitud, paso 2 de 3',
    req3: 'Solicitud, paso 3 de 3', sent: 'Solicitud enviada', requests: 'Mis solicitudes',
    favs: 'Guardados', account: 'Mi perfil', proHome: 'Solicitudes', proAvail: 'Disponibilidad'
  };

  /* ---------- cabecera ---------- */

  HY.headerNode = function () {
    var S = HY.state();
    var frag = HY.tpl('tpl-header');
    var header = frag.querySelector('header');
    if (!S.user) header.className = 'top guest';

    HY.icon(frag, '.logo', 'home2');
    HY.icon(frag, '.pill.help', 'help');

    var dark = HY.themeNow() === 'dark';
    var lbl = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    var themeBtn = frag.querySelector('[data-a="theme-toggle"]');
    themeBtn.setAttribute('aria-label', lbl);
    themeBtn.setAttribute('title', lbl);
    themeBtn.innerHTML = HY.ic(dark ? 'sun' : 'moon');

    var acct = frag.querySelector('[data-key="acct"]');
    if (S.user) {
      acct.setAttribute('data-to', 'account');
      acct.setAttribute('aria-label', 'Mi perfil, ' + S.user.name);
      acct.innerHTML = HY.ic('user');
      acct.appendChild(HY.el('span', 'lb-acct', S.user.name.split(' ')[0]));
    } else {
      acct.setAttribute('data-to', 'login');
      acct.removeAttribute('aria-label');
      acct.className = 'pill';
      acct.textContent = 'Ingresar';
    }
    return frag;
  };

  /* ---------- navegación inferior ---------- */

  HY.navNode = function () {
    var S = HY.state();
    var frag = HY.tpl('tpl-nav');
    var ul = frag.querySelector('ul');
    var items = HY.isPro()
      ? [['proHome', 'Solicitudes', 'clip'], ['proAvail', 'Disponibilidad', 'cal'], ['account', 'Perfil', 'user']]
      : [['home', 'Inicio', 'home'], ['requests', 'Solicitudes', 'clip'], ['favs', 'Guardados', 'heart'], ['account', 'Perfil', 'user']];
    var active = S.screen;
    var map = { search: 'home', list: 'home', compare: 'home', profile: 'home', req1: 'home', req2: 'home', req3: 'home', sent: 'requests', login: null };
    if (map.hasOwnProperty(active)) active = map[active];

    items.forEach(function (i) {
      var li = HY.tpl('tpl-nav-item').firstElementChild;
      var btn = li.querySelector('button');
      btn.setAttribute('data-to', i[0]);
      btn.setAttribute('data-key', 'tab-' + i[0]);
      if (active === i[0]) btn.setAttribute('aria-current', 'page');
      btn.innerHTML = HY.ic(i[2]) + i[1];
      ul.appendChild(li);
    });
    return frag;
  };

  /* ---------- barra de título ---------- */

  HY.sbarNode = function (title, sub, showBack) {
    var frag = HY.tpl('tpl-sbar');
    frag.querySelector('h1').textContent = title;
    if (sub) frag.querySelector('p.sub').textContent = sub;
    else frag.querySelector('p.sub').remove();
    if (showBack === false) frag.querySelector('.back').remove();
    else HY.icon(frag, '.back', 'back');
    return frag;
  };

  /* ---------- pie ---------- */

  HY.footNode = function () { return HY.tpl('tpl-foot'); };

  /* ---------- tarjeta de apariencia ---------- */

  HY.appearanceNode = function () {
    var frag = HY.tpl('tpl-blk-appearance');
    var seg = frag.querySelector('.seg');
    var pref = document.documentElement.getAttribute('data-theme-pref') || 'auto';
    [['light', 'Claro'], ['auto', 'Automático'], ['dark', 'Oscuro']].forEach(function (o) {
      seg.appendChild(HY.choice({
        name: 'theme', value: o[0], checked: pref === o[0],
        dataA: 'theme', dataKey: 'theme-' + o[0], text: o[1]
      }));
    });
    var note = frag.querySelector('.hint');
    note.textContent = (pref === 'auto'
      ? 'Sigue la configuración de tu dispositivo (ahora: ' + (HY.themeNow() === 'dark' ? 'oscuro' : 'claro') + '). '
      : '') + 'Se guarda en este navegador.';
    return frag;
  };

  /* ---------- tarjeta de accesibilidad inclusiva ---------- */

  HY.a11yNode = function () {
    var frag = HY.tpl('tpl-blk-a11y');
    var root = frag.firstElementChild;

    var cbSelect = root.querySelector('#a11y-cb');
    if (cbSelect) cbSelect.value = HY.colorblindNow();

    var fontSelect = root.querySelector('#a11y-font');
    if (fontSelect) fontSelect.value = HY.fontNow();

    var vibBtn = root.querySelector('#sw-vib');
    if (vibBtn) {
      var isVib = HY.vibrationNow();
      vibBtn.setAttribute('aria-checked', String(isVib));
    }

    return frag;
  };

})(window.HY);
