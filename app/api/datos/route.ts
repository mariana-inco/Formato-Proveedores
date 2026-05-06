export async function POST(request: Request) {
  try {
    const tipoContenido = request.headers.get("content-type") ?? "";

    let cuerpo: any = {};

    if (tipoContenido.includes("application/json")) {
      cuerpo = await request.json();
    } else {
      const formData = await request.formData();
      cuerpo = Object.fromEntries(formData.entries());
    }

    console.log("Datos recibidos:", cuerpo);

    return Response.json({
      ok: true,
      mensaje: "Formulario recibido correctamente. Prueba exitosa.",
      datos: cuerpo,
    });
  } catch (error) {
    console.error("Error en /api/datos:", error);

    return Response.json(
      {
        ok: false,
        error: "Error procesando la solicitud.",
      },
      { status: 500 }
    );
  }
}