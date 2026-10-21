/* ============================================================
   HogarYa · piezas compartidas
   Fragmentos de interfaz que se repiten en varias pantallas:
   tarjeta de profesional, línea de tiempo del estado, etiquetas
   de estado, pares de datos y cabecera de pasos.
   ============================================================ */
(function (HY) {
  'use strict';

  /* Cabecera de una tarjeta de profesional. lvl: "h2" o "h3". */
  HY.proTopNode = function (p, lvl) {
    var S = HY.state();
    var tag = lvl === 'h2' ? 'h2' : 'h3';
    var frag = HY.tpl('tpl-item-pro-top');
    var root = frag.firstElementChild;

    root.querySelector('.avatar').textContent = HY.initials(p.name);

    /* El nivel de título se cambia porque la misma pieza se usa
       como encabezado de lista y como encabezado de tarjeta. */
    var old = root.querySelector('h3');
    var h = HY.el(tag, 'ct');
    var a = HY.el('a');
    a.setAttribute('href', '#');
    a.setAttribute('data-a', 'open');
    a.setAttribute('data-id', p.id);
    a.setAttribute('data-key', 'open-' + p.id);
    a.textContent = p.name;
    h.appendChild(a);
    old.replaceWith(h);

    var meta = root.querySelector('.meta');
    meta.insertAdjacentHTML('afterbegin', HY.ic('star', 'fill'));
    var sp = HY.el('span');
    var b = HY.el('b', null, HY.fmtRating(p.rating));
    sp.appendChild(b);
    sp.appendChild(document.createTextNode(' · ' + p.jobs + ' trabajos'));
    meta.appendChild(sp);

    root.querySelector('.price').textContent = 'Desde S/ ' + p.price;

    var fav = S.favs.indexOf(p.id) > -1;
    var favBtn = root.querySelector('.fav');
    favBtn.setAttribute('data-id', p.id);
    favBtn.setAttribute('data-key', 'fav-' + p.id);
    favBtn.setAttribute('aria-label', fav ? 'Quitar a ' + p.name + ' de guardados' : 'Guardar a ' + p.name);
    if (fav) favBtn.className = 'fav on';
    favBtn.innerHTML = HY.ic('heart', fav ? 'fill' : '');

    return frag;
  };

  /* Tarjeta completa de un profesional dentro de una lista. */
  HY.proCardNode = function (p) {
    var S = HY.state();
    var frag = HY.tpl('tpl-item-pro-card');
    var root = frag.firstElementChild;
    root.prepend(HY.proTopNode(p, 'h2'));

    var tag = root.querySelector('.tag');
    tag.className = 'tag ' + (p.today ? 'ok' : '');
    tag.insertAdjacentHTML('afterbegin', HY.ic('clock'));
    tag.appendChild(document.createTextNode((p.today ? 'Disponible: ' : '') + p.when));

    var sel = S.compare.indexOf(p.id) > -1;
    var input = root.querySelector('.cmp input');
    input.setAttribute('data-id', p.id);
    input.setAttribute('data-key', 'cmp-' + p.id);
    if (sel) input.setAttribute('checked', '');
    root.querySelector('.cmp .sr').textContent = ' a ' + p.name;

    return frag;
  };

  /* Lista de profesionales de una categoría, con filtros y orden. */
  HY.listFor = function (c) {
    var S = HY.state();
    var l = HY.data.PROS.filter(function (p) { return p.cat === c; });
    if (S.filters.today) l = l.filter(function (p) { return p.today; });
    if (S.filters.sort === 'price') l = l.slice().sort(function (a, b) { return a.price - b.price; });
    if (S.filters.sort === 'rating') l = l.slice().sort(function (a, b) { return b.rating - a.rating; });
    return l;
  };

  /* Línea de tiempo de cuatro estados de una solicitud. */
  HY.timelineNode = function (r) {
    var frag = HY.tpl('tpl-blk-timeline');
    var ol = frag.querySelector('ol');
    ol.setAttribute('aria-label', 'Estado de la solicitud ' + r.id);
    HY.data.STAGES.forEach(function (s, i) {
      var li = HY.tpl('tpl-item-timeline').firstElementChild;
      li.className = i < r.st ? 'done' : (i === r.st ? 'now' : '');
      if (i === r.st) li.setAttribute('aria-current', 'step');
      var dot = li.querySelector('.dot');
      if (i < r.st) dot.innerHTML = HY.ic('check');
      else dot.textContent = String(i + 1);
      var txt = li.querySelector('span:last-child');
      txt.textContent = s;
      if (i < r.st) txt.appendChild(HY.el('span', 'sr', ' (completada)'));
      if (i === r.st) txt.appendChild(HY.el('span', 'sr', ' (estado actual)'));
      ol.appendChild(li);
    });
    return frag;
  };

  /* Etiqueta de estado de una solicitud (vista del cliente o del profesional). */
  HY.statusNode = function (r, forPro) {
    if (r.closed) return HY.el('span', 'tag bad', r.closed === 'cancelada' ? 'Cancelada' : 'Rechazada');
    var cls = r.st === 3 ? 'tag ok' : 'tag brand';
    var txt = (forPro && r.st === 0 ? 'Nueva' : HY.data.STAGES[r.st]);
    return HY.el('span', cls, txt);
  };

  HY.stateText = function (r) {
    if (r.closed === 'cancelada') return 'Cancelaste esta solicitud.';
    if (r.closed === 'rechazada') return 'El profesional no pudo atenderla.';
    return [
      'Esperando respuesta del profesional (suele tardar ~10 min).',
      'El profesional aceptó tu solicitud.',
      'El profesional está en camino.',
      'Servicio finalizado.'
    ][r.st];
  };

  /* Cabecera de los tres pasos de la solicitud: "Paso x de 3" y barra. */
  HY.stepHeadNode = function (n, title) {
    var frag = HY.tpl('tpl-step-head');
    frag.querySelector('#stepl').textContent = 'Paso ' + n + ' de 3';
    var bar = frag.querySelector('.progress');
    bar.setAttribute('aria-valuenow', String(n));
    frag.querySelector('.progress i').setAttribute('style', 'width:' + (n * 100 / 3) + '%');
    var out = document.createDocumentFragment();
    out.appendChild(HY.sbarNode(title, null));
    out.appendChild(frag);
    return out;
  };

  /* Resumen de errores al inicio del formulario: cada entrada lleva al campo. */
  HY.errSummaryNode = function (list) {
    list = list.filter(function (x) { return x[1]; });
    if (!list.length) return null;
    var frag = HY.tpl('tpl-blk-errsum');
    var h2 = frag.querySelector('h2');
    h2.insertAdjacentHTML('afterbegin', HY.ic('alert'));
    h2.appendChild(document.createTextNode(list.length === 1 ? 'Revisa 1 campo' : 'Revisa ' + list.length + ' campos'));
    var ul = frag.querySelector('ul');
    list.forEach(function (x) {
      var li = HY.el('li');
      var a = HY.el('a', null, x[1]);
      a.setAttribute('href', '#' + x[0]);
      a.setAttribute('data-a', 'tofield');
      a.setAttribute('data-id', x[0]);
      li.appendChild(a);
      ul.appendChild(li);
    });
    return frag;
  };

  /* Mensaje de error junto a un campo o junto a un grupo de opciones. */
  HY.errNode = function (id, msg, group) {
    var frag = HY.tpl(group ? 'tpl-blk-err-group' : 'tpl-blk-err');
    var p = frag.querySelector('p');
    p.setAttribute('id', id);
    p.insertAdjacentHTML('afterbegin', HY.ic('alert'));
    p.querySelector('span').textContent = msg;
    return frag;
  };

  /* Bloque de estado vacío: icono, título, explicación y botón. */
  HY.emptyNode = function (icon, title, text, btn) {
    var frag = HY.tpl('tpl-blk-empty');
    frag.querySelector('.big').innerHTML = HY.ic(icon);
    frag.querySelector('h2').textContent = title;
    frag.querySelector('p.sub').textContent = text;
    var b = frag.querySelector('button');
    b.className = 'btn ' + (btn.kind || 'secondary');
    b.textContent = btn.label;
    b.setAttribute('data-a', btn.action);
    if (btn.key) b.setAttribute('data-key', btn.key);
    return frag;
  };

  /* Aviso destacado (alerta o informativo). */
  HY.noticeNode = function (kind, icon, msg, id) {
    var frag = HY.tpl(kind === 'info' ? 'tpl-blk-notice-info' : 'tpl-blk-notice-alert');
    var box = frag.querySelector('div');
    if (id) box.setAttribute('id', id);
    box.insertAdjacentHTML('afterbegin', HY.ic(icon));
    box.querySelector('span').textContent = msg;
    return frag;
  };

  /* Tarjeta de un profesional para "vistos recientemente" y "guardados". */
  HY.proCardSimpleNode = function (p, meta) {
    var card = HY.el('div', 'card pro');
    card.appendChild(HY.proTopNode(p, 'h2'));
    if (meta) card.appendChild(HY.el('div', 'meta', meta));
    return card;
  };

})(window.HY);
