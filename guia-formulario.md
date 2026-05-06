# Guia del formulario de proveedores

Este archivo resume, en forma corta, que usa este proyecto y para que sirve cada pieza.

El objetivo es actualizar datos de proveedores de forma rapida, clara y con una carga sencilla del RUT.

## Lo que usamos

- `Next.js`: organiza la pagina, el layout general y la estructura de la app.
- `React`: maneja la parte interactiva del formulario, como estados y cambios en pantalla.
- `TypeScript`: ayuda a mantener el codigo mas ordenado y con menos errores.
- `Tailwind CSS`: define estilos, espaciados, colores y comportamiento responsive sin crear hojas CSS largas.
- `react-dropzone`: permite subir el RUT con arrastrar y soltar, o buscando el archivo desde el equipo.

## Archivos principales

- `app/page.tsx`: arma la pantalla principal y reparte el espacio entre el bloque informativo y el formulario.
- `app/_componentes/formulario-actualizacion.tsx`: contiene el formulario, los campos, la carga del RUT y el guardado de datos.
- `app/api/datos/route.ts`: recibe la información y la guarda en `datos.json`.
- `datos.json`: guarda cada registro enviado desde el formulario.
- `app/globals.css`: deja la base visual del proyecto, como tipografia, fondo y reglas globales.
- `app/layout.tsx`: define la estructura global y los metadatos de la pagina.
- `next.config.ts`: guarda ajustes del proyecto para Next.js.

## Que hace cada parte del formulario

- Informacion de la empresa: valida el nombre con el que esta registrado el proveedor.
- Datos de contacto: permite guardar quien responde por la ficha y como localizarlo.
- Carga de documentos: adjunta el RUT con estados de vacio, cargado o error.
- Guardado en JSON: junta los datos, los envía al servidor y los deja en `datos.json`.

## Flujo simple

1. La persona completa los datos basicos.
2. Adjunta el RUT.
3. Revisa que todo este correcto.
4. Guarda la informacion en `datos.json` y revisa la consola si quieres ver el registro.

## Nota rapida

La idea de este formato es que se sienta corto, claro y facil de completar, sin elementos que distraigan.
