import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const registroSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("El correo no tiene un formato valido")),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol: z.enum(["RECEPCIONISTA", "MEDICO", "GERENCIA"], {
    message: "El rol debe ser RECEPCIONISTA, MEDICO O GERENCIA",
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("El correo no tiene un formato valido")),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type RegistroInput = z.infer<typeof registroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

const validar =
  (schema: typeof registroSchema | typeof loginSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success)
      return res.status(400).json({
        error: "Datos invalidos",
        detalles: resultado.error.issues.map((i) => ({
          campo: i.path.join("."),
          mensaje: i.message,
        })),
      });

    req.body = resultado.data;
    return next();
  };

export const validarRegistro = validar(registroSchema);
export const validarLogin = validar(loginSchema);
