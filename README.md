# Mucamas Chile

**Mucamas Chile** es una aplicación web orientada a captar **reservas y contactos** para servicios de limpieza profesional (hoteles, Airbnb y hogares en Chile). Este repositorio contiene el **MVP**: landing pública, envío de reservas mediante **API Routes** de Next.js y persistencia en **Supabase (PostgreSQL)**, más un **panel admin interno** para revisar reservas, métricas y actualizar estados.

## Objetivo del MVP

- Convertir visitas en **solicitudes de reserva** con datos estructurados.
- Facilitar **contacto por WhatsApp** desde la landing (CTA prominente).
- **Registrar reservas en base de datos** sin exponer claves sensibles al navegador.
- Dar al equipo operativo una **vista admin** con listado, métricas y cambio de estado.

## Enfoque actual

- **Frontend** estático y rápido (App Router, Server/Client Components donde corresponde).
- **Backend ligero** exclusivamente en rutas API del mismo proyecto (sin servidor aparte en esta fase).
- **Autenticación admin provisional**: una clave compartida (`ADMIN_API_KEY`) enviada solo en cabeceras desde el panel; **no** sustituye auth de producción.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | **Next.js** (App Router) |
| Lenguaje | **TypeScript** (modo estricto) |
| Estilos | **Tailwind CSS** v4 |
| Base de datos | **Supabase** · PostgreSQL (cliente servidor con **service role** en API) |
| Runtime UI | **React** 19 |

---

## Funcionalidades implementadas

- **Landing page** premium, responsive y orientada a conversión (hero, servicios, Mucama Express, FAQ, formulario, etc.).
- **Reservas online**: formulario con validación en cliente y envío `POST` a `/api/bookings`.
- **API backend** (Route Handlers): validación de payload, respuestas JSON coherentes y manejo de errores.
- **Persistencia**: inserción de reservas en tabla `bookings` en Supabase (campos alineados a snake_case en BD).
- **Panel admin** en `/admin`: listado de reservas con lectura protegida por cabecera `x-admin-key`.
- **Actualización de estados**: `PATCH /api/admin/bookings/[id]` con estados `new`, `confirmed`, `in_progress`, `completed`, `cancelled`.
- **Dashboard de métricas**: `GET /api/admin/bookings/stats` (totales por estado, total general, reservas “hoy” Chile aproximado y últimos 7 días).

---

## Arquitectura

Flujo principal:

```text
Cliente (navegador)
    →  Landing /admin / fetch JSON
        →  Next.js API Routes (servidor)
            →  Supabase PostgreSQL (service role solo en servidor)
```

- Las **claves secretas** (`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_API_KEY`) solo existen en variables de entorno **del servidor** y se usan dentro de `route.ts` y librerías importadas exclusivamente ahí.
- El navegador solo ve **`NEXT_PUBLIC_*`** (p. ej. URL pública de Supabase si la usas en cliente; el proyecto actual usa sobre todo el cliente admin en servidor para datos sensibles).

---

## Estructura de carpetas relevante

```text
src/
├── app/
│   ├── layout.tsx              # Metadata SEO, fuentes, shell global
│   ├── page.tsx                # Landing principal
│   ├── globals.css             # Tokens Tailwind / tema Mucamas
│   ├── admin/
│   │   └── page.tsx            # Panel admin (/admin)
│   └── api/
│       ├── bookings/
│       │   └── route.ts        # POST reserva pública
│       └── admin/
│           └── bookings/
│               ├── route.ts           # GET listado (admin)
│               ├── stats/
│               │   └── route.ts       # GET métricas (admin)
│               └── [id]/
│                   └── route.ts         # PATCH estado (admin)
├── components/
│   ├── landing/                # Secciones de la landing
│   └── admin/                  # Panel: tabla, stats, estado
├── content/
│   └── landing.ts              # Copy y datos mock de marketing
└── lib/
    ├── bookings/               # Tipos, validación, mapeo → fila DB
    ├── admin/                  # Auth admin, stats, mapeo filas
    ├── supabase/
    │   └── server.ts           # Cliente Supabase servidor (service role)
    └── datetime/
        └── chile.ts            # Helpers día civil Chile (métricas)
```

En la raíz del proyecto también existe **`.env.local.example`** como plantilla de variables (sin valores reales).

---

## Instalación local

Requisitos: **Node.js** compatible con Next.js 16 (recomendado LTS actual).

```bash
npm install
npm run dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000). El panel admin: [http://localhost:3000/admin](http://localhost:3000/admin).

Compilar para producción:

```bash
npm run build
npm run start
```

---

## Variables de entorno

Crea un archivo **`.env.local`** en la raíz (no lo subas al repositorio). Puedes partir de **`.env.local.example`**.

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (pública). |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave **service role**; bypass RLS; **solo servidor** — nunca en el cliente ni en el repo. |
| `ADMIN_API_KEY` | Clave compartida para el panel admin; se envía como cabecera **`x-admin-key`** en las peticiones admin. |

**No incluyas valores reales en documentación ni commits.** Rota las claves si se filtran.

---

## Flujo de reservas (paso a paso)

1. **Cliente** completa el formulario en la landing (`/`).
2. El navegador envía **`POST /api/bookings`** con JSON validado (nombre, teléfono, email, tipo de servicio, etc.).
3. La **API Route** valida el cuerpo, usa el cliente Supabase con **service role** y **inserta** la fila en **`bookings`**.
4. El equipo abre **`/admin`**, ingresa la **`ADMIN_API_KEY`** y consulta **`GET /api/admin/bookings`** (y estadísticas vía **`GET /api/admin/bookings/stats`**).
5. Desde el panel se puede cambiar el estado con **`PATCH /api/admin/bookings/[id]`**, persistiendo el campo **`status`** en la misma tabla.

---

## Contratos API

Todas las respuestas son **JSON**. Los ejemplos usan datos ficticios; **`serviceType`** debe coincidir con un título válido del catálogo en `src/content/landing.ts` (p. ej. `"Airbnb y renta corta"`).

### 1. `POST /api/bookings`

Reserva pública. Sin cabecera admin.

**Request body** (`Content-Type: application/json`):

```json
{
  "serviceType": "Airbnb y renta corta",
  "date": "2026-05-20",
  "time": "10:30",
  "comuna": "Las Condes",
  "address": "Av. Ejemplo 123, depto 405",
  "duration": "4 horas",
  "fullName": "María Pérez",
  "phone": "+56 9 1234 5678",
  "email": "maria.perez@example.com",
  "comments": "Checkout antes de las 12:00"
}
```

**Response `200`** — reserva persistida:

```json
{
  "ok": true,
  "message": "Recibimos tu solicitud. Te contactaremos pronto."
}
```

**Response `400`** — validación fallida (campos requeridos / email / tipo de servicio):

```json
{
  "ok": false,
  "errors": {
    "fullName": ["El nombre es obligatorio."],
    "email": ["Ingresa un email válido."]
  }
}
```

*(También puede devolver `400` con `{ "ok": false, "message": "..." }` si el cuerpo no es JSON válido. Errores de Supabase u otro fallo interno → **`500`** con mensaje genérico.)*

---

### 2. `GET /api/admin/bookings`

Listado de reservas para el panel admin.

**Cabeceras requeridas**

| Cabecera | Valor |
|----------|--------|
| `x-admin-key` | Debe coincidir con `ADMIN_API_KEY` del servidor (ejemplo: `tu-clave-demo-admin`) |
| `Accept` | `application/json` (recomendado) |

**Response `200`**

```json
{
  "ok": true,
  "bookings": [
    {
      "id": "00000000-0000-4000-8000-000000000001",
      "createdAt": "2026-05-15T14:22:00.000Z",
      "serviceType": "Airbnb y renta corta",
      "bookingDate": "2026-05-20",
      "bookingTime": "10:30",
      "comuna": "Las Condes",
      "fullName": "María Pérez",
      "phone": "+56 9 1234 5678",
      "email": "maria.perez@example.com",
      "estado": "new"
    }
  ]
}
```

**Response `401`** — clave ausente o incorrecta:

```json
{
  "ok": false,
  "message": "No autorizado."
}
```

*(Errores de configuración o Supabase pueden responder **`500`**.)*

---

### 3. `PATCH /api/admin/bookings/[id]`

Actualiza la columna **`status`** de una fila en `bookings`. Sustituir `[id]` por el UUID de la reserva.

**Cabeceras requeridas**

| Cabecera | Valor |
|----------|--------|
| `x-admin-key` | Igual que en `GET /api/admin/bookings` |
| `Content-Type` | `application/json` |

**Request body**

```json
{
  "status": "confirmed"
}
```

**Estados permitidos** (`status`)

- `new`
- `confirmed`
- `in_progress`
- `completed`
- `cancelled`

**Response `200`**

```json
{
  "ok": true,
  "booking": {
    "id": "00000000-0000-4000-8000-000000000001",
    "createdAt": "2026-05-15T14:22:00.000Z",
    "serviceType": "Airbnb y renta corta",
    "bookingDate": "2026-05-20",
    "bookingTime": "10:30",
    "comuna": "Las Condes",
    "fullName": "María Pérez",
    "phone": "+56 9 1234 5678",
    "email": "maria.perez@example.com",
    "estado": "confirmed"
  }
}
```

**Response `400`** — JSON inválido o estado no permitido:

```json
{
  "ok": false,
  "message": "Estado no permitido."
}
```

**Response `401`** — misma forma que en el listado admin.

*(Otros casos: **`404`** si no existe la fila; **`500`** si falla la actualización.)*

---

### 4. `GET /api/admin/bookings/stats`

Métricas agregadas (conteos por estado, total, ventanas temporales).

**Cabeceras requeridas**

| Cabecera | Valor |
|----------|--------|
| `x-admin-key` | Igual que en los otros endpoints admin |
| `Accept` | `application/json` (recomendado) |

**Response `200`**

```json
{
  "ok": true,
  "stats": {
    "total": 42,
    "byStatus": {
      "new": 10,
      "confirmed": 8,
      "in_progress": 5,
      "completed": 17,
      "cancelled": 2
    },
    "createdToday": 3,
    "createdLast7Days": 15
  }
}
```

*(Errores de auth → **`401`**; fallos de configuración o consulta → **`500`**.)*

---

## Scripts útiles

| Script | Uso |
|--------|-----|
| `npm run dev` | Servidor de desarrollo con hot reload. |
| `npm run build` | Build de producción (incluye chequeo TypeScript). |
| `npm run start` | Sirve el build localmente. |
| `npm run lint` | ESLint según configuración del proyecto. |

---

## Estado actual del MVP

**Listo**

- Landing comercial y responsive.
- Envío de reservas con API interna y guardado en Supabase.
- Panel admin con listado, métricas, cambio de estado y protección básica por clave.
- Tipado TypeScript y código modular (`lib/`, `components/`).

**Pendiente / mejoras típicas de producto**

- Autenticación robusta (sesiones, roles, SSO, etc.).
- Pagos y facturación.
- Notificaciones automáticas (email/WhatsApp) desde backend confiable.
- Rate limiting y auditoría de acciones admin.
- Tests automatizados (e2e / contratos API).

---

## Roadmap sugerido

1. **Auth real** para admin (y eventualmente clientes): NextAuth, Clerk, Supabase Auth u otro proveedor acorde al modelo de datos.
2. **Pagos** (webpay, Stripe u otros) y estados de pago vinculados a reservas.
3. **Perfiles mucamas** y disponibilidad (skills, comunas, horarios).
4. **Matching** automático o semiautomático entre solicitud y ejecutores.
5. **WhatsApp automatizado** (plantillas, confirmaciones, recordatorios) vía API oficial.
6. **Emails transaccionales** (confirmación al cliente, alertas internas).
7. **Deploy productivo** (Vercel u otro host), variables de entorno en el proveedor, dominio y HTTPS, monitoreo y backups de BD.

---

## Licencia y contribución

Proyecto **privado** (`"private": true` en `package.json`). Ajusta licencia y guías de contribución cuando definas política de equipo.

---

_MVP documentado según el código actual; actualiza este README cuando cambien rutas, contratos de API o el modelo de datos._
