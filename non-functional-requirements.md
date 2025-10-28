# Requerimientos No Funcionales — Gestión Culinaria

## Rendimiento
- RNF-01: Tiempo de respuesta de búsqueda ≤ 500 ms (P95).
- RNF-02: Generación de lista de compras ≤ 3 s.
- RNF-03: Soportar 100 usuarios concurrentes sin degradación.

## Disponibilidad
- RNF-04: Uptime mensual ≥ 99.5 %.
- RNF-05: Restauración del servicio ≤ 1 h tras caída.
- RNF-06: Backup diario automático.

## Seguridad
- RNF-07: Contraseñas cifradas con BCrypt/Argon2.
- RNF-08: Expiración de sesión tras 15 min de inactividad.
- RNF-09: Toda conexión mediante HTTPS.
- RNF-10: Control de roles (RBAC).
- RNF-11: Bloqueo tras 5 intentos fallidos.

## Usabilidad y accesibilidad
- RNF-12: Cumplir WCAG 2.1 AA.
- RNF-13: Texto alternativo en imágenes.
- RNF-14: Mensajes de error comprensibles.
- RNF-15: Formularios navegables con teclado.

## Mantenibilidad
- RNF-16: ESLint/Prettier obligatorios.
- RNF-17: Cobertura de pruebas ≥ 70 %.
- RNF-18: Registro de cambios por versión.
- RNF-19: Actualización de dependencias por sprint.

## Escalabilidad
- RNF-20: Soporte para despliegue Docker.
- RNF-21: Soportar 500 usuarios activos mensuales.

## Observabilidad
- RNF-22: Logs detallados por usuario y acción.
- RNF-23: Métricas básicas de rendimiento.
- RNF-24: Alertas automáticas por errores críticos.

## Portabilidad
- RNF-25: Entorno Docker uniforme.
- RNF-26: Configuración por variables de entorno.
- RNF-27: Compatibilidad entre entornos (dev/test/prod).
