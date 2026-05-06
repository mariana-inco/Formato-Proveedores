"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";

type EstadoRut = "vacio" | "activo" | "cargado" | "error";

type DatosProveedor = {
  empresa: string;
  contacto: string;
  celular: string;
  fijo: string;
  email: string;
  rut: {
    nombre: string;
    tipo: string;
    tamanoBytes: number;
  } | null;
};

type CampoTextoProps = {
  claseContenedor?: string;
  htmlFor: string;
  etiqueta: string;
  nombre: string;
  tipo: "text" | "tel" | "email";
  placeholder?: string;
  autoComplete?: string;
  requerido?: boolean;
};

const formatosPermitidosRut: Accept = {
  "application/pdf": [".pdf"],
  "image/*": [".jpg", ".jpeg", ".png", ".webp"],
};

const tamanoMaximoRut = 10 * 1024 * 1024;
const descripcionRutId = "rut-ayuda";
const errorRutId = "rut-error";

const claseCampoEntrada =
  "mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/60";
const claseSeccionFormulario =
  "space-y-4 rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:p-5";
const claseBotonSecundario =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/60";

function CampoTexto({
  claseContenedor = "",
  htmlFor,
  etiqueta,
  nombre,
  tipo,
  placeholder,
  autoComplete,
  requerido = false,
}: CampoTextoProps) {
  const manejarEntrada = (evento: React.FormEvent<HTMLInputElement>) => {
    const input = evento.currentTarget;
    const valor = input.value;

    if (nombre === "celular" || nombre === "fijo") {
      input.value = valor.replace(/\D/g, "");
    }
    else if (nombre === "contacto" || nombre === "empresa") {
      input.value = valor.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, "");
    }
  };

  return (
    <div className={claseContenedor}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700">
        {etiqueta}
        {requerido ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        type={tipo}
        id={htmlFor}
        name={nombre}
        autoComplete={autoComplete}
        required={requerido}
        placeholder={placeholder}
        className={claseCampoEntrada}
        onInput={manejarEntrada}
        pattern={nombre === "email" ? "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" : undefined}
      />
    </div>
  );
}

function formatearTamano(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const unidades = ["KB", "MB", "GB"];
  let tamano = bytes / 1024;
  let indiceUnidad = 0;

  while (tamano >= 1024 && indiceUnidad < unidades.length - 1) {
    tamano /= 1024;
    indiceUnidad += 1;
  }

  const precision = indiceUnidad === 0 || tamano >= 10 ? 0 : 1;
  return `${tamano.toFixed(precision)} ${unidades[indiceUnidad]}`;
}

function resumirRechazoDeArchivo(rechazos: FileRejection[]) {
  const codigos = rechazos.flatMap((rechazo) =>
    rechazo.errors.map((error) => error.code),
  );

  if (codigos.includes("file-too-large")) {
    return "El RUT supera el límite de 10 MB.";
  }

  if (codigos.includes("file-invalid-type")) {
    return "El RUT debe ser PDF, JPG, JPEG, PNG o WEBP.";
  }

  return "No pudimos adjuntar el archivo. Revisa el formato e inténtalo de nuevo.";
}

function obtenerTexto(formulario: FormData, nombreCampo: string) {
  return String(formulario.get(nombreCampo) ?? "").trim();
}

export default function FormularioActualizacionProveedor() {
  const [archivoRut, setArchivoRut] = useState<File | null>(null);
  const [mensajeRut, setMensajeRut] = useState<string | null>(null);
  const [mensajeGuardado, setMensajeGuardado] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [claveEntradaRut, setClaveEntradaRut] = useState(0);
  const [formularioValido, setFormularioValido] = useState(false);
  const referenciaFormulario = useRef<HTMLFormElement | null>(null);

  function validarFormulario() {
    const formularioActual = referenciaFormulario.current;
    if (!formularioActual) return false;

    const formulario = new FormData(formularioActual);
    const empresa = obtenerTexto(formulario, "empresa");
    const contacto = obtenerTexto(formulario, "contacto");
    const celular = obtenerTexto(formulario, "celular");
    const email = obtenerTexto(formulario, "email");

    const emailValido = email.length > 0 && email.includes("@") && email.includes(".");

    return empresa.length > 0 && contacto.length > 0 && celular.length > 0 && emailValido;
  }

  const manejarCambioFormulario = () => {
    setFormularioValido(validarFormulario());
  };

  const manejarArrastre = useCallback(
    (archivosAceptados: File[], rechazosDeArchivo: FileRejection[]) => {
      if (archivosAceptados[0]) {
        setArchivoRut(archivosAceptados[0]);
        setMensajeRut(null);
        setMensajeGuardado(null);
        return;
      }

      if (rechazosDeArchivo.length > 0) {
        setArchivoRut(null);
        setMensajeRut(resumirRechazoDeArchivo(rechazosDeArchivo));
      }
    },
    [],
  );

  const {
    getRootProps: obtenerPropsRaiz,
    getInputProps: obtenerPropsEntrada,
    isDragActive: arrastreActivo,
    isDragAccept: arrastreAceptado,
    isDragReject: arrastreRechazado,
    open: abrirSelector,
  } = useDropzone({
    accept: formatosPermitidosRut,
    maxFiles: 1,
    maxSize: tamanoMaximoRut,
    multiple: false,
    noClick: true,
    onDrop: manejarArrastre,
  });

  function quitarRut() {
    setArchivoRut(null);
    setMensajeRut(null);
    setMensajeGuardado(null);
    setClaveEntradaRut((valor) => valor + 1);
  }

  async function manejarGuardado() {
    const formularioActual = referenciaFormulario.current;

    if (!formularioActual) {
      return;
    }

    if (!validarFormulario()) {
      setMensajeGuardado("Por favor, completa todos los campos requeridos (*) antes de enviar.");
      return;
    }

    setEnviando(true);
    setMensajeGuardado(null);

    const formulario = new FormData(formularioActual);
    const datosProveedor: DatosProveedor = {
      empresa: obtenerTexto(formulario, "empresa"),
      contacto: obtenerTexto(formulario, "contacto"),
      celular: obtenerTexto(formulario, "celular"),
      fijo: obtenerTexto(formulario, "fijo"),
      email: obtenerTexto(formulario, "email"),
      rut: archivoRut
        ? {
            nombre: archivoRut.name,
            tipo: archivoRut.type || "sin tipo",
            tamanoBytes: archivoRut.size,
          }
        : null,
    };

    try {
      const respuesta = await fetch("/api/datos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosProveedor),
      });

      const resultado = (await respuesta.json()) as {
        mensaje?: string;
        error?: string;
        registro?: DatosProveedor & { fechaGuardado: string };
      };

      if (!respuesta.ok) {
        throw new Error(
          resultado.error || resultado.mensaje || "No se pudo guardar.",
        );
      }

      console.log("Datos guardados en datos.json:", resultado.registro);

      formularioActual.reset();
      setArchivoRut(null);
      setMensajeRut(null);
      setClaveEntradaRut((valor) => valor + 1);
      setMensajeGuardado("Datos guardados en datos.json. Revisa la consola.");
    } catch (error) {
      setMensajeGuardado(
        error instanceof Error
          ? error.message
          : "No pudimos guardar la información.",
      );
    } finally {
      setEnviando(false);
    }
  }

  const estadoRut: EstadoRut = mensajeRut
    ? "error"
    : archivoRut
      ? "cargado"
      : arrastreRechazado
        ? "error"
        : arrastreAceptado || arrastreActivo
          ? "activo"
          : "vacio";

  const configuracionRut = {
    vacio: {
      borde:
        "border-slate-300 bg-white/85 hover:border-amber-300 hover:bg-amber-50/40",
      titulo: "Arrastra o selecciona el RUT",
      subtitulo: "PDF, JPG, JPEG, PNG o WEBP. Máximo 10 MB.",
    },
    activo: {
      borde: "border-amber-400 bg-amber-50/80 shadow-[0_0_0_1px_rgba(245,158,11,0.12)]",
      titulo: "Suelta el archivo aquí",
      subtitulo: "PDF, JPG, JPEG, PNG o WEBP. Máximo 10 MB.",
    },
    cargado: {
      borde: "border-emerald-300 bg-emerald-50/80 shadow-[0_0_0_1px_rgba(16,185,129,0.12)]",
      titulo: "RUT cargado",
      subtitulo: "Tu RUT está listo para enviarse.",
    },
    error: {
      borde: "border-rose-400 bg-rose-50/80 shadow-[0_0_0_1px_rgba(244,63,94,0.12)]",
      titulo: "Revisa el archivo",
      subtitulo: "Corrige el archivo y vuelve a intentarlo.",
    },
  } satisfies Record<
    EstadoRut,
    { borde: string; titulo: string; subtitulo: string }
  >;

  const rutinaRut = configuracionRut[estadoRut];
  const textoBotonArchivo = archivoRut ? "Cambiar archivo" : "Buscar archivo";

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-600">
          Actualización de proveedor
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Completa y envía la actualización
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Toma menos de 2 minutos. Los campos con * son obligatorios y el RUT se
          adjunta al final.
        </p>
      </div>

      <form
        ref={referenciaFormulario}
        className="space-y-4 px-5 py-5 sm:px-6"
        action="/api/datos"
        method="post"
        encType="multipart/form-data"
        onChange={manejarCambioFormulario}
        onSubmit={(evento) => {
          evento.preventDefault();
          void manejarGuardado();
        }}
      >
        <section className={claseSeccionFormulario}>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
              Información de la empresa
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              Confirma el nombre con el que te tenemos registrado.
            </p>
          </div>

          <CampoTexto
            htmlFor="empresa"
            etiqueta="Nombre de la empresa"
            nombre="empresa"
            tipo="text"
            placeholder="Ej. Dromos Pavimentos S.A.S."
            autoComplete="organization"
            requerido
          />
        </section>

        <section className={claseSeccionFormulario}>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
              Datos de contacto
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              Usaremos esta información para confirmar tu ficha.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CampoTexto
              claseContenedor="md:col-span-2"
              htmlFor="contacto"
              etiqueta="Nombre del contacto"
              nombre="contacto"
              tipo="text"
              placeholder="Nombre y apellido"
              autoComplete="name"
              requerido
            />

            <CampoTexto
              htmlFor="celular"
              etiqueta="Teléfono celular"
              nombre="celular"
              tipo="tel"
              placeholder="300 123 4567"
              autoComplete="tel"
              requerido
            />

            <CampoTexto
              htmlFor="fijo"
              etiqueta="Teléfono fijo"
              nombre="fijo"
              tipo="tel"
              placeholder="601 123 4567"
              autoComplete="tel"
            />

            <CampoTexto
              claseContenedor="md:col-span-2"
              htmlFor="email"
              etiqueta="Correo electrónico"
              nombre="email"
              tipo="email"
              placeholder="nombre@empresa.com"
              autoComplete="email"
              requerido
            />
          </div>
        </section>

        <section className={claseSeccionFormulario}>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
              Carga de documentos
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              Adjunta un solo archivo del RUT, vigente y legible.
            </p>
          </div>

          <div
            {...obtenerPropsRaiz({
              className: [
                "rounded-[26px] border-2 border-dashed p-4 transition-all duration-300 sm:p-5",
                rutinaRut.borde,
              ].join(" "),
              role: "group",
              "aria-label": "Zona para adjuntar el RUT",
              "aria-describedby": mensajeRut
                ? `${descripcionRutId} ${errorRutId}`
                : descripcionRutId,
              "aria-invalid": estadoRut === "error" ? true : undefined,
            })}
          >
            <input
              key={claveEntradaRut}
              {...obtenerPropsEntrada({ name: "rut" })}
            />

            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    RUT
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-slate-950 sm:text-lg">
                      {rutinaRut.titulo}
                    </h4>
                    <p
                      id={descripcionRutId}
                      className="text-sm leading-6 text-slate-600"
                    >
                      {rutinaRut.subtitulo}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <button
                    type="button"
                    onClick={abrirSelector}
                    className={claseBotonSecundario}
                  >
                    {textoBotonArchivo}
                  </button>
                  {archivoRut ? (
                    <button
                      type="button"
                      onClick={quitarRut}
                      className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:-translate-y-0.5 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200/60"
                    >
                      Quitar
                    </button>
                  ) : null}
                </div>
              </div>

              {archivoRut ? (
                <div className="rounded-[22px] border border-emerald-200 bg-white/95 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xs font-semibold text-emerald-700">
                        RUT
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {archivoRut.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatearTamano(archivoRut.size)} · Listo para enviar
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Cargado
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                  Arrastra el archivo o usa el botón para buscarlo en tu equipo.
                </div>
              )}

              {mensajeRut ? (
                <div
                  id={errorRutId}
                  className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"
                >
                  {mensajeRut}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm leading-6 text-slate-500">
              Revisa los datos antes de enviar.
            </p>
            {mensajeGuardado ? (
              <p className="text-sm font-medium text-emerald-700">
                {mensajeGuardado}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => void manejarGuardado()}
            disabled={enviando || !formularioValido}
            className="inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_16px_30px_rgba(245,158,11,0.28)] transition hover:-translate-y-0.5 hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/80 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {enviando ? "Guardando..." : "Enviar Actualización"}
          </button>
        </div>
      </form>
    </div>
  );
}
