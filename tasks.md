# Backlog de Desarrollo Autónomo Frontend - SplitPay (Next.js)

## Fase 1: Configuración de Conexión (API Client)
- [x] Frontend: Crear archivo `lib/api.ts` que configure una instancia base de `fetch` o `axios` apuntando a la variable de entorno `NEXT_PUBLIC_API_URL`.
- [x] Frontend: Crear un interceptor en `lib/api.ts` que inyecte automáticamente el token JWT (leído de localStorage o cookies) en el header `Authorization` de todas las peticiones.

## Fase 2: Autenticación e Ingreso
- [ ] Frontend: Actualizar el formulario de Login (`app/login/page.tsx` o similar) para enviar una petición `POST /api/auth/login` al backend.
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
