-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "lyrics" TEXT,
    "chords" TEXT,
    "youtubeLink" TEXT,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "songs_title_artist_churchId_key" ON "songs"("title", "artist", "churchId");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
