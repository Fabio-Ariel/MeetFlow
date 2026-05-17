-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "banner" TEXT,
    "atividades" TEXT,
    "equipe" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataTermino" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "localizacao" TEXT NOT NULL,
    "certificado" BOOLEAN NOT NULL DEFAULT false,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "valor" DOUBLE PRECISION,
    "vagas" INTEGER NOT NULL,
    "abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encerramento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);
