/* ============================================================
   HogarYa · vista Mi perfil
   Datos de la cuenta, preferencia de apariencia, cierre de
   sesión y reinicio de la demostración.
   ============================================================ */
(function (HY) {
  'use strict';

  function kvRow(label, value) {
    var tr = HY.tpl('tpl-item-kv').firstElementChild;
    tr.querySelector('dt').textContent = label;
    tr.querySelector('dd').textContent = value;
    return tr;
  }

  HY.views.account = function () {
    var S = HY.state();

    if (!S.user) {
      var frag = HY.tpl('tpl-view-account-guest');
      var root = frag.firstElementChild;
      root.prepend(HY.sbarNode('Mi perfil', null, false));
      HY.put(root, 'content', HY.emptyNode(
        'user',
        'Aún no ingresaste',
        'Ingresa para ver tus datos y tus solicitudes.',
        { label: 'Ingresar', kind: 'primary', action: 'needlogin', key: 'needlogin' }));
      HY.put(root, 'appearance', HY.appearanceNode());
      HY.put(root, 'a11y', HY.a11yNode());
      return frag;
    }

    var u = S.user;
    var frag2 = HY.tpl('tpl-view-account');
    var root2 = frag2.firstElementChild;
    root2.prepend(HY.sbarNode('Mi perfil', null, false));

    root2.querySelector('.avatar').textContent = HY.initials(u.name);
    root2.querySelector('.row h2').textContent = u.name;
    root2.querySelector('.row p.sub').textContent = u.role === 'profesional' ? 'Profesional' : 'Cliente';

    var dl = root2.querySelector('dl.kv');
    dl.appendChild(kvRow('Correo', u.email));
    if (u.role === 'cliente') {
      dl.appendChild(kvRow('Distrito', S.district));
      dl.appendChild(kvRow('Última dirección', S.lastAddress || 'Aún no hay una guardada'));
    }

    HY.put(root2, 'appearance', HY.appearanceNode());
    HY.put(root2, 'a11y', HY.a11yNode());
    HY.put(root2, 'foot', HY.footNode());
    return frag2;
  };

})(window.HY);
