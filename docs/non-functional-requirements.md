# Requerimientos no funcionales (cómo debe comportarse el sistema):

## Requerimientos de Rendimiento:
- RNF-01: Las páginas principales (Inicio, Búsqueda, Detalle de receta) deben cargar en menos de 1 segundo en ambiente local.  
- RNF-02: La generación de la lista de compras debe completarse en menos de 5 segundos.  
- RNF-03: El sistema debe funcionar correctamente con hasta 30 usuarios concurrentes durante las pruebas.  

## Requerimientos de Disponibilidad:
- RNF-04: En caso de caída del sistema, este debe poder reiniciarse manualmente en un máximo de 10 minutos.  
- RNF-05: Se debe realizar un respaldo semanal de la base de datos para evitar pérdida de información.  

## Requerimientos de Seguridad:
- RNF-06: Todo el tráfico del sistema debe utilizar HTTPS para proteger los datos transmitidos.  
- RNF-07: Las contraseñas deben almacenarse mediante un algoritmo de hash seguro (BCrypt).  
- RNF-08: Los roles de usuario (administrador, chef, usuario común) deben restringir correctamente las funciones y vistas a las que tienen acceso.  

## Requerimientos de Usabilidad y Accesibilidad:
- RNF-09: Los formularios del sistema deben ser fáciles de usar, navegables con teclado y mostrar mensajes de error claros.  
- RNF-10: Las imágenes deben tener texto alternativo y el contraste de colores debe permitir una lectura legible en toda la interfaz.  

## Requerimientos de Mantenibilidad:
- RNF-11: El proyecto debe implementar ESLint y Prettier para mantener un formato de código uniforme.  
- RNF-12: Todo cambio en la rama `main` debe realizarse mediante Pull Request revisado por al menos un integrante del equipo.  

---
