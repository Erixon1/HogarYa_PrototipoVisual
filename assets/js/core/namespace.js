/* ============================================================
   HogarYa · espacio de nombres
   Toda la aplicación vive en un único objeto global, "HY".
   Cada archivo se apoya en él; así no se filtran variables
   sueltas al ámbito global (el único acceso directo es
   window.__hy, que se deja al final, en main.js, para depurar).
   ============================================================ */
window.HY = {
  data: {},   /* catálogos y datos ilustrativos        */
  ui: {},     /* estado efímero de la interfaz          */
  views: {}   /* vistas: pantalla -> función que dibuja */
};
