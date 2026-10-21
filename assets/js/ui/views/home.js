/* ============================================================
   HogarYa · vista Inicio
   Buscador, categorías de servicio y perfiles vistos hace poco.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.views.home = function () {
    var S = HY.state();
    var frag = HY.tpl('tpl-view-home');
    var root = frag.firstElementChild;

    /* Distrito */
    var sel = root.querySelector('#district');
    HY.data.DISTRICTS.forEach(function (d) {
      var o = HY.el('option', null, d);
      if (d === S.district) o.setAttribute('selected', '');
      sel.appendChild(o);
    });

    /* Buscador */
    root.querySelector('.searchbox').insertAdjacentHTML('afterbegin', HY.ic('search'));
    root.querySelector('#q').setAttribute('value', S.query || '');

    /* Vistos recientemente */
    var rec = S.recent.map(HY.pro).filter(Boolean).slice(0, 3);
    if (rec.length) {
      var blk = HY.tpl('tpl-blk-recent');
      var sec = blk.firstElementChild;
      rec.forEach(function (p) { sec.appendChild(HY.proCardSimpleNode(p)); });
      root.querySelector('#cats-h').before(sec);
    }

    /* Categorías */
    var ul = root.querySelector('.cats');
    HY.data.CATS.forEach(function (c) {
      var li = HY.tpl('tpl-item-cat').firstElementChild;
      var btn = li.querySelector('button');
      btn.setAttribute('data-a', 'cat');
      btn.setAttribute('data-id', c.id);
      btn.setAttribute('data-key', 'cat-' + c.id);
      li.querySelector('.ci').innerHTML = HY.ic(c.icon);
      li.querySelector('b').textContent = c.name;
      li.querySelector('small').textContent = c.desc;
      ul.appendChild(li);
    });

    HY.put(root, 'foot', HY.footNode());
    return frag;
  };

})(window.HY);
