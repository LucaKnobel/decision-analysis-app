-- DropForeignKey
ALTER TABLE "Alternative" DROP CONSTRAINT "Alternative_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_userId_fkey";

-- DropForeignKey
ALTER TABLE "Criterion" DROP CONSTRAINT "Criterion_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_alternativeId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_criterionId_fkey";

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterion" ADD CONSTRAINT "Criterion_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alternative" ADD CONSTRAINT "Alternative_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "Alternative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "Criterion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
