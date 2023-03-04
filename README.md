# project3-frontNotas

Este proyecto (App de notas de texto) se compone de dos aplicaciones:

- proyecto_appnotas (Backend, donde esta la funcionalidad interna del proyecto)
- project3-frontNotas (Frontend, donde esta la aplicación donde permite que el usuario interactue a través del browser)

## Anónimo:

- Login: usando email + contraseña
- Registro: pide email + contraseña

## Usuarios Registrados:

- Ver su listado de notas (en el listado sólo se ven los títulos)
- Visualizar una nota
- Crear una nota: título, texto y categoría única (las categorías son fijas, no se pueden
  editar).
- Modificar sus notas: título, texto y categoría
- Eliminar una nota

## Funcionalidades extras de NOTA

- Marcar una nota como pública:
  Por defecto todas las notas son privadas y solo puede verlas el usuario que las
  creó, pero sí una nota se marca como pública esta se puede ver por cualquier
  usuario esté registrado y logueado en la aplicación o no.
  Las notas públicas sólo se puede acceder si se conoce la URL.
- Imagen: Se puede asociar una imagen (única) a cada nota.

# INSTALAR

- Para ver un funcionamiento completo de la aplicación deben estar inicializado el Backend y el Frontend de la aplicación.

- Instalar las dependencias necesarias mediante el comando `npm i`o `npm install`.

- Ejecutar `npm run dev` para lanzar el Backend.

- Ejecutar `npm start` para iniciar el Frontend .

- Ejecutar `npm i react - router - dom ` para instalar las rutas de la app.
