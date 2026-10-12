-- CreateTable
CREATE TABLE "PracticeMember" (
    "id" SERIAL NOT NULL,
    "practiceId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PracticeMember_practiceId_memberId_key" ON "PracticeMember"("practiceId", "memberId");

-- AddForeignKey
ALTER TABLE "PracticeMember" ADD CONSTRAINT "PracticeMember_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeMember" ADD CONSTRAINT "PracticeMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
