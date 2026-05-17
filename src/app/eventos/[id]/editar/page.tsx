import { prisma } from "@/lib/prisma"
import { salvarEvento } from "@/app/actions"
import { notFound } from "next/navigation"

export default async function EditarEvento({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Unwrapping params
  const { id } = await params;

  const evento = await prisma.evento.findUnique({ 
    where: { id: id } 
  })

  if (!evento) notFound()

  return (
    <main className="min-h-screen bg-[#0a0a14] text-white p-8">
      <form action={salvarEvento} className="max-w-4xl mx-auto bg-[#161b33] p-10 rounded-3xl border border-blue-500/30">
        <h1 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest">Editar Evento</h1>
        
        {/* Campo oculto para o ID */}
        <input type="hidden" name="id" value={evento.id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <input name="nome" defaultValue={evento.nome} placeholder="Nome" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" required />
            <input name="tipo" defaultValue={evento.tipo} placeholder="Tipo" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" />
            <input name="area" defaultValue={evento.area} placeholder="Área" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" />
            <select name="formato" defaultValue={evento.formato} className="w-full bg-[#2a2e45] p-3 rounded-full outline-none">
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div className="space-y-4">
            <textarea name="descricao" defaultValue={evento.descricao} placeholder="Descrição" className="w-full bg-[#2a2e45] p-4 rounded-2xl h-32 outline-none" />
            <input name="localizacao" defaultValue={evento.localizacao} placeholder="Localização" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" />
            <input name="vagas" type="number" defaultValue={evento.vagas} className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full mt-8 bg-white text-black font-bold py-3 rounded-full hover:bg-blue-400 transition-all">
          SALVAR ALTERAÇÕES
        </button>
      </form>
    </main>
  )
}