"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Factory, 
  Boxes, 
  TrendingUp, 
  ShieldAlert, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Send,
  SlidersHorizontal,
  Zap,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";

// Componentes shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  // Estado do Tema (Dark/Light)
  const [isDark, setIsDark] = useState(true);

  // Estado do Formulário de Leads
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    interest: "estoque",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`min-h-screen font-sans relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? "bg-[#05110d] text-slate-100 selection:bg-emerald-500 selection:text-slate-950" 
        : "bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white"
    }`}>
      
      {/* Luzes de fundo inspiradas em Auroras Verdes (ajustadas dinamicamente para cada tema) */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[300px] blur-[140px] pointer-events-none rounded-full transition-opacity duration-300 ${
        isDark ? "bg-emerald-500/15" : "bg-emerald-300/30"
      }`} />
      <div className={`absolute top-20 right-1/4 w-[400px] h-[350px] blur-[160px] pointer-events-none rounded-full transition-opacity duration-300 ${
        isDark ? "bg-teal-500/10" : "bg-teal-300/20"
      }`} />
      <div className={`absolute top-96 left-1/3 w-[600px] h-[250px] blur-[150px] pointer-events-none rounded-full transition-opacity duration-300 ${
        isDark ? "bg-green-500/10" : "bg-green-300/20"
      }`} />

      {/* 1. CABEÇALHO */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isDark 
          ? "border-emerald-950/80 bg-[#05110d]/80" 
          : "border-slate-200/80 bg-white/80"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg border transition-colors ${
              isDark 
                ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30" 
                : "bg-emerald-100 border-emerald-300"
            }`}>
              <Factory className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              FLUXORA<span className="text-emerald-500">.</span>
            </span>
          </div>

          <nav className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            <a href="#beneficios" className="hover:text-emerald-500 transition-colors">Benefícios</a>
            <a href="#recursos" className="hover:text-emerald-500 transition-colors">Recursos</a>
            <a href="#previa" className="hover:text-emerald-500 transition-colors">O Sistema</a>
            <a href="#contato" className="hover:text-emerald-500 transition-colors">Solicitar Contato</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Alternador de Tema Claro/Escuro */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className={`rounded-lg transition-all ${
                isDark 
                  ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300" 
                  : "border-slate-200 bg-white text-emerald-700 hover:bg-slate-100"
              }`}
              title={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Link href="/demo">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-900/20 transition-all border-0">
                Acessar Demonstração
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className={`relative pt-24 pb-20 border-b transition-colors ${
        isDark ? "border-emerald-950/60" : "border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <Badge variant="outline" className={`mb-6 px-3 py-1 gap-1.5 transition-colors ${
              isDark 
                ? "border-emerald-500/30 text-emerald-300 bg-emerald-950/50" 
                : "border-emerald-300 text-emerald-800 bg-emerald-50"
            }`}>
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Plataforma SaaS para Indústria 4.0
            </Badge>
            <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-none transition-colors ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Controle absoluto de <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 bg-clip-text text-transparent">
                matéria-prima em tempo real
              </span>
            </h1>
            <p className={`text-lg mb-8 leading-relaxed max-w-2xl transition-colors ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Elimine gargalos na produção, preveja rupturas de insumos e automatize a gestão de estoque industrial com inteligência operacional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contato">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold w-full sm:w-auto gap-2 shadow-md shadow-emerald-600/20 border-0">
                  Agendar Demonstração Guiada
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#previa">
                <Button size="lg" variant="outline" className={`w-full sm:w-auto font-semibold transition-colors ${
                  isDark 
                    ? "border-emerald-900/60 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-200" 
                    : "border-slate-300 bg-white hover:bg-slate-100 text-slate-800"
                }`}>
                  Ver Visualização do Dashboard
                </Button>
              </a>
            </div>

            <div className={`mt-12 flex items-center gap-6 text-xs border-t pt-6 transition-colors ${
              isDark ? "text-slate-400 border-emerald-950/80" : "text-slate-500 border-slate-200"
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sem necessidade de ERP complexo
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-500" /> Implementação rápida
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENEFÍCIOS */}
      <section id="beneficios" className={`py-20 border-b transition-colors ${
        isDark ? "border-emerald-950/60 bg-[#030a08]/60" : "border-slate-200 bg-emerald-50/40"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-2">
              Por que a Fluxora?
            </h2>
            <p className={`text-3xl font-bold transition-colors ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Engenharia de processos aplicada ao seu inventário
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className={`transition-all hover:shadow-lg ${
              isDark 
                ? "bg-[#071712]/80 border-emerald-950 text-slate-100 hover:border-emerald-500/40 hover:shadow-emerald-950/50" 
                : "bg-white border-slate-200 text-slate-900 hover:border-emerald-300 hover:shadow-emerald-100"
            }`}>
              <CardHeader>
                <div className={`p-2.5 rounded-md w-fit mb-3 border ${
                  isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-100 border-emerald-200"
                }`}>
                  <ShieldAlert className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Zero Paradas de Linha</CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Alertas inteligentes emitidos antes que qualquer insumo crítico atinja a margem de risco.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className={`transition-all hover:shadow-lg ${
              isDark 
                ? "bg-[#071712]/80 border-emerald-950 text-slate-100 hover:border-teal-500/40 hover:shadow-emerald-950/50" 
                : "bg-white border-slate-200 text-slate-900 hover:border-emerald-300 hover:shadow-emerald-100"
            }`}>
              <CardHeader>
                <div className={`p-2.5 rounded-md w-fit mb-3 border ${
                  isDark ? "bg-teal-500/10 border-teal-500/20" : "bg-teal-100 border-teal-200"
                }`}>
                  <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl">Otimização do Capital de Giro</CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Reduza o excesso de matérias-primas estocadas sem comprometer a capacidade produtiva.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className={`transition-all hover:shadow-lg ${
              isDark 
                ? "bg-[#071712]/80 border-emerald-950 text-slate-100 hover:border-green-500/40 hover:shadow-emerald-950/50" 
                : "bg-white border-slate-200 text-slate-900 hover:border-emerald-300 hover:shadow-emerald-100"
            }`}>
              <CardHeader>
                <div className={`p-2.5 rounded-md w-fit mb-3 border ${
                  isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-100 border-green-200"
                }`}>
                  <Boxes className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Rastreabilidade Total</CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Acompanhe entrada, consumo por lote e previsão de reabastecimento em um só lugar.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. FUNCIONALIDADES */}
      <section id="recursos" className={`py-20 border-b transition-colors ${
        isDark ? "border-emerald-950/60" : "border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-2">
              Recursos Nativos
            </h2>
            <p className={`text-3xl font-bold mb-4 transition-colors ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Construído para a rotina do chão de fábrica e suprimentos
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BarChart3,
                title: "KPIs Industriais",
                desc: "Métricas de Giro de Estoque, Lead Time de Fornecedor e Taxa de Ruptura."
              },
              {
                icon: SlidersHorizontal,
                title: "Parâmetros Dinâmicos",
                desc: "Defina estoques mínimos e pontos de pedido adaptáveis ao ritmo de produção."
              },
              {
                icon: Zap,
                title: "Entrada e Saída Ágil",
                desc: "Interface projetada para registro rápido por operadores de pátio e almoxarifado."
              },
              {
                icon: ShieldAlert,
                title: "Relatórios de Falhas",
                desc: "Diagnósticos preventivos de insumos que podem travar os próximos lotes."
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-xl border border-l-4 border-l-emerald-500 transition-all ${
                  isDark 
                    ? "border-emerald-950 bg-[#071712]/40 hover:bg-[#071712]" 
                    : "border-slate-200 bg-white hover:bg-emerald-50/50 shadow-sm"
                }`}
              >
                <item.icon className="h-6 w-6 text-emerald-500 mb-4" />
                <h3 className={`font-semibold text-lg mb-2 transition-colors ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRÉVIA DO SISTEMA */}
      <section id="previa" className={`py-20 border-b transition-colors ${
        isDark ? "border-emerald-950/60 bg-[#030a08]/40" : "border-slate-200 bg-slate-100/60"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className={`text-3xl font-bold mb-3 transition-colors ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Visibilidade clara sem poluição visual
            </h2>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              Conheça a interface minimalista que capacita equipes de suprimentos a tomarem decisões em segundos.
            </p>
          </div>

          <div className={`rounded-xl border shadow-2xl p-4 sm:p-6 max-w-5xl mx-auto transition-colors ${
            isDark 
              ? "border-emerald-950 bg-[#071712] shadow-emerald-950/40" 
              : "border-slate-200 bg-white shadow-emerald-900/10"
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b mb-6 ${
              isDark ? "border-emerald-950/80" : "border-slate-200"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-300"}`}></span>
                <span className={`w-3 h-3 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-300"}`}></span>
                <span className={`w-3 h-3 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-300"}`}></span>
                <span className={`text-xs font-mono ml-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  app.fluxora.io/dashboard
                </span>
              </div>
              <Badge variant="outline" className={
                isDark 
                  ? "border-emerald-500/40 text-emerald-300 text-xs bg-emerald-950/40" 
                  : "border-emerald-300 text-emerald-800 text-xs bg-emerald-50"
              }>
                Modo Simulação
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${
                isDark ? "bg-[#05110d] border-emerald-950" : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Total de Insumos</span>
                <div className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>1.420 t</div>
                <span className="text-xs text-emerald-500">↑ 4% em relação ao mês anterior</span>
              </div>
              <div className={`p-4 rounded-lg border ${
                isDark ? "bg-[#05110d] border-emerald-950" : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Materiais Críticos (Alerta)</span>
                <div className="text-2xl font-bold text-amber-500 mt-1">3 Itens</div>
                <span className="text-xs text-amber-600 dark:text-amber-400/80">Abaixo do estoque mínimo</span>
              </div>
              <div className={`p-4 rounded-lg border ${
                isDark ? "bg-[#05110d] border-emerald-950" : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Eficiência de Estoque</span>
                <div className="text-2xl font-bold text-emerald-500 mt-1">98.4%</div>
                <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Operação regular</span>
              </div>
            </div>

            <div className={`rounded-lg border overflow-hidden ${
              isDark ? "border-emerald-950 bg-[#05110d]" : "border-slate-200 bg-white"
            }`}>
              <div className={`px-4 py-3 border-b text-xs font-semibold grid grid-cols-4 ${
                isDark ? "bg-emerald-950/30 border-emerald-950 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
              }`}>
                <span>Material</span>
                <span>Categoria</span>
                <span>Qtd. Atual</span>
                <span>Status</span>
              </div>
              <div className={`divide-y text-xs ${isDark ? "divide-emerald-950/60" : "divide-slate-200"}`}>
                <div className="px-4 py-3 grid grid-cols-4 items-center">
                  <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Aço Laminado 1020</span>
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Metais</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>42.5 toneladas</span>
                  <span><Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Normal</Badge></span>
                </div>
                <div className="px-4 py-3 grid grid-cols-4 items-center">
                  <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Resina Polipropileno</span>
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Polímeros</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>1.2 toneladas</span>
                  <span><Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">Atenção</Badge></span>
                </div>
                <div className="px-4 py-3 grid grid-cols-4 items-center">
                  <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Pigmento Dióxido Titânio</span>
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Químicos</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>350 kg</span>
                  <span><Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30">Crítico</Badge></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CAPTAÇÃO DE LEADS */}
      <section id="contato" className={`py-20 border-b transition-colors ${
        isDark ? "border-emerald-950/60" : "border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className={`mb-4 ${
                isDark 
                  ? "border-emerald-500/30 text-emerald-300 bg-emerald-950/30" 
                  : "border-emerald-300 text-emerald-800 bg-emerald-50"
              }`}>
                Fale com um Especialista
              </Badge>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-colors ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                Pronto para otimizar a gestão de matérias-primas da sua fábrica?
              </h2>
              <p className={`mb-6 leading-relaxed transition-colors ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                Preencha o formulário para receber uma demonstração personalizada com os dados típicos do seu segmento industrial.
              </p>
              
              <div className="space-y-4">
                <div className={`flex items-center gap-3 text-sm transition-colors ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Atendimento por engenheiros de produção
                </div>
                <div className={`flex items-center gap-3 text-sm transition-colors ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  <CheckCircle2 className="h-5 w-5 text-teal-500" />
                  Diagnóstico de vulnerabilidades de estoque gratuito
                </div>
              </div>
            </div>

            {/* FORMULÁRIO DE LEADS */}
            <Card className={`p-2 shadow-xl transition-all ${
              isDark 
                ? "bg-[#071712] border-emerald-950 text-slate-100 shadow-emerald-950/40" 
                : "bg-white border-slate-200 text-slate-900 shadow-emerald-900/10"
            }`}>
              <CardHeader>
                <CardTitle className="text-xl">Solicitar Contato</CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Responda abaixo. Retornaremos em até 2 horas úteis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className={`p-6 rounded-lg border text-center ${
                    isDark 
                      ? "bg-emerald-950/40 border-emerald-500/30" 
                      : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                    <h3 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Solicitação Recebida!
                    </h3>
                    <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Obrigado, {leadForm.name}. Nossos especialistas entrarão em contato via{" "}
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        {leadForm.email}
                      </span>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={isDark ? "text-slate-300" : "text-slate-700"}>
                        Nome completo
                      </Label>
                      <Input
                        id="name"
                        required
                        placeholder="Ex: Carlos Eduardo"
                        className={`transition-colors ${
                          isDark 
                            ? "bg-[#05110d] border-emerald-950 focus:border-emerald-500 text-white" 
                            : "bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900"
                        }`}
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className={isDark ? "text-slate-300" : "text-slate-700"}>
                        E-mail corporativo
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="carlos@suaempresa.com.br"
                        className={`font-semibold transition-colors ${
                          isDark 
                            ? "bg-emerald-950/30 border-emerald-700/60 focus:border-emerald-500 text-emerald-400 placeholder:text-emerald-700/60" 
                            : "bg-emerald-50/50 border-emerald-300 focus:border-emerald-600 text-emerald-800 placeholder:text-emerald-600/50"
                        }`}
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className={isDark ? "text-slate-300" : "text-slate-700"}>
                        Nome da Empresa / Indústria
                      </Label>
                      <Input
                        id="company"
                        required
                        placeholder="Ex: Metalúrgica Silva S.A."
                        className={`transition-colors ${
                          isDark 
                            ? "bg-[#05110d] border-emerald-950 focus:border-emerald-500 text-white" 
                            : "bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900"
                        }`}
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest" className={isDark ? "text-slate-300" : "text-slate-700"}>
                        Área de maior interesse
                      </Label>
                      <Select 
                        value={leadForm.interest} 
                        onValueChange={(val) => setLeadForm({ ...leadForm, interest: val })}
                      >
                        <SelectTrigger className={
                          isDark 
                            ? "bg-[#05110d] border-emerald-950 text-white" 
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className={
                          isDark 
                            ? "bg-[#071712] border-emerald-950 text-white" 
                            : "bg-white border-slate-200 text-slate-900"
                        }>
                          <SelectItem value="estoque">Controle de Estoque de Matéria-Prima</SelectItem>
                          <SelectItem value="alertas">Alertas de Ruptura e Falha</SelectItem>
                          <SelectItem value="indicadores">Indicadores e Relatórios Industriais</SelectItem>
                          <SelectItem value="integracao">Outro / Consultoria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 mt-2 border-0">
                      <Send className="h-4 w-4" /> Enviar Dados de Contato
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. RODAPÉ */}
      <footer className={`py-12 border-t text-sm transition-colors ${
        isDark ? "bg-[#020705] text-slate-500 border-emerald-950" : "bg-slate-100 text-slate-600 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-emerald-500" />
            <span className={`font-bold text-lg tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              FLUXORA
            </span>
            <span className={`text-xs ml-2 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
              © 2026 Fluxora Tecnologia S.A.
            </span>
          </div>

          <div className={`flex gap-6 text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            <a href="#" className="hover:text-emerald-500 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Suporte Técnico</a>
          </div>
        </div>
      </footer>

    </div>
  );
}