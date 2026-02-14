-- CreateEnum
CREATE TYPE "Position" AS ENUM ('pitcher', 'catcher', 'first', 'second', 'third', 'shortstop', 'left', 'center', 'right');

-- CreateEnum
CREATE TYPE "Hand" AS ENUM ('right', 'left', 'both');

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER,
    "position" "Position",
    "subPosition" "Position",
    "throwHand" "Hand" NOT NULL,
    "batHand" "Hand" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);
