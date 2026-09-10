# Backlog de Desarrollo Autónomo Frontend - SplitPay (Next.js)

## Fase 1: Configuración de Conexión (API Client)
- [x] Frontend: Crear archivo `lib/api.ts` que configure una instancia base de `fetch` o `axios` apuntando a la variable de entorno `NEXT_PUBLIC_API_URL`.
- [x] Frontend: Crear un interceptor en `lib/api.ts` que inyecte automáticamente el token JWT (leído de localStorage o cookies) en el header `Authorization` de todas las peticiones.

## Fase 2: Autenticación e Ingreso
- [x] Frontend: Actualizar el formulario de Login (`app/login/page.tsx` o similar) para enviar una petición `POST /api/auth/login` al backend.
- [x] Frontend: Implementar la lógica para guardar el token JWT recibido en el almacenamiento local al hacer login exitoso.
- [x] Frontend: Actualizar el formulario de Registro para incluir el campo numérico `ingreso_mensual_declarado` y enviarlo mediante `POST /api/auth/register`.

## Fase 3: Dashboard y Estado Global
- [x] Frontend: Crear un contexto de React (`context/AuthContext.tsx`) para mantener el estado del usuario logueado en toda la aplicación.
- [x] Frontend: Modificar la página principal del Dashboard para hacer un `GET /api/households/me` (o ruta equivalente) y reemplazar los nombres "quemados" (mock data) por los de la base de datos.
- [ ] Frontend: Modificar el componente del listado de roomies para renderizar los miembros reales del hogar con su etiqueta de "Tesorero".

## Fase 4: Creación y División de Gastos
- [ ] Frontend: Actualizar el modal/formulario de "Nuevo Gasto" para que envíe el monto y la descripción vía `POST /api/expenses`.
- [ ] Frontend: Actualizar la vista de detalles del gasto para mostrar cuánto debe pagar cada usuario según el cálculo proporcional que devuelve el backend.
- [ ] Frontend: Agregar el botón "Aprobar Gasto" que dispare la petición `PUT /api/expenses/{id}/approve` al contrato social.

## Fase 5: Simplificador de Deudas y Deep Linking
- [ ] Frontend: Conectar la vista de "Balances" o "Deudas" llamando al endpoint `GET /api/households/{id}/balances` que usa el `debt_simplifier`.
- [ ] Frontend: Modificar los botones de "Pagar" para que formateen dinámicamente el enlace `nequi://pay?...` utilizando el teléfono del tesorero y el monto adeudado que retorne la API.

## Fase 6: Corrección de Contratos API y Preparación para Producción
- [x] Frontend: Corregir `BASE_URL` en `lib/api.ts` a `http://localhost:8000/api` (verificado en código).
- [x] Frontend: Conectar el login y registro reales usando `api.post` de `lib/api.ts` (verificado: `context/AuthContext.tsx`, `app/login/page.tsx`, `app/register/page.tsx`).
- [ ] [LIB] Frontend: En `lib/api.ts`, corregir el parseo de errores para leer `data?.detail` en vez de `data?.message`.
- [ ] [LIB] Frontend: Crear `lib/types.ts` con las interfaces TypeScript que reflejen exactamente la respuesta del backend, tipando como `string` los campos `ingreso_mensual_declarado`, `monto_total`, `monto_asignado`, `porcentaje_aplicado` y los valores de `saldos_netos`.
- [ ] [LIB] Frontend: En `context/AuthContext.tsx`, corregir el tipo de `ingreso_mensual_declarado` en la interfaz `User` de `number` a `string`.
- [ ] [LIB] Frontend: Reemplazar `CASA_MARINILLA_MEMBERS` y los ids hardcodeados en `lib/expense-division.ts` por los miembros reales obtenidos vía `GET /api/households/{id}/members`.
- [ ] [LIB] Frontend: Evaluar migrar el almacenamiento del JWT de `localStorage` a una cookie `httpOnly`.
- [ ] [INFRA] Frontend: Eliminar `typescript: { ignoreBuildErrors: true }` de `next.config.mjs`.
- [ ] [INFRA] Frontend: Configurar `NEXT_PUBLIC_API_URL` en Vercel apuntando a la URL pública del backend en Render.
- [ ] [UI] Frontend: Conectar `dashboard-view.tsx` y `wallets-list-view.tsx` a `GET /api/households/me` y `GET /api/households/{id}/members`.
- [ ] [UI] Frontend: Conectar la vista de balances a `GET /api/households/{id}/balances`, renderizando el botón "Pagar" con el campo `nequi_deep_link` que ya retorna el backend.
- [ ] [UI] Frontend: Conectar `add-expense-modal.tsx` a `POST /api/expenses` con el `household_id` real, dejando `computeSplitLines` solo como previsualización.
- [ ] [UI] Frontend: Agregar el botón "Rechazar Gasto" en `expense-card.tsx` conectado a `PUT /api/expenses/{id}/reject`.
- [ ] [UI] Frontend: Mostrar el texto "SplitPay no procesa ni retiene tu dinero; esto abrirá tu app de Nequi" antes de abrir cualquier deep link de pago.

## Fase 7: Correcciones de Tipos y Conexión Real de Vistas
- [ ] Frontend: En `context/AuthContext.tsx`, corregir el tipo de `ingreso_mensual_declarado` en la interfaz `User` de `number` a `string`, ya que el backend lo serializa como string.
- [ ] Frontend: Conectar `dashboard-view.tsx` y `wallets-list-view.tsx` a `GET /api/households/me` y `GET /api/households/{id}/members`, reemplazando el estado mock.
- [ ] Frontend: Conectar la vista de balances/wallet a `GET /api/households/{id}/balances`, y renderizar el botón "Pagar" usando el campo `nequi_deep_link` que ya retorna el backend, en vez de construir el enlace manualmente en el frontend.
- [ ] Frontend: Conectar `add-expense-modal.tsx` a `POST /api/expenses`, incluyendo el `household_id` real (hoy el modal solo maneja el mock `wallets = [{id: "casa-marinilla", ...}]`), dejando `computeSplitLines` únicamente como previsualización optimista.
- [ ] Frontend: Agregar el botón "Rechazar Gasto" en `expense-card.tsx` conectado a `PUT /api/expenses/{id}/reject`.
- [ ] Frontend: Antes de abrir cualquier deep link de pago, mostrar un texto visible ("SplitPay no procesa ni retiene tu dinero; esto abrirá tu app de Nequi para completar la transferencia") como capa de claridad de Cero Custodia hacia el usuario.
