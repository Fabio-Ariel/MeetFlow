import { NextRequest, NextResponse } from 'next/server';
import { criarEvento, getCurrentUser } from '@/app/actions';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const result = await criarEvento(formData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
  }
}
