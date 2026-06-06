PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "recipientRole" TEXT NOT NULL,
  "recipientId" TEXT,
  "actorId" TEXT,
  "actorName" TEXT,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "actionUrl" TEXT,
  "actionLabel" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
  "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
  "emailSentAt" DATETIME,
  "whatsappSentAt" DATETIME,
  "readAt" DATETIME,
  "archivedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Notification_recipientRole_idx" ON "Notification"("recipientRole");
CREATE INDEX IF NOT EXISTS "Notification_recipientId_idx" ON "Notification"("recipientId");
CREATE INDEX IF NOT EXISTS "Notification_type_idx" ON "Notification"("type");
CREATE INDEX IF NOT EXISTS "Notification_readAt_idx" ON "Notification"("readAt");
CREATE INDEX IF NOT EXISTS "Notification_archivedAt_idx" ON "Notification"("archivedAt");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");
