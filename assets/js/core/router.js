/* ============================================================
   HogarYa · navegación
   Enrutado de pantallas: avanzar, retroceder y saber qué
   solicitudes son visibles según el rol de quien entró.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.isPro = function () {
    var S = HY.state();
    return S.user && S.user.role === 'profesional';
  };

  /* El profesional ve las solicitudes dirigidas a él; el cliente,
     las suyas y las de prueba. */
  HY.visibleReqs = function () {
    var S = HY.state();
    if (!S.user) return [];
    if (HY.isPro()) return S.reqs.filter(function (r) { return r.proId === 'carlos'; });
    return S.reqs.filter(function (r) { return r.clientEmail === '*' || r.clientEmail === S.user.email; });
  };

  HY.reqById = function (id) {
    return HY.state().reqs.filter(function (r) { return r.id === id; })[0];
  };

  /* opts.reset = nueva navegación (vacía el historial);
     opts.replace = cambia la pantalla actual sin apilar. */
  HY.go = function (screen, params, opts) {
    opts = opts || {};
    var S = HY.state();
    if (!opts.replace && !opts.reset) S.stack.push({ screen: S.screen, params: S.params });
    if (opts.reset) S.stack = [];
    S.screen = screen; S.params = params || {};
    HY.render({ focusTitle: true, scrollTop: true });
  };

  HY.back = function () {
    var S = HY.state();
    var p = S.stack.pop();
    if (!p) { S.screen = HY.isPro() ? 'proHome' : 'home'; S.params = {}; }
    else { S.screen = p.screen; S.params = p.params; }
    HY.render({ focusTitle: true, scrollTop: true });
  };

  HY.home = function () { HY.go(HY.isPro() ? 'proHome' : 'home', {}, { reset: true }); };

})(window.HY);
