# Monorepo: Backend (NestJS) + Frontend (Angular)

- `backend/`: API REST con NestJS + TypeORM (MySQL) + JWT Auth
- `frontend/`: Aplicación Angular que consume la API

A continuación se explican los pasos para instalar dependencias, configurar variables de entorno y ejecutar ambos servicios en desarrollo.

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm
- MySQL

## Estructura del repo

- `backend/` Código del servidor NestJS
- `frontend/` Código del cliente Angular 20
- `.gitignore` a nivel raíz para ignorar artefactos de ambos proyectos

## Configuración del Backend

1) Copia las variables de entorno de ejemplo de .env.example y ajústalas a tu entorno:

2) Edita `backend/.env` con tus credenciales de MySQL y valores de JWT. Variables clave:

- DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
- JWT_SECRET
- PORT (por defecto 3000)
- TYPEORM_SYNC (true en dev para auto-sync)

3) Instala dependencias del backend:

```powershell
cd backend; npm install
```

4) Levanta el backend en desarrollo:

```powershell
cd backend; npm run start:dev
```

La API se expone por defecto en `http://localhost:3000`.

## Configuración del Frontend

1) Instala dependencias del frontend:

```powershell
cd frontend; npm install
```

2) Arranca el servidor de desarrollo de Angular:

```powershell
cd frontend; ng serve
```

El frontend corre por defecto en `http://localhost:4200` y está configurado para consumir la API en `http://localhost:3000` (ver `src/app/tokens.ts`). Si cambias el puerto del backend, actualiza ese archivo o provee un token alternativo en la configuración de la app.

## Flujo de Autenticación y Tareas

- Registro: POST `/auth/register` con `{ email, password }`
- Login: POST `/auth/login` devuelve `{ access_token }`
- CRUD de tareas en `/tasks` (requiere header `Authorization: Bearer <token>`)