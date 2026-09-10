# Backlog de Desarrollo Autónomo - SplitPay (PMV) — Frontend

> Convención de carriles: cada tarea pendiente lleva una etiqueta [UI], [LIB]
> o [INFRA] justo después de `- [ ]`. Cada agente de carril solo procesa las
> tareas de su propia etiqueta (ver agent.py y agent.yml).

## Completadas
- [x] Frontend: Corregir `BASE_URL` en `lib/api.ts` a `http://localhost:8000/api`.
- [x] Frontend: Conectar el login y registro reales usando `api.post` de `lib/api.ts`.

## Pendientes
- [ ] [LIB] Frontend: En `lib/api.ts`, corregir el parseo de errores para leer `data?.detail` en vez de `data?.message`.
- [ ] [LIB] Frontend: Crear `lib/types.ts` con las interfaces TypeScript que reflejen exactamente la respuesta del backend, tipando como `string` los campos `ingreso_mensual_declarado`, `monto_total`, `monto_asignado`, `porcentaje_aplicado` y los valores de `saldos_netos`.
- [ ] [LIB] Frontend: En `context/AuthContext.tsx`, corregir el tipo de `ingreso_mensual_declarado` en la interfaz `User` de `number` a `string`.
- [ ] [LIB] Frontend: Reemplazar `CASA_MARINILLA_MEMBERS` y los ids hardcodeados en `lib/expense-division.ts` por los miembros reales obtenidos vía `GET /api/households/{id}/members`.
- [ ] [LIB] Frontend: Evaluar migrar el almacenamiento del JWT de `localStorage` a una cookie `httpOnly`.
- [ ] [INFRA] Frontend: Eliminar `typescript: { ignoreBuildErrors: true }` de `next.config.mjs`.
- [ ] [INFRA] Frontend: Configurar `NEXT_PUBLIC_API_URL` en Vercel apuntando a la URL pública del backend en Render.
- [ ] [UI] Frontend: Modificar el componente del listado de roomies para renderizar los miembros reales del hogar (vía `GET /api/households/{id}/members`) con su etiqueta de "Tesorero".
- [ ] [UI] Frontend: Conectar `dashboard-view.tsx` y `wallets-list-view.tsx` a `GET /api/households/me` y `GET /api/households/{id}/members`.
- [ ] [UI] Frontend: Conectar `add-expense-modal.tsx` a `POST /api/expenses` con el `household_id` real, dejando `computeSplitLines` solo como previsualización.
- [ ] [UI] Frontend: Actualizar la vista de detalles del gasto para mostrar cuánto debe pagar cada usuario según el cálculo proporcional que devuelve el backend.
- [ ] [UI] Frontend: Agregar el botón "Aprobar Gasto" que dispare `PUT /api/expenses/{id}/approve`.
- [ ] [UI] Frontend: Agregar el botón "Rechazar Gasto" en `expense-card.tsx` conectado a `PUT /api/expenses/{id}/reject`.
- [ ] [UI] Frontend: Conectar la vista de balances a `GET /api/households/{id}/balances`, renderizando el botón "Pagar" con el campo `nequi_deep_link` que ya retorna el backend (no construir el enlace a mano en el frontend).
- [ ] [UI] Frontend: Mostrar el texto "SplitPay no procesa ni retiene tu dinero; esto abrirá tu app de Nequi" antes de abrir cualquier deep link de pago.
