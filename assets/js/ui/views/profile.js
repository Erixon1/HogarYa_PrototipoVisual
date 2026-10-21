/* ============================================================
   HogarYa · vista Perfil del profesional
   Precios, disponibilidad, opinión reciente y la acción de
   solicitar el servicio.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.views.profile = function () {
    var S = HY.state();
    var p = HY.pro(S.params.id);
    var c = HY.cat(p.cat);
    var fav = S.favs.indexOf(p.id) > -1;

    var frag = HY.tpl('tpl-view-profile');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode('Perfil', null));

    root.querySelector('.avatar.lg').textContent = HY.initials(p.name);
    root.querySelector('#pname').textContent = p.name;
    root.querySelector('.profile-head p.sub').textContent = c.name + ' · ' + S.district;

    var stats = root.querySelectorAll('.stats b');
    stats[0].textContent = HY.fmtRating(p.rating);
    stats[1].textContent = String(p.jobs);
    stats[2].textContent = p.years + ' años';

    var favBtn = root.querySelector('.profile-head button.fav, .profile-head .btn');
    favBtn.setAttribute('data-id', p.id);
    favBtn.setAttribute('data-key', 'fav-' + p.id);
    favBtn.innerHTML = HY.ic('heart', fav ? 'fill' : '') + (fav ? 'Quitar de guardados' : 'Guardar');

    var cards = root.querySelectorAll('.card');
    var prices = cards[0].querySelectorAll('dl.kv dd');
    prices[0].textContent = 'S/ ' + p.price;
    prices[1].textContent = 'S/ ' + p.labor;

    var tag = cards[1].querySelector('.tag');
    tag.className = 'tag ' + (p.today ? 'ok' : '');
    tag.insertAdjacentHTML('afterbegin', HY.ic('clock'));
    tag.appendChild(document.createTextNode(p.when));

    cards[2].querySelector('p').textContent = '«' + HY.data.REVIEWS[p.cat] + '»';

    var solicitar = frag.querySelector('.fixedbar.actionbar button');
    solicitar.setAttribute('data-id', p.id);

    return frag;
  };

})(window.HY);
