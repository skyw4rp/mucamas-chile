# Estado del proyecto · Mucamas Chile

Documento vivo para **retomar el MVP** con contexto rápido: qué existe hoy, cómo corre y qué falta.  
**No incluye secretos:** sustituir enlaces y valores sensibles fuera de este archivo.

**Última referencia de código:** revisar `README.md`, contratos en README y rutas bajo `src/app/api/`.

---

## 1. Resumen ejecutivo del MVP

Mucamas Chile es una **landing + captación de reservas** para servicios de limpieza (hoteles, Airbnb, hogares). El MVP permite:

- Presentación comercial en **`/`**.
- **Envío de reservas** vía `POST /api/bookings` con persistencia en **Supabase (PostgreSQL)**.
- **Notificación por email al equipo** tras guardar la reserva (**Resend**), sin bloquear la respuesta si el correo falla.
- **Panel interno** en **`/admin`** (clave compartida `ADMIN_API_KEY`) para listar reservas, ver métricas y actualizar **estado** (`status`).

Objetivo de negocio: **convertir visitas en solicitudes estructuradas** y dar visibilidad operativa mínima sin auth enterprise todavía.

---

## 2. Estado actual del proyecto

| Área | Estado |
|------|--------|
| Código en repo | MVP funcional en desarrollo local |
| Tests automatizados | No implementados de forma sistemática |
| Auth admin | Solo cabecera **`x-admin-key`** (no sesiones ni SSO) |
| Deploy productivo | **Completar según equipo** (ver §6) |

El proyecto compila con **`npm run build`** y pasa **`npm run lint`** según configuración actual del repo.

---

## 3. Funcionalidades implementadas

- **Landing** responsive (hero, servicios, Mucama Express, cómo funciona, FAQ, formulario, footer).
- **Formulario de reserva** → **`POST /api/bookings`** (validación server-side).
- **Supabase**: inserción en tabla **`bookings`** (mapeo camelCase API → snake_case DB).
- **Email**: notificación al equipo con **Resend** tras insert exitoso (`src/lib/email/`).
- **Admin**: `GET /api/admin/bookings`, `PATCH /api/admin/bookings/[id]`, `GET /api/admin/bookings/stats`.
- **UI admin**: tabla / tarjetas móvil, badges por estado, selector de estado, strip de métricas.

---

## 4. Arquitectura actual

```text
Navegador (landing /admin)
    → Next.js App Router (React 19)
        → API Routes (Route Handlers)
            → Supabase PostgreSQL (service role en servidor)
            → Resend (solo tras reserva guardada; opcional según env)
```

- **Secretos** (`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_API_KEY`, `RESEND_API_KEY`) solo en **servidor** / variables de entorno del host.
- **`NEXT_PUBLIC_*`** solo para valores pensados para exponerse al cliente (p. ej. URL pública de Supabase).

---

## 5. Stack tecnológico

| Componente | Versión / notas (referencia `package.json`) |
|------------|-----------------------------------------------|
| Next.js | App Router · ~16.x |
| React | ~19.x |
| TypeScript | Modo estricto |
| Tailwind CSS | v4 |
| Supabase | Cliente JS (`@supabase/supabase-js`) · PostgreSQL |
| Resend | SDK Node (`resend`) · emails transaccionales |
| ESLint | `eslint-config-next` |

---

## 6. Estado del deploy

**Definir con el equipo.** Este repo no fija un deploy único.

Recomendación habitual para este stack:

- **Frontend + API Routes:** Vercel (u otro host compatible con Next.js 16).
- **BD:** Supabase (proyecto ya enlazado por URL y keys).

Acciones típicas antes de producción:

- Crear proyecto/hosting y enlazar el repo.
- Configurar **todas** las variables de entorno en el panel del host (sin commitear `.env.local`).
- Verificar dominio en **Resend** para `from` (no depender solo de `onboarding@resend.dev`).
- Revisar **RLS** y políticas en Supabase si en el futuro se expone el cliente anon.

---

## 7. Variables de entorno utilizadas

Plantilla en **`.env.local.example`**. Lista esperada:

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Cliente servidor (insert/list/update admin); **nunca en cliente** |
| `ADMIN_API_KEY` | Protege rutas `/api/admin/*` vía cabecera **`x-admin-key`** |
| `RESEND_API_KEY` | Envío de correos desde el servidor |
| `BOOKING_NOTIFICATION_EMAIL` | Destino de la notificación de nueva reserva |
| `RESEND_FROM` | *(Opcional en código)* remitente verificado; si no existe, se usa valor por defecto de desarrollo Resend |

**No pegar valores reales en `PROJECT_STATUS.md` ni en commits.**

---

## 8. Flujo actual del sistema

1. Usuario completa el formulario en **`/`**.
2. Cliente hace **`POST /api/bookings`** con JSON validado.
3. Servidor inserta fila en **`bookings`** (Supabase).
4. Si el insert OK → intenta **email** al equipo (Resend); fallos solo en **log**.
5. Respuesta **200** al cliente si la reserva se guardó (independiente del email).
6. Operador entra a **`/admin`**, envía **`x-admin-key`**, consulta listado y estadísticas; puede **`PATCH`** para cambiar **`status`**.

Estados permitidos: `new`, `confirmed`, `in_progress`, `completed`, `cancelled`.

---

## 9. Funcionalidades pendientes

- Autenticación real para admin (sesiones, rol, OAuth, etc.).
- Pagos y conciliación con reservas.
- Rate limiting / anti-abuso en `POST /api/bookings`.
- Tests (unitarios, contrato API, e2e).
- Observabilidad (logs estructurados, alertas).
- Internacionalización si el producto sale de Chile.
- **`RESEND_FROM`** y dominio verificado documentados en README cuando existan valores de equipo.

---

## 10. Riesgos o consideraciones

- **`ADMIN_API_KEY`**: si filtra, cualquiera con la clave accede al panel y APIs admin; rotar y usar auth robusta en producción.
- **`SUPABASE_SERVICE_ROLE_KEY`**: bypass RLS; mantener solo en servidor y rotar si comprometida.
- **Emails**: si Resend falla o env está incompleto, la reserva **sí** queda guardada; el equipo debe revisar la BD o logs.
- **Conteos “hoy” en stats**: basados en día civil Chile con offset fijo en código; revisar si se necesita precisión DST/regional avanzada.
- **`serviceType`**: debe coincidir con catálogo en `src/content/landing.ts`; cambios de copy pueden romper validación hasta alinear lista servidor/cliente.

---

## 11. Próximos pasos recomendados

1. Completar **deploy** (Vercel + env vars) y smoke test end-to-end (formulario → Supabase → email → admin).
2. Verificar **dominio Resend** y fijar **`RESEND_FROM`** en producción.
3. Definir **backup / retención** y políticas Supabase.
4. Sustituir auth admin por solución de producto (Supabase Auth, Clerk, etc.).
5. Añadir **monitoring** y página de estado interna si aplica.

---

## 12. Ideas futuras

- WhatsApp automatizado (confirmaciones, plantillas Meta).
- Recordatorios por email al cliente.
- Portal mucamas (disponibilidad, matching, pagos).
- Integración calendario / CRM.

---

## 13. Cómo ejecutar el proyecto localmente

```bash
npm install
cp .env.local.example .env.local   # Windows: copiar manualmente y editar
# Editar .env.local con valores de desarrollo (sin subir al repo)

npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)  
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Otros scripts: `npm run build`, `npm run start`, `npm run lint`.

---

## 14. Cómo hacer deploy

1. Conectar el repositorio al proveedor (ej. **Vercel**).
2. Framework preset: **Next.js**.
3. Definir variables de entorno **iguales** a `.env.local.example` (con valores reales solo en el panel del host).
4. Ejecutar build (`npm run build` equivalente en CI del proveedor).
5. Tras el primer deploy: probar reserva real en staging, revisar Supabase y bandeja **`BOOKING_NOTIFICATION_EMAIL`**.

Documentación detallada de API: ver sección **Contratos API** en **`README.md`**.

---

## 15. Enlaces importantes

Sustituir por los enlaces reales del equipo (marcadores `TODO`):

| Recurso | Enlace |
|---------|--------|
| **GitHub** | `TODO` — *ej. `https://github.com/<org>/mucamas-chile`* |
| **Vercel** | `TODO` — *dashboard del proyecto / deployment* |
| **Supabase** | `TODO` — *dashboard del proyecto (SQL, tabla `bookings`, auth)* |

Enlaces de producto ya mencionados en código/docs del repo:

- Sitio público (cuando exista dominio): documentar aquí como **`https://www.mucamaschile.cl`** solo si el equipo confirma que es el canonical actual.

---

## Mantenimiento de este documento

Actualizar **`PROJECT_STATUS.md`** cuando cambien: deploy, variables críticas, flujos de negocio o decisiones de arquitectura. Mantener **sin credenciales**.
