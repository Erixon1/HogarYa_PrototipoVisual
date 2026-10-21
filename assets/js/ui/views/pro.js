/* ============================================================
   HogarYa · vistas del profesional
   Panel de solicitudes (aceptar, rechazar, marcar en camino,
   finalizar) y pestaña de disponibilidad y precio de visita.
   ============================================================ */
(function (HY) {
  'use strict';

  var DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  var LETRAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  /* Botón de acción sobre una solicitud. */
  function actionButton(action, id, label, srText, kind) {
    var b = HY.el('button', 'btn ' + kind, label);
    b.setAttribute('data-a', action);
    b.setAttribute('data-id', id);
    b.setAttribute('data-key', action + '-' + id);
    b.appendChild(HY.el('span', 'sr', srText));
    return b;
  }

  /* Una solicitud vista desde el panel del profesional. */
  function requestNode(r) {
    var frag = HY.tpl('tpl-item-request-pro');
    var li = frag.firstElementChild;

    li.querySelector('h2.ct').textContent = HY.cat(r.cat).name + ' · ' + r.clientShort;
    var ps = li.querySelectorAll('p');
    ps[0].textContent = r.when;
    ps[1].insertAdjacentHTML('afterbegin', HY.ic('pin'));
    ps[1].appendChild(document.createTextNode(r.address));
    ps[2].textContent = r.id;

    li.querySelector('.req-h').appendChild(HY.statusNode(r, true));

    if (r.problem) HY.put(li, 'problem', HY.el('p', 'sub', '«' + r.problem + '»'));
    else HY.drop(li, 'problem');

    if (!r.closed) HY.put(li, 'timeline', HY.timelineNode(r));
    else HY.drop(li, 'timeline');

    var actions = document.createDocumentFragment();
    if (!r.closed) {
      if (r.st === 0) {
        var row = HY.el('div', 'row');
        row.appendChild(actionButton('accept', r.id, 'Aceptar', ' solicitud ' + r.id, 'primary'));
        row.appendChild(actionButton('reject', r.id, 'Rechazar', ' solicitud ' + r.id, 'secondary'));
        actions.appendChild(row);
      } else if (r.st === 1) {
        actions.appendChild(actionButton('onway', r.id, 'Marcar en camino', ' solicitud ' + r.id, 'primary'));
      } else if (r.st === 2) {
        actions.appendChild(actionButton('finish', r.id, 'Finalizar servicio', ' solicitud ' + r.id, 'primary'));
      }
    }
    if (actions.childNodes.length) HY.put(li, 'actions', actions);
    else HY.drop(li, 'actions');

    return li;
  }

  HY.views.proHome = function () {
    var S = HY.state();
    var l = HY.visibleReqs();
    var n = l.filter(function (r) { return r.st === 0 && !r.closed; }).length;

    var frag = HY.tpl('tpl-view-proHome');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode(
      'Hola, ' + S.user.name.split(' ')[0],
      'Solicitudes (' + l.length + ') · ' + n + (n === 1 ? ' nueva' : ' nuevas'),
      false));

    var ul = root.querySelector('ul');
    l.forEach(function (r) { ul.appendChild(requestNode(r)); });

    HY.put(root, 'foot', HY.footNode());
    return frag;
  };

  HY.views.proAvail = function () {
    var S = HY.state(), ui = HY.ui;
    var c = S.proCfg, e = ui.errors;

    var frag = HY.tpl('tpl-view-proAvail');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode('Disponibilidad', 'Qué días atiendes y cuánto cobras por la visita', false));

    root.querySelector('[data-a="sw"]').setAttribute('aria-checked', String(c.avail));

    var chips = root.querySelector('.chips');
    DIAS.forEach(function (name, i) {
      var b = HY.el('button', 'chip', LETRAS[i]);
      b.setAttribute('type', 'button');
      b.setAttribute('style', 'min-width:48px;justify-content:center');
      b.setAttribute('data-a', 'day');
      b.setAttribute('data-i', String(i));
      b.setAttribute('data-key', 'd' + i);
      b.setAttribute('aria-pressed', String(c.days.indexOf(i) > -1));
      b.setAttribute('aria-label', name);
      chips.appendChild(b);
    });

    var price = root.querySelector('#price');
    price.setAttribute('value', c.price);

    var err = root.querySelector('#price-e');
    err.insertAdjacentHTML('afterbegin', HY.ic('alert'));
    if (e.price) {
      err.removeAttribute('hidden');
      err.querySelector('span').textContent = e.price;
      price.setAttribute('aria-invalid', 'true');
    } else {
      err.setAttribute('hidden', '');
      err.querySelector('span').textContent = '';
    }

    HY.put(root, 'foot', HY.footNode());
    return frag;
  };

})(window.HY);
