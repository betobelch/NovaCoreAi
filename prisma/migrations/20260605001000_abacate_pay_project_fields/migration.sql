ALTER TABLE "Project" ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'Pendente';
ALTER TABLE "Project" ADD COLUMN "abacateProductId" TEXT;
ALTER TABLE "Project" ADD COLUMN "abacateCheckoutId" TEXT;
ALTER TABLE "Project" ADD COLUMN "abacateCheckoutUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "abacateExternalId" TEXT;
ALTER TABLE "Project" ADD COLUMN "paidAt" DATETIME;

CREATE INDEX IF NOT EXISTS "Project_paymentStatus_idx" ON "Project"("paymentStatus");
CREATE INDEX IF NOT EXISTS "Project_abacateCheckoutId_idx" ON "Project"("abacateCheckoutId");
CREATE UNIQUE INDEX IF NOT EXISTS "Project_abacateExternalId_key" ON "Project"("abacateExternalId");
