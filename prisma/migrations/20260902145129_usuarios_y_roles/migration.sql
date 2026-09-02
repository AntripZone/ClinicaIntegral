/*
  Warnings:

  - Added the required column `rol` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('RECEPCIONISTA', 'MEDICO', 'GERENCIA');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "rol" "Rol" NOT NULL;
