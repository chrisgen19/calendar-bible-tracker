-- CreateTable
CREATE TABLE "reading_notes" (
    "id" TEXT NOT NULL,
    "bibleReadingId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reading_notes_bibleReadingId_idx" ON "reading_notes"("bibleReadingId");

-- AddForeignKey
ALTER TABLE "reading_notes" ADD CONSTRAINT "reading_notes_bibleReadingId_fkey" FOREIGN KEY ("bibleReadingId") REFERENCES "bible_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
