# README del proyecto

Aplicacion Laravel 13 + React 19 con Vite y TypeScript.

## Comandos iniciales
Ejecútalos en una terminal dentro del contenedor (terminal de VSC o Docker).

Generar `APP_KEY` y luego asignarla en `.env` (Deben crearlo en base al `.env.example`):

```bash
php artisan key:generate --show
```

Corrección de permisos:

```bash
chown -R www-data:www-data /var/www/app
chmod -R 775 /var/www/app/storage
chmod -R 775 /var/www/app/bootstrap/cache/
```

Ejecutar migracion inicial:

```bash
php artisan tinker --execute="DB::statement(\"CREATE SCHEMA IF NOT EXISTS laravel\")"
php artisan migrate
```
# Librerias incluidas:

## Principales

- `laravel/framework`: framework backend principal.
- `inertiajs/inertia-laravel` + `@inertiajs/react`: puente Laravel-React sin API REST tradicional.
- `laravel/sanctum`: autenticacion para SPA/API.
- `laravel/telescope`: inspeccion de requests, jobs, logs y queries.
- `laravel/pulse`: metricas y monitoreo de rendimiento.
- `react`: libreria base de UI.
- `vite` + `laravel-vite-plugin`: bundling y desarrollo frontend.
- `typescript`: tipado estatico en frontend.
- `tailwindcss`: utilidades CSS.
- `@mui/material`: componentes UI listos para uso.
- `@radix-ui/*`: primitivas UI accesibles (avatar, dialog, select, tooltip, etc).

## Datos y tablas

- `@tanstack/react-query`: cache y sincronizacion de datos remotos.
- `@tanstack/react-table`: construccion de tablas complejas.
- `@tanstack/react-virtual`: virtualizacion para listas/tablas grandes.

## Visuales y UX

- `chart.js` + plugins: graficos y anotaciones.
- `lucide-react` + `@fortawesome/fontawesome-free` + `bootstrap-icons`: iconografia.
- `toastr`: notificaciones toast.
- `react-dropzone` + `dropzone`: carga de archivos drag and drop.
- `signature_pad`: captura de firmas en canvas.

## Backend

- `maatwebsite/excel`: importacion/exportacion Excel/CSV.
- `barryvdh/laravel-dompdf` + `iio/libmergepdf` + `spatie/pdf-to-image`: generacion, union y conversion de PDFs.
- `predis/predis`: cliente Redis para cache/colas/sesiones.
- `simplesoftwareio/simple-qrcode`: generacion de codigos QR.
- `tightenco/ziggy`: uso de rutas Laravel en JavaScript.

## Desarrollo y testing

- `phpunit/phpunit`: pruebas unitarias e integracion.
- `laravel/dusk`: pruebas end-to-end.
- `mockery/mockery`: mocks para pruebas.
- `fakerphp/faker`: datos fake para tests y seeders.
- `nunomaduro/collision`: mejor salida de errores en consola.
- `laravel/pail`: visor en tiempo real de logs.
- `laravel/breeze` + `laravel/ui`: scaffolding de autenticacion y UI base.


## Normas gráficas

La documentación visual y el catálogo de assets viven en:

- [Normas gráficas y assets](./docs/normas-graficas.md)
---
---
# Sistema de gestión de red de contactos y licitaciones AVA

## Stack Tecnológico

Laravel Version

PostgreSQL Version

TailwindCSS

- **Backend / Framework:** Laravel 13.x (PHP 8.x)
- **Frontend / Estilos:**  React con TypeScript e inertia, Tailwind CSS
- **Base de Datos:** PostgreSQL
- **Entorno de Ejecución:** Contenedor Docker Independiente

---

## 📂 Estructura de la Documentación Tecnica

Para mantener la consistencia del proyecto, toda la especificación técnica, reglas de negocio y acuerdos se encuentran centralizados en la carpeta `docs/`:

- 📄 Especificación de Requisitos — Definición de Requisitos Funcionales (RF) y No Funcionales (RNF).
- 📄 Funcionalidades e Historias de Usuario — Desglose de módulos, lógica de negocio y Casos de Uso.
- 📄 Criterios de Aceptación — Reglas de validación, formatos y definición de "Hecho" (DoD).
- 📁 Minutas y Actas de Reuniones — Historial de acuerdos semanales, hitos académicos y sesiones de diseño técnico.

---

## ⚙️ Compatibilidad e Infraestructura

Este software está diseñado, probado y garantizado para funcionar sobre el entorno **Docker independiente** facilitado por la empresa. El código de este repositorio debe ser montado en el volumen correspondiente de dicho contenedor para interactuar correctamente con los servicios de red y base de datos preconfigurados.

---

## Guía de Despliegue e Inicialización

Siga estos pasos para integrar e inicializar el código de Ava dentro del entorno de ejecución:

### 1. Clonar el repositorio

Clone este código dentro de la ruta local destinada a los volúmenes del Docker:

```bash
git clone <https://github.com/AVA-UCSC/laravel-p2-2026.git>
cd sistema-gestion-contactos
```

### 2. Configurar variables de entorno

Copie el archivo de plantilla  ```.env.example``` para crear el archivo de configuración

```bash
cp .env.example .env
```

>[!IMPORTANT] Modifique el archivo .env recién creado >para que las credenciales de conexión coincidan >exactamente con los parámetros del contenedor Postgres >dela empresa. (DB_HOST,DB_PORT,DB_USERNAME, DB_PASSWORD).
 

### 3. Comandos de inicialización

Una vez que el contenedor de desarrollo esté arriba, acceda a la terminal y ejecute los siguientes comandos para preparar Laravel

```bash
php artisan key:generate
php artisan migrate --seed
```

Para la compilación de la interfaz (Tailwind CSS)

```bash
npm install #Instala los paquetes de Node.js
npm run build
```