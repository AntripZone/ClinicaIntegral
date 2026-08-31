import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  //ESPECIALIDAD + MEDICOS
  console.log("Datos de prueba...");
  const datos = [
    {
      nombre: "Cardiología",
      descripcion: "Diagnóstico y tratamiento de enfermedades del corazón",
      medicos: [
        { nombre: "Elena", apellido: "Ramírez", numColegiatura: "CMP-10234" },
        { nombre: "Andrés", apellido: "Vargas", numColegiatura: "CMP-10235" },
      ],
    },
    {
      nombre: "Pediatría",
      descripcion: "Atención médica de niños y adolescentes",
      medicos: [
        { nombre: "Lucía", apellido: "Fernández", numColegiatura: "CMP-20101" },
        { nombre: "Marco", apellido: "Salazar", numColegiatura: "CMP-20102" },
      ],
    },
    {
      nombre: "Traumatología",
      descripcion: "Lesiones del sistema musculoesquelético",
      medicos: [
        { nombre: "Rosa", apellido: "Quispe", numColegiatura: "CMP-30455" },
        { nombre: "Diego", apellido: "Ponce", numColegiatura: "CMP-30456" },
      ],
    },
    {
      nombre: "Dermatología",
      descripcion: "Enfermedades de la piel",
      medicos: [],
    },
  ];

  for (const esp of datos) {
    const especialidad = await prisma.especialidad.upsert({
      where: { nombre: esp.nombre },
      update: {},
      create: { nombre: esp.nombre, descripcion: esp.descripcion },
    });

    for (const m of esp.medicos) {
      const email = `${m.nombre}.${m.apellido}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") //Con esto quito las tildes
        .concat("@saludintegral.com");

      await prisma.medico.upsert({
        where: { numColegiatura: m.numColegiatura },
        update: {},
        create: {
          nombre: m.nombre,
          apellido: m.apellido,
          email,
          telefono: "98651548" + Math.floor(100000 + Math.random() * 899999),
          numColegiatura: m.numColegiatura,
          especialidadId: especialidad.id,
        },
      });
    }
  }

  // PACIENTES
  const pacientes = [
    {
      nombre: "Adrian",
      apellido: "Alva",
      email: "adrian@example.com",
      telefono: "986437664",
      fechaNacimiento: new Date("1997-09-05"),
      direccion: "Urb. Los Laureles 225, Trujillo",
    },
    {
      nombre: "María",
      apellido: "Torres",
      email: "maria.torres@example.com",
      telefono: "912345678",
      fechaNacimiento: new Date("1992-11-02"),
      direccion: "Jr. Puno 456, Lima",
    },
    {
      nombre: "Javier",
      apellido: "Chávez",
      email: "javier.chavez@example.com",
      telefono: "965432187",
      fechaNacimiento: new Date("2015-07-21"),
      direccion: "Calle Los Olivos 89, Lima",
    },
  ];

  for (const p of pacientes) {
    await prisma.paciente.upsert({
      where: { email: p.email },
      update: {},
      create: p,
    });
  }

  // CITAS
  // Mezcla de estados y fechas (pasadas y futuras) para poder probar
  const [cardiologo, , pediatra, , traumatologo] = await prisma.medico.findMany(
    {
      orderBy: { id: "asc" },
    },
  );
  const [paciente1, paciente2, paciente3] = await prisma.paciente.findMany({
    orderBy: { id: "asc" },
  });

  if (
    !cardiologo ||
    !pediatra ||
    !traumatologo ||
    !paciente1 ||
    !paciente2 ||
    !paciente3
  ) {
    throw new Error("Faltan médicos o pacientes base para crear las citas");
  }

  const dia = (offset: number, hora: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    d.setHours(hora, 0, 0, 0);
    d.setMilliseconds(0);
    return d;
  };

  const citas = [
    {
      fechaHora: dia(-7, 9),
      estado: "COMPLETADA" as const,
      motivo: "Control de presión arterial",
      medicoId: cardiologo.id,
      pacienteId: paciente1.id,
    },
    {
      fechaHora: dia(-7, 11),
      estado: "CANCELADA" as const,
      motivo: "Chequeo general",
      medicoId: pediatra.id,
      pacienteId: paciente3.id,
    },
    {
      fechaHora: dia(-3, 10),
      estado: "COMPLETADA" as const,
      motivo: "Dolor lumbar",
      medicoId: traumatologo.id,
      pacienteId: paciente2.id,
    },
    {
      fechaHora: dia(-1, 15),
      estado: "COMPLETADA" as const,
      motivo: "Seguimiento",
      medicoId: cardiologo.id,
      pacienteId: paciente1.id,
    },
    {
      fechaHora: dia(-1, 16),
      estado: "CANCELADA" as const,
      motivo: "Consulta de rutina",
      medicoId: pediatra.id,
      pacienteId: paciente2.id,
    },
    {
      fechaHora: dia(2, 9),
      estado: "PROGRAMADA" as const,
      motivo: "Vacunación",
      medicoId: pediatra.id,
      pacienteId: paciente3.id,
    },
    {
      fechaHora: dia(5, 16),
      estado: "PROGRAMADA" as const,
      motivo: "Evaluación de rodilla",
      medicoId: traumatologo.id,
      pacienteId: paciente2.id,
    },
  ];

  for (const c of citas) {
    const existe = await prisma.cita.findFirst({
      where: { medicoId: c.medicoId, fechaHora: c.fechaHora },
    });
    if (!existe) await prisma.cita.create({ data: c });
  }

  // -------------------------------------------------------------------------
  const resumen = {
    especialidades: await prisma.especialidad.count(),
    medicos: await prisma.medico.count(),
    pacientes: await prisma.paciente.count(),
    citas: await prisma.cita.count(),
  };
  console.log("Seed completado:", resumen);
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
