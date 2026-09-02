import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type Rol = "RECEPCIONISTA" | "MEDICO" | "GERENCIA";

export interface Auth {
  id: number;
  email: string;
  rol: Rol;
}

declare global {
  namespace Express {
    interface Request {
      user?: Auth;
    }
  }
}

export function verificarToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Token no proporcionado" });

  const token = header.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Token no proporcionado" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string) as Auth;
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido o expirado" });
  }
}
