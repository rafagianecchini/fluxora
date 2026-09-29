"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { INITIAL_MATERIALS, CATEGORIAS, calcularSituacao } from "@/data/materials";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { 
  ArrowLeft, Search, Filter, RotateCcw, Plus, ArrowUpRight, 
  ArrowDownLeft, AlertTriangle, CheckCircle2, XCircle, Boxes,
  Info, ShieldAlert, Sparkles, Sun, Moon
} from "lucide-react";

export default function DemoPage() {
  // Estado para controle do tema Claro / Escuro (Padrão: Escuro)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Estado principal contendo todas as matérias-primas em memória
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);

  // Estados para filtros da tabela
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [selectedStatus, setSelectedStatus] = useState("TODAS");

  // Estados para modais e validações de formulário
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [selectedMaterialForMove, setSelectedMaterialForMove] = useState(null);

  // Formulário de Cadastro de Material
  const [newMaterial, setNewMaterial] = useState({
    codigo: "",
    nome: "",
    categoria: "Metais",
    unidade: "kg",
    quantidade: "",
    estoqueMinimo: ""
  });
  const [addError, setAddError] = useState("");

  // Formulário de Movimentação de Estoque
  const [movement, setMovement] = useState({
    materialId: "",
    tipo: "ENTRADA",
    quantidade: ""
  });
  const [moveError, setMoveError] = useState("");

  // --- 1. CÁLCULOS DE INDICADORES (Métricas Gerais baseadas no estado global) ---
  const kpis = useMemo(() => {
    let normal = 0;
    let baixo = 0;
    let semEstoque = 0;

    materials.forEach((m) => {
      const situacao = calcularSituacao(m.quantidade, m.estoqueMinimo);
      if (situacao === "Normal") normal++;
      else if (situacao === "Estoque baixo") baixo++;
      else if (situacao === "Sem estoque") semEstoque++;
    });

    return {
      total: materials.length,
      normal,
      baixo,
      semEstoque
    };
  }, [materials]);

  // --- 2. DADOS PARA OS GRÁFICOS (Estatísticas Globais) ---
  const categoryChartData = useMemo(() => {
    const counts = {};
    CATEGORIAS.forEach(cat => counts[cat] = 0);

    materials.forEach(m => {
      if (counts[m.categoria] !== undefined) {
        counts[m.categoria]++;
      } else {
        counts[m.categoria] = 1;
      }
    });

    return Object.keys(counts).map(cat => ({
      categoria: cat,
      quantidade: counts[cat]
    }));
  }, [materials]);

  const statusChartData = useMemo(() => [
    { name: "Estoque Normal", value: kpis.normal, color: "#10b981" }, // Esmeralda / Verde
    { name: "Estoque Baixo", value: kpis.baixo, color: "#f59e0b" },  // Âmbar
    { name: "Sem Estoque", value: kpis.semEstoque, color: "#ef4444" } // Vermelho
  ], [kpis]);

  // --- 3. FILTRAGEM DE ITENS PARA A TABELA ---
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const situacao = calcularSituacao(m.quantidade, m.estoqueMinimo);

      const matchesSearch = 
        m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.codigo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = 
        selectedCategory === "TODAS" || m.categoria === selectedCategory;

      const matchesStatus = 
        selectedStatus === "TODAS" || situacao === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [materials, searchTerm, selectedCategory, selectedStatus]);

  // Função para resetar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("TODAS");
    setSelectedStatus("TODAS");
  };

  // --- 4. AÇÕES DE CADASTRO E MOVIMENTAÇÃO ---
  const handleAddMaterial = (e) => {
    e.preventDefault();
    setAddError("");

    if (!newMaterial.codigo.trim() || !newMaterial.nome.trim()) {
      setAddError("Preencha todos os campos obrigatórios.");
      return;
    }

    const qtd = Number(newMaterial.quantidade);
    const min = Number(newMaterial.estoqueMinimo);

    if (isNaN(qtd) || qtd < 0) {
      setAddError("A quantidade inicial deve ser maior ou igual a zero.");
      return;
    }

    if (isNaN(min) || min <= 0) {
      setAddError("O estoque mínimo deve ser maior que zero.");
      return;
    }

    // Verificar código duplicado
    if (materials.some(m => m.codigo.toLowerCase() === newMaterial.codigo.toLowerCase())) {
      setAddError("Este código de material já está cadastrado.");
      return;
    }

    const created = {
      id: Date.now().toString(),
      codigo: newMaterial.codigo.toUpperCase(),
      nome: newMaterial.nome,
      categoria: newMaterial.categoria,
      unidade: newMaterial.unidade,
      quantidade: qtd,
      estoqueMinimo: min
    };

    setMaterials(prev => [created, ...prev]);
    setIsAddOpen(false);
    setNewMaterial({
      codigo: "",
      nome: "",
      categoria: "Metais",
      unidade: "kg",
      quantidade: "",
      estoqueMinimo: ""
    });
  };

  const handleOpenMoveModal = (material) => {
    setSelectedMaterialForMove(material);
    setMovement({ materialId: material.id, tipo: "ENTRADA", quantidade: "" });
    setMoveError("");
    setIsMoveOpen(true);
  };

  const handleExecuteMove = (e) => {
    e.preventDefault();
    setMoveError("");

    const qtdMove = Number(movement.quantidade);

    if (isNaN(qtdMove) || qtdMove <= 0) {
      setMoveError("A quantidade da movimentação deve ser maior que zero.");
      return;
    }

    if (movement.tipo === "SAIDA" && qtdMove > selectedMaterialForMove.quantidade) {
      setMoveError(`Saída não permitida. Saldo disponível em estoque: ${selectedMaterialForMove.quantidade} ${selectedMaterialForMove.unidade}.`);
      return;
    }

    setMaterials(prev => prev.map(item => {
      if (item.id === selectedMaterialForMove.id) {
        const novaQtd = movement.tipo === "ENTRADA" 
          ? item.quantidade + qtdMove 
          : item.quantidade - qtdMove;
        return { ...item, quantidade: novaQtd };
      }
      return item;
    }));

    setIsMoveOpen(false);
  };

  // Helper para Badge de Situação
  const renderBadgeSituacao = (situacao) => {
    switch (situacao) {
      case "Normal":
        return (
          <Badge className={
            isDarkMode 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1.5 w-fit" 
              : "bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 w-fit"
          }>
            <CheckCircle2 className="w-3.5 h-3.5" /> Normal
          </Badge>
        );
      case "Estoque baixo":
        return (
          <Badge className={
            isDarkMode 
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30 flex items-center gap-1.5 w-fit" 
              : "bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5 w-fit"
          }>
            <AlertTriangle className="w-3.5 h-3.5" /> Estoque baixo
          </Badge>
        );
      case "Sem estoque":
        return (
          <Badge className={
            isDarkMode 
              ? "bg-red-500/10 text-red-400 border-red-500/30 flex items-center gap-1.5 w-fit" 
              : "bg-red-50 text-red-700 border-red-200 flex items-center gap-1.5 w-fit"
          }>
            <XCircle className="w-3.5 h-3.5" /> Sem estoque
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 selection:bg-emerald-500 selection:text-white pb-20 ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* BANNER INFORMATIVO - DEMO */}
      <div className={`border-b px-4 py-2 text-xs md:text-sm flex items-center justify-between transition-colors ${
        isDarkMode 
          ? "bg-emerald-950/40 border-emerald-800/30 text-emerald-300" 
          : "bg-emerald-100/70 border-emerald-200 text-emerald-900"
      }`}>
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <Info className="w-4 h-4 text-emerald-500 shrink-0" />
          <span><strong>Ambiente de Demonstração Interativa:</strong> Dados em memória simulados para testes de movimentação e visualização de KPIs.</span>
        </div>
      </div>

      {/* HEADER NAVEGAÇÃO */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 lg:px-8 py-4 transition-colors ${
        isDarkMode 
          ? "bg-slate-950/80 border-slate-800/80" 
          : "bg-white/80 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className={`inline-flex items-center text-sm font-medium transition-colors gap-1.5 ${
                isDarkMode ? "text-slate-400 hover:text-emerald-400" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Voltar à Home
            </Link>
            <span className={isDarkMode ? "text-slate-800" : "text-slate-300"}>|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-emerald-500/20">
                F
              </div>
              <span className={`font-bold tracking-tight text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Fluxora <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  isDarkMode ? "text-emerald-400 bg-emerald-950/80 border-emerald-800" : "text-emerald-700 bg-emerald-100 border-emerald-200"
                }`}>Demo</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* BOTÃO ALTERNADOR DE TEMA (MODO CLARO / ESCURO) */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`rounded-full transition-colors ${
                isDarkMode 
                  ? "border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-900" 
                  : "border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* BOTÃO NOVO MATERIAL */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 transition-all">
                  <Plus className="w-4 h-4 mr-1.5" /> Novo Material
                </Button>
              </DialogTrigger>
              <DialogContent className={
                isDarkMode 
                  ? "bg-slate-900 border-slate-800 text-slate-100 max-w-md" 
                  : "bg-white border-slate-200 text-slate-900 max-w-md"
              }>
                <DialogHeader>
                  <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    <Boxes className="w-5 h-5 text-emerald-500" /> Cadastrar Matéria-Prima
                  </DialogTitle>
                  <DialogDescription className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                    Adicione um novo insumo à base de dados para monitorar os alertas de estoque.
                  </DialogDescription>
                </DialogHeader>

                {addError && (
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{addError}</span>
                  </div>
                )}

                <form onSubmit={handleAddMaterial} className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Código *</Label>
                      <Input 
                        placeholder="Ex: MP-013" 
                        value={newMaterial.codigo}
                        onChange={e => setNewMaterial({...newMaterial, codigo: e.target.value})}
                        className={`mt-1 text-sm ${
                          isDarkMode 
                            ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600" 
                            : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                    <div>
                      <Label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Unidade *</Label>
                      <Input 
                        placeholder="Ex: kg, L, m, un" 
                        value={newMaterial.unidade}
                        onChange={e => setNewMaterial({...newMaterial, unidade: e.target.value})}
                        className={`mt-1 text-sm ${
                          isDarkMode 
                            ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600" 
                            : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Nome do Material *</Label>
                    <Input 
                      placeholder="Ex: Polímero de Alta Fusão" 
                      value={newMaterial.nome}
                      onChange={e => setNewMaterial({...newMaterial, nome: e.target.value})}
                      className={`mt-1 text-sm ${
                        isDarkMode 
                          ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600" 
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Categoria *</Label>
                    <Select 
                      value={newMaterial.categoria} 
                      onValueChange={v => setNewMaterial({...newMaterial, categoria: v})}
                    >
                      <SelectTrigger className={`mt-1 text-sm ${
                        isDarkMode 
                          ? "bg-slate-950 border-slate-800 text-white" 
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"}>
                        {CATEGORIAS.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Qtd. Inicial *</Label>
                      <Input 
                        type="number"
                        placeholder="0" 
                        value={newMaterial.quantidade}
                        onChange={e => setNewMaterial({...newMaterial, quantidade: e.target.value})}
                        className={`mt-1 text-sm ${
                          isDarkMode 
                            ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600" 
                            : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                    <div>
                      <Label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Estoque Mínimo *</Label>
                      <Input 
                        type="number"
                        placeholder="100" 
                        value={newMaterial.estoqueMinimo}
                        onChange={e => setNewMaterial({...newMaterial, estoqueMinimo: e.target.value})}
                        className={`mt-1 text-sm ${
                          isDarkMode 
                            ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600" 
                            : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddOpen(false)} 
                      className={isDarkMode ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold">
                      Salvar Material
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL DA DASHBOARD */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 space-y-8">
        
        {/* TÍTULO DA SEÇÃO */}
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Painel Operacional de Insumos
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Visão holística de inventário, alertas de demanda e controle de movimentações.
          </p>
        </div>

        {/* 1. INDICADORES EM CARDS (KPIs Globais) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={isDarkMode ? "bg-slate-900/80 border-slate-800 shadow-md" : "bg-white border-slate-200 shadow-sm"}>
            <CardHeader className="pb-2">
              <CardDescription className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Total Cadastrado
              </CardDescription>
              <CardTitle className={`text-3xl font-extrabold flex items-center justify-between ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {kpis.total}
                <Boxes className={`w-6 h-6 ${isDarkMode ? "text-slate-600" : "text-slate-400"}`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>Insumos sob gestão industrial</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-slate-900/80 border-emerald-500/20 shadow-md" : "bg-white border-emerald-200 shadow-sm"}>
            <CardHeader className="pb-2">
              <CardDescription className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                Estoque Normal
              </CardDescription>
              <CardTitle className="text-3xl font-extrabold text-emerald-500 flex items-center justify-between">
                {kpis.normal}
                <CheckCircle2 className="w-6 h-6 text-emerald-500/60" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xs ${isDarkMode ? "text-emerald-500/70" : "text-emerald-600"}`}>Quantidade acima do limite seguro</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-slate-900/80 border-amber-500/20 shadow-md" : "bg-white border-amber-200 shadow-sm"}>
            <CardHeader className="pb-2">
              <CardDescription className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-amber-400" : "text-amber-600"}`}>
                Estoque Baixo
              </CardDescription>
              <CardTitle className="text-3xl font-extrabold text-amber-500 flex items-center justify-between">
                {kpis.baixo}
                <AlertTriangle className="w-6 h-6 text-amber-500/60" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xs ${isDarkMode ? "text-amber-500/70" : "text-amber-600"}`}>Necessita de reposição em breve</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-slate-900/80 border-red-500/20 shadow-md" : "bg-white border-red-200 shadow-sm"}>
            <CardHeader className="pb-2">
              <CardDescription className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                Sem Estoque
              </CardDescription>
              <CardTitle className="text-3xl font-extrabold text-red-500 flex items-center justify-between">
                {kpis.semEstoque}
                <XCircle className="w-6 h-6 text-red-500/60" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xs ${isDarkMode ? "text-red-500/70" : "text-red-600"}`}>Risco imediato de parada de linha</p>
            </CardContent>
          </Card>
        </section>

        {/* 2. GRÁFICOS ANALÍTICOS (Estatísticas Globais) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 1: Barras - Materiais por Categoria */}
          <Card className={isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"}>
            <CardHeader>
              <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                <Sparkles className="w-4 h-4 text-emerald-500" /> Materiais por Categoria
              </CardTitle>
              <CardDescription className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Distribuição de itens cadastrados entre os setores da planta.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="categoria" stroke={isDarkMode ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} />
                  <YAxis stroke={isDarkMode ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={
                      isDarkMode 
                        ? { backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc", borderRadius: "8px" } 
                        : { backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#0f172a", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }
                    }
                    itemStyle={{ color: "#10b981" }}
                  />
                  <Bar dataKey="quantidade" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico 2: Rosca - Saúde do Estoque */}
          <Card className={isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"}>
            <CardHeader>
              <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                <Sparkles className="w-4 h-4 text-emerald-500" /> Saúde Geral do Estoque
              </CardTitle>
              <CardDescription className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Proporção da situação operacional de matérias-primas.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={
                      isDarkMode 
                        ? { backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc", borderRadius: "8px" } 
                        : { backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#0f172a", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }
                    }
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={(value) => <span className={`text-xs ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{value}</span>} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* 3. LISTAGEM COM BUSCA E FILTROS */}
        <section className="space-y-4">
          <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
            isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            
            {/* Campo de Busca por Nome/Código */}
            <div className="relative w-full md:w-80">
              <Search className={`w-4 h-4 absolute left-3 top-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
              <Input 
                placeholder="Buscar por nome ou código..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`pl-9 text-sm ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>

            {/* Filtros por Categoria e Situação */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              <div className="w-40">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className={`text-xs ${
                    isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"}>
                    <SelectItem value="TODAS">Todas Categorias</SelectItem>
                    {CATEGORIAS.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className={`text-xs ${
                    isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    <SelectValue placeholder="Situação" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"}>
                    <SelectItem value="TODAS">Todas Situações</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Estoque baixo">Estoque baixo</SelectItem>
                    <SelectItem value="Sem estoque">Sem estoque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botão Limpar Filtros */}
              {(searchTerm || selectedCategory !== "TODAS" || selectedStatus !== "TODAS") && (
                <Button 
                  variant="ghost" 
                  onClick={handleClearFilters}
                  className={`text-xs h-9 px-2 ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Limpar
                </Button>
              )}
            </div>
          </div>

          {/* TABELA DE MATERIAIS */}
          <div className={`rounded-xl border overflow-hidden shadow-lg transition-colors ${
            isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <Table>
              <TableHeader className={isDarkMode ? "bg-slate-950/80" : "bg-slate-100/80"}>
                <TableRow className={isDarkMode ? "border-slate-800 hover:bg-transparent" : "border-slate-200 hover:bg-transparent"}>
                  <TableHead className={`font-semibold text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>CÓDIGO</TableHead>
                  <TableHead className={`font-semibold text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>MATERIAL</TableHead>
                  <TableHead className={`font-semibold text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>CATEGORIA</TableHead>
                  <TableHead className={`font-semibold text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>UNIDADE</TableHead>
                  <TableHead className={`font-semibold text-xs text-right ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>DISPONÍVEL</TableHead>
                  <TableHead className={`font-semibold text-xs text-right ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>ESTOQUE MÍN.</TableHead>
                  <TableHead className={`font-semibold text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>SITUAÇÃO</TableHead>
                  <TableHead className={`font-semibold text-xs text-right ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>AÇÃO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length === 0 ? (
                  <TableRow className={isDarkMode ? "border-slate-800 hover:bg-transparent" : "border-slate-200 hover:bg-transparent"}>
                    <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Boxes className="w-8 h-8 text-slate-400 opacity-60" />
                        <p className="text-sm font-medium">Nenhum material encontrado com os filtros aplicados.</p>
                        <Button variant="link" onClick={handleClearFilters} className="text-emerald-500 text-xs">
                          Resetar busca e filtros
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((m) => {
                    const situacao = calcularSituacao(m.quantidade, m.estoqueMinimo);
                    return (
                      <TableRow 
                        key={m.id} 
                        className={`transition-colors ${
                          isDarkMode 
                            ? "border-slate-800/60 hover:bg-slate-800/40" 
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <TableCell className="font-mono text-xs text-emerald-500 font-semibold">{m.codigo}</TableCell>
                        <TableCell className={`font-medium ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>{m.nome}</TableCell>
                        <TableCell className="text-xs">
                          <span className={`px-2 py-1 rounded ${
                            isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                          }`}>{m.categoria}</span>
                        </TableCell>
                        <TableCell className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{m.unidade}</TableCell>
                        <TableCell className={`text-right font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{m.quantidade.toLocaleString()}</TableCell>
                        <TableCell className={`text-right text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{m.estoqueMinimo.toLocaleString()}</TableCell>
                        <TableCell>{renderBadgeSituacao(situacao)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleOpenMoveModal(m)}
                            className={`text-xs h-8 transition-colors ${
                              isDarkMode 
                                ? "border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400" 
                                : "border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600"
                            }`}
                          >
                            Movimentar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>

      {/* MODAL DE MOVIMENTAÇÃO DE ESTOQUE */}
      <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
        <DialogContent className={
          isDarkMode 
            ? "bg-slate-900 border-slate-800 text-slate-100 max-w-md" 
            : "bg-white border-slate-200 text-slate-900 max-w-md"
        }>
          <DialogHeader>
            <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Movimentar Estoque
            </DialogTitle>
            <DialogDescription className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {selectedMaterialForMove && (
                <span>
                  Item: <strong className="text-emerald-500">{selectedMaterialForMove.nome} ({selectedMaterialForMove.codigo})</strong> | Saldo atual: <strong className={isDarkMode ? "text-white" : "text-slate-900"}>{selectedMaterialForMove.quantidade} {selectedMaterialForMove.unidade}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {moveError && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{moveError}</span>
            </div>
          )}

          <form onSubmit={handleExecuteMove} className="space-y-4 py-2">
            <div>
              <Label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Tipo de Movimentação *</Label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => setMovement({ ...movement, tipo: "ENTRADA" })}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    movement.tipo === "ENTRADA"
                      ? isDarkMode
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : isDarkMode
                        ? "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4 text-emerald-500" /> Entrada (+)
                </button>
                <button
                  type="button"
                  onClick={() => setMovement({ ...movement, tipo: "SAIDA" })}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    movement.tipo === "SAIDA"
                      ? isDarkMode
                        ? "bg-red-500/20 border-red-500 text-red-300"
                        : "bg-red-50 border-red-500 text-red-700"
                      : isDarkMode
                        ? "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-red-500" /> Saída (-)
                </button>
              </div>
            </div>

            <div>
              <Label className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                Quantidade * ({selectedMaterialForMove?.unidade})
              </Label>
              <Input 
                type="number"
                placeholder="Informe a quantidade"
                value={movement.quantidade}
                onChange={e => setMovement({ ...movement, quantidade: e.target.value })}
                className={`mt-1 text-sm ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600" 
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>

            <DialogFooter className="pt-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsMoveOpen(false)} 
                className={isDarkMode ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold">
                Confirmar Registro
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}