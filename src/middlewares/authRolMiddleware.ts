import type { Request, Response, NextFunction } from "express";
import type { Rol } from "./authMiddleware";

export function autorizar(...roles: Rol[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "Token no proporcionado" });
    if (!roles.includes(req.user.rol))
      return res
        .status(403)
        .json({ message: "No tienes permiso para acceder a este recurso" });

    return next();
  };
}
