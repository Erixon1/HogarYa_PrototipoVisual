/* ============================================================
   HogarYa · vista Solicitud (tres pasos) y confirmación
   Paso 1: día y hora. Paso 2: dirección y problema.
   Paso 3: resumen antes de confirmar.
   ============================================================ */
(function (HY) {
  'use strict';

  /* ---------- paso 1: día y hora ---------- */

  HY.views.req1 = function () {
    var S = HY.state(), ui = HY.ui;
    var d = S.draft, e = ui.errors, days = HY.dayOptions();
    var p = HY.pro(d.proId);

    var frag = HY.tpl('tpl-view-req1');
    var root = frag.firstElementChild;

    /* Texto de contexto: el asterisco se inserta como elemento.
       Se toma la referencia antes de anteponer la cabecera de pasos,
       porque esa cabecera también tiene un <p class="sub">. */
    var intro = root.querySelector('p.sub');
    intro.textContent = 'Servicio: ' + HY.cat(p.cat).name + ' con ' + p.name + '. Los campos con ';
    var req = HY.el('span', 'req', '*');
    req.setAttribute('aria-hidden', 'true');
    intro.appendChild(req);
    intro.appendChild(HY.el('span', 'sr', 'asterisco'));
    intro.appendChild(document.createTextNode(' son obligatorios.'));

    root.prepend(HY.stepHeadNode(1, '¿Cuándo te viene bien?'));

    /* Días */
    var dayChips = root.querySelector('#g-day .chips');
    days.forEach(function (o, i) {
      dayChips.appendChild(HY.choice({
        name: 'day', value: o.v, checked: d.day === o.v, dataA: 'pickday',
        id: i === 0 ? 'day-first' : null, ariaInvalid: !!e.day, text: o.t
      }));
    });

    /* Horas */
    var hourChips = root.querySelector('#g-hour .chips');
    HY.data.HOURS.forEach(function (h, i) {
      hourChips.appendChild(HY.choice({
        name: 'hour', value: h, checked: d.hour === h, dataA: 'pickhour',
        id: i === 0 ? 'hour-first' : null, ariaInvalid: !!e.hour, text: h
      }));
    });

    /* Errores: el mensaje va junto al grupo que falta completar. */
    var dayField = root.querySelector('#g-day');
    if (e.day) {
      dayField.className = 'group invalid';
      dayField.setAttribute('aria-describedby', 'day-e');
      HY.put(dayField, 'dayerr', HY.errNode('day-e', e.day, true));
    } else {
      HY.drop(dayField, 'dayerr');
    }

    var hourField = root.querySelector('#g-hour');
    if (e.hour) {
      hourField.className = 'group invalid';
      hourField.setAttribute('aria-describedby', 'hour-e');
      HY.put(hourField, 'hourerr', HY.errNode('hour-e', e.hour, true));
    } else {
      HY.drop(hourField, 'hourerr');
    }

    /* Línea de estado */
    var missing = !d.day || !d.hour;
    var sel = root.querySelector('#sel');
    sel.insertAdjacentHTML('afterbegin', HY.ic(missing ? 'info' : 'check'));
    sel.appendChild(HY.el('span', null, 'Tu elección: ' + (d.day || 'falta elegir el día') + ' · ' + (d.hour || 'falta elegir la hora')));

    HY.put(root, 'foot', HY.footNode());
    return frag;
  };

  /* ---------- paso 2: dirección y problema ---------- */

  HY.views.req2 = function () {
    var S = HY.state(), ui = HY.ui;
    var d = S.draft, e = ui.errors;

    var frag = HY.tpl('tpl-view-req2');
    var root = frag.firstElementChild;
    root.prepend(HY.stepHeadNode(2, '¿Dónde y qué necesitas?'));

    /* La dirección se propone junto al distrito actual. */
    var label = root.querySelector('label[for="addr"]');
    label.textContent = 'Dirección en ' + S.district + ' ';
    var req = HY.el('span', 'req', '*');
    req.setAttribute('aria-hidden', 'true');
    label.appendChild(req);

    var addr = root.querySelector('#addr');
    if (d.address) addr.setAttribute('value', d.address);
    if (e.addr) {
      addr.setAttribute('aria-invalid', 'true');
      addr.setAttribute('aria-describedby', 'addr-e');
      HY.put(root, 'addrerr', HY.errNode('addr-e', e.addr));
    } else {
      HY.drop(root, 'addrerr');
    }

    if (!e.addr && S.lastAddress && d.address === S.lastAddress) {
      HY.put(root, 'addrhint', HY.el('p', 'hint', 'Es la dirección de tu última solicitud. Puedes cambiarla.'));
    } else {
      HY.drop(root, 'addrhint');
    }

    var prob = root.querySelector('#prob');
    if (d.problem) prob.textContent = d.problem;

    HY.put(root, 'foot', HY.footNode());
    return frag;
  };

  /* ---------- paso 3: resumen ---------- */

  HY.views.req3 = function () {
    var S = HY.state();
    var d = S.draft, p = HY.pro(d.proId), c = HY.cat(p.cat);

    var frag = HY.tpl('tpl-view-req3');
    var root = frag.firstElementChild;
    root.prepend(HY.stepHeadNode(3, 'Revisa y confirma'));

    var dl = root.querySelector('dl.kv');

    function row(label, value) {
      var tr = HY.tpl('tpl-item-kv').firstElementChild;
      tr.querySelector('dt').textContent = label;
      tr.querySelector('dd').textContent = value;
      return tr;
    }

    function rowWithChange(label, text, action, key, srText) {
      var tr = HY.tpl('tpl-item-kv').firstElementChild;
      tr.querySelector('dt').textContent = label;
      var dd = tr.querySelector('dd');
      var chg = HY.el('span', 'chg');
      chg.appendChild(document.createTextNode(text + ' '));
      var btn = HY.el('button', 'linkbtn');
      btn.setAttribute('data-a', action);
      btn.setAttribute('data-key', key);
      btn.appendChild(document.createTextNode('Cambiar'));
      btn.appendChild(HY.el('span', 'sr', srText));
      chg.appendChild(btn);
      dd.appendChild(chg);
      return tr;
    }

    dl.appendChild(row('Servicio', c.name));
    dl.appendChild(row('Profesional', p.name));
    dl.appendChild(rowWithChange('Cuándo', d.day + ', ' + d.hour, 'edit1', 'edit1', ' día y hora'));
    dl.appendChild(rowWithChange('Dónde', d.address, 'edit2', 'edit2', ' dirección'));
    if (d.problem) dl.appendChild(row('Problema', d.problem));
    dl.appendChild(row('Precio', 'Desde S/ ' + p.price));

    var notice = root.querySelector('.notice.info');
    notice.insertAdjacentHTML('afterbegin', HY.ic('info'));
    notice.querySelector('span').textContent = 'No pagas nada ahora. El profesional confirmará el precio final contigo.';

    HY.put(root, 'foot', HY.footNode());
    return frag;
  };

  /* ---------- confirmación ---------- */

  HY.views.sent = function () {
    var S = HY.state();
    var r = S.reqs.filter(function (x) { return x.id === S.params.id; })[0];

    var frag = HY.tpl('tpl-view-sent');
    var root = frag.firstElementChild;

    root.querySelector('.success .big').innerHTML = HY.ic('check');

    var box = root.querySelector('.codebox');
    box.textContent = r.id;
    box.setAttribute('aria-label', 'Código ' + r.id);

    var ps = root.querySelectorAll('.success p');
    ps[1].textContent = HY.cat(r.cat).name + ' con ' + r.proName;
    ps[1].appendChild(document.createElement('br'));
    ps[1].appendChild(document.createTextNode(r.when));

    return frag;
  };

})(window.HY);
