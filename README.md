# Agora Web

Agora es una plataforma para conectar founders con inversionistas por medio de eventos de tecnología.
Trata de resolver la necesidad tanto de los founders primerizos como de los inversionistas que buscan
proyectos en los que participar al conectarlos por medio de una plataforma que permite ver sus perfiles
durante y después de un evento tecnológico.

Por medio de esta plataforma se podrán crear eventos, agregar agendas, tener distintos perfiles de tecnólogo,
founder, inversionista dependiendo el evento, enviar invitaciones (admin), agregar asistentes, poner reglas
para asistentes, etc.

## Funcionalidades

Usuarios asistentes y admins:

1. Login
2. Signup
3. Ver eventos

Admins:

1. Crear eventos:

- 1.1: Datos generales: título, descripción, portada, fecha.
- 1.2: Definir agenda: sub-eventos con horario, descripción, portada, speaker (opcional) y registro
- 1.3: Definir roles y categorías: al inicio existirán 3 roles (founder, inversionista, asistente) para los cuales el admin podrá definir las reglas asociadas a cada uno, por ejemplo,
  que los usuarios inversionistas deban iniciar sesión por medio de MFA, o que los usuarios founders.
- 1.4: Definir categorías: las categorías son los sub-roles que puede tener un asistente en el evento, ejemplo: speaker, staff, tecnólogo, etc. El admin debe poder definir estas categorías.
- 1.5: Definir asistentes: ya sea por un archivo excel o creándolos a mano por medio de un formulario (nombre, correo, rol, categoría)
