-- CreateTable
CREATE TABLE "bible_readings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bibleBook" TEXT NOT NULL,
    "chapters" TEXT NOT NULL,
    "verses" TEXT,
    "dateRead" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bible_readings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bible_readings_userId_idx" ON "bible_readings"("userId");

-- CreateIndex
CREATE INDEX "bible_readings_dateRead_idx" ON "bible_readings"("dateRead");

-- AddForeignKey
ALTER TABLE "bible_readings" ADD CONSTRAINT "bible_readings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
