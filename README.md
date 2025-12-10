# Proyecto: todo_list_miercoles

Estructura separada de `backend/` y `frontend/` con scripts para desarrollo.

Requisitos:
- Node.js (>=18 recomendado)

Instalación (desde PowerShell en Windows):

```powershell
# En la raíz del proyecto (instala dependencias necesarias para los scripts raíz)
npm install

# Instalar dependencias de backend y frontend (opcional si quieres instalarlas por separado)
cd backend; npm install; cd ..
cd frontend; npm install; cd ..
```

Variables de entorno:
- Copia `backend/.env.example` a `backend/.env` y rellena las variables (no subir `.env` al repositorio).

Comandos útiles:
- Ejecutar backend en desarrollo (con recarga):
  - `npm --prefix backend run dev`
- Ejecutar frontend en desarrollo:
  - `npm --prefix frontend run dev`
- Ejecutar ambos en paralelo (desde la raíz):
  - `npm run dev`
- Construir frontend:
  - `npm --prefix frontend run build`

Notas:
- Se movieron las dependencias y configuración de servidor al `backend`.
- Se eliminó la dependencia `mysql2` del `frontend`.
- Asegúrate de no subir credenciales reales al repositorio.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
