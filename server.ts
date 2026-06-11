import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy-initialized GenAI helper
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Data about the examiners for context injection
const EXAMINERS_DATA = {
  leonardo: {
    name: "Prof. Leonardo Assis da Silva Filho (Orientador)",
    focus: "Direito Penal, Metodologia de Pesquisa, Proteção Integral no Norte do Brasil",
    style: "Incentivador, acadêmico e busca conectar a teoria com os desafios práticos da Região Norte."
  },
  paulo: {
    name: "Prof. Paulo Roberto Batista Júnior (Banca)",
    focus: "Direito Penal Dogmático, Tipicidade, Súmulas do STJ (Ex: Súmula 593), Doutrina tradicional e reformas recentes",
    style: "Direto, técnico, foca no rigor dogmático, quer saber do artigo 217-A do Código Penal, das novas Leis n° 15.280/2025 e 15.353/2026, e erro de tipo/proibição."
  },
  alvaro: {
    name: "Prof. Álvaro Henrique Seabra de Freitas (Banca)",
    focus: "Constitucionalismo, Direitos Humanos, Sociologia Jurídica e Políticas Públicas de Proteção",
    style: "Crítico, interessado nas causas estruturais (como a omissão escolar na educação sexual preventiva, subnotificação na Amazônia ribeirinha, infraestrutura precária)."
  }
};

// API Endpoint to check server status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API Endpoint to request a question or review defensive answers in the simulated exam
app.post("/api/defense/respond", async (req, res) => {
  try {
    const { history, examinerId, studentAnswer, currentSlideIndex } = req.body;

    const examiner = EXAMINERS_DATA[examinerId as keyof typeof EXAMINERS_DATA] || EXAMINERS_DATA.leonardo;

    // Check key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: "A chave API do Gemini não está configurada nos segredos do sistema. Adicione GEMINI_API_KEY nas Configurações.",
        suggestedResponse: {
          feedback: "A simulação está rodando em modo de demonstração local porque a chave API do Gemini está ausente.",
          question: "Qual é o principal problema identificado no seu TCC quanto à repressão do abuso sexual na Amazônia?",
          score: 8,
          tips: ["Mencione a dispersão populacional e a dependência do transporte fluvial.", "Cite a ausência de salas de depoimento especial."]
        }
      });
    }

    const genAI = getGenAI();

    // Context from the TCC content
    const tccContext = `
      CONTEÚDO DO TCC:
      Título: A presunção absoluta de vulnerabilidade no estupro de vulnerável e a omissão do Estado no combate ao abuso e exploração sexual de crianças e adolescentes na Região Norte do Brasil.
      Autor: Luiz Henrique Reis Tourinho
      Orientador: Prof. Leonardo Assis da Silva Filho
      Local/Data: Belém - PA, 2026.
      Instituição: Faculdade Conhecimento e Ciência (FCC).

      RESUMO & CAPÍTULOS CHAVE:
      1. Introdução: Investiga de que forma a omissão estatal no campo da educação sexual e a fragilidade da rede protetiva aumentam a vulnerabilidade. Defesa da proteção integral (Constituição art. 227 e ECA).
      2. Abuso vs. Exploração: Abuso é intrafamiliar/sem fins lucrativos; Exploração envolve mercantilização/pagamento. Critério objetivo de vulnerabilidade para menores de 14 anos (Art. 217-A CP).
      3. Jurisprudência & Leis Recentes: 
         - Súmula 593 do STJ: Consonância de que o consentimento ou histórico sexual do menor de 14 anos é irrelevante.
         - Lei 15.280/2025 aumentou a pena do estupro de vulnerável para 10 a 18 anos de reclusão (e até 40 anos se morte).
         - Lei 15.353/2026 positivou que a vulnerabilidade é absoluta e insuscetível de relativização ou consideração de consentimento, removendo margem judiciária de abrandar o caso.
         - Caso "Romeu e Julieta" (exceção rejeitada expressamente no Brasil).
         - Erro de Tipo: aplicável em raríssimos casos quando há absoluto desconhecimento involuntário da idade (gera exclusão do dolo, sem punição culposa porque não há previsão na modalidade culposa).
      4. Educação Sexual: Falha na aplicação da LDB (Lei 9.394/1996) e Parâmetros Curriculares Nacionais de 1997 como omissão estatal ilícita. A educação sexual previne a vitimização geral positiva facilitando autoproteção e denúncia.
      5. Impactos & Depoimento Especial: Clandestinidade dos crimes dá relevância ímpar à palavra da vítima. Lei da Escuta Protegida (Lei 13.431/2017) exige depoimento especial sem revitimização, mas falta infraestrutura no Norte (salas apropriadas e terapeutas).
      6. Especialidade da Região Norte:
         - Dispersão geográfica na Amazônia Legal (transporte fluvial dependente).
         - Subnotificação alarmante próxima a 90%.
         - Falta de delegacias especializadas de proteção à criança e adolescente fora de capitais.
         - Cruzamento com garimpo ilegal, tráfico de drogas e extrema pobreza.
    `;

    const formattedHistory = (history || []).map((msg: any) => 
      `${msg.role === "user" ? "Estudante" : msg.examinerName || "Examinador"}: ${msg.content}`
    ).join("\n");

    const systemInstruction = `
      Você é um avaliador acadêmico participando de uma banca de defesa de Trabalho de Conclusão de Curso (TCC) em Direito no Brasil.
      O candidato Luiz Henrique Reis Tourinho está defendendo seu TCC.
      Seu personagem atual é: ${examiner.name}.
      Seu foco de pesquisa é: ${examiner.focus}.
      Seu estilo de avaliação é: ${examiner.style}.

      Use o contexto real do TCC para fundamentar suas observações:
      ${tccContext}

      Sua tarefa:
      - Avalie a resposta anterior do estudante (studentAnswer) se ela for fornecida. Faça críticas construtivas e juridicamente corretas nos padrões acadêmicos de Direito Penal e Processual Penal brasileiros.
      - Se for a primeira pergunta (studentAnswer vazio ou curto), ignore o feedback anterior e formule direto uma excelente pergunta instigante baseada no foco do examinador e nas nuances do TCC.
      - Atribua uma nota de 1 a 10 para a resposta do estudante. Notas baixas (1-6) para respostas evasivas ou juridicamente erradas; notas altas (7-10) se ele argumentar com base na legislação (ex: Súmula 593 do STJ, ECA, Constituição, Leis de 2025/2026).
      - Elabore a próxima pergunta técnica da banca de forma clara e instigante.
      - Forneça 2 ou 3 dicas objetivas ("tips") de termos jurídicos ou argumentos que o estudante DEVE usar para formular uma boa resposta à sua pergunta formulada.

      Responda EXCLUSIVAMENTE em formato JSON, obedecendo este esquema exato:
      {
        "feedback": "Seu feedback detalhado e rigoroso, falando como o personagem.",
        "question": "A sua próxima questão formulada para o candidato.",
        "score": 10, // nota de 1 a 10 baseada na qualidade da última resposta
        "tips": ["Mencionar o Artigo X", "Citar a Súmula Y", "Discutir a vulnerabilidade estrutural na Amazônia"]
      }
    `;

    const userPrompt = `
      Histórico anterior da defesa:
      ${formattedHistory}

      Última resposta dada agora pelo Estudante Luiz Henrique:
      "${studentAnswer || ""}"

      Avalie essa resposta recente e prossiga com a sua rodada de banca. Lembre-se, responda apenas o objeto JSON.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["feedback", "question", "score", "tips"],
          properties: {
            feedback: {
              type: Type.STRING,
              description: "Comentários do examinador ativo sobre a resposta dada pelo aluno."
            },
            question: {
              type: Type.STRING,
              description: "A próxima pergunta desafiadora da banca de defesa."
            },
            score: {
              type: Type.INTEGER,
              description: "Uma avaliação de zero a dez sobre o desempenho do aluno na última fala."
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Palavras-chave e conceitos que o estudante deveria conter em sua resposta para ir bem."
            }
          }
        }
      }
    });

    const outputText = response.text || "{}";
    const resultJson = JSON.parse(outputText.trim());
    res.json(resultJson);

  } catch (error: any) {
    console.error("Erro no processamento da banca do Gemini:", error);
    res.status(500).json({
      error: "Ocorreu um erro ao comunicar com os avaliador de inteligência artificial.",
      details: error.message
    });
  }
});

// Configure Vite integration for dev vs prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TCC Presentation APP] Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
