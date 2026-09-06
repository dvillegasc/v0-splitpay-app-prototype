# Backlog de Desarrollo Autónomo Frontend - SplitPay (Next.js)

## Fase 1: Configuración de Conexión (API Client)
- [x] Frontend: Crear archivo `lib/api.ts` que configure una instancia base de `fetch` o `axios` apuntando a la variable de entorno `NEXT_PUBLIC_API_URL`.
- [x] Frontend: Crear un interceptor en `lib/api.ts` que inyecte automáticamente el token JWT (leído de localStorage o cookies) en el header `Authorization` de todas las peticiones.

## Fase 2: Autenticación e Ingreso
- [x] Frontend: Actualizar el formulario de Login (`app/login/page.tsx` o similar) para enviar una petición `POST /api/auth/login` al backend.
- [ ] Frontend: Implementar la lógica para guardar el token JWT recibido en el almacenamiento local al hacer login exitoso.
- [ ] Frontend: Actualizar el formulario de Registro para incluir el campo numérico `ingreso_mensual_declarado` y enviarlo mediante `POST /api/auth/register`.

## Fase 3: Dashboard y Estado Global
- [ ] Frontend: Crear un contexto de React (`context/AuthContext.tsx`) para mantener el estado del usuario logueado en toda la aplicación.
- [ ] Frontend: Modificar la página principal del Dashboard para hacer un `GET /api/households/me` (o ruta equivalente) y reemplazar los nombres "quemados" (mock data) por los de la base de datos.
- [ ] Frontend: Modificar el componente del listado de roomies para renderizar los miembros reales del hogar con su etiqueta de "Tesorero".

## Fase 4: Creación y División de Gastos
- [ ] Frontend: Actualizar el modal/formulario de "Nuevo Gasto" para que envíe el monto y la descripción vía `POST /api/expenses`.
- [ ] Frontend: Actualizar la vista de detalles del gasto para mostrar cuánto debe pagar cada usuario según el cálculo proporcional que devuelve el backend.
- [ ] Frontend: Agregar el botón "Aprobar Gasto" que dispare la petición `PUT /api/expenses/{id}/approve` al contrato social.

## Fase 5: Simplificador de Deudas y Deep Linking
- [ ] Frontend: Conectar la vista de "Balances" o "Deudas" llamando al endpoint `GET /api/households/{id}/balances` que usa el `debt_simplifier`.
- [ ] Frontend: Modificar los botones de "Pagar" para que formateen dinámicamente el enlace `nequi://pay?...` utilizando el teléfono del tesorero y el monto adeudado que retorne la API.

## Fase 6: Corrección de Contratos API y Preparación para Producción
- [ ] Frontend: En `lib/api.ts`, corregir el valor por defecto de `BASE_URL` de `http://localhost:3000/api` a `http://localhost:8000/api`, ya que 3000 es el puerto del propio Next.js y provoca que la app se llame a sí misma cuando `NEXT_PUBLIC_API_URL` no está definida.
- [ ] Frontend: En `lib/api.ts`, corregir el parseo de errores para leer `data?.detail` en vez de `data?.message` (FastAPI serializa sus errores como `{"detail": ...}`), contemplando que `detail` puede ser un string o un array de objetos de validación (errores 422 de Pydantic).
- [ ] Frontend: Crear `lib/types.ts` con las interfaces TypeScript que reflejen exactamente la respuesta del backend (`UserResponse`, `HouseholdResponse`, `HouseholdMemberResponse`, `ExpenseResponse`, `ExpenseSplitResponse`, `DebtSimplificationResponse`), tipando como `string` los campos `ingreso_mensual_declarado`, `monto_total`, `monto_asignado`, `porcentaje_aplicado` y los valores del objeto `saldos_netos`, ya que FastAPI serializa `Decimal` como string.
- [ ] Frontend: Eliminar `typescript: { ignoreBuildErrors: true }` de `next.config.mjs` para que los errores de tipos entre el frontend y el backend fallen el build en vez de pasar desapercibidos hasta runtime.
- [ ] Frontend: Conectar el login y registro reales usando `api.post` de `lib/api.ts` contra `/auth/login` y `/auth/register`, guardando el token con `setAuthToken` ya existente.
- [ ] Frontend: Reemplazar `CASA_MARINILLA_MEMBERS` y los ids hardcodeados (`"david" | "manuela" | "sebastian" | "alexander"`) en `lib/expense-division.ts` por los miembros reales obtenidos vía `GET /api/households/{id}/members`, usando el UUID real de usuario como identificador en vez de strings literales.
- [ ] Frontend: Conectar `add-expense-modal.tsx` para que el envío final llame a `POST /api/expenses` con la estructura de `ExpenseCreate`, dejando `computeSplitLines` únicamente como previsualización optimista en el modal, no como fuente de verdad de los montos guardados.
- [ ] Frontend: Configurar la variable de entorno `NEXT_PUBLIC_API_URL` en Vercel apuntando a la URL pública del backend desplegado en Render.
- [ ] Frontend: Evaluar migrar el almacenamiento del JWT de `localStorage` a una cookie `httpOnly` gestionada por el backend, ya que `localStorage` es vulnerable a robo de token vía XSS.
