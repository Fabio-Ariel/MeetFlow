'use server'
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { createClient } from "@/lib/supabase/server";

// ==================== AUTENTICAÇÃO ====================

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserAvatar() {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: user.id },
      select: { avatar: true }
    });
    return usuario?.avatar || user.user_metadata?.avatar_url || null;
  } catch {
    return user.user_metadata?.avatar_url || null;
  }
}

// ==================== EVENTOS ====================

interface FiltrosEventos {
  categoria?: string;
  formato?: string;
  busca?: string;
  data?: string;
  offset?: number;
  limit?: number;
}

export async function getEventosPaginados(filtros: FiltrosEventos = {}) {
  try {
    const { categoria, formato, busca, data, offset = 0, limit = 9 } = filtros;
    
    const where: Record<string, unknown> = {
      status: 'publicado'
    };

    if (categoria && categoria !== '' && categoria !== 'Categoria') {
      where.area = categoria;
    }

    if (formato && formato !== '' && formato !== 'Formato') {
      where.formato = formato;
    }

    if (busca && busca.trim() !== '') {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } }
      ];
    }

    if (data) {
      const dataFiltro = new Date(data);
      where.dataInicio = {
        gte: dataFiltro,
        lt: new Date(dataFiltro.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const [eventos, total] = await Promise.all([
      prisma.evento.findMany({
        where,
        orderBy: { dataInicio: 'asc' },
        skip: offset,
        take: limit,
        include: {
          _count: { select: { inscricoes: true } }
        }
      }),
      prisma.evento.count({ where })
    ]);

    return { eventos, total, hasMore: offset + limit < total };
  } catch (error) {
    console.error('Erro ao buscar eventos paginados:', error);
    return { eventos: [], total: 0, hasMore: false };
  }
}

export async function getEventos() {
  try {
    const eventos = await prisma.evento.findMany({
      where: { status: 'publicado' },
      orderBy: { dataInicio: 'asc' },
      include: {
        _count: { select: { inscricoes: true } }
      }
    });
    return eventos;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
}

export async function getEvento(id: string) {
  try {
    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        programacoes: { orderBy: { dia: 'asc' } },
        missoes: true,
        tiposIngresso: true,
        organizadores: true,
        _count: { select: { inscricoes: true } }
      }
    });
    return evento;
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return null;
  }
}

export async function getMeusEventosCriados() {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const eventos = await prisma.evento.findMany({
      where: { criadorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { inscricoes: true } }
      }
    });
    return eventos;
  } catch (error) {
    console.error('Erro ao buscar eventos criados:', error);
    return [];
  }
}

export async function criarEvento(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const nome = formData.get("nome") as string;
  const tipo = formData.get("tipo") as string;
  const area = formData.get("area") as string;
  const formato = formData.get("formato") as string;
  const descricao = formData.get("descricao") as string;
  const localizacao = formData.get("localizacao") as string;
  const endereco = formData.get("endereco") as string;
  const dataInicio = formData.get("dataInicio") as string;
  const dataTermino = formData.get("dataTermino") as string;
  const horarioInicio = formData.get("horarioInicio") as string;
  const horarioFim = formData.get("horarioFim") as string;
  const status = formData.get("status") as string || 'publicado';
  const bannerPath = formData.get("bannerPath") as string;

  // Tipos de ingresso (JSON string)
  const tiposIngressoJson = formData.get("tiposIngresso") as string;
  const tiposIngresso = tiposIngressoJson ? JSON.parse(tiposIngressoJson) : [];

  // Organizadores (JSON string)
  const organizadoresJson = formData.get("organizadores") as string;
  const organizadores = organizadoresJson ? JSON.parse(organizadoresJson) : [];

  const evento = await prisma.evento.create({
    data: {
      nome,
      tipo: tipo || 'Evento',
      area: area || 'Geral',
      formato: formato || 'Presencial',
      descricao,
      localizacao,
      endereco,
      banner: bannerPath || null,
      dataInicio: dataInicio ? new Date(dataInicio) : new Date(),
      dataTermino: dataTermino ? new Date(dataTermino) : new Date(),
      horarioInicio,
      horarioFim,
      status,
      criadorId: user.id,
      abertura: new Date(),
      encerramento: new Date(),
      tiposIngresso: {
        create: tiposIngresso.map((ing: { nome: string; preco: number; quantidade?: number }) => ({
          nome: ing.nome,
          preco: ing.preco,
          quantidade: ing.quantidade
        }))
      },
      organizadores: {
        create: organizadores.map((org: { nome: string; email: string; telefone?: string }) => ({
          nome: org.nome,
          email: org.email,
          telefone: org.telefone
        }))
      }
    }
  });

  revalidatePath("/");
  revalidatePath("/organizador");
  return { success: true, eventoId: evento.id };
}

export async function atualizarEvento(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const nome = formData.get("nome") as string;
  const tipo = formData.get("tipo") as string;
  const area = formData.get("area") as string;
  const formato = formData.get("formato") as string;
  const descricao = formData.get("descricao") as string;
  const localizacao = formData.get("localizacao") as string;
  const endereco = formData.get("endereco") as string;
  const dataInicio = formData.get("dataInicio") as string;
  const dataTermino = formData.get("dataTermino") as string;
  const horarioInicio = formData.get("horarioInicio") as string;
  const horarioFim = formData.get("horarioFim") as string;
  const status = formData.get("status") as string;
  const bannerPath = formData.get("bannerPath") as string;

  const tiposIngressoJson = formData.get("tiposIngresso") as string;
  const tiposIngresso = tiposIngressoJson ? JSON.parse(tiposIngressoJson) : [];

  const organizadoresJson = formData.get("organizadores") as string;
  const organizadores = organizadoresJson ? JSON.parse(organizadoresJson) : [];

  // Deletar tipos de ingresso e organizadores antigos
  await prisma.tipoIngresso.deleteMany({ where: { eventoId: id } });
  await prisma.organizador.deleteMany({ where: { eventoId: id } });

  await prisma.evento.update({
    where: { id },
    data: {
      nome,
      tipo,
      area,
      formato,
      descricao,
      localizacao,
      endereco,
      banner: bannerPath || undefined,
      dataInicio: dataInicio ? new Date(dataInicio) : undefined,
      dataTermino: dataTermino ? new Date(dataTermino) : undefined,
      horarioInicio,
      horarioFim,
      status,
      tiposIngresso: {
        create: tiposIngresso.map((ing: { nome: string; preco: number; quantidade?: number }) => ({
          nome: ing.nome,
          preco: ing.preco,
          quantidade: ing.quantidade
        }))
      },
      organizadores: {
        create: organizadores.map((org: { nome: string; email: string; telefone?: string }) => ({
          nome: org.nome,
          email: org.email,
          telefone: org.telefone
        }))
      }
    }
  });

  revalidatePath("/");
  revalidatePath("/organizador");
  revalidatePath(`/eventos/${id}`);
  return { success: true };
}

export async function salvarEvento(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const id = formData.get("id") as string;
  const data = {
    nome: formData.get("nome") as string,
    tipo: formData.get("tipo") as string,
    area: formData.get("area") as string,
    formato: formData.get("formato") as string,
    descricao: formData.get("descricao") as string,
    localizacao: formData.get("localizacao") as string,
  };

  if (id) {
    await prisma.evento.update({
      where: { id },
      data
    });
  } else {
    await prisma.evento.create({ 
      data: {
        ...data,
        criadorId: user.id,
        dataInicio: new Date(),
        dataTermino: new Date(),
        abertura: new Date(),
        encerramento: new Date(),
      }
    });
  }

  revalidatePath("/");
  redirect("/home");
}

export async function deletarEvento(id: string) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  await prisma.evento.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/organizador");
}

// ==================== INSCRIÇÕES ====================

export async function inscreverEvento(eventoId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Você precisa estar logado para se inscrever', requireAuth: true };
  }

  try {
    // Verificar se já está inscrito
    const inscricaoExistente = await prisma.inscricao.findUnique({
      where: { usuarioId_eventoId: { usuarioId: user.id, eventoId } }
    });
    if (inscricaoExistente) {
      return { error: 'Você já está inscrito neste evento' };
    }

    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
      include: { _count: { select: { inscricoes: true } } }
    });
    if (!evento) return { error: 'Evento não encontrado' };

   // Garantir que o usuário existe no banco
  await prisma.usuario.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
      email: user.email || '',
      senha: '',
      avatar: user.user_metadata?.avatar_url || null
    }
  });

  // Criar inscrição
  const inscricao = await prisma.inscricao.create({
    data: {
      usuarioId: user.id,
      eventoId
    }
  });

    // Criar progresso para cada missão do evento
    const missoes = await prisma.missao.findMany({ where: { eventoId } });
    for (const missao of missoes) {
      await prisma.missaoProgresso.create({
        data: { inscricaoId: inscricao.id, missaoId: missao.id }
      });
    }

    // Criar notificação de inscrição
    await prisma.notificacao.create({
      data: {
        usuarioId: user.id,
        tipo: 'INSCRICAO',
        titulo: 'Inscrição realizada com sucesso!',
        mensagem: `Sua inscrição no evento "${evento.nome}" foi confirmada.`,
        eventoId
      }
    });

    revalidatePath(`/eventos/${eventoId}`);
    revalidatePath('/meus-eventos');
    revalidatePath('/notificacoes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao inscrever:', error);
    return { error: 'Erro ao realizar inscrição' };
  }
}

export async function cancelarInscricao(eventoId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Não autorizado' };

  try {
    const inscricao = await prisma.inscricao.findUnique({
      where: { usuarioId_eventoId: { usuarioId: user.id, eventoId } }
    });

    if (!inscricao) return { error: 'Inscrição não encontrada' };

    // Deletar progressos de missões
    await prisma.missaoProgresso.deleteMany({
      where: { inscricaoId: inscricao.id }
    });

    // Deletar inscrição
    await prisma.inscricao.delete({
      where: { id: inscricao.id }
    });

    revalidatePath(`/eventos/${eventoId}`);
    revalidatePath('/meus-eventos');
    return { success: true };
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    return { error: 'Erro ao cancelar inscrição' };
  }
}

export async function getMeusEventos() {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const inscricoes = await prisma.inscricao.findMany({
      where: { usuarioId: user.id },
      include: {
        evento: {
          include: {
            programacoes: { orderBy: { dia: 'asc' } },
            missoes: true
          }
        },
        progressos: { include: { missao: true } }
      },
      orderBy: {
          evento: {
          dataInicio: 'desc'
      }
}
    });
    return inscricoes;
  } catch (error) {
    console.error('Erro ao buscar meus eventos:', error);
    return [];
  }
}

export async function verificarInscricao(eventoId: string) {
  const user = await getCurrentUser();
  if (!user) return false;

  try {
    const inscricao = await prisma.inscricao.findUnique({
      where: { usuarioId_eventoId: { usuarioId: user.id, eventoId } }
    });
    return !!inscricao;
  } catch {
    return false;
  }
}

export async function atualizarProgresso(inscricaoId: string, missaoId: string, novoProgresso: number) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Não autorizado' };

  try {
    const missao = await prisma.missao.findUnique({ where: { id: missaoId } });
    if (!missao) return { error: 'Missão não encontrada' };

    const concluida = novoProgresso >= missao.meta;
    
    await prisma.missaoProgresso.update({
      where: { inscricaoId_missaoId: { inscricaoId, missaoId } },
      data: { progresso: novoProgresso, concluida }
    });

    // Criar notificação se missão foi concluída
    if (concluida) {
      const inscricao = await prisma.inscricao.findUnique({
        where: { id: inscricaoId },
        include: { evento: true }
      });

      if (inscricao) {
        await prisma.notificacao.create({
          data: {
            usuarioId: user.id,
            tipo: 'MISSAO',
            titulo: 'Missão concluída!',
            mensagem: `Parabéns! Você completou a missão "${missao.titulo}" e ganhou ${missao.pontos} pontos.`,
            eventoId: inscricao.eventoId
          }
        });
      }
    }

    revalidatePath('/meus-eventos');
    revalidatePath('/notificacoes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return { error: 'Erro ao atualizar progresso' };
  }
}

// ==================== NOTIFICAÇÕES ====================

export async function getNotificacoes() {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const notificacoes = await prisma.notificacao.findMany({
      where: { usuarioId: user.id },
      include: { evento: true },
      orderBy: { createdAt: 'desc' }
    });

    // Verificar eventos próximos e criar lembretes se necessário
    const inscricoes = await prisma.inscricao.findMany({
      where: { usuarioId: user.id },
      include: { evento: true }
    });

    const agora = new Date();
    for (const inscricao of inscricoes) {
      const dataEvento = new Date(inscricao.evento.dataInicio);
      const diffDias = Math.ceil((dataEvento.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));

      // Verificar se já existe lembrete para este evento nos últimos 7 dias
      if (diffDias > 0 && diffDias <= 7) {
        const lembreteExistente = await prisma.notificacao.findFirst({
          where: {
            usuarioId: user.id,
            eventoId: inscricao.eventoId,
            tipo: 'LEMBRETE',
            createdAt: { gte: new Date(agora.getTime() - 24 * 60 * 60 * 1000) }
          }
        });

        if (!lembreteExistente) {
          await prisma.notificacao.create({
            data: {
              usuarioId: user.id,
              tipo: 'LEMBRETE',
              titulo: diffDias === 1 ? 'Evento amanhã!' : `Faltam ${diffDias} dias!`,
              mensagem: `O evento "${inscricao.evento.nome}" ${diffDias === 1 ? 'começa amanhã' : `começa em ${diffDias} dias`}. Não se esqueça!`,
              eventoId: inscricao.eventoId
            }
          });
        }
      }

      // Verificar missões pendentes
      const progressos = await prisma.missaoProgresso.findMany({
        where: { inscricaoId: inscricao.id, concluida: false },
        include: { missao: true }
      });

      if (progressos.length > 0 && diffDias >= 0 && diffDias <= 3) {
        const notifMissaoExistente = await prisma.notificacao.findFirst({
          where: {
            usuarioId: user.id,
            eventoId: inscricao.eventoId,
            tipo: 'MISSAO_PENDENTE',
            createdAt: { gte: new Date(agora.getTime() - 24 * 60 * 60 * 1000) }
          }
        });

        if (!notifMissaoExistente) {
          await prisma.notificacao.create({
            data: {
              usuarioId: user.id,
              tipo: 'MISSAO_PENDENTE',
              titulo: 'Você tem missões pendentes!',
              mensagem: `Você tem ${progressos.length} missão(ões) para completar no evento "${inscricao.evento.nome}".`,
              eventoId: inscricao.eventoId
            }
          });
        }
      }
    }

    // Buscar notificações atualizadas
    return await prisma.notificacao.findMany({
      where: { usuarioId: user.id },
      include: { evento: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return [];
  }
}

export async function marcarNotificacaoComoLida(notificacaoId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Não autorizado' };

  try {
    await prisma.notificacao.update({
      where: { id: notificacaoId },
      data: { lida: true }
    });
    revalidatePath('/notificacoes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    return { error: 'Erro ao marcar notificação' };
  }
}

export async function marcarTodasComoLidas() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Não autorizado' };

  try {
    await prisma.notificacao.updateMany({
      where: { usuarioId: user.id, lida: false },
      data: { lida: true }
    });
    revalidatePath('/notificacoes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao marcar notificações:', error);
    return { error: 'Erro ao marcar notificações' };
  }
}

// ==================== PERFIL ====================

export async function getPerfil() {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    // Buscar ou criar usuário no Prisma
    let usuario = await prisma.usuario.findUnique({
      where: { id: user.id }
    });

    if (!usuario) {
      // Criar usuário se não existir
      usuario = await prisma.usuario.create({
        data: {
          id: user.id,
          nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
          senha: '', // Não usamos senha pois auth é via Supabase
          avatar: user.user_metadata?.avatar_url || null
        }
      });
    }

    return usuario;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

export async function atualizarPerfil(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Não autorizado' };

  try {
    const nome = formData.get("nome") as string;
    const telefone = formData.get("telefone") as string;
    const bio = formData.get("bio") as string;
    const avatarPath = formData.get("avatarPath") as string;

    // Verificar se usuário existe, se não criar
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: user.id }
    });

    if (!usuarioExistente) {
      await prisma.usuario.create({
        data: {
          id: user.id,
          nome,
          email: user.email || '',
          senha: '',
          telefone,
          bio,
          avatar: avatarPath || null
        }
      });
    } else {
      await prisma.usuario.update({
        where: { id: user.id },
        data: {
          nome,
          telefone,
          bio,
          ...(avatarPath && { avatar: avatarPath })
        }
      });
    }

    // Atualizar metadados no Supabase Auth
    const supabase = await createClient();
    await supabase.auth.updateUser({
      data: { nome, avatar_url: avatarPath || undefined }
    });

    revalidatePath('/perfil');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { error: 'Erro ao atualizar perfil' };
  }
}

// ==================== AVALIACOES ====================

export async function criarAvaliacao(eventoId: string, nota: number, comentario?: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Voce precisa estar logado para avaliar', requireAuth: true };

  if (nota < 1 || nota > 5) {
    return { error: 'A nota deve ser entre 1 e 5' };
  }

  try {
    // Verificar se usuario esta inscrito no evento
    const inscricao = await prisma.inscricao.findUnique({
      where: { usuarioId_eventoId: { usuarioId: user.id, eventoId } }
    });

    if (!inscricao) {
      return { error: 'Voce precisa estar inscrito no evento para avaliar' };
    }

    // Verificar se ja avaliou
    const avaliacaoExistente = await prisma.avaliacao.findUnique({
      where: { eventoId_usuarioId: { eventoId, usuarioId: user.id } }
    });

    if (avaliacaoExistente) {
      // Atualizar avaliacao existente
      await prisma.avaliacao.update({
        where: { id: avaliacaoExistente.id },
        data: { nota, comentario }
      });
    } else {
      // Criar nova avaliacao
      await prisma.avaliacao.create({
        data: {
          eventoId,
          usuarioId: user.id,
          nota,
          comentario
        }
      });
    }

    revalidatePath(`/eventos/${eventoId}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar avaliacao:', error);
    return { error: 'Erro ao criar avaliacao' };
  }
}

export async function getAvaliacoesEvento(eventoId: string) {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { eventoId },
      include: {
        usuario: {
          select: { id: true, nome: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular media
    const total = avaliacoes.length;
    const soma = avaliacoes.reduce((acc, av) => acc + av.nota, 0);
    const media = total > 0 ? soma / total : 0;

    // Distribuicao de notas
    const distribuicao = {
      1: avaliacoes.filter(a => a.nota === 1).length,
      2: avaliacoes.filter(a => a.nota === 2).length,
      3: avaliacoes.filter(a => a.nota === 3).length,
      4: avaliacoes.filter(a => a.nota === 4).length,
      5: avaliacoes.filter(a => a.nota === 5).length,
    };

    return { avaliacoes, total, media, distribuicao };
  } catch (error) {
    console.error('Erro ao buscar avaliacoes:', error);
    return { avaliacoes: [], total: 0, media: 0, distribuicao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
}

export async function getMinhaAvaliacao(eventoId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { eventoId_usuarioId: { eventoId, usuarioId: user.id } }
    });
    return avaliacao;
  } catch {
    return null;
  }
}

export async function deletarAvaliacao(eventoId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Nao autorizado' };

  try {
    await prisma.avaliacao.delete({
      where: { eventoId_usuarioId: { eventoId, usuarioId: user.id } }
    });
    revalidatePath(`/eventos/${eventoId}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar avaliacao:', error);
    return { error: 'Erro ao deletar avaliacao' };
  }
}
