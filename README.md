# Vortex Crew — Demo

Demo rápida de tienda de indumentaria de ciclismo (marca **Vortex Crew**), construida para validar estilo con el cliente antes de armar la tienda completa.

Sitio estático (HTML + CSS + JS, sin frameworks ni build). No requiere Node.js para editar ni para desplegar.

## Estructura

```
index.html                    Página de Inicio (hero en video, destacados, categorías, nosotros, footer)
producto.html                 Página de producto individual de ejemplo
categoria.html                Plantilla de listado por categoría (usa ?cat=tricotas|calzas|mtb|accesorios|todos)
css/styles.css                Estilos (design system, layout, responsive)
js/main.js                    Interactividad (nav, buscador, tallas/colores, carrito demo, acordeón, etc.)
js/products.js                Catálogo demo compartido (usado por el buscador y categoria.html)
js/categoria.js               Render, orden y filtros de categoria.html
assets/videos/hero-video.mp4  Video del hero, comprimido para web (13MB → 3.2MB, 1280x720, sin audio)
assets/images/hero-poster.jpg Poster del video / imagen fija que se muestra en celular
vercel.json                   Config de Vercel (fuerza outputDirectory a la raíz, cache de assets)
api/crear-pago.js             Función serverless: crea el checkout de Mercado Pago (ver sección abajo)
shopify-theme/                Mismo diseño, pero como tema real de Shopify (Liquid) — ver shopify-theme/README.md
```

## Versión Shopify

Además de esta demo estática, existe una versión del mismo diseño construida como tema de Shopify (carrito y checkout reales, no de ejemplo), lista para subir a una tienda existente sin afectar el tema publicado. Ver [`shopify-theme/README.md`](shopify-theme/README.md) para instrucciones.

> **Nota para quien toque este proyecto:** la carpeta de imágenes/video se llama `assets/`, no `public/`. Vercel trata una carpeta llamada literalmente `public` como el directorio de salida cuando no detecta ningún framework — como nuestros `.html` viven en la raíz del proyecto y no dentro de esa carpeta, eso hacía que el sitio entero devolviera 404. Si algún día se agrega una carpeta de assets nueva, evitar llamarla `public`.

## Alcance de esta demo

- Página de Inicio y una página de Producto de ejemplo.
- "Agregar al carrito" es de ejemplo (muestra un aviso tipo toast, no hay carrito real). "Comprar ahora" en `producto.html` sí está conectado a un checkout real de Mercado Pago — ver sección abajo.
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

## Pago con Mercado Pago (botón "Comprar ahora" de producto.html)

El botón "Comprar ahora" de `producto.html` ya está conectado a Mercado Pago mediante `api/crear-pago.js` (una función serverless de Vercel). Falta un solo paso para que funcione:

1. Crear una cuenta en [mercadopago.cl](https://www.mercadopago.cl) (sirve con RUT de persona natural, no hace falta empresa constituida).
2. Entrar a [mercadopago.cl/developers/panel](https://www.mercadopago.cl/developers/panel) → **Tus integraciones** → crear una aplicación.
3. Copiar el **Access Token de PRUEBA** (modo sandbox — sirve para probar con tarjetas de prueba antes de cobrar plata real).
4. En Vercel: **Project → Settings → Environment Variables**, agregar `MP_ACCESS_TOKEN` con ese valor, y volver a desplegar.

Con eso, al apretar "Comprar ahora" se crea una orden real en Mercado Pago y redirige al checkout de prueba. El precio ($39.990) se define en el propio `api/crear-pago.js`, no en el navegador, para que nadie lo pueda alterar desde las herramientas de desarrollador.

Cuando estén listos para cobrar plata de verdad, se reemplaza el Access Token de prueba por el de **producción** (mismo panel de Mercado Pago) — no hay que tocar código.

## Botón flotante de consultas (correo)

Aparece en las 3 páginas, abajo a la derecha. Al escribir y apretar "Enviar" abre el programa de correo del visitante con un mensaje prellenado (nombre, correo del visitante y su pregunta) dirigido al negocio.

Todavía no tiene correo de destino configurado a propósito. Para activarlo: en `js/main.js`, buscar la línea `var CONTACT_EMAIL = '';` (cerca del comentario "Contact float") y poner el correo real entre las comillas, ej. `var CONTACT_EMAIL = 'hola@vortexcrew.cl';`. Mientras esté vacío, el botón avisa que falta configurarlo en vez de fallar en silencio.

## Próximos pasos (fuera del alcance de esta demo)

- Conectar Mercado Pago al resto de los productos del catálogo (hoy solo el de `producto.html` está conectado) y al botón "Agregar al carrito" con un carrito real de varios productos.
- Cargar catálogo completo de productos con fotografía real.
- Panel de administración para que el cliente cargue productos.
- Definir hosting definitivo (Hostinger u otro) junto al cliente, y hacer el deploy final ahí.
- Reemplazar textos e imágenes placeholder por contenido real de la marca.
