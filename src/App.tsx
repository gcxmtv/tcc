import React, { useState } from "react";
import { 
  BookOpen, 
  Award, 
  Users, 
  TrendingUp, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  ShieldAlert,
  GraduationCap,
  Layers,
  Download,
  Scale,
  Gavel,
  Sparkles,
  CheckCircle,
  XCircle,
  Copy,
  Check
} from "lucide-react";
import { jsPDF } from "jspdf";

// Slide contents reflecting the real TCC structure
interface Slide {
  id: string;
  chapter: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  notes?: string;
  type: "cover" | "text" | "stats" | "law" | "regional" | "conclusion" | "table";
}

const TCC_SLIDES: Slide[] = [
  {
    id: "cover",
    chapter: "Apresentação",
    title: "A Presunção Absoluta de Vulnerabilidade no Estupro de Vulnerável e a Omissão do Estado",
    subtitle: "no Combate ao Abuso e Exploração Sexual de Crianças e Adolescentes na Região Norte do Brasil",
    bullets: [
      "Autor: Luiz Henrique Reis Tourinho",
      "Orientador: Prof. Leonardo Assis da Silva Filho",
      "Faculdade Conhecimento e Ciência (FCC) – Belém/PA",
      "Curso: Bacharelado em Direito (2026)"
    ],
    notes: "Abertura oficial dos trabalhos perante a banca examinadora. Destaque para o recorte geográfico na Amazônia e a análise penal.",
    type: "cover"
  },
  {
    id: "intro",
    chapter: "1. Introdução",
    title: "Objeto do Estudo, Foco e Abordagem",
    bullets: [
      "O TCC abordou não apenas os crimes contra vulneráveis com ênfase no Art. 217-A (Código Penal), mas também os delitos previstos no Estatuto da Criança e do Adolescente (ECA).",
      "A pesquisa analisou a grave omissão do Estado brasileiro no seu dever de proteção integral, segurança e informação voltada às crianças e adolescentes.",
      "Foco desta apresentação: Visando objetividade, nos concentraremos no cerne do assunto — a análise criminal, a presunção absoluta de vulnerabilidade e o novo entendimento legislativo (Lei 15.353/2026)."
    ],
    notes: "Explicar rapidamente a abrangência do TCC, mas alinhar a expectativa da banca de que o foco desta defesa será a aplicação prática do Direito Penal.",
    type: "text"
  },
  {
    id: "state-omission",
    chapter: "2. Panorama Situacional",
    title: "Estatísticas, Omissão do Estado e Proteção",
    bullets: [
      "Cenário alarmante: Cerca de 80% dos casos documentados são intrafamiliares. Em regiões isoladas da Amazônia, estima-se subnotificação de até 90%.",
      "Omissão Ilícita Manifesta: Insuficiência escolar (falta de educação sexual preventiva) e extrema precariedade na rede protetiva nas áreas de interior.",
      "Necessidade de Prestação Positiva: O Estado deve estruturar urgentemente salas de escuta protegida (Lei 13.431/2017) e equipar conselhos tutelares e polícias locais.",
      "Consequência Jurídica: A inércia configura responsabilidade do poder público pela facilitação estrutural desses crimes cruéis."
    ],
    notes: "Apresentar rapidamente os números e a falha do Estado nas prestações positivas, e então fazer o gancho informando que agora passará efetivamente aos crimes.",
    type: "text"
  },
  {
    id: "concepts-diferenca",
    chapter: "3. Dignidade Sexual no Direito Penal",
    title: "Abuso vs. Exploração Sexual",
    bullets: [
      "Abuso Sexual: Ausência de mercantilização.",
      "Entendimento Doutrinário: Caracteriza-se por uma relação adulto-cêntrica e desigualdade de poder, onde o adulto se apropria do menor como mero objeto de prazer para satisfação de desejos (COUTO CUNHA, 2021).",
      "Também é definido como um 'jogo sexual' voltado para a estimulação de outrem, submetendo a vítima aos interesses do agressor (AZEVEDO; GUERRA, 1998).",
      "Exploração Sexual: Caracteriza-se pela mercantilização do corpo infantil, envolvendo finalidade de lucro através da utilização da criança ou adolescente para fins sexuais."
    ],
    notes: "Diferenciação clara entre abuso e exploração. O foco deste trabalho incide sobre o Abuso Sexual (Estupro de Vulnerável), onde não há finalidade mercantil.",
    type: "text"
  },
  {
    id: "concepts-vulnerabilidade",
    chapter: "3. Dignidade Sexual no Direito Penal",
    title: "Vulnerabilidade Etária e Presunção",
    bullets: [
      "Vulnerabilidade Etária Absoluta: Menores de 14 anos possuem incapacidade civil/penal de consentimento sexual presumidamente perfeita.",
      "A proteção penal da criança e do adolescente baseia-se na imaturidade fisiológica e psicológica para o entendimento e anuência à prática sexual."
    ],
    notes: "Dar o gancho para a entrada nos tipos penais específicos.",
    type: "text"
  },
  {
    id: "estupro-vulneravel",
    chapter: "4. Análise Criminal",
    title: "Estupro de Vulnerável - Artigo 217-A",
    bullets: [
      '"Art. 217-A. Ter conjunção carnal ou praticar outro ato libidinoso com menor de 14 (catorze) anos: Pena - reclusão, de 10 a 18 anos, e multa."',
      "§ 1º Incorre na mesma pena quem pratica com alguém que, por enfermidade mental ou outra causa, não pode oferecer resistência.",
      "§ 4º A pena é aumentada se o crime é cometido em concurso de 2 ou mais pessoas.",
      "§ 5º As penas aplicam-se independentemente do consentimento da vítima ou do fato de ela ter tido relações anteriores ao crime.",
      "Elementos constitutivos: Dolo (vontade de constranger à prática de ato libidinoso, independendo da intenção de satisfazer a lascívia).",
      "Consumação: A mera contemplação lasciva ou o beijo lascivo podem configurar a infração; o estado de sono também impede defeso, tipificando o crime."
    ],
    notes: "Apresentar o artigo 217-A completo e seus elementos constitutivos. O slide subsequente tratará da questão da tentativa.",
    type: "text"
  },
  {
    id: "tentativa-estupro-vulneravel",
    chapter: "4. Análise Criminal",
    title: "Tentativa no Estupro de Vulnerável",
    bullets: [
      "O crime de estupro de vulnerável admite tentativa?",
      "Posicionamento do STJ: NÃO é cabível a modalidade tentada para o crime de estupro de vulnerável.",
      "Qualquer contato libidinoso com menor de 14 anos já consuma o delito, sendo irrelevante se a conduta foi interrompida ou superficial, pois o bem jurídico da dignidade e liberdade sexual da vítima já se encontra violado.",
      "Jurisprudência: Tema Repetitivo 1121 do STJ – REsp 1.954.997/SC. Outros julgados: REsp 2.172.883/SP e REsp 1.694.310/GO."
    ],
    notes: "Questionamento à banca seguido da jurisprudência consolidada do STJ.",
    type: "text"
  },
  {
    id: "crimes-correlatos-tecnologia",
    chapter: "4. Análise Criminal",
    title: "Crimes Correlatos e do Estatuto da Criança e do Adolescente (ECA)",
    bullets: [
      "Art. 240, § 1º, II, ECA: Agenciar, facilitar, recrutar, coagir ou intermediar a participação de criança ou adolescente em cenas de sexo explícito ou pornográfica.",
      "Art. 241, ECA: Vender, expor à venda, disponibilizar, transmitir, distribuir, publicar ou divulgar cena de sexo explícito ou pornográfica envolvendo criança ou adolescente.",
      "Art. 241-C, ECA: Adquirir, possuir ou armazenar, por qualquer meio, foto, vídeo ou registro contendo cena de sexo explícito ou pornográfica envolvendo menor.",
      "Art. 216-B, CP: Produzir, filmar ou registrar cena de nudez ou ato sexual privado e íntimo sem autorização. Parágrafo Único: Mesma pena para montagens em registros.",
      "Art. 218-C, CP: Oferecer, trocar, disponibilizar, transmitir, publicar ou divulgar, por qualquer meio, cena de estupro, estupro de vulnerável, sexo ou nudez sem consentimento."
    ],
    notes: "Apresentação sistemática dos crimes instrumentais e cibernéticos que violam a dignidade sexual e a infância dentro do ECA e do Código Penal.",
    type: "table"
  },
  {
    id: "tabela-evolucao",
    chapter: "4. Análise Criminal",
    title: "Evolução Legislativa sobre a Presunção e Vulnerabilidade",
    bullets: [
      "Antes de 2009 (Art. 224, CP): Previa presunção de violência e gerou debate (absoluta vs. relativa).",
      "2009 (Lei 12.015): Revogou o art. 224 e criou o art. 217-A. A nova redação buscou superar a presunção.",
      "2017 (Súmula 593 STJ): Consolidou a vulnerabilidade etária absoluta, sendo irrelevante o consentimento.",
      "2018 (Lei 13.718): Acrescentou o §5º ao art. 217-A, expandindo a Súmula 593 para todas as hipóteses de vulnerabilidade.",
      "2025 (STJ REsp 2.045.280): Admitiu, em situação específica, relativização da orientação da Súmula 593, reabrindo o debate.",
      "2025 (CIDH - Comunicado): Manifestou preocupação com a relativização da proteção penal.",
      "2026 (Lei 15.353): Acrescentou o §4º-A reafirmando a proteção penal absoluta e reformulou o §5º."
    ],
    notes: "Tabela cronológica completa sobre a evolução e marcos jurídicos do tema.",
    type: "table"
  },
  {
    id: "romeu-julieta",
    chapter: "5. Interpretações Doutrinárias",
    title: "Teoria de Romeu e Julieta",
    bullets: [
      "Teoria de Romeu e Julieta",
      "Súmula 593 do STJ: O crime de estupro de vulnerável se configura com a conjunção carnal ou prática de ato libidinoso com menor de 14 anos, sendo irrelevante eventual consentimento da vítima para a prática do ato, sua experiência sexual anterior ou existência de relacionamento amoroso com o agente.",
      "Julgados do STJ (Distinguishing / relativização em casos excepcionais): REsp 1.977.165/MS, REsp 2.050.425/MG, REsp 2.045.280"
    ],
    notes: "Apresentar a súmula 593 e citar que o STJ tem julgados relativizando a aplicação em casos específicos (formação de núcleo familiar, pequena diferença de idade).",
    type: "text"
  },
  {
    id: "law-evolution",
    chapter: "5. Interpretações Doutrinárias",
    title: "O Novo Entendimento Legislativo",
    bullets: [
      "Lei nº 12.015/2009: Marco que unificou e consagrou a dignidade sexual de vulneráveis contra velhas classificações morais.",
      "Súmula 593 do STJ: Consolidou que o consentimento ou histórico sexual anterior do vulnerável é irrelevante para a configuração do crime.",
      "Lei nº 15.280/2025: Endureceu severamente a pena base do estupro de vulnerável (Art. 217-A) para 10 a 18 anos de reclusão.",
      "Lei nº 15.353/2026: Positivou por definitivo que a vulnerabilidade é absoluta e insuscetível de qualquer flexibilização judicial, sem possibilidade de relativização pelos Tribunais Superiores."
    ],
    notes: "A Lei de 2026 removeu a margem para a relativização ('Teoria de Romeu e Julieta') pelo magistrado, preservando integralmente o menor.",
    type: "law"
  },
  {
    id: "conclusion",
    chapter: "6. Conclusão",
    title: "Considerações Finais",
    bullets: [
      "O Estado falhou em proteger, mas o Direito Penal respondeu reafirmando a presunção absoluta do vulnerável.",
      "É imperativa a implementação obrigatória, sistemática e contínua de educação sexual preventiva e ampliação orçamentária para estruturar locais de escuta protegida.",
      "O sistema de persecução deve atuar em rede integrada (Conselho Tutelar, Saúde, Segurança e Ministério Público)."
    ],
    notes: "Encerramento. Agradecimento à banca examinadora.",
    type: "conclusion"
  }
];

// Brazilian map stats data 
const STATS_CARDS = [
  { label: "Subnotificação Estimada", value: "Até 90%", desc: "Em áreas remotas e ribeirinhas da Amazônia", type: "ratio", color: "text-red-500", icon: AlertTriangle },
  { label: "Casos por Hora (BR)", value: "3 crianças", desc: "A cada hora, sofreram agressão sexual", type: "count", color: "text-amber-500", icon: TrendingUp },
  { label: "Abuso Intrafamiliar", value: "80% dos casos", desc: "Cometidos por familiares ou pessoas próximas", type: "ratio", color: "text-slate-700", icon: Users }
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"slides" | "dashboard" | "legislation">("slides");

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    TCC_SLIDES.forEach((slide, index) => {
      if (index > 0) {
        doc.addPage();
      }

      const width = 297;
      const height = 210;

      // Outer layout border
      doc.setDrawColor(226, 232, 240);
      doc.rect(5, 5, width - 10, height - 10);

      if (slide.type === "cover") {
        // Draw Cover slide background
        doc.setFillColor(248, 250, 252);
        doc.rect(6, 6, width - 12, height - 12, "F");

        // Solid accent block
        doc.setFillColor(30, 41, 59);
        doc.rect(6, 6, 8, height - 12, "F");

        // Top college label
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        doc.text("FACULDADE CONHECIMENTO E CIÊNCIA – FCC", 25, 20);

        // Slide title
        doc.setFont("times", "bolditalic");
        doc.setFontSize(20);
        doc.setTextColor(15, 23, 42);
        const titleLines = doc.splitTextToSize(slide.title, 245);
        doc.text(titleLines, 25, 45);

        // Slide subtitle
        let subY = 45 + (titleLines.length * 8.5) + 4;
        if (slide.subtitle) {
          doc.setFont("times", "italic");
          doc.setFontSize(12);
          doc.setTextColor(71, 85, 105);
          const subLines = doc.splitTextToSize(slide.subtitle, 245);
          doc.text(subLines, 25, subY);
          subY += (subLines.length * 6) + 4;
        }

        // Horizontal dividing line
        doc.setDrawColor(226, 232, 240);
        doc.line(25, subY + 2, 275, subY + 2);

        // Metadata box
        doc.setDrawColor(203, 213, 225);
        doc.setFillColor(255, 255, 255);
        doc.rect(25, 125, 247, 60, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text("DADOS DA APRESENTAÇÃO DE TCC:", 31, 133);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        
        let metaY = 142;
        slide.bullets.forEach((bullet) => {
          doc.text(`• ${bullet}`, 33, metaY);
          metaY += 7;
        });

      } else {
        // Standard Slide Background
        doc.setFillColor(255, 255, 255);
        doc.rect(6, 6, width - 12, height - 12, "F");

        // Chapter tag
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(slide.chapter.toUpperCase(), 20, 20);

        // Page number
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(`SLIDE ${index + 1} / ${TCC_SLIDES.length}`, 250, 20);

        // Thin dark blue header divider line
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(0.6);
        doc.line(20, 24, 277, 24);

        // Slide Title
        doc.setFont("times", "bolditalic");
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        const titleLines = doc.splitTextToSize(slide.title, 250);
        doc.text(titleLines, 20, 35);

        // Bullet list formatting
        let bulletY = 35 + (titleLines.length * 7.5) + 8;
        
        slide.bullets.forEach((bullet) => {
          // Bullet point (square style)
          doc.setFillColor(30, 41, 59);
          doc.rect(20, bulletY - 2.5, 2, 2, "F");

          const bulletLines = doc.splitTextToSize(bullet, 242);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(51, 65, 85);
          doc.text(bulletLines, 25, bulletY);

          bulletY += (bulletLines.length * 5.8) + 4.5;
        });
      }

      // Consistent slide bottom footer
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.3);
      doc.line(20, 195, 277, 195);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("LUIZ HENRIQUE REIS TOURINHO • CURSO DE BACHARELADO EM DIREITO • FACULDADE FCC", 20, 200);
    });

    doc.save("Apresentacao_TCC_Luiz_Tourinho_FCC.pdf");
  };

  React.useEffect(() => {
    document.title = "TCC HENRIQUE TOURINHO";
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeTab !== "slides") return;
      if (event.key === "ArrowRight" || event.key === "Right") {
        setCurrentSlide((prev) => (prev < TCC_SLIDES.length - 1 ? prev + 1 : prev));
      } else if (event.key === "ArrowLeft" || event.key === "Left") {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTab]);

  const handleNextSlide = () => {
    if (currentSlide < TCC_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleJumpToSlide = (index: number) => {
    setCurrentSlide(index);
    setActiveTab("slides");
  };

  const currentSlideData = TCC_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans selection:bg-[#334155] selection:text-white" id="applet-root">
      
      {/* Top Header Section */}
      <header className="h-20 bg-white border-b border-slate-300 md:px-8 px-4 flex flex-wrap items-center justify-between shrink-0 shadow-sm z-50 sticky top-0" id="header-container">
        <div className="flex items-center gap-4" id="header-brand">
          <div className="h-12 flex items-center justify-center" id="brand-icon-wrapper">
            <img 
              src="https://faculdadefcc.edu.br/wp-content/uploads/2025/06/fcc-colorido.png" 
              alt="Logo Faculdade FCC" 
              className="h-12 w-auto object-contain" 
              referrerPolicy="no-referrer"
              id="fcc-logo-img"
            />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.15em] uppercase text-slate-500 flex items-center gap-2" id="header-title">
              Luiz Henrique R. Tourinho
              <span className="text-[9px] bg-[#E2E8F0] text-[#1E293B] border border-slate-300 px-2 py-0.5 rounded-none font-mono tracking-normal shrink-0" id="bacharel-badge">
                DIREITO PENAL
              </span>
            </h1>
            <p className="text-xs font-semibold text-slate-600 truncate max-w-xs md:max-w-md" id="header-subtitle">
              Faculdade Conhecimento e Ciência (FCC) • Belém - PA (2026)
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs (Geometric) */}
        <div className="flex bg-[#E2E8F0] p-1 rounded-none border border-slate-300" id="tabs-navigation">
          <button
            onClick={() => setActiveTab("slides")}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "slides" 
                ? "bg-white text-[#1E293B] shadow-sm font-black border-b-2 border-[#334155]" 
                : "text-slate-500 hover:text-slate-800"
            }`}
            id="tab-slides"
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-600" /> Slides
          </button>
          
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "dashboard" 
                ? "bg-white text-[#1E293B] shadow-sm font-black border-b-2 border-[#334155]" 
                : "text-slate-500 hover:text-slate-800"
            }`}
            id="tab-dashboard"
          >
            <TrendingUp className="h-3.5 w-3.5 text-slate-600" /> Métricas
          </button>

          <button
            onClick={() => setActiveTab("legislation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "legislation" 
                ? "bg-white text-[#1E293B] shadow-sm font-black border-b-2 border-[#334155]" 
                : "text-slate-500 hover:text-slate-800"
            }`}
            id="tab-legislation"
          >
            <FileText className="h-3.5 w-3.5 text-slate-600" /> Leis
          </button>


        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-1 w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8" id="main-content-layout">
        
        {/* Left Side: Index & Quick Navigation Panel (Desktop Only) */}
        <aside className="lg:col-span-1 flex flex-col gap-4" id="sidebar-panel">
          <div className="bg-[#E2E8F0] p-5 rounded-none border border-slate-300 flex flex-col h-full shrink-0" id="sidebar-wrapper">
            <h2 className="uppercase text-[10px] font-black tracking-[0.25em] text-slate-500 mb-4 flex items-center gap-2" id="index-title">
              <Layers className="h-4 w-4 text-slate-600" /> SUMÁRIO DE SLIDES
            </h2>
            
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] lg:max-h-none" id="slide-jump-list">
              {TCC_SLIDES.map((slide, index) => {
                const isActive = currentSlide === index && activeTab === "slides";
                const numStr = String(index + 1).padStart(2, "0");
                return (
                  <button
                    key={slide.id}
                    onClick={() => handleJumpToSlide(index)}
                    className={`w-full text-left p-3 rounded-none text-xs font-semibold uppercase tracking-wider transition flex items-start gap-3 border ${
                      isActive
                        ? "bg-white border-[#334155] ring-2 ring-[#334155] text-slate-900 font-bold"
                        : "bg-white/60 border-slate-300 opacity-70 hover:opacity-100 text-slate-600 hover:bg-white"
                    }`}
                    id={`btn-slide-nav-${slide.id}`}
                  >
                    <span className="font-mono text-[10px] text-slate-400 mt-0.5 shrink-0">{numStr}</span>
                    <div className="truncate flex-1">
                      <span className="font-mono text-slate-400 block text-[9px] lowercase tracking-normal leading-tight">{slide.chapter}</span>
                      <span className="block truncate font-bold text-[11px] tracking-tight">{slide.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-350 mt-5" id="sidebar-footer">
              <div className="p-4 bg-white/75 border border-slate-300 rounded-none space-y-3" id="banca-summary-widget">
                <p className="text-[10px] font-mono font-bold tracking-[0.1em] text-slate-500 uppercase flex items-center gap-1.5 leading-none">
                  <Award className="h-4 w-4 text-slate-700" /> FICHA TÉCNICA
                </p>
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-500 font-medium">Orientador:</span>
                  <span className="font-bold text-slate-800">Prof. Leonardo Assis</span>
                </div>
                <div className="flex justify-between text-[11px] border-t border-slate-200 pt-2">
                  <span className="text-slate-500 font-medium">Grau:</span>
                  <span className="font-bold text-slate-800">Bacharel em Direito</span>
                </div>
                <div className="flex justify-between text-[11px] border-t border-slate-200 pt-2">
                  <span className="text-slate-500 font-medium">Cidade/Ano:</span>
                  <span className="font-mono text-slate-800 uppercase font-bold text-[10px]">Belém-PA (2026)</span>
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="w-full mt-3 px-4 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-white text-[10px] font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition"
                id="btn-download-pdf-sidebar"
              >
                <Download className="h-4 w-4 shrink-0" /> Salvar Slides em PDF
              </button>
            </div>
          </div>
        </aside>

        {/* Center/Right Dynamic Main Frame */}
        <section className="lg:col-span-3 flex flex-col gap-6" id="center-dynamic-canvas">
          
          {/* Dynamic Tab 1: Slide Presentation View */}
          {activeTab === "slides" && (
            <div className="bg-white rounded-none border border-slate-300 overflow-hidden shadow-sm flex flex-col justify-between min-h-[520px] relative" id="slide-viewer-box">
              
              {/* Massive back watermark */}
              <div className="absolute top-2 right-4 text-[#EEF2F6] font-mono text-[120px] font-black leading-none select-none pointer-events-none">
                {String(currentSlide + 1).padStart(2, "0")}
              </div>

              {/* Slide Screen Header bar */}
              <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center z-10" id="slide-header-bar">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#334155] border-l-4 border-[#334155] pl-3 py-0.5" id="slide-chapter-badge">
                  {currentSlideData.chapter}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold" id="slide-counter">
                  SLIDE {currentSlide + 1} / {TCC_SLIDES.length}
                </span>
              </div>

              {/* Main Slide Layout Stage */}
              <div className="p-8 md:p-14 flex-1 flex flex-col justify-center z-10" id="slide-presentation-viewport">
                
                {currentSlideData.type === "cover" ? (
                  <div className="space-y-6" id="slide-layout-cover">
                    <div className="h-1 w-20 bg-[#334155]" id="cover-accent-line"></div>
                    <h2 className="text-2xl md:text-4xl font-serif italic text-slate-950 leading-tight tracking-tight max-w-3xl" id="cover-main-title">
                      {currentSlideData.title}
                    </h2>
                    {currentSlideData.subtitle && (
                      <p className="text-sm md:text-base text-slate-600 max-w-xl font-medium leading-relaxed" id="cover-subtitle">
                        {currentSlideData.subtitle}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl pt-6 border-t border-slate-200" id="cover-metadata-grid">
                      {currentSlideData.bullets.map((bullet, i) => (
                        <div key={i} className="text-slate-700 text-xs font-semibold bg-[#F8FAFC] border-l-2 border-[#334155] p-3 rounded-none" id={`cover-meta-item-${i}`}>
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6" id="slide-layout-standard">
                    <div className="space-y-1">
                      <div className="h-1 w-16 bg-[#334155]"></div>
                      <h2 className="text-xl md:text-3xl font-serif italic text-slate-900 leading-tight tracking-tight" id="slide-standard-title">
                        {currentSlideData.title}
                      </h2>
                    </div>
                    
                    {currentSlideData.type === "table" ? (
                      <div className="space-y-4" id="slide-table-layout">
                        <div className="mt-4 border border-slate-350 w-full rounded-none shadow-sm bg-white overflow-hidden max-h-[48vh] overflow-y-auto" id="slide-table-container">
                          {currentSlideData.id === "tabela-evolucao" ? (
                            <table className="w-full text-left border-collapse text-xs md:text-sm">
                              <thead className="bg-[#1E293B] text-white">
                                <tr>
                                  <th className="py-2.5 px-3 border border-slate-600 w-1/5">Período / Marco</th>
                                  <th className="py-2.5 px-3 border border-slate-600 w-1/5">Norma / Decisão</th>
                                  <th className="py-2.5 px-3 border border-slate-600 w-2/5">Conteúdo</th>
                                  <th className="py-2.5 px-3 border border-slate-600 w-1/5">Impacto</th>
                                </tr>
                              </thead>
                              <tbody className="bg-slate-50 text-slate-800">
                                <tr className="border-b border-white">
                                  <td className="py-3 px-3 border-r border-white font-bold align-top">Antes de 2009</td>
                                  <td className="py-3 px-3 border-r border-white align-top font-mono text-[10px] md:text-xs text-slate-600">Art. 224 do CP</td>
                                  <td className="py-3 px-3 border-r border-white bg-slate-100 align-top font-medium">Previa presunção de violência nos atos sexuais contra menores de 14 anos.</td>
                                  <td className="py-3 px-3 align-top">Surgiu intenso debate: a presunção seria absoluta ou relativa?</td>
                                </tr>
                                <tr className="border-b border-white">
                                  <td className="py-3 px-3 border-r border-white font-bold align-top">2009</td>
                                  <td className="py-3 px-3 border-r border-white align-top font-mono text-[10px] md:text-xs text-slate-600">Lei nº 12.015/2009</td>
                                  <td className="py-3 px-3 border-r border-white bg-slate-100 align-top font-medium">Revogou o art. 224 e criou o <strong>art. 217-A</strong> (estupro de vulnerável).</td>
                                  <td className="py-3 px-3 align-top">Buscou superar a lógica da presunção, mas não encerrou a discussão.</td>
                                </tr>
                                <tr className="border-b border-white">
                                  <td className="py-3 px-3 border-r border-white font-bold align-top">2017</td>
                                  <td className="py-3 px-3 border-r border-white align-top font-mono text-[10px] md:text-xs text-[#1E293B] font-bold">Súmula 593 do STJ</td>
                                  <td className="py-3 px-3 border-r border-white bg-slate-100 align-top font-medium">Irrelevantes consentimento, experiência anterior ou relacionamento.</td>
                                  <td className="py-3 px-3 align-top font-bold text-center">Consolidou a ideia de vulnerabilidade etária absoluta.</td>
                                </tr>
                                <tr className="border-b border-white">
                                  <td className="py-3 px-3 border-r border-white font-bold align-top relative">2018</td>
                                  <td className="py-3 px-3 border-r border-white align-top font-mono text-[10px] md:text-xs text-slate-600">Lei nº 13.718/2018</td>
                                  <td className="py-3 px-3 border-r border-white bg-slate-100 align-top font-medium">Acrescentou o <strong>§5º ao art. 217-A</strong>.</td>
                                  <td className="py-3 px-3 align-top">O legislador expandiu a Súmula 593 para todas as hipóteses.</td>
                                </tr>
                                <tr className="border-b border-white">
                                  <td className="py-4 px-3 border-r border-white font-bold align-top" rowSpan={2}>2025</td>
                                  <td className="py-4 px-3 border-r border-white align-top font-mono text-[10px] md:text-xs text-slate-600">STJ – REsp 2.045.280</td>
                                  <td className="py-4 px-3 border-r border-white bg-slate-100 align-top font-medium">Admitiu, em situação específica, relativização da Súmula 593.</td>
                                  <td className="py-4 px-3 align-top">Reabriu o debate sobre a possibilidade de afastar o crime em exceções.</td>
                                </tr>
                                <tr className="border-b border-white">
                                  <td className="py-4 px-3 border-r border-white align-top font-mono text-[10px] md:text-xs text-slate-600">CIDH – Comunicado</td>
                                  <td className="py-4 px-3 border-r border-white bg-slate-100 align-top font-medium">A CIDH manifestou preocupação com a relativização da proteção.</td>
                                  <td className="py-4 px-3 align-top">Alertou para violação dos deveres de prevenção e proteção integral.</td>
                                </tr>
                                <tr>
                                  <td className="py-4 px-3 border-r border-white font-bold align-top">2026</td>
                                  <td className="py-4 px-3 border-r border-white align-top font-mono text-[10px] md:text-xs text-[#1E293B] font-bold">Lei nº 15.353/2026</td>
                                  <td className="py-4 px-3 border-r border-white bg-slate-100 align-top font-medium">Acrescentou o <strong>§4º-A</strong> (inadmissível relativização) e reformulou o <strong>§5º</strong>.</td>
                                  <td className="py-4 px-3 align-top font-bold bg-[#1E293B] text-white">Reafirmou a proteção penal absoluta.</td>
                                </tr>
                              </tbody>
                            </table>
                          ) : currentSlideData.id === "crimes-correlatos-tecnologia" ? (
                            <table className="w-full text-left border-collapse text-xs md:text-sm">
                              <thead className="bg-[#1E293B] text-white">
                                <tr>
                                  <th className="py-3 px-4 border border-slate-600 w-1/2 bg-[#1E293B]">Estatuto da Criança e do Adolescente (ECA)</th>
                                  <th className="py-3 px-4 border border-slate-600 w-1/2 bg-[#334155] border-l border-slate-500">Código Penal (CP)</th>
                                </tr>
                              </thead>
                              <tbody className="bg-slate-50 text-slate-800">
                                <tr className="border-b border-slate-200">
                                  <td className="py-4 px-4 border-r border-slate-200 align-top">
                                    <div className="font-mono text-[11px] text-red-600 font-bold bg-red-50 inline-block px-1.5 py-0.5 mb-1.5">Art. 240, § 1º, II, ECA</div>
                                    <p className="text-slate-800 leading-normal font-semibold text-xs md:text-xs">
                                      Agenciar, facilitar, recrutar, coagir ou intermediar a participação de criança ou adolescente em cenas de sexo explícito ou pornográfica.
                                    </p>
                                    <div className="font-mono text-[10px] text-red-700 font-bold bg-red-50/80 inline-block px-1.5 py-0.5 mt-2 rounded">
                                      Pena: Reclusão, 4 a 8 anos, e multa
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 align-top">
                                    <div className="font-mono text-[11px] text-slate-700 font-bold bg-slate-100 inline-block px-1.5 py-0.5 mb-1.5">Art. 216-B, CP</div>
                                    <p className="text-slate-800 leading-normal font-semibold text-xs md:text-xs">
                                      Produzir, filmar ou registrar cena de nudez ou ato sexual privado e íntimo sem autorização.
                                    </p>
                                    <div className="font-mono text-[10px] text-slate-700 font-bold bg-slate-100/80 inline-block px-1.5 py-0.5 mt-2 rounded mr-1">
                                      Pena: Detenção, 6 meses a 1 ano, e multa
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                                      *Parágrafo Único: Mesma pena para montagens em registros (deepfakes).
                                    </p>
                                  </td>
                                </tr>
                                <tr className="border-b border-slate-200">
                                  <td className="py-4 px-4 border-r border-slate-200 align-top bg-slate-100/50">
                                    <div className="font-mono text-[11px] text-red-600 font-bold bg-red-50 inline-block px-1.5 py-0.5 mb-1.5">Art. 241, ECA</div>
                                    <p className="text-slate-800 leading-normal font-semibold text-xs md:text-xs">
                                      Vender, expor à venda, disponibilizar, transmitir, distribuir, publish ou divulgar por qualquer meio cena de sexo explícito ou pornográfica envolvendo criança ou adolescente.
                                    </p>
                                    <div className="font-mono text-[10px] text-red-700 font-bold bg-red-50/80 inline-block px-1.5 py-0.5 mt-2 rounded">
                                      Pena: Reclusão, 4 a 8 anos, e multa
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 align-top bg-slate-100/50">
                                    <div className="font-mono text-[11px] text-slate-700 font-bold bg-slate-100 inline-block px-1.5 py-0.5 mb-1.5">Art. 218-C, CP</div>
                                    <p className="text-slate-800 leading-normal font-semibold text-xs md:text-xs">
                                      Oferecer, trocar, disponibilizar, transmitir, publicar ou divulgar, por qualquer meio, cena de estupro, estupro de vulnerável, sexo ou nudez sem consentimento.
                                    </p>
                                    <div className="font-mono text-[10px] text-slate-700 font-bold bg-slate-200/80 inline-block px-1.5 py-0.5 mt-2 rounded">
                                      Pena: Reclusão, 1 a 5 anos
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-4 px-4 border-r border-slate-200 align-top">
                                    <div className="font-mono text-[11px] text-red-600 font-bold bg-red-50 inline-block px-1.5 py-0.5 mb-1.5">Art. 241-C, ECA</div>
                                    <p className="text-slate-800 leading-normal font-semibold text-xs md:text-xs">
                                      Adquirir, possuir ou armazenar, por qualquer meio, foto, vídeo ou registro contendo cena de sexo explícito ou pornográfica envolvendo menor.
                                    </p>
                                    <div className="font-mono text-[10px] text-red-700 font-bold bg-red-50/80 inline-block px-1.5 py-0.5 mt-2 rounded">
                                      Pena: Reclusão, 1 a 4 anos, e multa
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 align-top bg-slate-100/30 text-slate-500 italic">
                                    <span className="text-[11px] font-mono block mb-1">Sem correspondência direta no CP</span>
                                    <span className="text-[11.5px] leading-relaxed block font-semibold text-slate-600">
                                      Armazenamento e a posse individual de pornografia infantojuvenil constitui tipo penal autônomo criado especificamente no estatuto menorista (ECA).
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : null}
                        </div>

                        {currentSlideData.id === "crimes-correlatos-tecnologia" && (
                          <div className="bg-blue-50/85 border-l-4 border-blue-600 p-4 shadow-xs mt-3 flex gap-3 items-start" id="diferencial-protetivo-note">
                            <Scale className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <h4 className="font-sans font-extrabold text-[#1E293B] text-xs uppercase tracking-wider">
                                Diferencial Protetivo Sistêmico
                              </h4>
                              <p className="text-slate-700 text-xs md:text-[13px] leading-relaxed">
                                O Estatuto da Criança e do Adolescente (ECA) adota uma premissa de <strong>vulnerabilidade absoluta permanente</strong> baseada estritamente na menoridade (protegendo pessoas até 18 anos incompletos nos Artigos 240, 241 e correlatos). Em contraste, as inovações no Código Penal (CP) tutelam as infrações à dignidade sexual e privacidade de forma ampla, cuja caracterização gravita essencialmente em torno da ausência de consentimento de sujeitos capazes.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : currentSlideData.id === "romeu-julieta" ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start" id="romeu-julieta-container">
                        <ul className="space-y-4 pt-2 border-l border-slate-200 pl-6" id="slide-bullet-list">
                          {currentSlideData.bullets.map((bullet, i) => {
                            const isMainPrereq = bullet.includes("Súmula 593") || bullet.includes("Lei nº 15.353/2026") || bullet.includes("Art. 217-A") || bullet.includes("subnotificação") || bullet.includes("Tema Repetitivo 1121");
                            return (
                              <li 
                                key={i} 
                                className={`text-slate-700 text-sm md:text-base leading-relaxed flex items-start gap-1 p-2 rounded-none transition ${
                                  isMainPrereq ? "bg-[#F1F5F9] border-l-2 border-[#1E293B] text-slate-950 font-medium" : "hover:bg-slate-50"
                                }`}
                                id={`slide-bullet-${i}`}
                              >
                                <span className="w-1.5 h-1.5 bg-[#334155] rotate-45 shrink-0 mt-2 mr-3" id={`bullet-counter-${i}`} />
                                <span className="flex-1">{bullet}</span>
                              </li>
                            )
                          })}
                        </ul>
                        <div className="bg-amber-50/70 border-l-4 border-amber-500 p-5 shadow-sm space-y-3" id="stj-informative-box">
                          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs font-mono uppercase tracking-wider">
                            <Scale className="h-4 w-4 text-amber-700" />
                            <span>Informativo 820 - STJ</span>
                          </div>
                          <p className="text-slate-800 text-xs md:text-sm leading-relaxed italic">
                            &ldquo;É possível o reconhecimento da atipicidade de conduta que poderia configurar o crime de estupro de vulnerável, quando as circunstâncias fáticas verificadas (consentimento da família da vítima, inclusive abrigando o casal por período de tempo, e a manutenção do relacionamento até os dias atuais, inclusive com nascimento de filho fruto da relação), indicam que o bem jurídico tutelado não foi vulnerado.&rdquo;
                          </p>
                          <div className="text-[10px] text-slate-500 font-mono text-right">
                            Tribunal da Cidadania • Distinguishing Constitucional
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ul className="space-y-4 pt-4 border-l border-slate-200 pl-6" id="slide-bullet-list">
                        {currentSlideData.bullets.map((bullet, i) => {
                          // highlight important statutes as code styling dynamically
                          const isMainPrereq = bullet.includes("Súmula 593") || bullet.includes("Lei nº 15.353/2026") || bullet.includes("Art. 217-A") || bullet.includes("subnotificação") || bullet.includes("Tema Repetitivo 1121");
                          return (
                            <li 
                              key={i} 
                              className={`text-slate-700 text-sm md:text-base leading-relaxed flex items-start gap-1 p-2 rounded-none transition ${
                                    isMainPrereq ? "bg-[#F1F5F9] border-l-2 border-[#1E293B] text-slate-950 font-medium" : "hover:bg-slate-50"
                              }`}
                              id={`slide-bullet-${i}`}
                            >
                              <span className="w-2 h-2 bg-[#334155] rotate-45 shrink-0 mt-2 mr-3" id={`bullet-counter-${i}`} />
                              <span className="flex-1">{bullet}</span>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Presentation Control Actions Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between z-10" id="presentation-actions-bar">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    disabled={currentSlide === 0}
                    className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none disabled:opacity-30 disabled:cursor-not-allowed transition"
                    id="btn-prev-slide"
                  >
                    ◀ Anterior
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none flex items-center gap-1.5 transition"
                    id="btn-download-pdf-viewer"
                    title="Baixar apresentação completa como PDF"
                  >
                    <Download className="h-3.5 w-3.5 text-[#334155]" /> PDF
                  </button>
                </div>
                
                <div className="hidden sm:flex items-center gap-1.5" id="indicators-list">
                  {TCC_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 transition-all ${
                        currentSlide === idx ? "w-8 bg-[#334155]" : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                      id={`dot-${idx}`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {currentSlide === TCC_SLIDES.length - 1 ? (
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="px-5 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-bold uppercase tracking-widest rounded-none transition"
                    id="btn-goto-dashboard"
                  >
                    Visualizar Métricas ❯
                  </button>
                ) : (
                  <button
                    onClick={handleNextSlide}
                    className="px-5 py-2.5 bg-[#334155] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-widest rounded-none transition"
                    id="btn-next-slide"
                  >
                    Próximo ❯
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Tab 3: Painel de Estatísticas / TCC Insights Dashboard */}
          {activeTab === "dashboard" && (
            <div className="bg-white rounded-none border border-slate-300 p-6 md:p-8 shadow-sm space-y-6" id="dashboard-box">
              <div id="db-header" className="pb-3 border-b border-slate-200">
                <div className="h-1 w-20 bg-[#334155] mb-2"></div>
                <h2 className="text-xl font-serif italic text-slate-900 leading-tight" id="db-title">
                  Panoramas e Fatores de Omissão Estatal Coletados
                </h2>
                <p className="text-xs text-slate-500 mt-1" id="db-desc">
                  Métricas extraídas diretamente pela pesquisa sobre vulnerabilidade na Amazônia Legal (2026).
                </p>
              </div>

              {/* Grid of indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="db-metrics-grid">
                {STATS_CARDS.map((stat, idx) => {
                  const IconComp = stat.icon;
                  return (
                    <div key={idx} className="bg-slate-50 p-5 rounded-none border border-slate-250 flex items-start justify-between relative" id={`metric-box-${idx}`}>
                      <div className="space-y-1">
                        <span className="text-[9px] text-[#334155] font-mono font-bold uppercase tracking-widest block">{stat.label}</span>
                        <span className="text-3xl font-black font-serif text-[#1E293B] block pt-1">{stat.value}</span>
                        <span className="text-slate-600 text-xs block leading-relaxed">{stat.desc}</span>
                      </div>
                      <div className="p-2 bg-white border border-slate-200 text-slate-500" id={`metric-icon-${idx}`}>
                        <IconComp className="h-5 w-5 text-[#334155]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Crucial geographical limitations visualization */}
              <div className="bg-[#1E293B] p-6 rounded-none text-white space-y-4" id="geo-challenges-block">
                <h3 className="text-xs font-bold font-mono tracking-widest text-slate-300 uppercase flex items-center gap-2" id="challenges-subtitle">
                  <MapPin className="h-4 w-4" /> DIFICULDADES LOGÍSTICAS & OPERACIONAIS NA AMAZÔNIA
                </h3>
                
                <div className="space-y-4" id="challenges-list">
                  <div className="flex items-start gap-4 border-l-2 border-slate-600 pl-4" id="chal-1">
                    <div>
                      <span className="font-bold text-white text-xs block uppercase tracking-wider font-mono text-slate-300">Ausência de Salas de Escuta Protegida (Lei 13.431/17):</span>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        Falta quase total de equipes multidisciplinares no interior de estados como o Pará e Amazonas, provocando revitimização crônica de crianças em depoimentos comuns.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-l-2 border-slate-600 pl-4" id="chal-2">
                    <div>
                      <span className="font-bold text-white text-xs block uppercase tracking-wider font-mono text-slate-300">Dispersão Territorial e Vias Fluviais Únicas:</span>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        Ausência de vias terrestres isola distritos ribeirinhos que distam dias de barco da delegacia especializada mais próxima, resultando em uma impunidade naturalizada.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-l-2 border-slate-600 pl-4" id="chal-3">
                    <div>
                      <span className="font-bold text-white text-xs block uppercase tracking-wider font-mono text-slate-300">Complexos de Fronteira e Extração Extrativista:</span>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        Concentrados e vilas de garimpo geram bolsões comerciais que alimentam a exploração sexual comercial no corpo infantil devido ao vácuo total de fiscalização estatal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Tab 4: Mapa de Leis / Legislation Explorer */}
          {activeTab === "legislation" && (
            <div className="bg-white rounded-none border border-slate-300 p-0 md:p-0 shadow-sm overflow-x-auto" id="legislation-box">
              
              <div className="p-6 md:p-8 pb-4">
                <div className="h-1 w-20 bg-[#334155] mb-2"></div>
                <h2 className="text-xl font-serif italic text-slate-900 leading-tight">
                  Arco Normativo e Impactos no Debate Jurídico
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Evolução do debate da presunção de violência à vulnerabilidade absoluta.
                </p>
              </div>

              <table className="w-full text-left border-collapse text-sm mb-4">
                <thead>
                  <tr className="bg-[#4273E1] text-white">
                    <th className="py-3 px-6 font-bold border border-white">Período / Marco</th>
                    <th className="py-3 px-6 font-bold border border-white">Norma ou decisão</th>
                    <th className="py-3 px-6 font-bold border border-white">Conteúdo</th>
                    <th className="py-3 px-6 font-bold border border-white">Impacto no debate jurídico</th>
                  </tr>
                </thead>
                <tbody className="bg-[#EDF2FC] text-slate-800 border-b border-white">
                  <tr>
                    <td className="py-4 px-6 border border-white font-bold align-top"><span className="border border-red-500 rounded-[50%] p-2 py-4">Antes de 2009</span></td>
                    <td className="py-4 px-6 border border-white align-top">Art. <span className="relative">224<span className="absolute -top-4 -right-8 text-red-500 text-lg">⤵</span></span> do Código Penal</td>
                    <td className="py-4 px-6 border border-white bg-[#E1EAFA] align-top">Previa presunção de violência nos atos sexuais contra menores de 14 anos e outras pessoas vulneráveis.</td>
                    <td className="py-4 px-6 border border-white align-top">Surgiu intenso debate: a presunção seria <span className="font-bold">absoluta ou relativa?</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 border border-white font-bold align-top">2009</td>
                    <td className="py-4 px-6 border border-white align-top">Lei 12.015/2009</td>
                    <td className="py-4 px-6 border border-white bg-[#E1EAFA] align-top">Revogou o art. 224 e criou o <strong>art. 217-A</strong> (estupro de vulnerável).</td>
                    <td className="py-4 px-6 border border-white align-top">A nova redação buscou superar a lógica da presunção de violência, mas <span className="font-bold">não encerrou a discussão</span> sobre a relativização da vulnerabilidade.</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 border border-white font-bold align-top">2017</td>
                    <td className="py-4 px-6 border border-white align-top">Súmula 593 do STJ</td>
                    <td className="py-4 px-6 border border-white bg-[#E1EAFA] align-top">Estabeleceu que o crime ocorre com vítima menor de 14 anos, sendo irrelevantes consentimento, experiência sexual anterior ou relacionamento.</td>
                    <td className="py-4 px-6 border border-white align-top text-center"><span className="font-bold">Consolidou a ideia de vulnerabilidade etária absoluta.</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 border border-white font-bold align-top relative">
                      2018
                      <span className="absolute left-6 top-8 text-red-500 text-lg">↗</span>
                    </td>
                    <td className="py-4 px-6 border border-white align-top">Lei 13.718/2018</td>
                    <td className="py-4 px-6 border border-white bg-[#E1EAFA] align-top">Acrescentou o <span className="border border-red-500 rounded-[50%] p-1 relative">§5º <span className="absolute -top-3 -right-6 text-red-500 text-sm">↗</span></span> ao <strong>art. 217-A</strong>, afirmando que o crime se aplica independentemente de consentimento ou experiência sexual da vítima.</td>
                    <td className="py-4 px-6 border border-white align-top">O legislador expandiu o espírito da Súmula 593 para <strong>todas as hipóteses de vulnerabilidade.</strong></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 border border-white font-bold align-top" rowSpan={2}>2025</td>
                    <td className="py-4 px-6 border border-white align-top">STJ – REsp 2.045.280</td>
                    <td className="py-4 px-6 border border-white bg-[#E1EAFA] align-top">Admitiu, em situação específica, relativização da orientação da <strong>Súmula 593</strong> mediante análise do caso concreto.</td>
                    <td className="py-4 px-6 border border-white align-top">Reabriu o debate sobre a <strong>possibilidade de afastar o crime</strong> em determinadas circunstâncias.</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 border border-white align-top">CIDH – Comunicado de imprensa</td>
                    <td className="py-4 px-6 border border-white bg-[#E1EAFA] align-top">A Comissão Interamericana manifestou <strong>preocupação com a relativização da proteção penal de menores de 14 anos.</strong></td>
                    <td className="py-4 px-6 border border-white align-top">Alertou para a possível violação dos deveres de <strong>prevenção e proteção integral.</strong></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 border border-white font-bold align-top">2026</td>
                    <td className="py-4 px-6 border border-white align-top">Lei 15.353/2026</td>
                    <td className="py-4 px-6 border border-white bg-[#E1EAFA] align-top">Acrescentou o <strong>§4º-A</strong> ao art. 217-A, afirmando que a <strong>presunção de vulnerabilidade é absoluta e inadmissível sua relativização</strong>, e reformulou o <strong>§5º.</strong></td>
                    <td className="py-4 px-6 border border-white align-top"><span className="font-bold">Reação legislativa reafirmando a proteção penal absoluta da vulnerabilidade.</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 text-right">
                 <img src="https://logodownload.org/wp-content/uploads/2019/08/gran-cursos-logo.png" className="h-6 opacity-30 inline" alt="Gran Cursos placeholder logo"/>
              </div>
            </div>
          )}


        </section>
      </main>

      {/* Presentation Bottom Footer Context */}
      <footer className="border-t border-slate-300 bg-[#334155] py-4 px-8 text-white text-xs mt-auto flex flex-col sm:flex-row justify-between items-center gap-4" id="applet-footer">
        <p id="footer-text-left" className="font-mono tracking-widest text-[10px] uppercase font-black">
          MODO APRESENTAÇÃO ACADÊMICA ATIVO • BELÉM/PA • 2026
        </p>
        <p id="footer-text-right" className="font-mono text-slate-300 flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-white" /> Luiz Henrique Reis Tourinho • Bacharel em Direito (FCC)
        </p>
      </footer>
    </div>
  );
}
