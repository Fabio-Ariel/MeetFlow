import { NextRequest, NextResponse } from 'next/server';
import { getEvento, atualizarEvento, getCurrentUser } from '@/app/actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const evento = await getEvento(id);
  
  if (!evento) {
    return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
  }
  
  return NextResponse.json({ evento });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const formData = await request.formData();
    const result = await atualizarEvento(id, formData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 });
  }
}
