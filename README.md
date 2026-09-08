# Vortex Crew — Demo

Demo rápida de tienda de indumentaria de ciclismo (marca **Vortex Crew**), construida para validar estilo con el cliente antes de armar la tienda completa.

Sitio estático (HTML + CSS + JS, sin frameworks ni build). No requiere Node.js para editar ni para desplegar.

## Estructura

```
index.html            Página de Inicio (hero en video, destacados, categorías, nosotros, footer)
producto.html          Página de producto individual de ejemplo
css/styles.css         Estilos (design system, layout, responsive)
js/main.js              Interactividad (nav, tallas/colores, carrito demo, acordeón, etc.)
public/videos/hero-video.mp4   Video del hero, comprimido para web (13MB → 3.2MB, 1280x720, sin audio)
public/images/hero-poster.jpg  Poster del video / imagen fija que se muestra en celular
vercel.json             Config mínima de cache para Vercel
```

## Alcance de esta demo

- Página de Inicio y una página de Producto de ejemplo.
- Botón "Comprar" y "Agregar al carrito" son de ejemplo — no hay pasarela de pago conectada (muestran un aviso tipo toast).
- Fotos y textos de productos son **placeholder** (nombres, precios y tallas de ejemplo). El único contenido real es el video del hero.
- Las fotos de las secciones "Categorías" y "Sobre nosotros" son fotos de stock (Unsplash) usadas como placeholder de estilo de vida — se reemplazan por fotos reales del cliente más adelante.
- Los íconos de producto (tricota, calzas, guantes, gorra, etc.) son ilustraciones lineales sobre fondos degradados de marca — un lookbook simple, ya que aún no hay fotografía real de producto.

## Ver la demo en tu computador

No hace falta instalar nada. Ejecuta un servidor estático simple desde esta carpeta y abre `http://localhost:8080`:

```bash
# con Python (viene instalado en Windows/Mac normalmente)
py -m http.server 8080
# o
python3 -m http.server 8080
```

(Abrir `index.html` con doble clic también funciona, pero un servidor local evita posibles bloqueos del navegador con rutas relativas.)

## Publicar en Vercel (temporal, para mostrarle al cliente)

**Opción más simple — sin instalar nada:**

1. Ir a **[vercel.com/drop](https://vercel.com/drop)**.
2. Arrastrar la carpeta completa `WEB BICICLETAS` al navegador.
3. Vercel sube los archivos y entrega una URL pública en segundos.

**Opción alternativa (si prefieren integración con GitHub para futuras actualizaciones):**

1. Subir esta carpeta a un repositorio de GitHub.
2. En [vercel.com/new](https://vercel.com/new), importar ese repositorio.
3. Como es un sitio estático (sin framework), Vercel lo detecta automáticamente — no hay que tocar configuración de build.

## Próximos pasos (fuera del alcance de esta demo)

- Integrar pasarela de pago real (Flow / Mercado Pago / Webpay, a definir según si el cliente tiene empresa constituida).
- Cargar catálogo completo de productos con fotografía real.
- Panel de administración para que el cliente cargue productos.
- Definir hosting definitivo (Hostinger u otro) junto al cliente, y hacer el deploy final ahí.
- Reemplazar textos e imágenes placeholder por contenido real de la marca.
