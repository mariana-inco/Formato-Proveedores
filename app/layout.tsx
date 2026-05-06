import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Actualización de Datos de Proveedores",
  description:
    "Formulario para actualizar datos de proveedores y adjuntar el RUT con facilidad.",
};

export default function DisenoPrincipal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
