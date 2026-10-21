/* ============================================================
   HogarYa · vista Comparar
   Tabla con dos profesionales lado a lado: precio, calificación,
   disponibilidad, experiencia y trabajos.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.views.compare = function () {
    var S = HY.state();
    var a = HY.pro(S.compare[0]), b = HY.pro(S.compare[1]);

    if (!a || !b) {
      var vacio = HY.tpl('tpl-blk-compare-empty');
      vacio.firstElementChild.prepend(HY.sbarNode('Comparar', null));
      return vacio;
    }

    var frag = HY.tpl('tpl-view-compare');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode('Comparar', 'Dos profesionales lado a lado'));

    root.querySelector('caption').textContent = 'Comparación de ' + a.name + ' y ' + b.name;
    var heads = root.querySelectorAll('thead th');
    heads[0].textContent = a.name;
    heads[1].textContent = b.name;

    var rows = [
      ['Precio de visita', function (p) { return 'S/ ' + p.price; }],
      ['Calificación', function (p) { return HY.fmtRating(p.rating) + ' de 5'; }],
      ['Disponible', function (p) { return p.when; }],
      ['Experiencia', function (p) { return p.years + ' años'; }],
      ['Trabajos', function (p) { return String(p.jobs); }]
    ];
    var tbody = root.querySelector('tbody');
    rows.forEach(function (row) {
      var tr = HY.tpl('tpl-item-compare-row').firstElementChild;
      tr.querySelector('th').textContent = row[0];
      var tds = tr.querySelectorAll('td');
      tds[0].textContent = row[1](a);
      tds[1].textContent = row[1](b);
      tbody.appendChild(tr);
    });

    var btns = root.querySelectorAll('.row button');
    btns[0].setAttribute('data-id', a.id);
    btns[0].textContent = 'Ver perfil de ' + a.name.split(' ')[0];
    btns[1].setAttribute('data-id', b.id);
    btns[1].textContent = 'Ver perfil de ' + b.name.split(' ')[0];

    return frag;
  };

})(window.HY);
