# roots co. — Demo

Demo de tienda de indumentaria de trail/MTB (marca **roots co.**), construida para validar estilo con el cliente antes de armar la tienda completa.

Sitio estático (HTML + CSS + JS, sin frameworks ni build). No requiere Node.js para editar ni para desplegar.

## Estructura

```
index.html                    Página de Inicio (hero, destacados, categorías, nosotros, footer)
producto.html                 Página de producto individual (Polera Araucaria)
categoria.html                Plantilla de listado por categoría (usa ?cat=poleras|pantalones|shorts|guantes|cinturones|calcetines|botellas|accesorios|todos)
css/styles.css                Estilos (design system, layout, responsive)
js/main.js                    Interactividad (nav, buscador, tallas/colores, carrito demo, acordeón, etc.)
js/products.js                Catálogo compartido (usado por el buscador y categoria.html)
js/categoria.js               Render, orden y filtros de categoria.html
assets/images/productos/      Fotos reales de producto (provistas por el cliente), organizadas por categoría
assets/images/banner/         Foto del hero y foto de respaldo para celular
assets/images/categorias/     Fotos de fondo de las 3 tarjetas de categoría del home
assets/images/nosotros/       Foto de la sección "Sobre nosotros"
vercel.json                   Config de Vercel (fuerza outputDirectory a la raíz, cache de assets)
api/crear-pago.js             Función serverless: crea el checkout de Mercado Pago (ver sección abajo)
api/enviar-consulta.js        Función serverless: manda la consulta del botón flotante al correo del dueño (ver sección abajo)
shopify-theme/                Mismo diseño (bajo la marca anterior "Vortex Crew"), como tema real de Shopify — ver nota abajo
```

> **Nota sobre `shopify-theme/`:** ese tema se construyó antes de recibir el material real de roots co. y todavía tiene la marca de ejemplo "Vortex Crew" — no se actualizó en esta pasada (el pedido del cliente fue enfocado en el sitio estático). Si más adelante se retoma la versión Shopify, hay que aplicarle el mismo rebranding que se hizo acá.

## Versión Shopify

Además de esta demo estática, existe una versión del mismo layout construida como tema de Shopify (carrito y checkout reales, no de ejemplo). Está desactualizada respecto al branding real (ver nota arriba). Ver [`shopify-theme/README.md`](shopify-theme/README.md) para instrucciones de instalación.

> **Nota para quien toque este proyecto:** la carpeta de imágenes/video se llama `assets/`, no `public/`. Vercel trata una carpeta llamada literalmente `public` como el directorio de salida cuando no detecta ningún framework — como nuestros `.html` viven en la raíz del proyecto y no dentro de esa carpeta, eso hacía que el sitio entero devolviera 404. Si algún día se agrega una carpeta de assets nueva, evitar llamarla `public`.

## Alcance de esta demo

- Página de Inicio y una página de Producto (Polera Araucaria, la más vendida del catálogo real).
- "Agregar al carrito" es de ejemplo (muestra un aviso tipo toast, no hay carrito real). "Comprar ahora" en `producto.html` sí está conectado a un checkout real de Mercado Pago — ver sección abajo.
- **Fotos de producto: reales**, provistas por el cliente (33 fotos de estudio, 14 modelos). **Precios: provisorios**, uno fijo por categoría (ver tabla abajo) — todavía no se recibió una lista de precios real. **Nombres, colores y tallas: reales**, sacados directo de la planilla de stock del cliente.
- Las fotos de las secciones "Categorías" y "Sobre nosotros" son fotos reales de acción/detalle del mismo cliente (no son stock de internet).
- Solo se publicaron las variantes **Hombre** de las poleras. El stock del cliente incluye 4 modelos de Mujer (Araucaria, Campamento Base, Hit The Road, Combi) en colores distintos, pero no llegaron fotos de esas variantes — hay que pedírselas al cliente y agregarlas en `js/products.js` cuando estén.

### Precios provisorios por categoría

| Categoría | Precio placeholder |
|---|---|
| Poleras | $27.990 |
| Pantalón | $39.990 |
| Short | $24.990 |
| Guantes | $14.990 |
| Cinturón | $16.990 |
| Calcetines | $7.990 |
| Botellas | $9.990 |

Se cambian editando el campo `price` de cada producto en `js/products.js`.

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

Con eso, al apretar "Comprar ahora" se crea una orden real en Mercado Pago y redirige al checkout de prueba. El precio ($27.990) se define en el propio `api/crear-pago.js`, no en el navegador, para que nadie lo pueda alterar desde las herramientas de desarrollador.

Cuando estén listos para cobrar plata de verdad, se reemplaza el Access Token de prueba por el de **producción** (mismo panel de Mercado Pago) — no hay que tocar código.

## Botón flotante de consultas (correo)

Aparece en las 3 páginas, abajo a la derecha. El cliente escribe su nombre, correo y pregunta; al apretar "Enviar" el mensaje llega **directo al Gmail del dueño** mediante `api/enviar-consulta.js` (función serverless de Vercel) — no depende de que el visitante tenga un programa de correo configurado. Cuando el dueño le da "Responder" en Gmail, la respuesta va directo al correo que escribió el cliente (queda configurado así automáticamente).

Para activarlo, se usa [Resend](https://resend.com) (tiene plan gratuito):

1. Crear una cuenta gratis en [resend.com](https://resend.com) con el Gmail del dueño del negocio.
2. En el panel de Resend → **API Keys** → crear una nueva, copiarla.
3. En Vercel: **Project → Settings → Environment Variables**, agregar:
   - `RESEND_API_KEY` → la key que copiaste.
   - `CONTACT_EMAIL` → el Gmail donde quieren que lleguen las consultas.
4. Redesplegar.

**Importante sobre el modo gratis de Resend:** sin verificar un dominio propio, Resend solo deja enviar correos **al mismo correo con el que se creó la cuenta**. Para este caso funciona perfecto, porque justamente queremos que llegue al Gmail del dueño (la misma cuenta). Si más adelante quieren que el remitente diga algo como `contacto@rootsco.cl` en vez de la dirección genérica de Resend, hay que verificar un dominio propio en su panel (requiere acceso a la configuración DNS del dominio).

## Próximos pasos (fuera del alcance de esta demo)

- Reemplazar los precios placeholder por la lista de precios real del cliente (ver tabla arriba).
- Conseguir fotos de las 4 variantes Mujer de poleras que faltan (Araucaria, Campamento Base, Hit The Road, Combi).
- Conectar Mercado Pago al resto de los productos del catálogo (hoy solo Polera Araucaria está conectada) y al botón "Agregar al carrito" con un carrito real de varios productos.
- Panel de administración para que el cliente cargue productos.
- Definir hosting definitivo (Hostinger u otro) junto al cliente, y hacer el deploy final ahí.
- Actualizar `shopify-theme/` con la marca y catálogo reales, si se retoma esa vía.
