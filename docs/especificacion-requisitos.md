# Especificación de Requisitos Técnicos - Proyecto Ava

## 1. Estructura Core de Datos (Entidades)

El sistema Ava se construye sobre las siguientes entidades pilares en PostgreSQL:
- **Empresas:** Entidad matriz que agrupa diferentes divisiones de negocio.
- **Divisiones:** Sub-entidades que permiten segmentar el contacto dentro de grandes corporaciones.
- **Personas (Contactos):** Gestión de perfiles con historial laboral dinámico (RUT como texto, sin columnas redundantes) que permite rastrear la movilidad de un contacto de una empresa a otra.
- **Licitaciones:** Proyectos específicos gestionados mediante estados cambiantes.
- **Interacciones:** Registro multiformato (Llamada, Correo, Reunión, Nota) vinculado de forma directa a personas y licitaciones.
- **Precalificaciones:** Módulo análogo a licitaciones utilizado para la evaluación previa de proyectos, vinculando contactos, resúmenes de visitas a terreno y archivos multimedia.

## 2. Requisitos Funcionales

### R1. Módulo de Autenticación y Usuarios
Gestiona el acceso, la seguridad y los perfiles de los integrantes de AVA. Establece las reglas base de validación para el sistema.
- **Entradas:** id, nombre_1, nombre_2, apellido_1, apellido_2, cargo, rut_usuario, email, password.
- **Reglas de Validación:**
  - **R1.1:** [Regla Base de ID] El identificador único (`id`) será un número entero positivo, autoincremental generado automáticamente por el sistema y de carácter no modificable.
  - **R1.2:** [Regla Base de Nombres] El campo `nombre_1` consistirá en una cadena de caracteres del alfabeto español (máx. 40 caracteres), admitiendo letras con o sin tildes.
  - **R1.3:** El campo `nombre_2` es opcional y se rige por las mismas condiciones de formato que **R1.2**.
  - **R1.4:** El campo `apellido_1` se rige por las mismas condiciones de formato que **R1.2**.
  - **R1.5:** El campo `apellido_2` se rige por las mismas condiciones de formato que **R1.2**.
  - **R1.6:** [Regla Base de RUT] El campo `rut_usuario` será una cadena alfanumérica en formato “XXXXXXX-X”. La sección numérica constará de 7 a 8 dígitos (rango [5.000.000 − 99.999.999]) y el dígito verificador admitirá números (0-9) o la letra “K”.
  - **R1.7:** [Regla Base de Email] El campo `email` será una cadena de caracteres (máx. 35) con estructura validada “XXXXX@XXXX.XX”.
  - **R1.8:** El campo `password` requiere una cadena alfanumérica de mínimo 8 caracteres (aA-zZ, 0-9).
  - **R1.9:** El campo `cargo` se restringe exclusivamente al conjunto de valores {“Gerente”, “Admin”, “Visualizador”}.
  - **R1.10:** El ingreso de `email` (**R1.7**) y `password` (**R1.8**) es obligatorio para iniciar sesión.
  - **R1.11:** Si las credenciales no coinciden con los registros, el sistema denegará el acceso con el mensaje “Credenciales inválidas”.
  - **R1.12:** Si la autenticación es exitosa, se inicializa la sesión, se cargan los permisos según **R1.9** y se redirige al Dashboard mediante Inertia.
  - **R1.13:** Al activar la acción de cierre de sesión, se invalida el token y se destruye la sesión activa.
- **Salidas:**
  - **Salida 1:** Token de sesión, cargo, nombre_1, nombre_2, apellido_1, apellido_2, rut_usuario, email.
  - **Salida 2:** Redirección a la interfaz correspondiente según rol.
  - **Salida 3:** Mensajes informativos de error en interfaz (**R1.11**).

---

### R2. Registro de Empresa
Permite ingresar una nueva entidad corporativa matriz al sistema.
- **Entradas:** id, rut_empresa, nombre_empresa, tipo_empresa.
- **Reglas de Validación:**
  - **R2.1:** El campo `id` hereda estrictamente el comportamiento definido en **R1.1**.
  - **R2.2:** El campo `rut_empresa` se rige por la regla de validación de formato y estructura de **R1.6**.
  - **R2.3:** El campo `nombre_empresa` consistirá en una cadena de caracteres en español de máximo 100 caracteres (con o sin tildes). No se permiten prefijos redundantes en los atributos de la base de datos.
  - **R2.4:** El campo `tipo_empresa` se restringe exclusivamente al conjunto de valores {“Cliente”, “Competencia”, “Subcontratista”}.
  - **R2.5:** Los campos `rut_empresa` (**R2.2**), `nombre_empresa` (**R2.3**) y `tipo_empresa` (**R2.4**) son obligatorios.
  - **R2.6:** Si el `rut_empresa` ya existe en la base de datos, el sistema aborta y muestra “Empresa ya registrada”.
  - **R2.7:** Al guardar exitosamente, se despliega el mensaje “Empresa registrada con éxito”.
- **Salidas:**
  - **Salida 1:** id, rut_empresa, nombre_empresa, tipo_empresa.
  - **Salida 2:** Mensajes de estado del sistema (**R2.6** y **R2.7**).

---

### R3. Actualización y Eliminación de Empresas
Permite modificar o dar de baja empresas existentes utilizando su identificador único.
- **Entradas:** id, rut_empresa, nombre_empresa, tipo_empresa.
- **Reglas de Validación:**
  - **R3.1:** El ingreso del identificador único de la empresa es obligatorio para iniciar la búsqueda.
  - **R3.2:** Si el identificador no coincide con ningún registro activo, se despliega el mensaje “Empresa no encontrada”.
  - **R3.3:** Al cargar un registro válido, se pueblan en el formulario los campos descritos en **R2**.
  - **R3.4:** En caso de optar por la eliminación, se remueve el registro y se confirma con el mensaje “Empresa eliminada exitosamente”.
  - **R3.5:** En caso de actualización, las modificaciones de datos quedan sujetas a las restricciones de formato declaradas en **R2.2**, **R2.3** y **R2.4**. El `id` (**R2.1**) no es modificable.
  - **R3.6:** Si la actualización es exitosa, se despliega el mensaje “Empresa actualizada con éxito”.
- **Salidas:**
  - **Salida 1:** Notificaciones y alertas de estado de la operación (**R3.2**, **R3.4**, **R3.6**).

---

### R4. Registro de Divisiones
Permite ingresar una nueva Sub-entidad o División asociada a una empresa matriz corporativa.
- **Entradas:** id, empresa_id, nombre_division.
- **Reglas de Validación:**
  - **R4.1:** El campo `id` hereda estrictamente el comportamiento definido en **R1.1**.
  - **R4.2:** El campo `empresa_id` debe corresponder obligatoriamente a un identificador existente y validado en el módulo de Empresas (**R2**). De lo contrario, arroja “Empresa no encontrada”.
  - **R4.3:** El campo `nombre_division` consistirá en una cadena de caracteres en español de máximo 100 caracteres. Su ingreso es obligatorio.
  - **R4.4:** Si la división ya se encuentra registrada para la misma empresa matriz, el sistema frena la inserción con el mensaje “División ya registrada”.
  - **R4.5:** Si los datos son válidos, se realiza el guardado y se despliega “División registrada con éxito”.
- **Salidas:**
  - **Salida 1:** id, empresa_id, nombre_division.
  - **Salida 2:** Alertas e informativos del motor de validación (**R4.2**, **R4.4**, **R4.5**).

---

### R5. Actualización y Eliminación de Divisiones
Permite modificar o dar de baja divisiones existentes utilizando su identificador único de relación.
- **Entradas:** id, empresa_id, nombre_division.
- **Reglas de Validación:**
  - **R5.1:** El ID de la división es obligatorio para localizar la entidad.
  - **R5.2:** Si el ID solicitado no existe, el sistema responde con el mensaje “División no encontrada”.
  - **R5.3:** Al seleccionar una división válida, se habilita la edición del campo `nombre_division`.
  - **R5.4:** En caso de eliminación, se remueve el registro y se confirma con el mensaje “División eliminada exitosamente”.
  - **R5.5:** Las modificaciones aplicadas al campo `nombre_division` deben cumplir obligatoriamente con las restricciones de formato descritas en **R4.3**.
  - **R5.6:** Si la transacción de actualización es exitosa, se despliega el mensaje “División actualizada con éxito”.
- **Salidas:**
  - **Salida 1:** Mensajes de confirmación o error de la persistencia (**R5.2**, **R5.4**, **R5.6**).

---

### R6. Registro de Clientes (Contactos)
Permite el ingreso de personas estratégicas al repositorio centralizado del sistema.
- **Entradas:** id, rut_persona, nombre_1, nombre_2, apellido_1, apellido_2, email, telefono, perfil_linkedin.
- **Reglas de Validación:**
  - **R6.1:** El campo `id` hereda estrictamente el comportamiento definido en **R1.1**.
  - **R6.2:** El campo `rut_persona` se rige por la regla de validación de formato y estructura establecida en **R1.6**, almacenándose estrictamente como texto plano.
  - **R6.3:** Los campos de identificación de nombre y apellido (`nombre_1`, `nombre_2`, `apellido_1`, `apellido_2`) heredan de forma directa las restricciones de caracteres, longitud y uso de tildes definidas en **R1.2**, **R1.3**, **R1.4** y **R1.5** respectivamente.
  - **R6.4:** El campo `email` se rige bajo las mismas condiciones estructurales definidas en **R1.7**.
  - **R6.5:** El campo `telefono` requiere una cadena numérica de longitud exacta igual a 9 dígitos (valores del 0 al 9).
  - **R6.6:** El campo `perfil_linkedin` aceptará una cadena con estructura de URL válida, con una longitud máxima de 200 caracteres.
  - **R6.7:** Los atributos `rut_persona`, `nombre_1`, `apellido_1` y `email` son de carácter estrictamente obligatorio.
  - **R6.8:** Si el `rut_persona` ya existe en el sistema, se bloquea el registro con el mensaje “El usuario ya se encuentra registrado”.
  - **R6.9:** Ante un registro exitoso, el sistema responde con el mensaje “Cliente ingresado con éxito”.
- **Salidas:**
  - **Salida 1:** id, rut_persona, nombre_1, apellido_1, email, timestamp de creación.
  - **Salida 2:** Despliegue de alertas de validación en la interfaz (**R6.8** y **R6.9**).

---

### R7. Actualización y Eliminación de Clientes
Permite editar los perfiles de contacto o dar de baja registros de la red de AVA.
- **Entradas:** id, rut_persona, nombre_1, nombre_2, apellido_1, apellido_2, email, telefono, perfil_linkedin.
- **Reglas de Validación:**
  - **R7.1:** El ingreso del identificador único (`id`) del cliente es mandatorio para iniciar la acción.
  - **R7.2:** Si el identificador no existe en los registros, se muestra el mensaje “Persona no encontrada”.
  - **R7.3:** Al seleccionar un contacto válido, la interfaz poblará el formulario con los datos vigentes definidos en **R6**.
  - **R7.4:** Si se gatilla la eliminación, el sistema borra el registro de la persona y despliega “Persona eliminada exitosamente”.
  - **R7.5:** Si se realiza una actualización, los nuevos valores ingresados deben validar con éxito los formatos de campo heredados en **R6.2**, **R6.3**, **R6.4**, **R6.5** y **R6.6**.
  - **R7.6:** Si el proceso de actualización finaliza correctamente, se muestra el mensaje “Cliente actualizado con éxito”.
- **Salidas:**
  - **Salida 1:** Notificaciones de estado de la operación (**R7.2**, **R7.4**, **R7.6**).

---

### R8. Registro de Historial Laboral
Registra de forma dinámica el cargo y la subdivisión corporativa actual del contacto para rastrear su movilidad laboral.
- **Entradas:** id, persona_id, division_id, cargo, estado_actual, fecha_inicio, fecha_fin.
- **Reglas de Validación:**
  - **R8.1:** El campo `id` hereda estrictamente el comportamiento definido en **R1.1**.
  - **R8.2:** Las llaves foráneas `persona_id` y `division_id` deben mapear obligatoriamente a entidades válidas de los módulos **R6** y **R4** respectivamente.
  - **R8.3:** El campo `cargo` consistirá en una cadena alfabética en español de máximo 40 caracteres (con o sin tildes).
  - **R8.4:** El campo `estado_actual` es un tipo de dato booleano (Boolean) que define si el puesto está vigente en el tiempo presente.
  - **R8.5:** Los campos `fecha_inicio` y `fecha_fin` son de ingreso obligatorio con tipo de dato Date.
- **Salidas:**
  - **Salida 1:** id, persona_id, division_id, cargo, estado_actual, fecha_inicio.

---

### R9. Actualización y Eliminación de Historial Laboral
Permite modificar o cerrar registros de la trayectoria profesional de un contacto cuando cambia de empresa.
- **Entradas:** id, cargo, estado_actual, fecha_inicio, fecha_fin.
- **Reglas de Validación:**
  - **R9.1:** El ID del historial es obligatorio. Si no se encuentra el registro, despliega “Registro no encontrado”.
  - **R9.2:** [Lógica de Exclusividad Activa] Si el campo `estado_actual` (**R8.4**) se modifica a "Verdadero" (True), el backend validará que no existan otros historiales activos para esa misma persona. De existir, cambiará esos registros previos a `estado_actual = False` e inyectará de forma automática la fecha actual del servidor en el campo `fecha_fin`.
  - **R9.3:** Se exige que la `fecha_fin` sea cronológicamente posterior a la `fecha_inicio`.
  - **R9.4:** En caso de eliminación física, el sistema responde con el mensaje “Historial eliminado exitosamente”.
  - **R9.5:** Si la actualización es correcta, se gatilla el mensaje “Historial actualizado con éxito”.
- **Salidas:**
  - **Salida 1:** Instancia actualizada del historial de cargo, alertas del sistema (**R9.1**, **R9.4**, **R9.5**).

---

### R10. Registro de Notas
Permite ingresar observaciones, comentarios o anotaciones libres a cualquier entidad del sistema de forma polimórfica.
- **Entradas:** id, detalle, notable_type, notable_id, user_id.
- **Reglas de Validación:**
  - **R10.1:** El campo `detalle` aceptará texto libre de longitud indefinida (tipo de dato Text en la base de datos). Su llenado es obligatorio.
  - **R10.2:** El campo `notable_type` almacenará de forma automatizada la clase del modelo con el que se relaciona (ej: “Persona”, “Empresa”, “Licitación”, “Precalificación”).
  - **R10.3:** El campo `notable_id` guardará el identificador único de la entidad definida en `notable_type`.
  - **R10.4:** El campo `user_id` registrará de forma automática el ID del integrante de AVA que mantiene la sesión iniciada según el contexto de **R1**.
  - **R10.5:** Al consolidar el registro en la base de datos, se muestra “Nota registrada con éxito”.
- **Salidas:**
  - **Salida 1:** id, detalle, notable_type, notable_id, user_id, timestamp.
  - **Salida 2:** Mensaje informativo de éxito (**R10.5**).

---

### R11. Modificación y Eliminación de Notas
Permite alterar o dar de baja anotaciones en el sistema restringiendo los privilegios de edición.
- **Entradas:** id, detalle.
- **Reglas de Validación:**
  - **R11.1:** El ID de la nota es obligatorio para ejecutar cualquier alteración.
  - **R11.2:** [Restricción de Seguridad por Rol] Las operaciones de modificación o eliminación de notas quedan restringidas únicamente al usuario propietario de la nota (`user_id` en **R10.4**) o a usuarios que posean un cargo de “Admin” o “Gerente” conforme a **R1.9**.
  - **R11.3:** Si el campo `detalle` se modifica bajo las reglas de **R10.1**, se confirma con el mensaje “Nota actualizada con éxito”.
  - **R11.4:** En caso de eliminación, se remueve el registro físico y despliega el mensaje “Nota eliminada”.
- **Salidas:**
  - **Salida 1:** Alertas informativas de la acción de edición (**R11.3**, **R11.4**).

---

### R12. Registro de Licitaciones (Proyectos)
Permite ingresar nuevos proyectos o licitaciones al pipeline comercial de AVA, activando el control automático de estancamiento.
- **Entradas:** id, empresa_id, division_id, nombre_proyecto, estado_pipeline.
- **Reglas de Validación:**
  - **R12.1:** El campo `id` hereda estrictamente el comportamiento definido en **R1.1**.
  - **R12.2:** Para `nombre_proyecto` se requiere una cadena de texto (máx. 255 caracteres) de carácter obligatorio.
  - **R12.3:** El atributo `estado_pipeline` se restringirá única y exclusivamente al conjunto predefinido {"Presentada","Adjudicada","Desierta"}.
  - **R12.4:** Las llaves externas `empresa_id` y `division_id` se validarán contra los registros existentes en los módulos **R2** y **R4** respectivamente.
  - **R12.5:** Al guardar el proyecto, la interfaz despliega el mensaje “Licitación registrada con éxito”.
  - **R12.6:** [Alerta de Inactividad Comercial - 30 días] El sistema evaluará diariamente la diferencia en días corridos entre la fecha actual del servidor y el timestamp de la última interacción vinculada (**R13**) a este ID de licitación. Si el indicador es superior a 30 días (o no existen interacciones y han pasado 30 días desde su creación), se activará automáticamente un estado de Alerta Visual en el pipeline del Dashboard.
- **Salidas:**
  - **Salida 1:** id_licitacion, nombre_proyecto, estado_pipeline, estado_alerta (Booleano).
  - **Salida 2:** Mensaje informativo de persistencia (**R12.5**).

---

### R13. Registro de Interacciones
Registra las gestiones e hitos comerciales con contactos vinculados directamente a las licitaciones activas.
- **Entradas:** id, licitacion_id, persona_id, user_id, fecha, comentario, tipo_contacto.
- **Reglas de Validación:**
  - **R13.1:** El campo `fecha` (tipo Date) no puede ser cronológicamente posterior a la fecha actual del servidor.
  - **R13.2:** El campo `comentario` requiere una entrada de texto libre obligatorio que argumente la gestión comercial.
  - **R13.3:** El atributo `tipo_contacto` se limitará exclusivamente al conjunto de opciones {“Reunión Presencial”, “Llamada”, “Correo”, “WhatsApp”, “Otro”}.
  - **R13.4:** Los campos `licitacion_id`, `persona_id` y `user_id` deben verificar su existencia e integridad referencial contra los módulos **R12**, **R6** y **R1** respectivamente.
  - **R13.5:** Al persistir la interacción, se muestra el mensaje “Interacción registrada con éxito” y se refresca automáticamente el cálculo de inactividad de la licitación (**R12.6**).
- **Salidas:**
  - **Salida 1:** id, fecha, tipo_contacto, comentario, timestamp.

---

### R14. Registro Valoración de Cliente
Permite calificar el nivel de influencia, relación y feedback con personas y divisiones corporativas.
- **Entradas:** id, persona_id, division_id, user_id, valoracion, comentario_evaluacion.
- **Reglas de Validación:**
  - **R14.1:** El campo `valoracion` aceptará estrictamente un valor de tipo entero comprendido en el rango cerrado [1 - 5] (Escala de estrellas).
  - **R14.2:** El campo `comentario_evaluacion` utiliza el formato de texto libre de **R10.1** para justificar la calificación.
  - **R14.3:** Las llaves `persona_id`, `division_id` y `user_id` se validan mediante integridad referencial con los módulos **R6**, **R4** y **R1** respectivamente.
  - **R14.2:** Al almacenar la calificación con éxito, el sistema despliega el mensaje “Valoración ingresada con éxito”.
- **Salidas:**
  - **Salida 1:** Promedio aritmético de valoración de la entidad, comentario_evaluacion.

---

### R15. Módulo de Precalificaciones
Permite la administración de los procesos de evaluación previa a los proyectos, vinculando contactos, minutas técnicas de terreno y archivos adjuntos con control de revisiones.
- **Entradas:** id, empresa_id, division_id, nombre_precalificacion, resumen_visita, archivo_multimedia, persona_id.
- **Reglas de Validación:**
  - **R15.1:** El campo `id` hereda estrictamente el comportamiento definido en **R1.1**.
  - **R15.2:** El campo `nombre_precalificacion` se rige por las reglas de longitud y obligatoriedad establecidas en **R12.2**.
  - **R15.3:** Las llaves externas `empresa_id` y `division_id` se validarán bajo las mismas condiciones de integridad declaradas en **R12.4** (módulos **R2** y **R4**).
  - **R15.4:** El campo `resumen_visita` hereda el formato de texto libre obligatorio definido en **R10.1** para registrar los detalles de terreno.
  - **R15.5:** El campo `archivo_multimedia` validará la carga de archivos binarios, permitiendo únicamente extensiones de imagen (`.jpg`, `.jpeg`, `.png`) o documentos técnicos (`.pdf`), con un peso máximo de carga restringido a 10MB por archivo.
  - **R15.6:** El atributo `persona_id` permite asociar uno o más contactos estratégicos, validando que existan dentro del repositorio de clientes (**R6**).
  - **R15.7:** [Alerta de Control de Precalificación - 15 días] El sistema monitoreará la cantidad de días transcurridos desde el último cambio de estado o adición de notas (**R10**) vinculadas al ID de la precalificación. Si la inactividad supera los 15 días corridos, el sistema gatillará automáticamente un estado de Alerta Visual (color amarillo) en la interfaz para advertir gestiones de terreno pendientes.
  - **R15.8:** Si todas las validaciones son correctas, los datos se guardan y se emite el mensaje “Precalificación registrada con éxito”.
- **Salidas:**
  - **Salida 1:** id_precalificacion, nombre_precalificacion, ruta_archivo_multimedia, estado_alerta_15_dias (Booleano).
  - **Salida 2:** Alerta de éxito del sistema (**R15.8**).

---

## 3. Requisitos No Funcionales

- **RNF-01 Seguridad y Cifrado:** Todas las contraseñas deben ser almacenadas utilizando un algoritmo de hashing robusto (como BCrypt o Argon2). Nunca deben guardarse en texto plano en la base de datos PostgreSQL.
- **RNF-02 Tiempo de Respuesta (Latencia):** Dado que el sistema utiliza la arquitectura Inertia.js combinada con componentes React en el Frontend, el tiempo de carga e intercambio de datos entre transiciones de página no debe superar los 2 segundos bajo condiciones de red estándar, garantizando una navegación fluida.
- **RNF-03 Disponibilidad y Respaldo:** El sistema debe asegurar una tasa de disponibilidad del 99.5% dentro del horario laboral (08:00 - 20:00). Se deben programar respaldos automáticos diarios (Backups masivos) de la base de datos relacional para evitar la pérdida de bitácoras comerciales críticas.