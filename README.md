# Pilarsa SRL

Refactor integral de la web comercial y del panel administrativo sobre Next.js + Prisma.

## Que cambia en esta version

- APIs con validacion centralizada y reglas compartidas.
- Capa de dominio que desacopla el frontend del esquema heredado.
- Operaciones criticas con transacciones para evitar inconsistencias.
- Rediseño visual del sitio publico y del panel admin.
- Workspaces operativos reutilizables para usados, services, vehiculos, repuestos y finanzas.

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno minimas

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
```

## Base de datos nueva sin tocar la actual

Si necesitas levantar un entorno nuevo sin modificar la base existente:

1. Crea una nueva base PostgreSQL.
2. Define `DATABASE_URL_FRESH` apuntando a esa base.
3. Usa el esquema alternativo:

```bash
npx prisma db push --schema prisma/schema.fresh.prisma
npx prisma generate --schema prisma/schema.fresh.prisma
```

`schema.fresh.prisma` replica el modelo actual para inicializar otra base sin tocar `prisma/schema.prisma`.

## Estructura recomendada

- `lib/core`: errores, HTTP y compatibilidad con campos heredados.
- `lib/domain`: contratos, validaciones y serializadores.
- `lib/server/modules`: reglas de negocio por recurso.
- `components/admin/workspaces`: flujos operativos reutilizables del panel.
- `lib/api`: cliente tipado para frontend.
