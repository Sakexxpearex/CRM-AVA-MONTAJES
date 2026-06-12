# Criterios de Aceptación - Proyecto Ava

## CA1. Autenticación y Usuarios (Ref: R1)
* **CA1.1 - Inicio de Sesión Exitoso:**
  * **Dado** que un usuario está registrado con el cargo "Admin" y se encuentra en la pantalla de login,
  * **Cuando** ingresa su email y password correctos y presiona "Iniciar Sesión",
  * **Entonces** el sistema genera un token de sesión válido y lo redirige mediante Inertia al Dashboard Principal, mostrando su nombre y cargo en la interfaz.
* **CA1.2 - Credenciales Inválidas:**
  * **Dado** que un usuario ingresa un correo no registrado o una contraseña errónea,
  * **Cuando** gatilla la acción de inicio de sesión,
  * **Entonces** el sistema bloquea el acceso y despliega en pantalla el mensaje: “Credenciales inválidas”.

## CA2. Gestión de Empresas y Divisiones (Ref: R2, R3, R4, R5)
* **CA2.1 - Restricción de RUT Duplicado:**
  * **Dado** que la empresa "Empresa Alfa" ya está registrada con el RUT "99.999.999-K",
  * **Cuando** un usuario intenta registrar una nueva empresa con ese mismo RUT,
  * **Entonces** el sistema interrumpe la persistencia y muestra el error: “Empresa ya registrada”.
* **CA2.2 - Integridad Referencial en Divisiones:**
  * **Dado** que se intenta registrar una nueva división asociada a un `empresa_id` que fue eliminado o no existe,
  * **Cuando** se envía el formulario de registro,
  * **Entonces** el backend responde con un código de error y despliega en la interfaz: “Empresa no encontrada”.

## CA3. Clientes e Historial Laboral (Ref: R6, R7, R8, R9)
* **CA3.1 - Lógica de Exclusividad de Puesto Activo:**
  * **Dado** que el contacto "Juan Pérez" tiene un historial laboral activo (`estado_actual = True`) en la "División A",
  * **Cuando** el usuario registra un nuevo historial laboral para "Juan Pérez" en la "División B" marcando `estado_actual = True`,
  * **Entonces** el sistema actualiza automáticamente el registro de la "División A" cambiando su `estado_actual` a `False` e inyectando la fecha del día de hoy en su campo `fecha_fin`.

## CA4. Control Polimórfico de Notas (Ref: R10, R11)
* **CA4.1 - Seguridad y Permisos de Edición:**
  * **Dado** que una nota fue creada por el usuario "Ejecutivo A" (Rol: Visualizador),
  * **Cuando** el usuario "Ejecutivo B" (Rol: Visualizador) intenta modificar o eliminar dicha nota,
  * **Entonces** el sistema deniega la acción lanzando un error de permisos en el cliente.
* **CA4.2 - Excepción para Roles Administrativos:**
  * **Dado** el mismo escenario anterior,
  * **Cuando** un usuario con cargo "Admin" o "Gerente" intenta editar o borrar la nota,
  * **Entonces** el sistema procesa la solicitud con éxito y muestra “Nota actualizada con éxito” o “Nota eliminada”.

## CA5. Pipeline de Licitaciones e Interacciones (Ref: R12, R13)
* **CA5.1 - Control de Estancamiento Comercial (30 días):**
  * **Dado** que una licitación en estado "Preparación" registró su última interacción hace 31 días corridos,
  * **Cuando** se procesa la rutina diaria de verificación o se carga el Dashboard,
  * **Entonces** el componente visual del pipeline cambia su propiedad interna `estado_alerta` a `True`, activando una señal visual de advertencia en la tarjeta del proyecto.

## CA6. Módulo de Precalificaciones (Ref: R15)
* **CA6.1 - Restricción de Archivos Multimedia:**
  * **Dado** que un usuario está completando una minuta de precalificación de terreno,
  * **Cuando** intenta adjuntar un archivo con extensión `.zip`, `.exe` o un `.pdf` que pesa 15MB,
  * **Entonces** el sistema rechaza la carga antes de subirla al servidor y notifica que solo se permiten imágenes (`.jpg`, `.png`) o documentos (`.pdf`) de hasta 10MB.
* **CA6.2 - Alerta de Gestión de Terreno Pendiente (15 días):**
  * **Dado** que una precalificación fue guardada pero no ha recibido modificaciones ni notas asociadas en los últimos 16 días,
  * **Cuando** un usuario visualiza el módulo de Precalificaciones en la plataforma,
  * **Entonces** el registro se renderiza con un indicador amarillo y el flag `estado_alerta_15_dias` se evalúa como `True`.