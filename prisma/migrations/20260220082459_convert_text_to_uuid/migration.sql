-- 1. Drop foreign key constraints

ALTER TABLE "Analysis" DROP CONSTRAINT IF EXISTS "Analysis_userId_fkey";
ALTER TABLE "Alternative" DROP CONSTRAINT IF EXISTS "Alternative_analysisId_fkey";
ALTER TABLE "Criterion" DROP CONSTRAINT IF EXISTS "Criterion_analysisId_fkey";
ALTER TABLE "Rating" DROP CONSTRAINT IF EXISTS "Rating_alternativeId_fkey";
ALTER TABLE "Rating" DROP CONSTRAINT IF EXISTS "Rating_criterionId_fkey";

-- 2. Convert primary keys and foreign keys

ALTER TABLE "User"
  ALTER COLUMN "id" TYPE uuid USING "id"::uuid;

ALTER TABLE "Analysis"
  ALTER COLUMN "id" TYPE uuid USING "id"::uuid,
  ALTER COLUMN "userId" TYPE uuid USING "userId"::uuid;

ALTER TABLE "Alternative"
  ALTER COLUMN "id" TYPE uuid USING "id"::uuid,
  ALTER COLUMN "analysisId" TYPE uuid USING "analysisId"::uuid;

ALTER TABLE "Criterion"
  ALTER COLUMN "id" TYPE uuid USING "id"::uuid,
  ALTER COLUMN "analysisId" TYPE uuid USING "analysisId"::uuid;

ALTER TABLE "Rating"
  ALTER COLUMN "id" TYPE uuid USING "id"::uuid,
  ALTER COLUMN "alternativeId" TYPE uuid USING "alternativeId"::uuid,
  ALTER COLUMN "criterionId" TYPE uuid USING "criterionId"::uuid;

-- 3. Recreate foreign keys

ALTER TABLE "Analysis"
  ADD CONSTRAINT "Analysis_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Alternative"
  ADD CONSTRAINT "Alternative_analysisId_fkey"
  FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE;

ALTER TABLE "Criterion"
  ADD CONSTRAINT "Criterion_analysisId_fkey"
  FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE;

ALTER TABLE "Rating"
  ADD CONSTRAINT "Rating_alternativeId_fkey"
  FOREIGN KEY ("alternativeId") REFERENCES "Alternative"("id") ON DELETE CASCADE;

ALTER TABLE "Rating"
  ADD CONSTRAINT "Rating_criterionId_fkey"
  FOREIGN KEY ("criterionId") REFERENCES "Criterion"("id") ON DELETE CASCADE;
