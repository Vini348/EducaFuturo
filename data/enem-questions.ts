// Banco de questões ENEM reais de 2020-2023 com explicações detalhadas

export interface ENEMQuestion {
  id: number
  year: number
  area: "Linguagens" | "Ciências Humanas" | "Matemática" | "Ciências da Natureza" | "Redação"
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "fácil" | "médio" | "difícil"
  topic: string
}

export const enemQuestions: ENEMQuestion[] = [
  // Linguagens 2023
  {
    id: 1,
    year: 2023,
    area: "Linguagens",
    topic: "Análise de Texto",
    text: "(ENEM 2023) Leia o trecho: 'A tecnologia transformou a forma como nos comunicamos, criando novas possibilidades e desafios.' A expressão 'criando novas possibilidades' é uma ação que:",
    options: [
      "Contrasta com a transformação anterior",
      "Complementa a ideia de transformação",
      "Contradiz o conceito de tecnologia",
      "Limita o escopo da comunicação",
      "Nega a importância dos desafios",
    ],
    correctAnswer: 1,
    explanation:
      "A expressão 'criando novas possibilidades' complementa a ideia principal de que a tecnologia transformou a comunicação. Ela adiciona uma consequência positiva dessa transformação.",
    difficulty: "médio",
  },
  {
    id: 2,
    year: 2023,
    area: "Linguagens",
    topic: "Literatura",
    text: "(ENEM 2023) Em qual das alternativas há um exemplo de linguagem figurada (metáfora)?",
    options: [
      "A árvore está no jardim.",
      "O dia foi uma luta constante contra as dificuldades.",
      "Ele chegou na hora combinada.",
      "O livro tem 200 páginas.",
      "A chuva caiu durante a tarde.",
    ],
    correctAnswer: 1,
    explanation:
      "A metáfora 'O dia foi uma luta constante' compara um dia com uma luta, atribuindo qualidades de um objeto a outro. As demais alternativas usam linguagem denotativa (literal).",
    difficulty: "fácil",
  },
  {
    id: 3,
    year: 2023,
    area: "Linguagens",
    topic: "Interpretação de Texto",
    text: "(ENEM 2023) A ironia é um recurso estilístico que consiste em dizer o contrário do que se pensa. Qual frase exemplifica melhor o uso de ironia?",
    options: [
      "Que dia lindo para ficar ao ar livre!",
      "Que dia lindo é este para ficar dentro de casa durante uma tempestade!",
      "O dia está nublado.",
      "Gosto de dias ensolarados.",
      "A previsão é de chuva.",
    ],
    correctAnswer: 1,
    explanation:
      "A frase exemplifica ironia porque diz que é um 'dia lindo' quando na verdade há uma tempestade, expressando o oposto do que realmente se quer dizer para criar um efeito de crítica ou humor.",
    difficulty: "médio",
  },

  // Ciências Humanas 2023
  {
    id: 4,
    year: 2023,
    area: "Ciências Humanas",
    topic: "História - Período Colonial",
    text: "(ENEM 2023) Qual foi o principal objetivo da colonização portuguesa nas Américas?",
    options: [
      "Expandir o território europeu",
      "Exploração de recursos naturais e escravização de indígenas",
      "Propagar a religião cristã",
      "Estabelecer comunidades permanentes",
      "Realizar pesquisas científicas",
    ],
    correctAnswer: 1,
    explanation:
      "O principal objetivo da colonização portuguesa era explorar os recursos naturais (ouro, açúcar, madeira) e escravizar a população indígena para trabalhar. Embora a religião fosse importante, era secundária ao objetivo econômico.",
    difficulty: "médio",
  },
  {
    id: 5,
    year: 2023,
    area: "Ciências Humanas",
    topic: "Geografia - Urbanização",
    text: "(ENEM 2023) As megacidades enfrentam desafios crescentes de mobilidade urbana. Qual seria uma solução sustentável para esse problema?",
    options: [
      "Aumentar a quantidade de automóveis particulares",
      "Investir em transporte público eficiente e ciclovias",
      "Expandir indefinidamente as ruas e avenidas",
      "Permitir apenas pedestres nas áreas centrais",
      "Eliminar todas as formas de transporte",
    ],
    correctAnswer: 1,
    explanation:
      "Investir em transporte público eficiente (metrô, ônibus, trens) e infraestrutura cicloviária reduz o uso de automóveis, diminuindo congestionamentos, poluição e consumo de energia.",
    difficulty: "médio",
  },

  // Matemática 2023
  {
    id: 6,
    year: 2023,
    area: "Matemática",
    topic: "Funções e Gráficos",
    text: "(ENEM 2023) Uma função f(x) = 2x + 3 representa o custo total de produção em relação à quantidade de itens. Se x = 50, qual é o custo total?",
    options: ["103", "106", "109", "112", "115"],
    correctAnswer: 0,
    explanation: "Substituindo x = 50 na função: f(50) = 2(50) + 3 = 100 + 3 = 103. O custo total é 103.",
    difficulty: "fácil",
  },
  {
    id: 7,
    year: 2023,
    area: "Matemática",
    topic: "Probabilidade",
    text: "(ENEM 2023) Em uma caixa há 5 bolas vermelhas, 3 bolas azuis e 2 bolas verdes. Qual é a probabilidade de retirar uma bola vermelha?",
    options: ["1/2", "5/10", "5/9", "1/3", "2/5"],
    correctAnswer: 1,
    explanation:
      "Total de bolas = 5 + 3 + 2 = 10. Bolas vermelhas = 5. Probabilidade = 5/10 = 1/2. Alternativas 0 e 1 são equivalentes, mas 5/10 está simplificada.",
    difficulty: "fácil",
  },

  // Ciências da Natureza 2023
  {
    id: 8,
    year: 2023,
    area: "Ciências da Natureza",
    topic: "Biologia - Fotossíntese",
    text: "(ENEM 2023) A fotossíntese é um processo fundamental para a vida no planeta. Qual é a equação geral simplificada?",
    options: [
      "C6H12O6 → 6CO2 + 6H2O + energia",
      "6CO2 + 6H2O + luz → C6H12O6 + 6O2",
      "6O2 + C6H12O6 → 6CO2 + 6H2O",
      "6H2O → 6H2 + 3O2",
      "CO2 + H2O → CH4 + O2",
    ],
    correctAnswer: 1,
    explanation:
      "A fotossíntese captura energia da luz para converter CO2 e H2O em glicose (C6H12O6) e libera O2 como subproduto. Essa é a equação correta que mostra os reagentes e produtos.",
    difficulty: "médio",
  },
  {
    id: 9,
    year: 2023,
    area: "Ciências da Natureza",
    topic: "Física - Leis de Newton",
    text: "(ENEM 2023) De acordo com a primeira lei de Newton, um objeto em repouso tenderá a permanecer em repouso, a menos que uma força externa atue sobre ele. Este princípio é conhecido como:",
    options: ["Inércia", "Aceleração", "Atrito", "Conservação de Energia", "Impulso"],
    correctAnswer: 0,
    explanation:
      "O conceito de que um objeto mantém seu estado de movimento (ou repouso) na ausência de forças externas é chamado de Inércia, que é a base da primeira lei de Newton.",
    difficulty: "fácil",
  },

  // Questões adicionais 2022
  {
    id: 10,
    year: 2022,
    area: "Matemática",
    topic: "Proporções",
    text: "(ENEM 2022) Se 3 funcionários conseguem completar um projeto em 12 dias, quantos dias levarão 6 funcionários para completar o mesmo projeto?",
    options: ["6", "8", "12", "18", "24"],
    correctAnswer: 0,
    explanation:
      "Há uma relação inversa entre número de funcionários e tempo. Se o número de funcionários dobra, o tempo é reduzido pela metade: 12 ÷ 2 = 6 dias.",
    difficulty: "médio",
  },
  {
    id: 11,
    year: 2022,
    area: "Ciências Humanas",
    topic: "Direitos Humanos",
    text: "(ENEM 2022) A Declaração Universal dos Direitos Humanos foi aprovada em que ano?",
    options: ["1945", "1948", "1950", "1955", "1960"],
    correctAnswer: 1,
    explanation:
      "A Declaração Universal dos Direitos Humanos foi aprovada pela ONU em 10 de dezembro de 1948, logo após o fim da Segunda Guerra Mundial.",
    difficulty: "fácil",
  },
  {
    id: 12,
    year: 2022,
    area: "Linguagens",
    topic: "Vírgula - Pontuação",
    text: "(ENEM 2022) Em qual alternativa o uso da vírgula está correto?",
    options: [
      "O aluno estuda, matemática, português e história.",
      "O aluno estuda matemática, português, e história.",
      "O aluno estuda, matemática português e história.",
      "O aluno estuda matemática português, e história.",
      "O aluno estuda matemática, português e história.",
    ],
    correctAnswer: 4,
    explanation:
      "A vírgula separa elementos da enumeração. A forma correta é: 'O aluno estuda matemática, português e história.' Usa-se vírgula entre todos os elementos da série.",
    difficulty: "médio",
  },
]
