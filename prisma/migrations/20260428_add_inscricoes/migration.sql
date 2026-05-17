-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscricao" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programacao" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "dia" TIMESTAMP(3) NOT NULL,
    "titulo" TEXT NOT NULL,
    "horario" TEXT NOT NULL,

    CONSTRAINT "Programacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Missao" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "pontos" INTEGER NOT NULL DEFAULT 10,
    "meta" INTEGER NOT NULL DEFAULT 1,
    "icone" TEXT,

    CONSTRAINT "Missao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissaoProgresso" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "missaoId" TEXT NOT NULL,
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "concluida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MissaoProgresso_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "endereco" TEXT;
ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "horarioInicio" TEXT;
ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "horarioFim" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_usuarioId_eventoId_key" ON "Inscricao"("usuarioId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "MissaoProgresso_inscricaoId_missaoId_key" ON "MissaoProgresso"("inscricaoId", "missaoId");

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programacao" ADD CONSTRAINT "Programacao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Missao" ADD CONSTRAINT "Missao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissaoProgresso" ADD CONSTRAINT "MissaoProgresso_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissaoProgresso" ADD CONSTRAINT "MissaoProgresso_missaoId_fkey" FOREIGN KEY ("missaoId") REFERENCES "Missao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
