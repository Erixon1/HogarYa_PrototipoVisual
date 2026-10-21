/* ============================================================
   HogarYa · vista Lista de profesionales
   Filtros, orden y selección de dos profesionales para comparar.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.views.list = function () {
    var S = HY.state(), ui = HY.ui;
    var c = HY.cat(S.params.cat);
    var l = HY.listFor(c.id);
    var n = S.compare.length;

    var frag = HY.tpl('tpl-view-list');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode(c.name, 'Profesionales en ' + S.district));

    /* Distrito */
    var sel = root.querySelector('#district');
    HY.data.DISTRICTS.forEach(function (d) {
      var o = HY.el('option', null, d);
      if (d === S.district) o.setAttribute('selected', '');
      sel.appendChild(o);
    });

    /* Filtros */
    var chips = root.querySelectorAll('.chips .chip');
    chips[0].setAttribute('aria-pressed', String(S.filters.today));
    chips[1].setAttribute('aria-pressed', String(S.filters.sort === 'price'));
    chips[2].setAttribute('aria-pressed', String(S.filters.sort === 'rating'));

    /* Aviso al llegar al máximo de comparación */
    if (ui.notice) HY.put(root, 'notice', HY.noticeNode('alert', 'alert', ui.notice, 'cmpnote'));
    else HY.drop(root, 'notice');

    /* Conteo */
    root.querySelector('p.sub[role="status"]').textContent =
      l.length + ' ' + (l.length === 1 ? 'profesional encontrado' : 'profesionales encontrados') + (n ? ' · ' + n + ' para comparar' : '');

    /* Lista o estado vacío */
    if (l.length) {
      var ul = HY.el('ul', 'stack');
      ul.setAttribute('style', 'list-style:none;margin:0;padding:0');
      l.forEach(function (p) { ul.appendChild(HY.proCardNode(p)); });
      HY.put(root, 'list', ul);
    } else {
      HY.put(root, 'list', HY.emptyNode(
        'search',
        'No hay profesionales con estos filtros',
        'Quita los filtros para ver a todos los profesionales de ' + c.name + '.',
        { label: 'Quitar filtros', action: 'clearf', key: 'clearf' }));
    }

    /* La barra de comparación y su espacio solo existen con 2 elegidos */
    if (n === 2) { /* se mantiene la de la plantilla */ }
    else {
      frag.querySelector('.fixedbar.actionbar').remove();
      root.querySelector('.spacer').remove();
    }

    return frag;
  };

})(window.HY);
