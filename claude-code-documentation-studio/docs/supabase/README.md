# Supabase Database Setup

Este directorio contiene todos los scripts SQL necesarios para configurar la base de datos de Supabase desde cero.

## 📋 Orden de Ejecución

Ejecuta estos archivos en orden en el SQL Editor de Supabase:

### 1. **`schema.sql`** - Estructura básica de progreso y tracking
   - Tablas: `user_progress`, `page_visits`, `user_achievements`, `section_config`
   - Políticas RLS básicas
   - Funciones de tracking

### 2. **`membership-schema.sql`** - Sistema de membresías
   - Tablas: `membership_plans`, `user_memberships`, `course_access`, `module_access`, `payment_history`
   - Planes: Free y Pro con precios
   - Trigger para asignar plan Free automáticamente a nuevos usuarios
   - Funciones: `user_has_course_access()`, `user_has_module_access()`
   - Configuración inicial de acceso por módulo

### 3. **`admin-schema.sql`** - Sistema de administración completo
   - Tabla: `admin_users`
   - Función `public.is_admin()` - Verifica si usuario actual es admin
   - Función `check_is_admin()` - RPC para verificación desde cliente
   - Función `get_all_users_admin()` - Lista todos los usuarios (solo admin)
   - Políticas RLS completas para admin
   - Permisos de admin en todas las tablas necesarias

   **IMPORTANTE:** Después de ejecutar, añade tu email como admin:
   ```sql
   INSERT INTO admin_users (user_id, email, role, is_active)
   SELECT id, email, 'super_admin', true
   FROM auth.users
   WHERE email = 'TU_EMAIL@gmail.com'
   ON CONFLICT (email) DO NOTHING;
   ```

## 🔧 Utilidades

- **`verify-admin-setup.sql`** - Script de verificación
  - Ejecuta este archivo para verificar que todo esté configurado correctamente
  - Muestra: funciones, políticas, configuración de acceso a módulos

## 📝 Configuración por Módulo

### Free Plan (acceso limitado)
- ✅ Subagents
- ❌ Hooks
- ❌ Workflows

### Pro Plan (acceso completo)
- ✅ Subagents
- ✅ Hooks
- ✅ Workflows

## 🔐 Funciones RPC Disponibles

### Para usuarios normales:
- `user_has_course_access(user_id, course_id)` - Verifica acceso a curso
- `user_has_module_access(user_id, course_id, module_id)` - Verifica acceso a módulo

### Para administradores:
- `check_is_admin()` - Verifica si el usuario actual es admin
- `get_all_users_admin()` - Lista todos los usuarios con sus membresías (solo admin)

## 🚨 Troubleshooting

### Error: "Access denied. Admin privileges required"
- Verifica que tu email esté en `admin_users`
- Verifica que `is_active = true`
- Ejecuta: `SELECT * FROM admin_users WHERE email = 'tu_email@gmail.com';`

### Error: "structure of query does not match function result type"
- Asegúrate de haber ejecutado `fix-user-list-types.sql`
- Este archivo corrige los tipos de datos

### Error: "permission denied for schema auth"
- Normal al intentar crear funciones en schema `auth`
- Usa `public` schema en su lugar (ya corregido en los scripts)

## 📂 Archivos del Proyecto

```
supabase/
├── README.md                 # Este archivo - Documentación completa
├── schema.sql                # ✅ 1. Progreso y tracking
├── membership-schema.sql     # ✅ 2. Sistema de membresías
├── admin-schema.sql          # ✅ 3. Sistema de administración
└── verify-admin-setup.sql    # 🔧 Script de verificación
```

## 🎯 Setup Rápido para Nuevos Desarrolladores

1. Ejecuta los 3 archivos principales en orden (schema.sql → membership-schema.sql → admin-schema.sql)
2. Añade tu email como admin (query incluida en paso 3)
3. Ejecuta `verify-admin-setup.sql` para confirmar que todo funciona
4. Accede a `/admin` en la aplicación

¡Listo! El sistema completo está configurado y funcionando.
