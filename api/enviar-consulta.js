// Envía la consulta del formulario flotante al correo del dueño del negocio
// usando Resend (resend.com). Requiere dos variables de entorno en Vercel
// (Project Settings -> Environment Variables):
//   RESEND_API_KEY  -> la API key de la cuenta de Resend
//   CONTACT_EMAIL   -> a qué correo debe llegar la consulta (ej. el Gmail del dueño)
//
// El "Responder" del correo que le llega al dueño va directo al correo que
// escribió el cliente en la web (reply_to), así puede contestarle desde su
// propio Gmail sin copiar y pegar nada.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  var apiKey = process.env.RESEND_API_KEY;
  var destino = process.env.CONTACT_EMAIL;
  if (!apiKey || !destino) {
    res.status(500).json({ error: 'Falta configurar RESEND_API_KEY y/o CONTACT_EMAIL en Vercel (Settings -> Environment Variables).' });
    return;
  }

  var body = req.body || {};

  /* Campo trampa: invisible para personas, pero un bot que llena todos los
     inputs del formulario lo va a completar. Si viene con contenido,
     respondemos "éxito" sin mandar nada, para no delatar el filtro. */
  if ((body.empresa || '').toString().trim()) {
    res.status(200).json({ ok: true });
    return;
  }

  var stripControlChars = function (s) { return s.replace(/[\r\n\t]/g, ' '); };

  var nombre = stripControlChars((body.nombre || '').toString().trim()).slice(0, 100);
  var correo = stripControlChars((body.correo || '').toString().trim()).slice(0, 200);
  var mensaje = (body.mensaje || '').toString().trim().slice(0, 3000);

  if (!nombre || !correo || !mensaje) {
    res.status(400).json({ error: 'Completa nombre, correo y mensaje.' });
    return;
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(correo)) {
    res.status(400).json({ error: 'Ingresa un correo válido.' });
    return;
  }

  try {
    var mailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        from: 'roots co. Web <onboarding@resend.dev>',
        to: [destino],
        reply_to: correo,
        subject: 'Consulta desde la web — ' + nombre,
        text: 'De: ' + nombre + ' (' + correo + ')\n\n' + mensaje
      })
    });

    var data = await mailRes.json();

    if (!mailRes.ok) {
      res.status(502).json({ error: (data && data.message) || 'No se pudo enviar el correo.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo contactar al servicio de correo.' });
  }
};
