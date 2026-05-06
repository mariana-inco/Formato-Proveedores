import FormularioActualizacionProveedor from "./_componentes/formulario-actualizacion";

const puntosRapidos = [
  "Solo pedimos lo esencial.",
  "El RUT se adjunta en segundos.",
  "La revisión queda más ágil.",
];

export default function Inicio() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f8f4ee_0%,#efe6da_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[-10rem] top-[-8rem] -z-10 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-6rem] top-20 -z-10 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-10rem] left-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
        <aside className="order-2 overflow-hidden rounded-[30px] border border-slate-900/10 bg-slate-950 px-5 py-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] lg:sticky lg:top-6 lg:order-1 lg:self-start lg:px-6 lg:py-7">
          <div className="space-y-4">
            <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
              Guía rápida
            </span>
            <div className="space-y-3">
              <h1 className="max-w-sm text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Actualiza tus datos sin enredos.
              </h1>
              <p className="max-w-md text-sm leading-6 text-white/75">
                Completa lo esencial y adjunta el RUT vigente. Es un formulario
                corto, claro y pensado para terminarlo rápido.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              Lo importante
            </p>
            <ul className="mt-4 space-y-3">
              {puntosRapidos.map((punto) => (
                <li key={punto} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-300" />
                  <span className="leading-6 text-white/80">{punto}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
              Tiempo estimado
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">2 minutos</p>
            <p className="mt-1 text-sm leading-6 text-white/70">
              Sin pasos extra y con una carga de RUT simple.
            </p>
          </div>
        </aside>

        <section className="order-1 lg:order-2">
          <FormularioActualizacionProveedor />
        </section>
      </div>
    </main>
  );
}
