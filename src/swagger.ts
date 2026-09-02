import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API de gestion de Clinical Integral AlvaClinic",
    description: "Documentacion generada automaticamente por swagger-autogen",
    version: "1.0.0",
  },
  servers: [
    { url: "http://localhost:3000", description: "Servidor de desarrollo" },
  ],
  tags: [
    { name: "Auth", description: "Registro e inicio de sesión" },
    { name: "Pacientes", description: "Módulo de Recepción" },
    { name: "Médicos", description: "Directorio de especialistas" },
    { name: "Especialidades", description: "Catálogo de áreas médicas" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtenido en POST /api/auth/login", //token que devuelve POST
      },
    },
  },
};
//archivo generado
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/index.ts"];

//archivos q seran leidos por swagger-autogen
const routes = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.0.0", autoHeaders: false })(
  outputFile,
  endpointsFiles,
  doc,
);
