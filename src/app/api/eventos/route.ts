import { NextRequest, NextResponse } from 'next/server';
import { getEventosPaginados } from '@/app/actions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filtros = {
    categoria: searchParams.get('categoria') || undefined,
    formato: searchParams.get('formato') || undefined,
    busca: searchParams.get('busca') || undefined,
    data: searchParams.get('data') || undefined,
    offset: parseInt(searchParams.get('offset') || '0'),
    limit: parseInt(searchParams.get('limit') || '9'),
  };

  const result = await getEventosPaginados(filtros);
  
  return NextResponse.json(result);
}
