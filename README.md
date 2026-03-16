# Proyecto Angular

Este proyecto fue desarrollado con Angular por Leonardo Sanabria.

## Requisitos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

- Node.js
- npm
- Angular CLI

Puedes validar las versiones con:

```bash
node -v
npm -v
ng version
```

## Instalación

Instala las dependencias del proyecto con:

```bash
npm install
```

## Ejecutar la aplicación

Para iniciar la aplicación en modo desarrollo, usa:

```bash
ng serve
```

Luego abre tu navegador en:

```bash
http://localhost:4200/
```

## Formatear el código

Para formatear el proyecto con Prettier, ejecuta:

```bash
npm run format
```

## Despliegue

Para este proyecto, una opción de despliegue sería:

- Generar la build de producción con:

```bash
ng build --configuration production
```

- Publicar los archivos generados en la carpeta `dist/` en una plataforma de hosting estático o servidor web.

### Estrategia sugerida

Se podría desplegar en alguna de estas opciones:

- **Vercel** o **Netlify** para una aplicación frontend estática.
- **Firebase Hosting** si se desea una integración sencilla y rápida.
- **NGINX en un VPS** si se requiere un despliegue más controlado y personalizado.

### Flujo general de despliegue

1. Ejecutar la build de producción.
2. Validar que los archivos se generen correctamente en `dist/`.
3. Configurar la plataforma elegida para servir el contenido estático.
4. En caso de usar rutas de Angular, configurar redirección al `index.html`.
5. Validar funcionamiento final en ambiente productivo.


### Evidencia en video

Hay un pequeño video con la demostración del video en la raíz del proyecto