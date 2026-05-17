import { criarEvento } from "@/app/actions";

export default function NovoEvento() {
  return (
    <main className="min-h-screen bg-[#0a0a14] text-white p-8">
      <form action={criarEvento} className="max-w-4xl mx-auto bg-[#161b33] p-10 rounded-3xl border border-blue-500/30" encType="multipart/form-data">
        <h1 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest">Criar Evento</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <input name="nome" placeholder="Nome do Evento" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" required />
            <input name="tipo" placeholder="Tipo (Ex: Congresso)" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" />
            <input name="area" placeholder="Área Temática" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" />
            <select name="formato" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none">
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
            </select>
            <label className="block text-sm text-gray-400 mb-2">Upload de Imagem do evento</label>
            <input name="banner" type="file" accept="image/*" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none text-gray-400 file:text-white file:bg-blue-600 file:border-0 file:rounded-full file:px-4 file:py-2 file:cursor-pointer" />
          </div>

          <div className="space-y-4">
            <textarea name="descricao" placeholder="Descrição" className="w-full bg-[#2a2e45] p-4 rounded-2xl h-32 outline-none" />
            <input name="localizacao" placeholder="Endereço ou Link" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" />
            <input name="vagas" type="number" placeholder="Vagas" className="w-full bg-[#2a2e45] p-3 rounded-full outline-none" />
          </div>
        </div>

        <button type="submit" className="w-full mt-8 bg-white text-black font-bold py-3 rounded-full hover:bg-blue-400 transition-all">
          CRIAR EVENTO
        </button>
      </form>
    </main>
  );
}
