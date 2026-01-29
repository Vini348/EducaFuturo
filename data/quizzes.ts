export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  subject: string
  subjectName: string
  category: string
  difficulty: number
  timeLimit?: number
  questions: QuizQuestion[]
  passingScore: number
  tags: string[]
  year: number
}

export const quizzes: Quiz[] = [
  // ==================== 1º ANO ====================

  // CIRCUITOS ELÉTRICOS - 1º ANO
  {
    id: "circuitos-1ano-basico",
    title: "Circuitos Elétricos Básicos",
    description: "Fundamentos de circuitos elétricos, Lei de Ohm e análise de circuitos simples",
    subject: "circuitos-1ano",
    subjectName: "Circuitos Elétricos",
    category: "power",
    difficulty: 1,
    timeLimit: 900,
    passingScore: 70,
    tags: ["circuitos", "lei de ohm", "resistência", "1º ano"],
    year: 1,
    questions: [
      {
        id: "q1",
        text: "Qual a unidade de medida da resistência elétrica?",
        options: [
          { id: "a", text: "Ampère (A)", isCorrect: false },
          { id: "b", text: "Volt (V)", isCorrect: false },
          { id: "c", text: "Ohm (Ω)", isCorrect: true },
          { id: "d", text: "Watt (W)", isCorrect: false },
        ],
        explanation: "A resistência elétrica é medida em Ohms (Ω), em homenagem ao físico Georg Simon Ohm.",
        difficulty: "easy",
        topic: "Grandezas Elétricas",
      },
      {
        id: "q2",
        text: "Segundo a Lei de Ohm, se a tensão é 12V e a resistência é 4Ω, qual a corrente?",
        options: [
          { id: "a", text: "3A", isCorrect: true },
          { id: "b", text: "48A", isCorrect: false },
          { id: "c", text: "8A", isCorrect: false },
          { id: "d", text: "16A", isCorrect: false },
        ],
        explanation: "Pela Lei de Ohm: I = V/R = 12V/4Ω = 3A. A corrente é inversamente proporcional à resistência.",
        difficulty: "easy",
        topic: "Lei de Ohm",
      },
      {
        id: "q3",
        text: "Em um circuito série com duas resistências de 10Ω cada, a resistência total é:",
        options: [
          { id: "a", text: "5Ω", isCorrect: false },
          { id: "b", text: "10Ω", isCorrect: false },
          { id: "c", text: "20Ω", isCorrect: true },
          { id: "d", text: "100Ω", isCorrect: false },
        ],
        explanation: "Em circuitos série, as resistências se somam: Rtotal = R1 + R2 = 10Ω + 10Ω = 20Ω.",
        difficulty: "medium",
        topic: "Circuitos Série",
      },
      {
        id: "q4",
        text: "Qual representa a ordem de grandeza de 0,001?",
        options: [
          { id: "a", text: "10³", isCorrect: false },
          { id: "b", text: "10⁻³", isCorrect: true },
          { id: "c", text: "10⁻¹", isCorrect: false },
          { id: "d", text: "10¹", isCorrect: false },
        ],
        explanation:
          "0,001 = 1/1000 = 1/10³ = 10⁻³. Cada casa decimal à direita representa uma potência negativa de 10.",
        difficulty: "easy",
        topic: "Ordem de Grandeza",
      },
      {
        id: "q5",
        text: "A primeira Lei de Kirchhoff (Lei dos Nós) estabelece que:",
        options: [
          { id: "a", text: "A soma das tensões em uma malha é zero", isCorrect: false },
          { id: "b", text: "A soma das correntes que entram em um nó é igual à soma das que saem", isCorrect: true },
          { id: "c", text: "A resistência total é a soma das resistências", isCorrect: false },
          { id: "d", text: "A potência é o produto da tensão pela corrente", isCorrect: false },
        ],
        explanation:
          "A Lei dos Nós (1ª Lei de Kirchhoff) baseia-se no princípio da conservação da carga elétrica: ΣIentrada = ΣIsaída.",
        difficulty: "medium",
        topic: "Leis de Kirchhoff",
      },
    ],
  },

  // ELETRÔNICA DIGITAL - 1º ANO
  {
    id: "digital-1ano-basico",
    title: "Fundamentos de Eletrônica Digital",
    description: "Sistemas de numeração, portas lógicas e álgebra booleana básica",
    subject: "digital-1ano",
    subjectName: "Eletrônica Digital",
    category: "digital",
    difficulty: 1,
    timeLimit: 900,
    passingScore: 70,
    tags: ["digital", "portas lógicas", "binário", "1º ano"],
    year: 1,
    questions: [
      {
        id: "q1",
        text: "Qual é o resultado da operação AND entre 1 e 0?",
        options: [
          { id: "a", text: "0", isCorrect: true },
          { id: "b", text: "1", isCorrect: false },
          { id: "c", text: "Indefinido", isCorrect: false },
          { id: "d", text: "Erro", isCorrect: false },
        ],
        explanation: "A porta AND só produz saída 1 quando TODAS as entradas são 1. Como uma entrada é 0, a saída é 0.",
        difficulty: "easy",
        topic: "Portas Lógicas",
      },
      {
        id: "q2",
        text: "O número binário 1101 corresponde a qual valor decimal?",
        options: [
          { id: "a", text: "11", isCorrect: false },
          { id: "b", text: "13", isCorrect: true },
          { id: "c", text: "15", isCorrect: false },
          { id: "d", text: "17", isCorrect: false },
        ],
        explanation: "1101₂ = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13₁₀",
        difficulty: "easy",
        topic: "Sistemas de Numeração",
      },
      {
        id: "q3",
        text: "Quantos bits são necessários para representar o número decimal 15?",
        options: [
          { id: "a", text: "3 bits", isCorrect: false },
          { id: "b", text: "4 bits", isCorrect: true },
          { id: "c", text: "5 bits", isCorrect: false },
          { id: "d", text: "6 bits", isCorrect: false },
        ],
        explanation:
          "15 em decimal = 1111 em binário, que requer 4 bits. (2⁴ = 16, que é o primeiro valor maior que 15)",
        difficulty: "medium",
        topic: "Sistemas de Numeração",
      },
      {
        id: "q4",
        text: "Qual é a saída de uma porta OR com todas as entradas em 0?",
        options: [
          { id: "a", text: "0", isCorrect: true },
          { id: "b", text: "1", isCorrect: false },
          { id: "c", text: "Indefinido", isCorrect: false },
          { id: "d", text: "Depende do número de entradas", isCorrect: false },
        ],
        explanation: "A porta OR produz saída 1 quando pelo menos UMA entrada é 1. Se todas são 0, a saída é 0.",
        difficulty: "easy",
        topic: "Portas Lógicas",
      },
      {
        id: "q5",
        text: "Em que base o sistema hexadecimal opera?",
        options: [
          { id: "a", text: "Base 8", isCorrect: false },
          { id: "b", text: "Base 10", isCorrect: false },
          { id: "c", text: "Base 16", isCorrect: true },
          { id: "d", text: "Base 2", isCorrect: false },
        ],
        explanation: "O sistema hexadecimal usa base 16, com dígitos 0-9 e letras A-F para representar valores 0-15.",
        difficulty: "easy",
        topic: "Sistemas de Numeração",
      },
    ],
  },

  // MATEMÁTICA - 1º ANO
  {
    id: "matematica-1ano-funcoes",
    title: "Matemática - Funções",
    description: "Conceitos fundamentais de funções matemáticas e suas aplicações",
    subject: "matematica-1ano",
    subjectName: "Matemática",
    category: "analog",
    difficulty: 1,
    timeLimit: 1200,
    passingScore: 70,
    tags: ["matemática", "funções", "gráficos", "1º ano"],
    year: 1,
    questions: [
      {
        id: "q1",
        text: "Qual é o domínio da função f(x) = 1/x?",
        options: [
          { id: "a", text: "Todos os números reais", isCorrect: false },
          { id: "b", text: "Todos os números reais exceto zero", isCorrect: true },
          { id: "c", text: "Apenas números positivos", isCorrect: false },
          { id: "d", text: "Apenas números inteiros", isCorrect: false },
        ],
        explanation:
          "A função f(x) = 1/x não está definida para x = 0, pois divisão por zero é indefinida. Portanto, o domínio é ℝ - {0}.",
        difficulty: "easy",
        topic: "Domínio de Funções",
      },
      {
        id: "q2",
        text: "Se f(x) = 2x + 3, qual é o valor de f(5)?",
        options: [
          { id: "a", text: "10", isCorrect: false },
          { id: "b", text: "13", isCorrect: true },
          { id: "c", text: "8", isCorrect: false },
          { id: "d", text: "15", isCorrect: false },
        ],
        explanation: "Substituindo x = 5 na função: f(5) = 2(5) + 3 = 10 + 3 = 13.",
        difficulty: "easy",
        topic: "Avaliação de Funções",
      },
      {
        id: "q3",
        text: "Uma função linear tem a forma geral:",
        options: [
          { id: "a", text: "f(x) = ax² + bx + c", isCorrect: false },
          { id: "b", text: "f(x) = ax + b", isCorrect: true },
          { id: "c", text: "f(x) = a/x", isCorrect: false },
          { id: "d", text: "f(x) = aˣ", isCorrect: false },
        ],
        explanation:
          "Uma função linear tem a forma f(x) = ax + b, onde 'a' é o coeficiente angular e 'b' é o coeficiente linear.",
        difficulty: "easy",
        topic: "Tipos de Funções",
      },
    ],
  },

  // FÍSICA - FORÇA DA NATUREZA - 1º ANO
  {
    id: "fisica-forca-1ano",
    title: "Física - Força da Natureza",
    description: "Conceitos de força, movimento e grandezas vetoriais",
    subject: "fisica-forca-1ano",
    subjectName: "Física - Força da Natureza",
    category: "power",
    difficulty: 1,
    timeLimit: 1200,
    passingScore: 70,
    tags: ["física", "força", "vetores", "movimento", "1º ano"],
    year: 1,
    questions: [
      {
        id: "q1",
        text: "Qual é a unidade de força no Sistema Internacional (SI)?",
        options: [
          { id: "a", text: "Joule (J)", isCorrect: false },
          { id: "b", text: "Newton (N)", isCorrect: true },
          { id: "c", text: "Watt (W)", isCorrect: false },
          { id: "d", text: "Pascal (Pa)", isCorrect: false },
        ],
        explanation: "A unidade de força no SI é o Newton (N), em homenagem a Isaac Newton. 1 N = 1 kg⋅m/s².",
        difficulty: "easy",
        topic: "Unidades de Medida",
      },
      {
        id: "q2",
        text: "Grandezas vetoriais são caracterizadas por possuir:",
        options: [
          { id: "a", text: "Apenas intensidade", isCorrect: false },
          { id: "b", text: "Intensidade, direção e sentido", isCorrect: true },
          { id: "c", text: "Apenas direção", isCorrect: false },
          { id: "d", text: "Apenas sentido", isCorrect: false },
        ],
        explanation:
          "Grandezas vetoriais possuem três características: intensidade (módulo), direção e sentido. Exemplos: força, velocidade, aceleração.",
        difficulty: "easy",
        topic: "Grandezas Vetoriais",
      },
      {
        id: "q3",
        text: "A primeira lei de Newton (Lei da Inércia) estabelece que:",
        options: [
          { id: "a", text: "F = ma", isCorrect: false },
          { id: "b", text: "Um corpo em repouso tende a permanecer em repouso", isCorrect: true },
          { id: "c", text: "Para toda ação há uma reação", isCorrect: false },
          { id: "d", text: "A energia se conserva", isCorrect: false },
        ],
        explanation:
          "A Lei da Inércia afirma que um corpo em repouso permanece em repouso e um corpo em movimento permanece em movimento retilíneo uniforme, a menos que uma força externa atue sobre ele.",
        difficulty: "medium",
        topic: "Leis de Newton",
      },
    ],
  },

  // INTRODUÇÃO À COMPUTAÇÃO - 1º ANO
  {
    id: "computacao-1ano-basico",
    title: "Introdução à Computação",
    description: "Fundamentos de informática, Excel e ferramentas de escritório",
    subject: "computacao-1ano",
    subjectName: "Introdução à Computação",
    category: "digital",
    difficulty: 1,
    timeLimit: 900,
    passingScore: 70,
    tags: ["computação", "excel", "office", "informática", "1º ano"],
    year: 1,
    questions: [
      {
        id: "q1",
        text: "No Excel, qual função calcula a soma de um intervalo de células?",
        options: [
          { id: "a", text: "=MÉDIA()", isCorrect: false },
          { id: "b", text: "=SOMA()", isCorrect: true },
          { id: "c", text: "=CONTAR()", isCorrect: false },
          { id: "d", text: "=MÁXIMO()", isCorrect: false },
        ],
        explanation: "A função =SOMA() é usada para calcular a soma de valores em um intervalo de células no Excel.",
        difficulty: "easy",
        topic: "Funções do Excel",
      },
      {
        id: "q2",
        text: "Qual é a extensão padrão de arquivos do Microsoft Word?",
        options: [
          { id: "a", text: ".txt", isCorrect: false },
          { id: "b", text: ".docx", isCorrect: true },
          { id: "c", text: ".pdf", isCorrect: false },
          { id: "d", text: ".xlsx", isCorrect: false },
        ],
        explanation: "A extensão .docx é o formato padrão dos documentos do Microsoft Word desde a versão 2007.",
        difficulty: "easy",
        topic: "Formatos de Arquivo",
      },
      {
        id: "q3",
        text: "Para criar uma referência absoluta no Excel, usa-se:",
        options: [
          { id: "a", text: "Parênteses ()", isCorrect: false },
          { id: "b", text: "Cifrão $", isCorrect: true },
          { id: "c", text: "Asterisco *", isCorrect: false },
          { id: "d", text: "Hashtag #", isCorrect: false },
        ],
        explanation:
          "O símbolo $ é usado para criar referências absolutas no Excel, fixando a linha e/ou coluna (ex: $A$1).",
        difficulty: "medium",
        topic: "Referências no Excel",
      },
    ],
  },

  // ==================== 2º ANO ====================

  // MATEMÁTICA - 2º ANO
  {
    id: "matematica-2ano-combinatoria",
    title: "Matemática - Análise Combinatória",
    description: "Princípios de contagem, permutações, arranjos e combinações",
    subject: "matematica-2ano",
    subjectName: "Matemática",
    category: "analog",
    difficulty: 2,
    timeLimit: 1200,
    passingScore: 75,
    tags: ["matemática", "combinatória", "probabilidade", "2º ano"],
    year: 2,
    questions: [
      {
        id: "q1",
        text: "Quantas permutações podem ser formadas com as letras da palavra 'CASA'?",
        options: [
          { id: "a", text: "12", isCorrect: true },
          { id: "b", text: "24", isCorrect: false },
          { id: "c", text: "16", isCorrect: false },
          { id: "d", text: "8", isCorrect: false },
        ],
        explanation: "CASA tem 4 letras com A repetido 2 vezes. Permutação com repetição: 4!/2! = 24/2 = 12.",
        difficulty: "medium",
        topic: "Permutações",
      },
      {
        id: "q2",
        text: "Em uma urna com 5 bolas vermelhas e 3 azuis, qual a probabilidade de retirar uma bola vermelha?",
        options: [
          { id: "a", text: "3/8", isCorrect: false },
          { id: "b", text: "5/8", isCorrect: true },
          { id: "c", text: "1/2", isCorrect: false },
          { id: "d", text: "2/3", isCorrect: false },
        ],
        explanation: "P(vermelha) = número de bolas vermelhas / total de bolas = 5/(5+3) = 5/8.",
        difficulty: "easy",
        topic: "Probabilidade",
      },
      {
        id: "q3",
        text: "De quantas maneiras podemos escolher 3 pessoas de um grupo de 7?",
        options: [
          { id: "a", text: "21", isCorrect: false },
          { id: "b", text: "35", isCorrect: true },
          { id: "c", text: "42", isCorrect: false },
          { id: "d", text: "210", isCorrect: false },
        ],
        explanation: "Combinação: C(7,3) = 7!/(3!×4!) = (7×6×5)/(3×2×1) = 210/6 = 35.",
        difficulty: "medium",
        topic: "Combinações",
      },
    ],
  },

  // ELETRÔNICA ANALÓGICA - 2º ANO
  {
    id: "analogica-2ano-intermediario",
    title: "Eletrônica Analógica Intermediária",
    description: "Semicondutores, diodos, transistores e amplificadores básicos",
    subject: "analogica-2ano",
    subjectName: "Eletrônica Analógica",
    category: "analog",
    difficulty: 2,
    timeLimit: 1200,
    passingScore: 75,
    tags: ["analógica", "semicondutores", "transistores", "2º ano"],
    year: 2,
    questions: [
      {
        id: "q1",
        text: "Qual é a tensão de limiar típica de um diodo de silício?",
        options: [
          { id: "a", text: "0.3V", isCorrect: false },
          { id: "b", text: "0.7V", isCorrect: true },
          { id: "c", text: "1.2V", isCorrect: false },
          { id: "d", text: "2.1V", isCorrect: false },
        ],
        explanation:
          "Diodos de silício têm tensão de limiar de aproximadamente 0.7V para começar a conduzir significativamente.",
        difficulty: "easy",
        topic: "Semicondutores",
      },
      {
        id: "q2",
        text: "Em um transistor NPN, qual terminal controla a corrente entre coletor e emissor?",
        options: [
          { id: "a", text: "Coletor", isCorrect: false },
          { id: "b", text: "Base", isCorrect: true },
          { id: "c", text: "Emissor", isCorrect: false },
          { id: "d", text: "Substrato", isCorrect: false },
        ],
        explanation:
          "A base controla a corrente entre coletor e emissor. Uma pequena corrente na base permite uma corrente maior entre coletor e emissor.",
        difficulty: "medium",
        topic: "Transistores",
      },
      {
        id: "q3",
        text: "Qual material é mais comumente usado na fabricação de semicondutores?",
        options: [
          { id: "a", text: "Cobre", isCorrect: false },
          { id: "b", text: "Silício", isCorrect: true },
          { id: "c", text: "Alumínio", isCorrect: false },
          { id: "d", text: "Ferro", isCorrect: false },
        ],
        explanation:
          "O silício é o material mais usado na fabricação de semicondutores devido às suas propriedades elétricas ideais.",
        difficulty: "easy",
        topic: "Materiais Semicondutores",
      },
    ],
  },

  // PROGRAMAÇÃO - 2º ANO
  {
    id: "programacao-2ano-logica",
    title: "Programação - Lógica e Algoritmos",
    description: "Fundamentos de programação, estruturas de controle e algoritmos",
    subject: "programacao-2ano",
    subjectName: "Programação",
    category: "digital",
    difficulty: 2,
    timeLimit: 1200,
    passingScore: 75,
    tags: ["programação", "algoritmos", "lógica", "2º ano"],
    year: 2,
    questions: [
      {
        id: "q1",
        text: "Qual estrutura de repetição é mais adequada quando não sabemos quantas vezes o loop deve executar?",
        options: [
          { id: "a", text: "for", isCorrect: false },
          { id: "b", text: "while", isCorrect: true },
          { id: "c", text: "switch", isCorrect: false },
          { id: "d", text: "if", isCorrect: false },
        ],
        explanation:
          "O 'while' é ideal quando a condição de parada depende de uma condição que pode mudar durante a execução, e não sabemos quantas iterações serão necessárias.",
        difficulty: "medium",
        topic: "Estruturas de Repetição",
      },
      {
        id: "q2",
        text: "Em programação, o que é uma variável?",
        options: [
          { id: "a", text: "Um valor constante", isCorrect: false },
          { id: "b", text: "Um espaço na memória para armazenar dados", isCorrect: true },
          { id: "c", text: "Uma função matemática", isCorrect: false },
          { id: "d", text: "Um tipo de loop", isCorrect: false },
        ],
        explanation:
          "Uma variável é um espaço reservado na memória do computador para armazenar dados que podem ser modificados durante a execução do programa.",
        difficulty: "easy",
        topic: "Conceitos Básicos",
      },
      {
        id: "q3",
        text: "Qual é o resultado da expressão lógica: (5 > 3) AND (2 < 4)?",
        options: [
          { id: "a", text: "Verdadeiro", isCorrect: true },
          { id: "b", text: "Falso", isCorrect: false },
          { id: "c", text: "Erro", isCorrect: false },
          { id: "d", text: "Indefinido", isCorrect: false },
        ],
        explanation:
          "(5 > 3) é verdadeiro e (2 < 4) é verdadeiro. Na operação AND, ambas condições devem ser verdadeiras, então o resultado é verdadeiro.",
        difficulty: "easy",
        topic: "Operadores Lógicos",
      },
    ],
  },

  // SISTEMAS DE COMUNICAÇÃO - 2º ANO
  {
    id: "comunicacao-2ano-redes",
    title: "Sistemas de Comunicação",
    description: "Fundamentos de redes, protocolos e sistemas de comunicação",
    subject: "comunicacao-2ano",
    subjectName: "Sistemas de Comunicação",
    category: "digital",
    difficulty: 2,
    timeLimit: 1200,
    passingScore: 75,
    tags: ["comunicação", "redes", "protocolos", "2º ano"],
    year: 2,
    questions: [
      {
        id: "q1",
        text: "Qual classe de endereço IP pertence o endereço 192.168.1.1?",
        options: [
          { id: "a", text: "Classe A", isCorrect: false },
          { id: "b", text: "Classe B", isCorrect: false },
          { id: "c", text: "Classe C", isCorrect: true },
          { id: "d", text: "Classe D", isCorrect: false },
        ],
        explanation:
          "Endereços que começam com 192 pertencem à Classe C (192.0.0.0 a 223.255.255.255). O 192.168.x.x é um endereço privado da Classe C.",
        difficulty: "medium",
        topic: "Endereçamento IP",
      },
      {
        id: "q2",
        text: "Qual protocolo é usado para transferência de páginas web?",
        options: [
          { id: "a", text: "FTP", isCorrect: false },
          { id: "b", text: "HTTP", isCorrect: true },
          { id: "c", text: "SMTP", isCorrect: false },
          { id: "d", text: "POP3", isCorrect: false },
        ],
        explanation:
          "HTTP (HyperText Transfer Protocol) é o protocolo usado para transferir páginas web entre servidores e navegadores.",
        difficulty: "easy",
        topic: "Protocolos de Rede",
      },
      {
        id: "q3",
        text: "Quantos bits tem um endereço IPv4?",
        options: [
          { id: "a", text: "16 bits", isCorrect: false },
          { id: "b", text: "32 bits", isCorrect: true },
          { id: "c", text: "64 bits", isCorrect: false },
          { id: "d", text: "128 bits", isCorrect: false },
        ],
        explanation: "Um endereço IPv4 tem 32 bits, divididos em 4 octetos de 8 bits cada (ex: 192.168.1.1).",
        difficulty: "easy",
        topic: "Endereçamento IP",
      },
    ],
  },

  // FÍSICA - ENERGIA - 2º ANO
  {
    id: "fisica-energia-2ano",
    title: "Física - Energia",
    description: "Conceitos de energia, ondas e movimento harmônico simples",
    subject: "fisica-energia-2ano",
    subjectName: "Física - Energia",
    category: "power",
    difficulty: 2,
    timeLimit: 1200,
    passingScore: 75,
    tags: ["física", "energia", "ondas", "2º ano"],
    year: 2,
    questions: [
      {
        id: "q1",
        text: "No movimento harmônico simples, o que acontece com a velocidade no ponto de amplitude máxima?",
        options: [
          { id: "a", text: "É máxima", isCorrect: false },
          { id: "b", text: "É zero", isCorrect: true },
          { id: "c", text: "É constante", isCorrect: false },
          { id: "d", text: "É negativa", isCorrect: false },
        ],
        explanation:
          "No ponto de amplitude máxima, o objeto para momentaneamente antes de inverter o sentido do movimento, portanto a velocidade é zero.",
        difficulty: "medium",
        topic: "Movimento Harmônico",
      },
      {
        id: "q2",
        text: "Qual a relação entre velocidade, comprimento de onda e frequência?",
        options: [
          { id: "a", text: "v = λ + f", isCorrect: false },
          { id: "b", text: "v = λ / f", isCorrect: false },
          { id: "c", text: "v = λ × f", isCorrect: true },
          { id: "d", text: "v = λ - f", isCorrect: false },
        ],
        explanation: "A velocidade de uma onda é o produto do comprimento de onda pela frequência: v = λ × f.",
        difficulty: "easy",
        topic: "Ondas",
      },
      {
        id: "q3",
        text: "A energia cinética de um objeto é dada por:",
        options: [
          { id: "a", text: "Ec = mgh", isCorrect: false },
          { id: "b", text: "Ec = ½mv²", isCorrect: true },
          { id: "c", text: "Ec = mv", isCorrect: false },
          { id: "d", text: "Ec = m²v", isCorrect: false },
        ],
        explanation: "A energia cinética é dada por Ec = ½mv², onde m é a massa e v é a velocidade do objeto.",
        difficulty: "easy",
        topic: "Energia Cinética",
      },
    ],
  },

  // INSTALAÇÃO - 2º ANO
  {
    id: "instalacao-2ano-eletrica",
    title: "Instalações Elétricas",
    description: "Fundamentos de instalações elétricas residenciais e industriais",
    subject: "instalacao-2ano",
    subjectName: "Instalação",
    category: "power",
    difficulty: 2,
    timeLimit: 1200,
    passingScore: 75,
    tags: ["instalação", "elétrica", "normas", "2º ano"],
    year: 2,
    questions: [
      {
        id: "q1",
        text: "Qual a tensão padrão para tomadas residenciais no Brasil?",
        options: [
          { id: "a", text: "110V ou 220V", isCorrect: true },
          { id: "b", text: "Apenas 110V", isCorrect: false },
          { id: "c", text: "Apenas 220V", isCorrect: false },
          { id: "d", text: "380V", isCorrect: false },
        ],
        explanation:
          "No Brasil, as tensões padrão para residências são 110V ou 220V, dependendo da região e da concessionária local.",
        difficulty: "easy",
        topic: "Tensões Residenciais",
      },
      {
        id: "q2",
        text: "Qual dispositivo protege contra sobrecorrente em instalações elétricas?",
        options: [
          { id: "a", text: "Interruptor", isCorrect: false },
          { id: "b", text: "Disjuntor", isCorrect: true },
          { id: "c", text: "Tomada", isCorrect: false },
          { id: "d", text: "Lâmpada", isCorrect: false },
        ],
        explanation:
          "O disjuntor é um dispositivo de proteção que desliga automaticamente o circuito quando detecta sobrecorrente.",
        difficulty: "easy",
        topic: "Dispositivos de Proteção",
      },
      {
        id: "q3",
        text: "Qual a cor do fio terra em instalações elétricas brasileiras?",
        options: [
          { id: "a", text: "Azul", isCorrect: false },
          { id: "b", text: "Verde ou verde-amarelo", isCorrect: true },
          { id: "c", text: "Preto", isCorrect: false },
          { id: "d", text: "Vermelho", isCorrect: false },
        ],
        explanation:
          "O fio terra deve ser verde ou verde-amarelo, conforme a NBR 5410 (norma brasileira de instalações elétricas).",
        difficulty: "easy",
        topic: "Códigos de Cores",
      },
    ],
  },

  // ==================== 3º ANO ====================

  // ELETRÔNICA DE POTÊNCIA - 3º ANO
  {
    id: "potencia-3ano-avancado",
    title: "Eletrônica de Potência Avançada",
    description: "Conversores de potência, PWM e técnicas de controle avançadas",
    subject: "potencia-3ano",
    subjectName: "Eletrônica de Potência",
    category: "power",
    difficulty: 3,
    timeLimit: 1800,
    passingScore: 80,
    tags: ["potência", "conversores", "PWM", "3º ano"],
    year: 3,
    questions: [
      {
        id: "q1",
        text: "Em um conversor Buck operando em modo contínuo, se D = 0.6 e Vin = 24V, qual é Vout?",
        options: [
          { id: "a", text: "14.4V", isCorrect: true },
          { id: "b", text: "16.8V", isCorrect: false },
          { id: "c", text: "18.2V", isCorrect: false },
          { id: "d", text: "20.4V", isCorrect: false },
        ],
        explanation: "Em conversor Buck: Vout = D × Vin = 0.6 × 24V = 14.4V, onde D é o duty cycle.",
        difficulty: "hard",
        topic: "Conversores DC-DC",
      },
      {
        id: "q2",
        text: "Qual componente é crítico para operação em modo contínuo em conversores?",
        options: [
          { id: "a", text: "Capacitor", isCorrect: false },
          { id: "b", text: "Resistor", isCorrect: false },
          { id: "c", text: "Indutor", isCorrect: true },
          { id: "d", text: "Diodo", isCorrect: false },
        ],
        explanation:
          "O indutor mantém a corrente contínua. Seu valor deve ser suficiente para evitar corrente zero durante o ciclo.",
        difficulty: "hard",
        topic: "Conversores DC-DC",
      },
      {
        id: "q3",
        text: "Em PWM, o que significa 'duty cycle' de 75%?",
        options: [
          { id: "a", text: "O sinal está ligado 25% do tempo", isCorrect: false },
          { id: "b", text: "O sinal está ligado 75% do tempo", isCorrect: true },
          { id: "c", text: "A frequência é 75 Hz", isCorrect: false },
          { id: "d", text: "A tensão é 75% da máxima", isCorrect: false },
        ],
        explanation:
          "Duty cycle de 75% significa que o sinal PWM permanece em nível alto durante 75% do período total.",
        difficulty: "medium",
        topic: "PWM",
      },
    ],
  },

  // CONTROLE - 3º ANO
  {
    id: "controle-3ano-avancado",
    title: "Controle Avançado",
    description: "Amplificadores operacionais, CLPs e sistemas de controle",
    subject: "controle-3ano",
    subjectName: "Controle",
    category: "analog",
    difficulty: 3,
    timeLimit: 1800,
    passingScore: 80,
    tags: ["controle", "amplificadores", "CLP", "3º ano"],
    year: 3,
    questions: [
      {
        id: "q1",
        text: "Em um amplificador operacional ideal, qual é a impedância de entrada?",
        options: [
          { id: "a", text: "Zero", isCorrect: false },
          { id: "b", text: "Infinita", isCorrect: true },
          { id: "c", text: "1 kΩ", isCorrect: false },
          { id: "d", text: "50 Ω", isCorrect: false },
        ],
        explanation:
          "Em teoria, um amp-op ideal tem impedância de entrada infinita, não permitindo corrente pelas entradas.",
        difficulty: "medium",
        topic: "Amplificadores Operacionais",
      },
      {
        id: "q2",
        text: "Qual linguagem de programação é mais comum em CLPs para lógica de relés?",
        options: [
          { id: "a", text: "C++", isCorrect: false },
          { id: "b", text: "Python", isCorrect: false },
          { id: "c", text: "Ladder", isCorrect: true },
          { id: "d", text: "Java", isCorrect: false },
        ],
        explanation: "Ladder é a linguagem gráfica mais usada em CLPs, baseada em diagramas de relés elétricos.",
        difficulty: "medium",
        topic: "Programação de CLPs",
      },
      {
        id: "q3",
        text: "Em um sistema de controle PID, o que faz o termo integral (I)?",
        options: [
          { id: "a", text: "Corrige erros futuros", isCorrect: false },
          { id: "b", text: "Elimina erro em regime permanente", isCorrect: true },
          { id: "c", text: "Aumenta a velocidade de resposta", isCorrect: false },
          { id: "d", text: "Reduz o overshoot", isCorrect: false },
        ],
        explanation:
          "O termo integral acumula o erro ao longo do tempo, eliminando o erro em regime permanente (erro estacionário).",
        difficulty: "hard",
        topic: "Controle PID",
      },
    ],
  },

  // MANUTENÇÃO - 3º ANO
  {
    id: "manutencao-3ano-diagnostico",
    title: "Manutenção e Diagnóstico",
    description: "Técnicas de manutenção preventiva e diagnóstico de falhas",
    subject: "manutencao-3ano",
    subjectName: "Manutenção",
    category: "power",
    difficulty: 3,
    timeLimit: 1500,
    passingScore: 80,
    tags: ["manutenção", "diagnóstico", "falhas", "3º ano"],
    year: 3,
    questions: [
      {
        id: "q1",
        text: "Qual tipo de manutenção é realizada antes da ocorrência de falhas?",
        options: [
          { id: "a", text: "Manutenção corretiva", isCorrect: false },
          { id: "b", text: "Manutenção preventiva", isCorrect: true },
          { id: "c", text: "Manutenção preditiva", isCorrect: false },
          { id: "d", text: "Manutenção de emergência", isCorrect: false },
        ],
        explanation:
          "Manutenção preventiva é realizada periodicamente para evitar falhas, baseada em cronogramas pré-estabelecidos.",
        difficulty: "easy",
        topic: "Tipos de Manutenção",
      },
      {
        id: "q2",
        text: "Qual instrumento é mais adequado para medir isolamento elétrico?",
        options: [
          { id: "a", text: "Multímetro comum", isCorrect: false },
          { id: "b", text: "Megôhmetro", isCorrect: true },
          { id: "c", text: "Osciloscópio", isCorrect: false },
          { id: "d", text: "Amperímetro", isCorrect: false },
        ],
        explanation:
          "O megôhmetro (ou megger) aplica alta tensão para medir resistências muito altas, ideal para testes de isolamento.",
        difficulty: "medium",
        topic: "Instrumentos de Medição",
      },
      {
        id: "q3",
        text: "Em diagnóstico de falhas, o que significa MTBF?",
        options: [
          { id: "a", text: "Mean Time Before Failure", isCorrect: false },
          { id: "b", text: "Mean Time Between Failures", isCorrect: true },
          { id: "c", text: "Maximum Time Before Failure", isCorrect: false },
          { id: "d", text: "Minimum Time Between Failures", isCorrect: false },
        ],
        explanation: "MTBF (Mean Time Between Failures) é o tempo médio entre falhas consecutivas de um equipamento.",
        difficulty: "medium",
        topic: "Indicadores de Confiabilidade",
      },
    ],
  },

  // MATEMÁTICA - 3º ANO
  {
    id: "matematica-3ano-complexos",
    title: "Matemática - Números Complexos",
    description: "Operações com números complexos e suas aplicações em eletrônica",
    subject: "matematica-3ano",
    subjectName: "Matemática",
    category: "analog",
    difficulty: 3,
    timeLimit: 1500,
    passingScore: 80,
    tags: ["matemática", "números complexos", "fasores", "3º ano"],
    year: 3,
    questions: [
      {
        id: "q1",
        text: "Qual é o resultado de (3 + 4i) + (2 - 3i)?",
        options: [
          { id: "a", text: "5 + i", isCorrect: true },
          { id: "b", text: "5 - i", isCorrect: false },
          { id: "c", text: "1 + 7i", isCorrect: false },
          { id: "d", text: "6 + i", isCorrect: false },
        ],
        explanation: "Soma de complexos: (3 + 4i) + (2 - 3i) = (3 + 2) + (4i - 3i) = 5 + i.",
        difficulty: "easy",
        topic: "Operações com Complexos",
      },
      {
        id: "q2",
        text: "O módulo do número complexo 3 + 4i é:",
        options: [
          { id: "a", text: "7", isCorrect: false },
          { id: "b", text: "5", isCorrect: true },
          { id: "c", text: "25", isCorrect: false },
          { id: "d", text: "12", isCorrect: false },
        ],
        explanation: "Módulo: |3 + 4i| = √(3² + 4²) = √(9 + 16) = √25 = 5.",
        difficulty: "medium",
        topic: "Módulo de Complexos",
      },
      {
        id: "q3",
        text: "Na forma polar, o número complexo 1 + i pode ser escrito como:",
        options: [
          { id: "a", text: "√2 ∠ 45°", isCorrect: true },
          { id: "b", text: "2 ∠ 45°", isCorrect: false },
          { id: "c", text: "√2 ∠ 90°", isCorrect: false },
          { id: "d", text: "1 ∠ 45°", isCorrect: false },
        ],
        explanation: "1 + i tem módulo √2 e argumento 45° (ou π/4 rad), então é √2 ∠ 45°.",
        difficulty: "hard",
        topic: "Forma Polar",
      },
    ],
  },

  // FÍSICA - FORÇA DA NATUREZA E CAMPO - 3º ANO
  {
    id: "fisica-campo-3ano",
    title: "Física - Força da Natureza e Campo",
    description: "Campos elétricos, magnéticos e eletromagnetismo avançado",
    subject: "fisica-campo-3ano",
    subjectName: "Física - Força da Natureza e Campo",
    category: "power",
    difficulty: 3,
    timeLimit: 1500,
    passingScore: 80,
    tags: ["física", "campo elétrico", "magnetismo", "3º ano"],
    year: 3,
    questions: [
      {
        id: "q1",
        text: "A Lei de Faraday estabelece que a fem induzida é proporcional à:",
        options: [
          { id: "a", text: "Intensidade do campo magnético", isCorrect: false },
          { id: "b", text: "Variação do fluxo magnético", isCorrect: true },
          { id: "c", text: "Área da espira", isCorrect: false },
          { id: "d", text: "Resistência do circuito", isCorrect: false },
        ],
        explanation:
          "A Lei de Faraday: fem = -dΦ/dt, onde a fem induzida é proporcional à taxa de variação do fluxo magnético.",
        difficulty: "medium",
        topic: "Indução Eletromagnética",
      },
      {
        id: "q2",
        text: "O campo elétrico no interior de um condutor em equilíbrio eletrostático é:",
        options: [
          { id: "a", text: "Máximo", isCorrect: false },
          { id: "b", text: "Zero", isCorrect: true },
          { id: "c", text: "Constante", isCorrect: false },
          { id: "d", text: "Variável", isCorrect: false },
        ],
        explanation:
          "Em equilíbrio eletrostático, as cargas se distribuem na superfície do condutor, resultando em campo elétrico zero no interior.",
        difficulty: "medium",
        topic: "Campo Elétrico",
      },
      {
        id: "q3",
        text: "A força entre dois fios paralelos percorridos por correntes no mesmo sentido é:",
        options: [
          { id: "a", text: "Atrativa", isCorrect: true },
          { id: "b", text: "Repulsiva", isCorrect: false },
          { id: "c", text: "Zero", isCorrect: false },
          { id: "d", text: "Perpendicular aos fios", isCorrect: false },
        ],
        explanation:
          "Correntes no mesmo sentido em fios paralelos geram força atrativa entre eles, conforme a Lei de Ampère.",
        difficulty: "hard",
        topic: "Força Magnética",
      },
    ],
  },
]

// Funções auxiliares
export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.id === id)
}

export function getQuizzesBySubject(subject: string): Quiz[] {
  return quizzes.filter((quiz) => quiz.subject === subject)
}

export function getQuizzesByYear(year: number): Quiz[] {
  return quizzes.filter((quiz) => quiz.year === year)
}

export function getQuizzesByDifficulty(difficulty: number): Quiz[] {
  return quizzes.filter((quiz) => quiz.difficulty === difficulty)
}

export function searchQuizzes(searchTerm: string): Quiz[] {
  const term = searchTerm.toLowerCase()
  return quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(term) ||
      quiz.description.toLowerCase().includes(term) ||
      quiz.subjectName.toLowerCase().includes(term) ||
      quiz.tags.some((tag) => tag.toLowerCase().includes(term)),
  )
}

export function getRandomQuiz(): Quiz {
  return quizzes[Math.floor(Math.random() * quizzes.length)]
}

export function calculateQuizScore(
  answers: Record<string, string>,
  quiz: Quiz,
): {
  score: number
  percentage: number
  passed: boolean
  correctAnswers: number
  totalQuestions: number
} {
  const correctAnswers = quiz.questions.reduce((count, question) => {
    const selectedAnswer = answers[question.id]
    const correctOption = question.options.find((option) => option.isCorrect)
    return selectedAnswer === correctOption?.id ? count + 1 : count
  }, 0)

  const percentage = Math.round((correctAnswers / quiz.questions.length) * 100)

  return {
    score: correctAnswers,
    percentage,
    passed: percentage >= quiz.passingScore,
    correctAnswers,
    totalQuestions: quiz.questions.length,
  }
}

// Estatísticas dos questionários
export function getQuizStats() {
  const totalQuizzes = quizzes.length
  const byYear = {
    1: quizzes.filter((q) => q.year === 1).length,
    2: quizzes.filter((q) => q.year === 2).length,
    3: quizzes.filter((q) => q.year === 3).length,
  }
  const byDifficulty = {
    easy: quizzes.filter((q) => q.difficulty === 1).length,
    medium: quizzes.filter((q) => q.difficulty === 2).length,
    hard: quizzes.filter((q) => q.difficulty === 3).length,
  }
  const byCategory = {
    digital: quizzes.filter((q) => q.category === "digital").length,
    analog: quizzes.filter((q) => q.category === "analog").length,
    power: quizzes.filter((q) => q.category === "power").length,
  }

  return {
    totalQuizzes,
    byYear,
    byDifficulty,
    byCategory,
  }
}
