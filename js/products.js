/* Catálogo demo compartido — usado por el buscador y las páginas de categoría. */
(function (global) {
  'use strict';

  var ICONS = {
    jersey: '<path d="M32 16 L16 26 L23 40 L32 33 L32 88 L68 88 L68 33 L77 40 L84 26 L68 16 L58 23 L42 23 Z"/><line x1="50" y1="24" x2="50" y2="86"/><line x1="34" y1="70" x2="42" y2="70"/><line x1="58" y1="70" x2="66" y2="70"/>',
    bib: '<path d="M33 14 L67 14 L70 48 L61 88 L52 88 L50 50 L48 88 L39 88 L30 48 Z"/><line x1="33" y1="14" x2="67" y2="14"/>',
    jacket: '<path d="M30 14 L14 25 L21 40 L30 32 L30 88 L70 88 L70 32 L79 40 L86 25 L70 14 L58 20 L58 14 L42 14 L42 20 Z"/><line x1="50" y1="20" x2="50" y2="86"/><circle cx="50" cy="30" r="2.4" fill="currentColor" stroke="none"/>',
    gloves: '<path d="M28 55 Q26 40 34 38 L34 22 Q34 17 38 17 Q42 17 42 22 L42 36 L44 36 L44 18 Q44 13 48 13 Q52 13 52 18 L52 36 L54 36 L54 19 Q54 14 58 14 Q62 14 62 19 L62 37 L64 37 Q68 37 69 43 L71 55 Q72 66 63 72 L63 85 L33 85 L33 70 Q26 66 28 55 Z"/>',
    cap: '<path d="M22 62 Q18 28 50 24 Q80 27 78 62 Z"/><line x1="22" y1="62" x2="78" y2="62"/><path d="M68 58 Q92 56 95 66 Q92 74 66 68 Z"/><circle cx="50" cy="24" r="2.6" fill="currentColor" stroke="none"/>',
    socks: '<path d="M38 14 L62 14 L62 52 L82 66 L82 88 L48 88 L48 62 L38 62 Z"/>'
  };

  var CATEGORY_LABELS = {
    tricotas: 'Tricotas y Jerseys',
    calzas: 'Calzas y Shorts',
    mtb: 'MTB & Gravel',
    accesorios: 'Accesorios',
    todos: 'Todo el catálogo'
  };

  var PRODUCTS = [
    {
      id: 'tricota-aero',
      name: 'Tricota Aero Manga Corta',
      price: 39990,
      category: ['tricotas'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }, { name: 'Vortex Orange', hex: '#ff4b1f' }],
      tile: 'tile-1',
      icon: 'jersey',
      badge: 'Más vendida',
      dateAdded: '2026-06-01'
    },
    {
      id: 'tricota-termica',
      name: 'Tricota Térmica Manga Larga',
      price: 52990,
      category: ['tricotas'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }, { name: 'Gris Grafito', hex: '#3b3b44' }],
      tile: 'tile-2',
      icon: 'jersey',
      badge: null,
      dateAdded: '2026-05-10'
    },
    {
      id: 'tricota-trail',
      name: 'Tricota Trail MTB Manga Larga',
      price: 45990,
      category: ['tricotas', 'mtb'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }, { name: 'Vortex Orange', hex: '#ff4b1f' }],
      tile: 'tile-4',
      icon: 'jersey',
      badge: 'Nuevo',
      dateAdded: '2026-08-20'
    },
    {
      id: 'tricota-mujer-aero',
      name: 'Tricota Mujer Aero',
      price: 39990,
      category: ['tricotas'],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }, { name: 'Blanco', hex: '#f7f6f3' }],
      tile: 'tile-5',
      icon: 'jersey',
      badge: null,
      dateAdded: '2026-04-15'
    },
    {
      id: 'calzas-bib-termicas',
      name: 'Calzas Bib Largas Térmicas',
      price: 54990,
      category: ['calzas'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }, { name: 'Gris Grafito', hex: '#3b3b44' }],
      tile: 'tile-2',
      icon: 'bib',
      badge: null,
      dateAdded: '2026-05-01'
    },
    {
      id: 'calzas-cortas-aero',
      name: 'Calzas Cortas Aero',
      price: 34990,
      category: ['calzas'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }, { name: 'Vortex Orange', hex: '#ff4b1f' }],
      tile: 'tile-6',
      icon: 'bib',
      badge: 'Más vendida',
      dateAdded: '2026-07-01'
    },
    {
      id: 'short-mtb-enduro',
      name: 'Short MTB Enduro',
      price: 42990,
      category: ['calzas', 'mtb'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }],
      tile: 'tile-3',
      icon: 'bib',
      badge: 'Nuevo',
      dateAdded: '2026-08-05'
    },
    {
      id: 'calzas-mujer-bib',
      name: 'Calzas Mujer Bib',
      price: 54990,
      category: ['calzas'],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }],
      tile: 'tile-5',
      icon: 'bib',
      badge: null,
      dateAdded: '2026-03-20'
    },
    {
      id: 'cortavientos-shield',
      name: 'Cortavientos Vortex Shield',
      price: 64990,
      category: ['mtb', 'tricotas'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }, { name: 'Vortex Orange', hex: '#ff4b1f' }],
      tile: 'tile-3',
      icon: 'jacket',
      badge: 'Nuevo',
      dateAdded: '2026-08-25'
    },
    {
      id: 'guantes-mtb-largo',
      name: 'Guantes MTB Dedo Largo',
      price: 19990,
      category: ['mtb'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }],
      tile: 'tile-4',
      icon: 'gloves',
      badge: null,
      dateAdded: '2026-06-15'
    },
    {
      id: 'guantes-pro-grip',
      name: 'Guantes Pro Grip Corto',
      price: 17990,
      category: ['accesorios'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }],
      tile: 'tile-4',
      icon: 'gloves',
      badge: null,
      dateAdded: '2026-02-10'
    },
    {
      id: 'gorra-tecnica',
      name: 'Gorra Técnica Vortex',
      price: 12990,
      category: ['accesorios'],
      sizes: ['Única'],
      colors: [{ name: 'Negro', hex: '#0a0a0c' }, { name: 'Blanco', hex: '#f7f6f3' }],
      tile: 'tile-5',
      icon: 'cap',
      badge: null,
      dateAdded: '2026-01-20'
    },
    {
      id: 'calcetas-aero',
      name: 'Calcetas Aero (Pack x3)',
      price: 9990,
      category: ['accesorios'],
      sizes: ['36-39', '40-43', '44-46'],
      colors: [{ name: 'Negro/Gris', hex: '#0a0a0c' }],
      tile: 'tile-6',
      icon: 'socks',
      badge: null,
      dateAdded: '2026-01-05'
    }
  ];

  function formatPrice(n) {
    return '$' + n.toLocaleString('es-CL');
  }

  function iconMarkup(type) {
    return ICONS[type] || '';
  }

  global.VORTEX_CATALOG = {
    products: PRODUCTS,
    categoryLabels: CATEGORY_LABELS,
    formatPrice: formatPrice,
    iconMarkup: iconMarkup
  };
})(window);
