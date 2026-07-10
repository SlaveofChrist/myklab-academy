-- CreateTable
CREATE TABLE "chapitres_vus" (
    "id_vue" SERIAL NOT NULL,
    "date_vue" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "apprenant_id" INTEGER NOT NULL,
    "chapitre_id" INTEGER NOT NULL,

    CONSTRAINT "chapitres_vus_pkey" PRIMARY KEY ("id_vue")
);

-- CreateIndex
CREATE UNIQUE INDEX "chapitres_vus_apprenant_id_chapitre_id_key" ON "chapitres_vus"("apprenant_id", "chapitre_id");

-- AddForeignKey
ALTER TABLE "chapitres_vus" ADD CONSTRAINT "chapitres_vus_apprenant_id_fkey" FOREIGN KEY ("apprenant_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapitres_vus" ADD CONSTRAINT "chapitres_vus_chapitre_id_fkey" FOREIGN KEY ("chapitre_id") REFERENCES "chapitres"("id_chap") ON DELETE CASCADE ON UPDATE CASCADE;
