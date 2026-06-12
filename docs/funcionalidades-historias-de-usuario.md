Historias de Usuario e Historial de Aceptación

### HU01: Autenticación de Usuarios
* **Narrativa:**
  * **Como** integrante del equipo de AVA,
  * **quiero** iniciar y cerrar sesión de forma segura en la plataforma,
  * **para** acceder a las funcionalidades del sistema según mi cargo y proteger la información comercial.
* **Requisitos asociados:** R1
* **Criterios de Aceptación:**
  * **Escenario 1: Inicio de sesión exitoso**
    * **Dado** que un usuario está registrado con un cargo válido y se encuentra en el login,
    * **Cuando** ingresa su `email` y `password` correctos y presiona "Iniciar Sesión",
    * **Entonces** el sistema genera un token de sesión y lo redirige mediante Inertia al Dashboard, mostrando su nombre y cargo.
  * **Escenario 2: Login fallido**
    * **Dado** que el usuario ingresa credenciales incorrectas,
    * **Cuando** intenta iniciar sesión,
    * **Entonces** el sistema bloquea el acceso y muestra el mensaje *“Credenciales inválidas”*.

### HU02: Administración de Empresas Matrices
* **Narrativa:**
  * **Como** Administrador o Gerente de AVA,
  * **quiero** registrar, actualizar y eliminar empresas en el sistema,
  * **para** mantener un catálogo centralizado de clientes, competencias y subcontratistas.
* **Requisitos asociados:** R2, R3
* **Criterios de Aceptación:**
  * **Escenario 1: Control de RUT duplicado**
    * **Dado** que la empresa "Alfa" ya está registrada con un RUT específico,
    * **Cuando** se intenta registrar otra empresa con el mismo RUT,
    * **Entonces** el sistema aborta la operación y muestra *“Empresa ya registrada”*.

### HU03: Estructuración de Divisiones Corporativas
* **Narrativa:**
  * **Como** Administrador o Gerente de AVA,
  * **quiero** asociar subdivisiones específicas a las empresas matrices,
  * **para** mapear con precisión las diferentes áreas de negocio con las que interactuamos.
* **Requisitos asociados:** R4, R5
* **Criterios de Aceptación:**
  * **Escenario 1: Validación de Empresa Matriz**
    * **Dado** que se intenta registrar una división apuntando a un `empresa_id` inexistente,
    * **Cuando** se envía el formulario,
    * **Entonces** el backend deniega la acción y despliega *“Empresa no encontrada”*.

### HU04: Gestión de Contactos Estratégicos (Clientes)
* **Narrativa:**
  * **Como** Administrador o Gerente de AVA,
  * **quiero** gestionar las fichas de los clientes (datos personales, email, teléfono, LinkedIn),
  * **para** disponer de un repositorio único de personas clave para la gestión comercial.
* **Requisitos asociados:** R6, R7
* **Criterios de Aceptación:**
  * **Escenario 1: Validación de formatos base**
    * **Dado** que se ingresan los datos de un cliente, los campos de RUT, Email y Nombres deben heredar y validar estructuralmente las reglas de formato de usuario (**R1.6**, **R1.7**, **R1.2**).

### HU05: Trazabilidad de Historial Laboral
* **Narrativa:**
  * **Como** Administrador o Gerente de AVA,
  * **quiero** registrar el cargo, la división y el periodo de tiempo en que un contacto trabaja en una empresa,
  * **para** rastrear la movilidad laboral de los clientes a lo largo del tiempo.
* **Requisitos asociados:** R8, R9
* **Criterios de Aceptación:**
  * **Escenario 1: Exclusividad de puesto activo**
    * **Dado** que un contacto tiene un historial marcado como activo (`estado_actual = True`),
    * **Cuando** se registra un nuevo historial para el mismo contacto con `estado_actual = True`,
    * **Entonces** el backend cambia automáticamente el registro antiguo a `False` e inyecta la fecha actual en `fecha_fin`.

### HU06: Registro Polimórfico de Notas
* **Narrativa:**
  * **Como** integrante de AVA,
  * **quiero** agregar comentarios o anotaciones libres en la ficha de cualquier entidad,
  * **para** centralizar observaciones importantes sobre las gestiones realizadas.
* **Requisitos asociados:** R10, R11
* **Criterios de Aceptación:**
  * **Escenario 1: Restricción de seguridad por rol**
    * **Dado** que una nota fue creada por un usuario con rol "Visualizador",
    * **Cuando** otro usuario con rol "Visualizador" intenta editarla o borrarla,
    * **Entonces** el sistema bloquea la acción por falta de privilegios. Admins y Gerentes quedan exentos de esta restricción.

### HU07: Valoración de Clientes
* **Narrativa:**
  * **Como** integrante de AVA,
  * **quiero** calificar del 1 al 5 a los contactos junto con una justificación,
  * **para** medir el nivel de influencia y la calidad de la relación comercial.
* **Requisitos asociados:** R14
* **Criterios de Aceptación:**
  * **Escenario 1: Rango de estrellas exacto**
    * **Dado** que se envía una calificación, el sistema solo persistirá valores enteros en el rango cerrado `[1 - 5]`.

### HU08: Control de Pipeline de Licitaciones
* **Narrativa:**
  * **Como** Gerente de AVA,
  * **quiero** registrar y visualizar los proyectos en sus diferentes etapas,
  * **para** controlar el estado del embudo de ventas de la empresa.
* **Requisitos asociados:** R12
* **Criterios de Aceptación:**
  * **Escenario 1: Alerta automática de estancamiento**
    * **Dado** que una licitación no ha registrado ninguna interacción en los últimos 30 días corridos,
    * **Cuando** se carga el Dashboard,
    * **Entonces** la tarjeta visual del proyecto activa una alerta roja (`estado_alerta = True`).

### HU09: Bitácora de Interacciones Comerciales
* **Narrativa:**
  * **Como** integrante de AVA,
  * **quiero** registrar cada reunión, llamada o correo realizado con un contacto,
  * **para** mantener al equipo informado y reiniciar el contador de inactividad de los proyectos.
* **Requisitos asociados:** R13
* **Criterios de Aceptación:**
  * **Escenario 1: Refresco de inactividad**
    * **Dado** que una licitación está en estado de alerta por inactividad,
    * **Cuando** se registra con éxito una nueva interacción válida,
    * **Entonces** el sistema actualiza el timestamp y desactiva la alerta visual de los 30 días automáticamente.

### HU10: Administración de Precalificaciones Técnicas
* **Narrativa:**
  * **Como** Administrador o Gerente de AVA,
  * **quiero** crear una ficha técnica previa al proyecto con minutas de terreno y archivos adjuntos,
  * **para** evaluar la viabilidad técnica antes de ofertar en una licitación.
* **Requisitos asociados:** R15
* **Criterios de Aceptación:**
  * **Escenario 1: Control estricto de adjuntos**
    * **Dado** que el usuario sube un archivo a la precalificación,
    * **Cuando** el archivo posee una extensión no permitida (ej: `.zip`) o supera los 10MB,
    * **Entonces** el sistema detiene la carga e informa el error. Solo se permiten `.jpg`, `.jpeg`, `.png` y `.pdf`.

### HU11: Monitoreo de Alertas en Terreno
* **Narrativa:**
  * **Como** Gerente de AVA,
  * **quiero** que el sistema me advierta cuando una precalificación técnica pase mucho tiempo inactiva,
  * **para** asegurar que el equipo de terreno realice el seguimiento a tiempo.
* **Requisitos asociados:** R15.7
* **Criterios de Aceptación:**
  * **Escenario 1: Alerta visual de 15 días**
    * **Dado** que una precalificación lleva 15 días continuos sin registrar cambios ni notas asociadas,
    * **Cuando** se accede al panel de Precalificaciones,
    * **Entonces** el registro se renderiza con un indicador visual amarillo (`estado_alerta_15_dias = True`).