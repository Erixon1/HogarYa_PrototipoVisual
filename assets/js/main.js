/* ============================================================
   HogarYa · arranque
   Conecta los eventos con las acciones, carga las plantillas de
   assets/views/ y dibuja la primera pantalla.
   ============================================================ */
(function (HY) {
  'use strict';

  document.addEventListener('click', HY.actions.rateClick, true);
  document.addEventListener('click', HY.actions.click);
  document.addEventListener('change', HY.actions.change);
  document.addEventListener('input', HY.actions.input);
  document.addEventListener('submit', HY.actions.submit);
  document.addEventListener('keydown', HY.actions.key);

  /* Acceso para depurar desde la consola del navegador. */
  window.__hy = {
    state: function () { return HY.state(); },
    render: HY.render,
    setTheme: HY.setTheme
  };

  /* Mensaje de carga o de error según se pueda leer el prototipo. */
  var cargando = document.getElementById('cargando');

  HY.loadTemplates().then(function () {
    if (cargando) cargando.remove();
    HY.render();
  }).catch(function (err) {
    console.error(err);
    if (!cargando) return;
    cargando.innerHTML = '';
    cargando.appendChild(HY.el('h1', null, 'HogarYa necesita un servidor local'));
    cargando.appendChild(HY.el('p', null,
      'Las plantillas del prototipo viven en archivos .html y el navegador no permite leerlos al abrir el archivo directamente desde el disco.'));
    cargando.appendChild(HY.el('p', null,
      'Ábrelo usando Live Server o Live Preview en tu editor, o levanta un servidor local en http://localhost:8000.'));
  });

})(window.HY);
