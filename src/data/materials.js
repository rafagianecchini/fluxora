// Função utilitária para calcular a situação do estoque com base nas regras do negócio
export function calcularSituacao(quantidade, estoqueMinimo) {
  if (quantidade === 0) {
    return "Sem estoque";
  }
  if (quantidade < estoqueMinimo) {
    return "Estoque baixo";
  }
  return "Normal";
}

// Base inicial com 12 matérias-primas distribuídas em 4 categorias
export const INITIAL_MATERIALS = [
  { id: "1", codigo: "MP-001", nome: "Chapa de Aço Carbono 2mm", categoria: "Metais", unidade: "kg", quantidade: 150, estoqueMinimo: 200 },
  { id: "2", codigo: "MP-002", nome: "Tubos de Alumínio 1/2\"", categoria: "Metais", unidade: "m", quantidade: 450, estoqueMinimo: 300 },
  { id: "3", codigo: "MP-003", nome: "Barra Redonda de Latão", categoria: "Metais", unidade: "m", quantidade: 0, estoqueMinimo: 100 },
  { id: "4", codigo: "MP-004", nome: "Resina Polipropileno (PP)", categoria: "Polímeros", unidade: "kg", quantidade: 800, estoqueMinimo: 500 },
  { id: "5", codigo: "MP-005", nome: "Granulado de PVC Transparente", categoria: "Polímeros", unidade: "kg", quantidade: 120, estoqueMinimo: 250 },
  { id: "6", codigo: "MP-006", nome: "Polietileno de Alta Densidade (PEAD)", categoria: "Polímeros", unidade: "kg", quantidade: 0, estoqueMinimo: 400 },
  { id: "7", codigo: "MP-007", nome: "Pigmento Industrial Ciano", categoria: "Químicos", unidade: "L", quantidade: 85, estoqueMinimo: 80 },
  { id: "8", codigo: "MP-008", nome: "Solvente Industrial PU", categoria: "Químicos", unidade: "L", quantidade: 25, estoqueMinimo: 100 },
  { id: "9", codigo: "MP-009", nome: "Aditivo Anti-UV", categoria: "Químicos", unidade: "L", quantidade: 210, estoqueMinimo: 150 },
  { id: "10", codigo: "MP-010", nome: "Caixa de Papelão Ondulado G", categoria: "Embalagens", unidade: "un", quantidade: 1200, estoqueMinimo: 800 },
  { id: "11", codigo: "MP-011", nome: "Filme Stretchel Industrial 500mm", categoria: "Embalagens", unidade: "roloj", quantidade: 45, estoqueMinimo: 60 },
  { id: "12", codigo: "MP-012", nome: "Fita Adesiva Larga Transparente", categoria: "Embalagens", unidade: "roloj", quantidade: 0, estoqueMinimo: 150 },
];

export const CATEGORIAS = ["Metais", "Polímeros", "Químicos", "Embalagens"];