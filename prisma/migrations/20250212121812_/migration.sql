/*
  Warnings:

  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FOLDER', 'FILE');

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- DropTable
DROP TABLE "Folder";

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "created" TIMESTAMP(3) NOT NULL,
    "type" "Type" NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
