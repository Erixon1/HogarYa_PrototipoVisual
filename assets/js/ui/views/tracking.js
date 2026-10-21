/* ============================================================
   HogarYa · vista Seguimiento y Guardados
   Solicitudes del cliente con su estado, y lista de
   profesionales marcados con el corazón.
   ============================================================ */
(function (HY) {
  'use strict';

  /* Una solicitud del cliente, con su estado y sus acciones. */
  function requestNode(r) {
    var frag = HY.tpl('tpl-item-request');
    var li = frag.firstElementChild;

    li.querySelector('h2.ct').textContent = HY.cat(r.cat).name + ' · ' + r.proName;
    var ps = li.querySelectorAll('p');
    ps[0].textContent = r.when;
    ps[1].textContent = r.id;
    ps[2].textContent = HY.stateText(r);

    var badges = li.querySelector('.req-h > .stack');
    badges.appendChild(HY.statusNode(r));
    if (r.example) badges.appendChild(HY.el('span', 'tag', 'Solicitud de prueba'));

    if (!r.closed) HY.put(li, 'timeline', HY.timelineNode(r));
    else HY.drop(li, 'timeline');

    var open = !r.closed && r.st < 3;
    if (open) {
      var b = HY.el('button', 'btn secondary', 'Cancelar solicitud');
      b.setAttribute('data-a', 'cancelreq');
      b.setAttribute('data-id', r.id);
      b.setAttribute('data-key', 'cancel-' + r.id);
      b.appendChild(HY.el('span', 'sr', ' ' + r.id));
      HY.put(li, 'actions', b);
    } else if (r.st === 3 && !r.closed) {
      if (r.rated) {
        HY.put(li, 'actions', HY.el('p', 'tag ok', 'Calificaste con ' + r.rated + ' de 5'));
      } else {
        var rb = HY.el('button', 'btn secondary', 'Calificar servicio');
        rb.setAttribute('data-a', 'rate');
        rb.setAttribute('data-id', r.id);
        rb.setAttribute('data-key', 'rate-' + r.id);
        HY.put(li, 'actions', rb);
      }
    } else {
      HY.drop(li, 'actions');
    }

    return li;
  }

  HY.views.requests = function () {
    var S = HY.state();

    if (!S.user) {
      var frag0 = HY.tpl('tpl-view-requests');
      var r0 = frag0.firstElementChild;
      r0.prepend(HY.sbarNode('Mis solicitudes', null, false));
      HY.put(r0, 'content', HY.emptyNode(
        'clip',
        'Ingresa para ver tus solicitudes',
        'Aquí verás el estado de cada servicio que pidas.',
        { label: 'Ingresar', kind: 'primary', action: 'needlogin', key: 'needlogin' }));
      HY.drop(frag0, 'foot');
      return frag0;
    }

    var l = HY.visibleReqs();
    var frag = HY.tpl('tpl-view-requests');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode('Mis solicitudes', l.length + ' ' + (l.length === 1 ? 'solicitud' : 'solicitudes'), false));

    if (l.length) {
      var ul = HY.el('ul', 'stack');
      ul.setAttribute('style', 'list-style:none;margin:0;padding:0');
      l.forEach(function (r) { ul.appendChild(requestNode(r)); });
      HY.put(root, 'content', ul);
    } else {
      HY.put(root, 'content', HY.emptyNode(
        'clip',
        'Aún no tienes solicitudes',
        'Elige un servicio y solicita a un profesional.',
        { label: 'Buscar un servicio', kind: 'primary', action: 'home', key: 'tohome3' }));
    }

    HY.put(root, 'foot', HY.footNode());
    return frag;
  };

  HY.views.favs = function () {
    var S = HY.state();
    var l = S.favs.map(HY.pro).filter(Boolean);

    var frag = HY.tpl('tpl-view-favs');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode('Guardados', l.length + ' ' + (l.length === 1 ? 'profesional' : 'profesionales'), false));

    if (l.length) {
      l.forEach(function (p) {
        root.appendChild(HY.proCardSimpleNode(p, HY.cat(p.cat).name + ' · ' + p.when));
      });
    } else {
      root.appendChild(HY.emptyNode(
        'heart',
        'Todavía no guardaste a nadie',
        'Toca el corazón en la tarjeta de un profesional para encontrarlo después.',
        { label: 'Buscar un servicio', kind: 'primary', action: 'home', key: 'tohome4' }));
    }

    return frag;
  };

})(window.HY);
