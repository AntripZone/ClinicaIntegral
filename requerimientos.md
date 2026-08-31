## Entity: pacientes

| Atributo         | Tipo          | Notas       |
| ---------------- | ------------- | ----------- |
| id_paciente      | Número Entero | [PK]        |
| nombre           | Texto         | Obligatorio |
| apellido         | Texto         | Obligatorio |
| email            | Texto Unico   | Obligatorio |
| telefono         | Texto         | Obligatorio |
| fecha_nacimiento | Fecha         | Obligatorio |
| direccion        | Texto         |             |
| fecha_registro   | Fecha         | Obligatorio |

## Entity: especialidaddes

| Atributo         | Tipo          | Notas       |
| ---------------- | ------------- | ----------- |
| id_especidalidad | Número Entero | [PK]        |
| nombre           | Texto         | Obligatorio |
| descripcion      | Texto         |             |

## Entity: medicos

| Atributo         | Tipo          | Notas       |
| ---------------- | ------------- | ----------- |
| id_medico        | Número Entero | [PK]        |
| nombre           | Texto         | Obligatorio |
| apellido         | Texto         | Obligatorio |
| email            | Texto         | Unico       |
| telefono         | Texto         |             |
| num_colegiatura  | Texto         | Unico       |
| id_especidalidad | Número Entero | [FK]        |

## Entity: citas

| Atributo    | Tipo          | Notas       |
| ----------- | ------------- | ----------- |
| id_cita     | Número Entero | [PK]        |
| fecha_hora  | Fecha y Hora  | Obligatorio |
| motivo      | Texto         |             |
| estado      | Texto         | Obligatorio |
| notas       | Texto         |             |
| id_paciente | Número Entero | [FK]        |
| id_medico   | Número Entero | [FK]        |

"Una Especialidad puede tener muchos Médicos, pero un Médico pertenece a una sola especialidad."
"Un Paciente puede tener muchas Citas, pero una Cita pertenece a un solo Paciente."
"Un Médico puede tener muchas Citas, pero una Cita pertenece a un solo Médico."
"Un Paciente puede ser atendido por muchos Médicos y un Médico puede atender a muchos Pacientes, se crea Citas"
