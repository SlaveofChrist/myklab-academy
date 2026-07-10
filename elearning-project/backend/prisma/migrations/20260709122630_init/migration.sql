-- CreateEnum
CREATE TYPE "Role" AS ENUM ('REFERENT', 'APPRENANT');

-- CreateEnum
CREATE TYPE "Categorie" AS ENUM ('NUMERIQUE', 'ARTISANAT', 'AGRICULTURE');

-- CreateTable
CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "date_insc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specialite" TEXT,
    "biographie" TEXT,
    "solde_gains" DOUBLE PRECISION DEFAULT 0,
    "xp_total" INTEGER DEFAULT 0,
    "niveau" INTEGER DEFAULT 1,
    "points_boutique" INTEGER DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "cours" (
    "id_cours" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url_video" TEXT,
    "prix" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "categorie" "Categorie" NOT NULL,
    "referent_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cours_pkey" PRIMARY KEY ("id_cours")
);

-- CreateTable
CREATE TABLE "chapitres" (
    "id_chap" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "ordre_lecture" INTEGER NOT NULL,
    "contenu_textuel" TEXT,
    "cours_id" INTEGER NOT NULL,

    CONSTRAINT "chapitres_pkey" PRIMARY KEY ("id_chap")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id_inscription" SERIAL NOT NULL,
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progression" INTEGER NOT NULL DEFAULT 0,
    "apprenant_id" INTEGER NOT NULL,
    "cours_id" INTEGER NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id_inscription")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id_quiz" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "score_min_reussite" INTEGER NOT NULL DEFAULT 50,
    "temps_limite" INTEGER,
    "cours_id" INTEGER NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id_quiz")
);

-- CreateTable
CREATE TABLE "questions" (
    "id_quest" SERIAL NOT NULL,
    "enonce" TEXT NOT NULL,
    "options_reponses" JSONB NOT NULL,
    "reponse_correcte" TEXT NOT NULL,
    "quiz_id" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id_quest")
);

-- CreateTable
CREATE TABLE "tentatives_quiz" (
    "id_tentative" SERIAL NOT NULL,
    "score_obtenu" INTEGER NOT NULL,
    "date_passage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "est_reussi" BOOLEAN NOT NULL,
    "apprenant_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,

    CONSTRAINT "tentatives_quiz_pkey" PRIMARY KEY ("id_tentative")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_apprenant_id_cours_id_key" ON "inscriptions"("apprenant_id", "cours_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_cours_id_key" ON "quiz"("cours_id");

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_referent_id_fkey" FOREIGN KEY ("referent_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapitres" ADD CONSTRAINT "chapitres_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "cours"("id_cours") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_apprenant_id_fkey" FOREIGN KEY ("apprenant_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "cours"("id_cours") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "cours"("id_cours") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id_quiz") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tentatives_quiz" ADD CONSTRAINT "tentatives_quiz_apprenant_id_fkey" FOREIGN KEY ("apprenant_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tentatives_quiz" ADD CONSTRAINT "tentatives_quiz_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id_quiz") ON DELETE RESTRICT ON UPDATE CASCADE;
