# Guia del formulario de proveedores

Este archivo resume, en forma corta, qué usa este proyecto y para qué sirve cada pieza.

El objetivo es actualizar datos de proveedores de forma rápida, clara y con una carga sencilla del RUT.

## Lo que usamos

- `Next.js`: organiza la página, el layout general y la estructura de la app.
- `React`: maneja la parte interactiva del formulario, como estados y cambios en pantalla.
- `TypeScript`: ayuda a mantener el código más ordenado y con menos errores.
- `Tailwind CSS`: define estilos, espaciados, colores y comportamiento responsive sin crear hojas CSS largas.
- `react-dropzone`: permite subir el RUT con arrastrar y soltar, o buscando el archivo desde el equipo.

## Archivos principales

- `app/page.tsx`: arma la pantalla principal y reparte el espacio entre el bloque informativo y el formulario.
- `app/_componentes/formulario-actualizacion.tsx`: contiene el formulario, los campos, la carga del RUT y el guardado de datos.
- `app/api/datos/route.ts`: recibe la información y la guarda en `datos.json`.
- `datos.json`: guarda cada registro enviado desde el formulario.
- `app/globals.css`: deja la base visual del proyecto, como tipografía, fondo y reglas globales.
- `app/layout.tsx`: define la estructura global y los metadatos de la página.
- `next.config.ts`: guarda ajustes del proyecto para Next.js.

## Qué hace cada parte del formulario

- Información de la empresa: valida que el nombre solo tenga letras y espacios.
- Datos de contacto: valida que el nombre del contacto solo tenga letras y espacios, el teléfono solo números y el correo tenga `@` y un dominio válido.
- Carga de documentos: adjunta el RUT con estados de vacío, cargado o error.
- Guardado en JSON: junta los datos, los envía al servidor y guarda el registro en `datos.json`.

## Validaciones importantes

- El botón de envío se deshabilita si faltan campos obligatorios.
- Se muestra un mensaje claro indicando qué campos faltan completar.
- El correo debe contener `@` y un dominio para poder enviar la actualización.
- El nombre de la empresa y el nombre del contacto no aceptan números ni caracteres especiales.

## Flujo simple

1. La persona completa los datos básicos.
2. Adjunta el RUT.
3. Revisa que todo esté correcto y que no haya mensajes de error.
4. Envía la información y se guarda en `datos.json`.

## Nota rápida

La idea de este formato es que se sienta corto, claro y fácil de completar, sin elementos que distraigan.
