import { NextRequest, NextResponse } from "next/server";
import { criarAvaliacao } from "@/app/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventoId, nota, comentario } = body;

    if (!eventoId || !nota) {
      return NextResponse.json(
        { error: 'eventoId e nota sao obrigatorios' },
        { status: 400 }
      );
    }

    const result = await criarAvaliacao(eventoId, nota, comentario);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error, requireAuth: result.requireAuth },
        { status: result.requireAuth ? 401 : 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro na API de avaliacoes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
