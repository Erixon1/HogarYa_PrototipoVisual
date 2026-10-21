/* ============================================================
   HogarYa · vista Resultados
   Servicios y profesionales que coinciden con lo buscado.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.views.search = function () {
    var S = HY.state();
    var q = (S.query || '').trim().toLowerCase();
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
    var nq = norm(q);
    var cs = HY.data.CATS.filter(function (c) { return norm(c.name + ' ' + c.desc + ' ' + c.kw).indexOf(nq) > -1; });
    var ps = HY.data.PROS.filter(function (p) { return norm(p.name).indexOf(nq) > -1; });
    var total = cs.length + ps.length;

    var frag = HY.tpl('tpl-view-search');
    var root = frag.firstElementChild;
    root.appendChild(HY.sbarNode('Resultados para «' + S.query + '»', total + ' ' + (total === 1 ? 'resultado' : 'resultados')));

    if (cs.length) {
      var svc = HY.tpl('tpl-blk-services');
      var ul = svc.querySelector('.cats');
      cs.forEach(function (c) {
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
      root.appendChild(svc);
    }

    if (ps.length) {
      var pr = HY.tpl('tpl-blk-pros');
      var sec = pr.querySelector('section');
      ps.forEach(function (p) {
        sec.appendChild(HY.proCardSimpleNode(p, HY.cat(p.cat).name));
      });
      root.appendChild(pr);
    }

    if (!cs.length && !ps.length) {
      root.appendChild(HY.emptyNode(
        'search',
        'No encontramos «' + S.query + '»',
        'Prueba con el nombre del servicio, por ejemplo «electricidad» o «pintura».',
        { label: 'Ver las categorías', action: 'home', key: 'tohome' }));
    }

    return frag;
  };

})(window.HY);
