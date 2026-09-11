/* Catálogo compartido — usado por el buscador y las páginas de categoría.
   Fotos y stock por talla vienen del cliente (roots co.); los precios son
   provisorios por categoría hasta que el cliente confirme precio real por
   producto (ver README). */
(function (global) {
  'use strict';

  var CATEGORY_LABELS = {
    poleras: 'Poleras',
    pantalones: 'Pantalones',
    shorts: 'Shorts',
    guantes: 'Guantes',
    cinturones: 'Cinturones',
    calcetines: 'Calcetines',
    botellas: 'Botellas',
    accesorios: 'Accesorios',
    todos: 'Todo el catálogo'
  };

  var PRODUCTS = [
    {
      id: 'polera-araucaria',
      name: 'Polera Araucaria',
      price: 27990,
      category: ['poleras'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Concho Vino', hex: '#7d2b3a' }],
      images: [
        'assets/images/productos/poleras/polera-araucaria-1.jpg',
        'assets/images/productos/poleras/polera-araucaria-2.jpg',
        'assets/images/productos/poleras/polera-araucaria-3.jpg',
        'assets/images/productos/poleras/polera-araucaria-4.jpg',
        'assets/images/productos/poleras/polera-araucaria-5.jpg',
        'assets/images/productos/poleras/polera-araucaria-6.jpg'
      ],
      badge: 'Más vendida',
      dateAdded: '2026-07-10',
      desc: 'Polera técnica manga corta, gráfica inspirada en la araucaria andina.'
    },
    {
      id: 'polera-campamento-base',
      name: 'Polera Campamento Base',
      price: 27990,
      category: ['poleras'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Verde Agua', hex: '#8fb7ae' }],
      images: [
        'assets/images/productos/poleras/polera-campamento-base-1.jpg',
        'assets/images/productos/poleras/polera-campamento-base-2.jpg',
        'assets/images/productos/poleras/polera-campamento-base-3.jpg',
        'assets/images/productos/poleras/polera-campamento-base-4.jpg',
        'assets/images/productos/poleras/polera-campamento-base-5.jpg',
        'assets/images/productos/poleras/polera-campamento-base-6.jpg',
        'assets/images/productos/poleras/polera-campamento-base-7.jpg'
      ],
      badge: null,
      dateAdded: '2026-06-20',
      desc: 'Manga 3/4, tela técnica transpirable para salidas largas de trail.'
    },
    {
      id: 'polera-combi',
      name: 'Polera Combi',
      price: 27990,
      category: ['poleras'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Azul', hex: '#3b3f72' }],
      images: [
        'assets/images/productos/poleras/polera-combi-1.jpg',
        'assets/images/productos/poleras/polera-combi-2.jpg',
        'assets/images/productos/poleras/polera-combi-3.jpg'
      ],
      badge: null,
      dateAdded: '2026-05-15',
      desc: 'Manga larga con protección extra, espíritu road trip.'
    },
    {
      id: 'polera-defender',
      name: 'Polera Defender',
      price: 27990,
      category: ['poleras'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Verde Militar', hex: '#7d7a54' }],
      images: [
        'assets/images/productos/poleras/polera-defender-1.jpg',
        'assets/images/productos/poleras/polera-defender-2.jpg',
        'assets/images/productos/poleras/polera-defender-3.jpg'
      ],
      badge: 'Nuevo',
      dateAdded: '2026-08-18',
      desc: 'Manga larga resistente, pensada para terreno exigente.'
    },
    {
      id: 'polera-hit-the-road',
      name: 'Polera Hit The Road',
      price: 27990,
      category: ['poleras'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Morada', hex: '#9b7fc7' }],
      images: [
        'assets/images/productos/poleras/polera-hit-the-road-1.jpg',
        'assets/images/productos/poleras/polera-hit-the-road-2.jpg',
        'assets/images/productos/poleras/polera-hit-the-road-3.jpg',
        'assets/images/productos/poleras/polera-hit-the-road-4.jpg',
        'assets/images/productos/poleras/polera-hit-the-road-5.jpg',
        'assets/images/productos/poleras/polera-hit-the-road-6.jpg',
        'assets/images/productos/poleras/polera-hit-the-road-7.jpg'
      ],
      badge: null,
      dateAdded: '2026-04-22',
      desc: 'Corte relajado, ideal para rodar y para el después.'
    },
    {
      id: 'pantalon-long-roots',
      name: 'Pantalón Long Roots',
      price: 39990,
      category: ['pantalones'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#16161a' }],
      images: [
        'assets/images/productos/pantalones/pantalon-long-roots-1.jpg',
        'assets/images/productos/pantalones/pantalon-long-roots-2.jpg',
        'assets/images/productos/pantalones/pantalon-long-roots-3.jpg'
      ],
      badge: 'Nuevo',
      dateAdded: '2026-08-28',
      desc: 'Trail pants resistente, con bolsillo con cierre y ajuste en el tobillo.'
    },
    {
      id: 'short-roots',
      name: 'Short Roots',
      price: 24990,
      category: ['shorts', 'pantalones'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Negro', hex: '#16161a' }],
      images: [
        'assets/images/productos/shorts/short-roots-1.jpg',
        'assets/images/productos/shorts/short-roots-2.jpg',
        'assets/images/productos/shorts/short-roots-3.jpg'
      ],
      badge: null,
      dateAdded: '2026-07-02',
      desc: 'Trail shorts liviano, libertad de movimiento en cada pedaleada.'
    },
    {
      id: 'guante-black-sabath',
      name: 'Guante Black Sabath',
      price: 14990,
      category: ['guantes', 'accesorios'],
      sizes: ['S/M', 'L/XL'],
      colors: [{ name: 'Negro', hex: '#16161a' }],
      images: [
        'assets/images/productos/guantes/guante-black-sabath-1.jpg',
        'assets/images/productos/guantes/guante-black-sabath-2.jpg',
        'assets/images/productos/guantes/guante-black-sabath-3.jpg'
      ],
      badge: null,
      dateAdded: '2026-03-12',
      desc: 'Guante dedo largo, grip reforzado para técnico y enduro.'
    },
    {
      id: 'guante-soja',
      name: 'Guante Soja',
      price: 14990,
      category: ['guantes', 'accesorios'],
      sizes: ['S/M', 'L/XL'],
      colors: [{ name: 'Verde Militar', hex: '#6f7a52' }],
      images: [
        'assets/images/productos/guantes/guante-soja-1.jpg',
        'assets/images/productos/guantes/guante-soja-2.jpg',
        'assets/images/productos/guantes/guante-soja-3.jpg',
        'assets/images/productos/guantes/guante-soja-4.jpg',
        'assets/images/productos/guantes/guante-soja-5.jpg'
      ],
      badge: 'Nuevo',
      dateAdded: '2026-08-30',
      desc: 'Palma reforzada, tela ligera y transpirable.'
    },
    {
      id: 'cinturon-leaf',
      name: 'Cinturón Leaf',
      price: 16990,
      category: ['cinturones', 'accesorios'],
      sizes: ['Única'],
      colors: [{ name: 'Verde Militar', hex: '#6f7a52' }],
      images: [
        'assets/images/productos/cinturones/cinturon-leaf-1.jpg',
        'assets/images/productos/cinturones/cinturon-leaf-2.jpg',
        'assets/images/productos/cinturones/cinturon-leaf-3.jpg'
      ],
      badge: null,
      dateAdded: '2026-02-18',
      desc: 'Cinturón de cincha con hebilla técnica, ajuste rápido.'
    },
    {
      id: 'calcetin-rootsco',
      name: 'Calcetín RootsCo',
      price: 7990,
      category: ['calcetines', 'accesorios'],
      sizes: ['Única'],
      colors: [{ name: 'Verde Bosque', hex: '#5f7a5a' }],
      images: [
        'assets/images/productos/calcetines/calcetin-rootsco-1.jpg',
        'assets/images/productos/calcetines/calcetin-rootsco-2.jpg'
      ],
      badge: null,
      dateAdded: '2026-01-25',
      desc: 'Calcetín acolchado en zonas de apoyo, caña media.'
    },
    {
      id: 'botella-campamento-base',
      name: 'Botella Campamento Base',
      price: 9990,
      category: ['botellas', 'accesorios'],
      sizes: ['Única'],
      colors: [{ name: 'Negra', hex: '#16161a' }],
      images: [
        'assets/images/productos/botellas/botella-campamento-base-1.jpg',
        'assets/images/productos/botellas/botella-campamento-base-2.jpg'
      ],
      badge: null,
      dateAdded: '2026-05-05',
      desc: 'Botella Purist 22oz, libre de sabores, apta para bidonera.'
    },
    {
      id: 'botella-combi',
      name: 'Botella Combi',
      price: 9990,
      category: ['botellas', 'accesorios'],
      sizes: ['Única'],
      colors: [{ name: 'Turquesa', hex: '#3fb6ae' }],
      images: [
        'assets/images/productos/botellas/botella-combi-1.jpg',
        'assets/images/productos/botellas/botella-combi-2.jpg'
      ],
      badge: null,
      dateAdded: '2026-05-05',
      desc: 'Botella Purist 22oz, libre de sabores, apta para bidonera.'
    },
    {
      id: 'botella-hit-the-road',
      name: 'Botella Hit The Road',
      price: 9990,
      category: ['botellas', 'accesorios'],
      sizes: ['Única'],
      colors: [{ name: 'Transparente', hex: '#eae7df' }],
      images: [
        'assets/images/productos/botellas/botella-hit-the-road-1.jpg',
        'assets/images/productos/botellas/botella-hit-the-road-2.jpg',
        'assets/images/productos/botellas/botella-hit-the-road-3.jpg'
      ],
      badge: null,
      dateAdded: '2026-05-05',
      desc: 'Botella Purist 22oz, libre de sabores, apta para bidonera.'
    }
  ];

  function formatPrice(n) {
    return '$' + n.toLocaleString('es-CL');
  }

  global.VORTEX_CATALOG = {
    products: PRODUCTS,
    categoryLabels: CATEGORY_LABELS,
    formatPrice: formatPrice
  };
})(window);
