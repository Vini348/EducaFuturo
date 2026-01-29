interface CurriculumGame {
  id: string
  title: string
  description: string
  year: 1 | 2 | 3
  subject: string
  difficulty: "easy" | "medium" | "hard"
  type: "memory" | "quiz" | "simulation" | "matching" | "puzzle" | "strategy"
  estimatedTime: number // em minutos
  points: number
  icon: string
  category: string
  content: any
}

export const curriculumGames: CurriculumGame[] = [
  // ==================== 1º ANO ====================

  // CIRCUITOS ELÉTRICOS - 1º ANO
  {
    id: "memoria-componentes-basicos-1ano",
    title: "Memória dos Componentes Básicos",
    description: "Jogo da memória com resistores, capacitores, indutores e suas características",
    year: 1,
    subject: "Circuitos Elétricos",
    difficulty: "easy",
    type: "memory",
    estimatedTime: 10,
    points: 100,
    icon: "🔋",
    category: "Componentes Básicos",
    content: {
      pairs: [
        {
          id: "resistor",
          name: "Resistor",
          image: "/images/components/resistor.png",
          description: "Limita corrente elétrica",
        },
        {
          id: "capacitor",
          name: "Capacitor",
          image: "/images/components/capacitor.png",
          description: "Armazena carga elétrica",
        },
        {
          id: "indutor",
          name: "Indutor",
          image: "/images/components/indutor.png",
          description: "Armazena energia magnética",
        },
        {
          id: "diodo",
          name: "Diodo",
          image: "/images/components/diode.png",
          description: "Permite corrente em uma direção",
        },
        { id: "led", name: "LED", image: "/images/components/led.png", description: "Diodo emissor de luz" },
        { id: "bateria", name: "Bateria", image: "/images/components/battery.png", description: "Fonte de tensão DC" },
        {
          id: "transistor",
          name: "Transistor",
          image: "/images/components/transistor.png",
          description: "Amplifica ou chaveia sinais",
        },
        {
          id: "transformador",
          name: "Transformador",
          image: "/images/components/transformer.png",
          description: "Altera níveis de tensão AC",
        },
      ],
    },
  },
  {
    id: "associacao-lei-ohm-1ano",
    title: "Associação da Lei de Ohm",
    description: "Associe as fórmulas da Lei de Ohm com suas aplicações práticas",
    year: 1,
    subject: "Circuitos Elétricos",
    difficulty: "medium",
    type: "matching",
    estimatedTime: 15,
    points: 150,
    icon: "⚡",
    category: "Leis Fundamentais",
    content: {
      items: [
        { formula: "V = I × R", application: "Calcular tensão conhecendo corrente e resistência" },
        { formula: "I = V / R", application: "Calcular corrente conhecendo tensão e resistência" },
        { formula: "R = V / I", application: "Calcular resistência conhecendo tensão e corrente" },
        { formula: "P = V × I", application: "Calcular potência elétrica" },
        { formula: "P = I² × R", application: "Potência em função da corrente e resistência" },
        { formula: "P = V² / R", application: "Potência em função da tensão e resistência" },
      ],
    },
  },
  {
    id: "simulador-circuitos-serie-paralelo-1ano",
    title: "Simulador de Circuitos Série e Paralelo",
    description: "Monte circuitos série e paralelo e observe o comportamento das grandezas",
    year: 1,
    subject: "Circuitos Elétricos",
    difficulty: "hard",
    type: "simulation",
    estimatedTime: 25,
    points: 200,
    icon: "🔌",
    category: "Análise de Circuitos",
    content: {
      scenarios: [
        {
          title: "Circuito Série Simples",
          components: ["fonte", "resistor1", "resistor2", "resistor3"],
          objective: "Calcular corrente total e tensões parciais",
        },
        {
          title: "Circuito Paralelo Simples",
          components: ["fonte", "resistor1", "resistor2", "resistor3"],
          objective: "Calcular correntes parciais e resistência equivalente",
        },
        {
          title: "Circuito Misto",
          components: ["fonte", "resistor1", "resistor2", "resistor3", "resistor4"],
          objective: "Analisar circuito série-paralelo complexo",
        },
      ],
    },
  },

  // ELETRÔNICA DIGITAL - 1º ANO
  {
    id: "quiz-sistemas-numeracao-1ano",
    title: "Quiz dos Sistemas de Numeração",
    description: "Teste seus conhecimentos sobre conversões entre sistemas binário, decimal e hexadecimal",
    year: 1,
    subject: "Eletrônica Digital",
    difficulty: "medium",
    type: "quiz",
    estimatedTime: 20,
    points: 150,
    icon: "💻",
    category: "Sistemas de Numeração",
    content: {
      questions: [
        {
          question: "Converta o número decimal 25 para binário:",
          options: ["11001", "10011", "11010", "10101"],
          correct: 0,
          explanation: "25 em binário é 11001 (16+8+1 = 25)",
        },
        {
          question: "Qual o valor decimal do binário 1101?",
          options: ["11", "13", "15", "12"],
          correct: 1,
          explanation: "1101 = 8+4+0+1 = 13",
        },
        {
          question: "O hexadecimal FF corresponde a qual decimal?",
          options: ["255", "256", "254", "240"],
          correct: 0,
          explanation: "FF = 15×16 + 15 = 255",
        },
        {
          question: "Converta o decimal 100 para hexadecimal:",
          options: ["64", "6A", "A6", "46"],
          correct: 1,
          explanation: "100 ÷ 16 = 6 resto 4, então 100 = 6A em hexadecimal",
        },
        {
          question: "Qual o valor binário do hexadecimal A3?",
          options: ["10100011", "10110011", "10100001", "11100011"],
          correct: 0,
          explanation: "A3 = 1010 0011 (A=1010, 3=0011)",
        },
      ],
    },
  },
  {
    id: "memoria-portas-logicas-1ano",
    title: "Memória das Portas Lógicas",
    description: "Encontre os pares de portas lógicas e suas tabelas verdade",
    year: 1,
    subject: "Eletrônica Digital",
    difficulty: "easy",
    type: "memory",
    estimatedTime: 12,
    points: 120,
    icon: "🚪",
    category: "Portas Lógicas",
    content: {
      pairs: [
        {
          id: "and",
          name: "Porta AND",
          symbol: "∧",
          truthTable: "0,0→0; 0,1→0; 1,0→0; 1,1→1",
          image: "/images/logic-gates/and-gate.png",
        },
        {
          id: "or",
          name: "Porta OR",
          symbol: "∨",
          truthTable: "0,0→0; 0,1→1; 1,0→1; 1,1→1",
          image: "/images/logic-gates/or-gate.png",
        },
        {
          id: "not",
          name: "Porta NOT",
          symbol: "¬",
          truthTable: "0→1; 1→0",
          image: "/images/logic-gates/not-gate.png",
        },
        {
          id: "nand",
          name: "Porta NAND",
          symbol: "⊼",
          truthTable: "0,0→1; 0,1→1; 1,0→1; 1,1→0",
          image: "/images/logic-gates/nand-gate.png",
        },
        {
          id: "nor",
          name: "Porta NOR",
          symbol: "⊽",
          truthTable: "0,0→1; 0,1→0; 1,0→0; 1,1→0",
          image: "/images/logic-gates/nor-gate.png",
        },
        {
          id: "xor",
          name: "Porta XOR",
          symbol: "⊕",
          truthTable: "0,0→0; 0,1→1; 1,0→1; 1,1→0",
          image: "/images/logic-gates/xor-gate.png",
        },
      ],
    },
  },

  // MATEMÁTICA - 1º ANO
  {
    id: "puzzle-funcoes-1ano",
    title: "Puzzle das Funções",
    description: "Monte o gráfico correto para cada tipo de função matemática",
    year: 1,
    subject: "Matemática",
    difficulty: "medium",
    type: "puzzle",
    estimatedTime: 18,
    points: 140,
    icon: "📊",
    category: "Funções",
    content: {
      functions: [
        { type: "linear", equation: "f(x) = 2x + 1", description: "Função do 1º grau crescente" },
        { type: "quadratic", equation: "f(x) = x² - 4", description: "Função do 2º grau com concavidade para cima" },
        { type: "exponential", equation: "f(x) = 2^x", description: "Função exponencial crescente" },
        { type: "logarithmic", equation: "f(x) = log(x)", description: "Função logarítmica" },
        { type: "trigonometric", equation: "f(x) = sen(x)", description: "Função trigonométrica seno" },
      ],
    },
  },
  {
    id: "estrategia-equacoes-1ano",
    title: "Estratégia das Equações",
    description: "Resolva equações do 1º e 2º grau seguindo a estratégia correta",
    year: 1,
    subject: "Matemática",
    difficulty: "hard",
    type: "strategy",
    estimatedTime: 30,
    points: 180,
    icon: "🎯",
    category: "Equações",
    content: {
      levels: [
        {
          title: "Equações do 1º Grau",
          equations: ["2x + 5 = 13", "3x - 7 = 2x + 1", "4(x-1) = 2x + 6"],
          strategy: "Isolar a variável x aplicando operações inversas",
        },
        {
          title: "Equações do 2º Grau",
          equations: ["x² - 5x + 6 = 0", "2x² - 8x + 6 = 0", "x² - 4 = 0"],
          strategy: "Usar fórmula de Bhaskara ou fatoração",
        },
      ],
    },
  },

  // FÍSICA - FORÇA DA NATUREZA - 1º ANO
  {
    id: "simulador-leis-newton-1ano",
    title: "Simulador das Leis de Newton",
    description: "Experimente com forças, massas e acelerações em diferentes cenários",
    year: 1,
    subject: "Física - Força da Natureza",
    difficulty: "medium",
    type: "simulation",
    estimatedTime: 22,
    points: 160,
    icon: "🍎",
    category: "Leis de Newton",
    content: {
      experiments: [
        {
          title: "1ª Lei - Inércia",
          scenario: "Objeto em movimento retilíneo uniforme",
          variables: ["velocidade", "atrito", "força_aplicada"],
        },
        {
          title: "2ª Lei - F = ma",
          scenario: "Força resultante causando aceleração",
          variables: ["força", "massa", "aceleração"],
        },
        {
          title: "3ª Lei - Ação e Reação",
          scenario: "Interação entre dois corpos",
          variables: ["força_acao", "força_reacao", "massa1", "massa2"],
        },
      ],
    },
  },
  {
    id: "associacao-grandezas-vetoriais-1ano",
    title: "Associação de Grandezas Vetoriais",
    description: "Associe grandezas físicas com suas características vetoriais",
    year: 1,
    subject: "Física - Força da Natureza",
    difficulty: "easy",
    type: "matching",
    estimatedTime: 15,
    points: 130,
    icon: "📐",
    category: "Grandezas Vetoriais",
    content: {
      items: [
        { grandeza: "Velocidade", caracteristica: "Módulo, direção e sentido" },
        { grandeza: "Força", caracteristica: "Intensidade, direção e sentido" },
        { grandeza: "Aceleração", caracteristica: "Módulo, direção e sentido" },
        { grandeza: "Deslocamento", caracteristica: "Módulo, direção e sentido" },
        { grandeza: "Temperatura", caracteristica: "Apenas módulo (escalar)" },
        { grandeza: "Massa", caracteristica: "Apenas módulo (escalar)" },
      ],
    },
  },

  // INTRODUÇÃO À COMPUTAÇÃO - 1º ANO
  {
    id: "quiz-excel-basico-1ano",
    title: "Quiz Excel Básico",
    description: "Teste seus conhecimentos sobre fórmulas e funções básicas do Excel",
    year: 1,
    subject: "Introdução à Computação",
    difficulty: "easy",
    type: "quiz",
    estimatedTime: 15,
    points: 110,
    icon: "📊",
    category: "Planilhas Eletrônicas",
    content: {
      questions: [
        {
          question: "Qual fórmula calcula a soma de A1 até A10?",
          options: ["=SOMA(A1:A10)", "=SUM(A1:A10)", "=TOTAL(A1:A10)", "=ADD(A1:A10)"],
          correct: 0,
          explanation: "A função SOMA() é usada para somar intervalos de células",
        },
        {
          question: "Como fazer referência absoluta à célula B5?",
          options: ["B5", "$B$5", "&B&5", "#B#5"],
          correct: 1,
          explanation: "O símbolo $ torna a referência absoluta",
        },
        {
          question: "Qual função calcula a média aritmética?",
          options: ["=MEDIA()", "=AVERAGE()", "=MEAN()", "=AVG()"],
          correct: 0,
          explanation: "A função MEDIA() calcula a média aritmética dos valores",
        },
        {
          question: "Qual função encontra o maior valor em um intervalo?",
          options: ["=MAXIMO()", "=MAX()", "=MAIOR()", "=TOP()"],
          correct: 0,
          explanation: "A função MAXIMO() retorna o maior valor do intervalo especificado",
        },
        {
          question: "Como criar um gráfico no Excel?",
          options: ["Inserir > Gráfico", "Dados > Gráfico", "Fórmulas > Gráfico", "Página Inicial > Gráfico"],
          correct: 0,
          explanation: "Para criar gráficos, use a aba Inserir e selecione o tipo de gráfico desejado",
        },
      ],
    },
  },

  // ==================== 2º ANO ====================

  // MATEMÁTICA - 2º ANO
  {
    id: "estrategia-analise-combinatoria-2ano",
    title: "Estratégia da Análise Combinatória",
    description: "Resolva problemas de permutação, arranjo e combinação usando a estratégia correta",
    year: 2,
    subject: "Matemática",
    difficulty: "hard",
    type: "strategy",
    estimatedTime: 35,
    points: 220,
    icon: "🎲",
    category: "Análise Combinatória",
    content: {
      problems: [
        {
          type: "permutacao",
          problem: "De quantas maneiras 5 pessoas podem se sentar em uma fila?",
          solution: "P5 = 5! = 120",
          strategy: "Usar permutação simples quando a ordem importa",
        },
        {
          type: "arranjo",
          problem: "Quantos números de 3 algarismos distintos podemos formar com os dígitos 1,2,3,4,5?",
          solution: "A5,3 = 5!/(5-3)! = 60",
          strategy: "Usar arranjo quando escolhemos e ordenamos",
        },
        {
          type: "combinacao",
          problem: "De quantas maneiras podemos escolher 3 pessoas de um grupo de 8?",
          solution: "C8,3 = 8!/(3!×5!) = 56",
          strategy: "Usar combinação quando a ordem não importa",
        },
      ],
    },
  },
  {
    id: "simulador-probabilidade-2ano",
    title: "Simulador de Probabilidade",
    description: "Experimente com dados, moedas e cartas para entender conceitos de probabilidade",
    year: 2,
    subject: "Matemática",
    difficulty: "medium",
    type: "simulation",
    estimatedTime: 25,
    points: 170,
    icon: "🎰",
    category: "Probabilidade",
    content: {
      experiments: [
        {
          title: "Lançamento de Dados",
          description: "Calcule probabilidades com um ou dois dados",
          events: ["número par", "soma igual a 7", "produto maior que 10"],
        },
        {
          title: "Cartas de Baralho",
          description: "Probabilidades com cartas de um baralho padrão",
          events: ["carta vermelha", "figura", "ás de espadas"],
        },
        {
          title: "Urna com Bolas",
          description: "Retirada de bolas coloridas com e sem reposição",
          events: ["bola azul", "duas bolas da mesma cor", "pelo menos uma vermelha"],
        },
      ],
    },
  },

  // ELETRÔNICA ANALÓGICA - 2º ANO
  {
    id: "memoria-semicondutores-2ano",
    title: "Memória dos Semicondutores",
    description: "Encontre os pares de dispositivos semicondutores e suas características",
    year: 2,
    subject: "Eletrônica Analógica",
    difficulty: "medium",
    type: "memory",
    estimatedTime: 18,
    points: 150,
    icon: "🔬",
    category: "Dispositivos Semicondutores",
    content: {
      pairs: [
        {
          id: "diodo_retificador",
          name: "Diodo Retificador",
          characteristic: "Conduz corrente em uma direção",
          image: "/images/semiconductors/rectifier-diode.png",
        },
        {
          id: "diodo_zener",
          name: "Diodo Zener",
          characteristic: "Regulador de tensão",
          image: "/images/semiconductors/zener-diode.png",
        },
        {
          id: "transistor_bjt",
          name: "Transistor BJT",
          characteristic: "Amplificador de corrente",
          image: "/images/semiconductors/bjt-transistor.png",
        },
        {
          id: "transistor_fet",
          name: "Transistor FET",
          characteristic: "Amplificador controlado por tensão",
          image: "/images/semiconductors/fet-transistor.png",
        },
        {
          id: "scr",
          name: "SCR (Tiristor)",
          characteristic: "Chave controlada",
          image: "/images/semiconductors/scr.png",
        },
        {
          id: "triac",
          name: "TRIAC",
          characteristic: "Controle de potência AC",
          image: "/images/semiconductors/triac.png",
        },
      ],
    },
  },
  {
    id: "simulador-amplificadores-2ano",
    title: "Simulador de Amplificadores",
    description: "Configure diferentes tipos de amplificadores e observe suas características",
    year: 2,
    subject: "Eletrônica Analógica",
    difficulty: "hard",
    type: "simulation",
    estimatedTime: 30,
    points: 200,
    icon: "📢",
    category: "Amplificadores",
    content: {
      amplifiers: [
        {
          type: "Emissor Comum",
          parameters: ["ganho_tensao", "impedancia_entrada", "impedancia_saida"],
          characteristics: "Alto ganho de tensão, inversão de fase",
        },
        {
          type: "Coletor Comum",
          parameters: ["ganho_corrente", "impedancia_entrada", "impedancia_saida"],
          characteristics: "Seguidor de tensão, alta impedância de entrada",
        },
        {
          type: "Base Comum",
          parameters: ["ganho_tensao", "frequencia_corte"],
          characteristics: "Sem inversão de fase, boa resposta em frequência",
        },
      ],
    },
  },

  // PROGRAMAÇÃO - 2º ANO
  {
    id: "puzzle-algoritmos-2ano",
    title: "Puzzle dos Algoritmos",
    description: "Monte algoritmos colocando os blocos de código na ordem correta",
    year: 2,
    subject: "Programação",
    difficulty: "medium",
    type: "puzzle",
    estimatedTime: 20,
    points: 160,
    icon: "🧩",
    category: "Lógica de Programação",
    content: {
      algorithms: [
        {
          title: "Algoritmo de Ordenação (Bubble Sort)",
          blocks: [
            "início",
            "para i = 0 até n-1",
            "para j = 0 até n-i-2",
            "se vetor[j] > vetor[j+1]",
            "trocar vetor[j] com vetor[j+1]",
            "fim se",
            "fim para j",
            "fim para i",
            "fim",
          ],
          description: "Algoritmo simples de ordenação que compara elementos adjacentes",
        },
        {
          title: "Busca Linear",
          blocks: [
            "início",
            "ler valor_procurado",
            "para i = 0 até n-1",
            "se vetor[i] = valor_procurado",
            "retornar posição i",
            "fim se",
            "fim para",
            "retornar -1 (não encontrado)",
            "fim",
          ],
          description: "Busca sequencial elemento por elemento no vetor",
        },
        {
          title: "Cálculo do Fatorial",
          blocks: [
            "início",
            "ler n",
            "fatorial = 1",
            "para i = 1 até n",
            "fatorial = fatorial * i",
            "fim para",
            "escrever fatorial",
            "fim",
          ],
          description: "Calcula o fatorial de um número usando laço de repetição",
        },
      ],
    },
  },
  {
    id: "quiz-estruturas-dados-2ano",
    title: "Quiz de Estruturas de Dados",
    description: "Teste seus conhecimentos sobre arrays, listas, pilhas e filas",
    year: 2,
    subject: "Programação",
    difficulty: "hard",
    type: "quiz",
    estimatedTime: 25,
    points: 190,
    icon: "📚",
    category: "Estruturas de Dados",
    content: {
      questions: [
        {
          question: "Qual estrutura segue o princípio LIFO (Last In, First Out)?",
          options: ["Fila", "Pilha", "Lista", "Array"],
          correct: 1,
          explanation: "Pilha segue LIFO - o último elemento inserido é o primeiro a sair",
        },
        {
          question: "Em uma fila, onde são inseridos os novos elementos?",
          options: ["No início", "No final", "No meio", "Em qualquer posição"],
          correct: 1,
          explanation: "Na fila, elementos são inseridos no final e removidos do início (FIFO)",
        },
        {
          question: "Qual a complexidade de busca em um array não ordenado?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: 2,
          explanation: "Busca linear em array não ordenado tem complexidade O(n)",
        },
        {
          question: "Qual estrutura permite acesso direto aos elementos por índice?",
          options: ["Lista ligada", "Pilha", "Array", "Árvore"],
          correct: 2,
          explanation: "Arrays permitem acesso direto aos elementos através de índices",
        },
        {
          question: "Em uma árvore binária, quantos filhos cada nó pode ter no máximo?",
          options: ["1", "2", "3", "Ilimitado"],
          correct: 1,
          explanation: "Em árvores binárias, cada nó pode ter no máximo 2 filhos",
        },
      ],
    },
  },

  // SISTEMAS DE COMUNICAÇÃO - 2º ANO
  {
    id: "associacao-protocolos-rede-2ano",
    title: "Associação de Protocolos de Rede",
    description: "Associe protocolos de rede com suas funções e características",
    year: 2,
    subject: "Sistemas de Comunicação",
    difficulty: "medium",
    type: "matching",
    estimatedTime: 20,
    points: 150,
    icon: "🌐",
    category: "Protocolos de Rede",
    content: {
      items: [
        { protocol: "HTTP", function: "Transferência de páginas web", layer: "Aplicação" },
        { protocol: "TCP", function: "Transporte confiável de dados", layer: "Transporte" },
        { protocol: "IP", function: "Roteamento de pacotes", layer: "Rede" },
        { protocol: "Ethernet", function: "Acesso ao meio físico", layer: "Enlace" },
        { protocol: "FTP", function: "Transferência de arquivos", layer: "Aplicação" },
        { protocol: "UDP", function: "Transporte rápido sem garantias", layer: "Transporte" },
      ],
    },
  },
  {
    id: "simulador-modulacao-2ano",
    title: "Simulador de Modulação",
    description: "Experimente com diferentes tipos de modulação AM, FM e digital",
    year: 2,
    subject: "Sistemas de Comunicação",
    difficulty: "hard",
    type: "simulation",
    estimatedTime: 28,
    points: 180,
    icon: "📡",
    category: "Modulação",
    content: {
      modulations: [
        {
          type: "AM (Amplitude Modulation)",
          parameters: ["frequencia_portadora", "amplitude_modulacao", "indice_modulacao"],
          characteristics: "Varia amplitude da portadora",
        },
        {
          type: "FM (Frequency Modulation)",
          parameters: ["frequencia_portadora", "desvio_frequencia", "frequencia_modulante"],
          characteristics: "Varia frequência da portadora",
        },
        {
          type: "ASK (Amplitude Shift Keying)",
          parameters: ["amplitude_0", "amplitude_1", "taxa_bits"],
          characteristics: "Modulação digital por amplitude",
        },
        {
          type: "FSK (Frequency Shift Keying)",
          parameters: ["frequencia_0", "frequencia_1", "taxa_bits"],
          characteristics: "Modulação digital por frequência",
        },
      ],
    },
  },

  // FÍSICA - ENERGIA - 2º ANO
  {
    id: "simulador-ondas-2ano",
    title: "Simulador de Ondas",
    description: "Experimente com ondas mecânicas e eletromagnéticas",
    year: 2,
    subject: "Física - Energia",
    difficulty: "medium",
    type: "simulation",
    estimatedTime: 25,
    points: 170,
    icon: "🌊",
    category: "Ondas",
    content: {
      wave_types: [
        {
          type: "Onda Senoidal",
          parameters: ["amplitude", "frequencia", "comprimento_onda", "velocidade"],
          equation: "y = A × sen(2π(ft - x/λ))",
        },
        {
          type: "Onda Quadrada",
          parameters: ["amplitude", "periodo", "duty_cycle"],
          applications: "Sinais digitais, eletrônica",
        },
        {
          type: "Onda Triangular",
          parameters: ["amplitude", "periodo", "simetria"],
          applications: "Geradores de função, música",
        },
      ],
    },
  },
  {
    id: "puzzle-movimento-harmonico-2ano",
    title: "Puzzle do Movimento Harmônico",
    description: "Monte as equações do movimento harmônico simples",
    year: 2,
    subject: "Física - Energia",
    difficulty: "hard",
    type: "puzzle",
    estimatedTime: 30,
    points: 200,
    icon: "⚖️",
    category: "Movimento Harmônico",
    content: {
      equations: [
        {
          system: "Massa-Mola",
          position: "x(t) = A × cos(ωt + φ)",
          velocity: "v(t) = -Aω × sen(ωt + φ)",
          acceleration: "a(t) = -Aω² × cos(ωt + φ)",
          frequency: "ω = √(k/m)",
        },
        {
          system: "Pêndulo Simples",
          position: "θ(t) = θ₀ × cos(ωt + φ)",
          frequency: "ω = √(g/L)",
          period: "T = 2π√(L/g)",
          energy: "E = ½mgh(1-cosθ₀)",
        },
      ],
    },
  },

  // INSTALAÇÕES ELÉTRICAS - 2º ANO
  {
    id: "memoria-dispositivos-protecao-2ano",
    title: "Memória dos Dispositivos de Proteção",
    description: "Encontre os pares de dispositivos de proteção e suas aplicações",
    year: 2,
    subject: "Instalação",
    difficulty: "easy",
    type: "memory",
    estimatedTime: 15,
    points: 130,
    icon: "🛡️",
    category: "Proteção Elétrica",
    content: {
      pairs: [
        {
          id: "disjuntor",
          name: "Disjuntor",
          application: "Proteção contra sobrecorrente",
          image: "/images/protection/circuit-breaker.png",
        },
        {
          id: "dr",
          name: "Dispositivo DR",
          application: "Proteção contra fuga de corrente",
          image: "/images/protection/rcd.png",
        },
        {
          id: "dps",
          name: "Dispositivo DPS",
          application: "Proteção contra surtos",
          image: "/images/protection/spd.png",
        },
        {
          id: "fusivel",
          name: "Fusível",
          application: "Proteção por fusão",
          image: "/images/protection/fuse.png",
        },
        {
          id: "rele_termico",
          name: "Relé Térmico",
          application: "Proteção de motores",
          image: "/images/protection/thermal-relay.png",
        },
        {
          id: "para_raios",
          name: "Para-raios",
          application: "Proteção contra descargas atmosféricas",
          image: "/images/protection/lightning-rod.png",
        },
      ],
    },
  },
  {
    id: "quiz-normas-nbr-2ano",
    title: "Quiz das Normas NBR",
    description: "Teste seus conhecimentos sobre normas brasileiras de instalações elétricas",
    year: 2,
    subject: "Instalação",
    difficulty: "hard",
    type: "quiz",
    estimatedTime: 25,
    points: 190,
    icon: "📋",
    category: "Normas Técnicas",
    content: {
      questions: [
        {
          question: "Qual norma regulamenta instalações elétricas de baixa tensão?",
          options: ["NBR 5410", "NBR 5419", "NBR 14039", "NBR 5444"],
          correct: 0,
          explanation: "NBR 5410 é a norma para instalações elétricas de baixa tensão",
        },
        {
          question: "Qual a seção mínima para condutor de proteção (terra)?",
          options: ["1,5 mm²", "2,5 mm²", "4,0 mm²", "6,0 mm²"],
          correct: 1,
          explanation: "A seção mínima do condutor de proteção é 2,5 mm²",
        },
        {
          question: "Em banheiros, qual a altura mínima para tomadas?",
          options: ["0,3 m", "0,6 m", "1,0 m", "1,3 m"],
          correct: 3,
          explanation: "Em banheiros, tomadas devem estar a pelo menos 1,3 m do piso",
        },
        {
          question: "Qual a cor padronizada para o condutor neutro?",
          options: ["Verde", "Azul claro", "Amarelo", "Preto"],
          correct: 1,
          explanation: "O condutor neutro deve ser identificado pela cor azul claro",
        },
        {
          question: "Qual norma trata de proteção contra descargas atmosféricas?",
          options: ["NBR 5410", "NBR 5419", "NBR 14039", "NBR 5444"],
          correct: 1,
          explanation: "NBR 5419 regulamenta a proteção de estruturas contra descargas atmosféricas",
        },
      ],
    },
  },

  // ==================== 3º ANO ====================

  // ELETRÔNICA DE POTÊNCIA - 3º ANO
  {
    id: "simulador-conversores-dc-dc-3ano",
    title: "Simulador de Conversores DC-DC",
    description: "Simule diferentes topologias de conversores DC-DC e analise suas características",
    year: 3,
    subject: "Eletrônica de Potência",
    difficulty: "hard",
    type: "simulation",
    estimatedTime: 35,
    points: 250,
    icon: "🔄",
    category: "Conversores DC-DC",
    content: {
      converters: [
        {
          type: "Buck (Abaixador)",
          components: ["chave", "diodo", "indutor", "capacitor"],
          equation: "Vo = D × Vi",
          characteristics: "Tensão de saída menor que entrada",
        },
        {
          type: "Boost (Elevador)",
          components: ["chave", "diodo", "indutor", "capacitor"],
          equation: "Vo = Vi / (1-D)",
          characteristics: "Tensão de saída maior que entrada",
        },
        {
          type: "Buck-Boost (Inversor)",
          components: ["chave", "diodo", "indutor", "capacitor"],
          equation: "Vo = -D × Vi / (1-D)",
          characteristics: "Tensão de saída invertida",
        },
      ],
    },
  },
  {
    id: "associacao-pwm-3ano",
    title: "Associação PWM",
    description: "Associe técnicas de PWM com suas aplicações em eletrônica de potência",
    year: 3,
    subject: "Eletrônica de Potência",
    difficulty: "medium",
    type: "matching",
    estimatedTime: 20,
    points: 160,
    icon: "⚡",
    category: "Modulação PWM",
    content: {
      items: [
        { technique: "PWM Senoidal", application: "Inversores para motores AC" },
        { technique: "PWM por Histerese", application: "Controle de corrente" },
        { technique: "PWM Vetorial (SVPWM)", application: "Controle eficiente de motores trifásicos" },
        { technique: "PWM com Portadora Triangular", application: "Conversores DC-DC" },
        { technique: "PWM Aleatório", application: "Redução de EMI" },
        { technique: "PWM Multinível", application: "Alta tensão, baixa distorção" },
      ],
    },
  },

  // CONTROLE - 3º ANO
  {
    id: "simulador-amplificadores-operacionais-3ano",
    title: "Simulador de Amplificadores Operacionais",
    description: "Configure diferentes circuitos com amp-ops e analise suas respostas",
    year: 3,
    subject: "Controle",
    difficulty: "hard",
    type: "simulation",
    estimatedTime: 30,
    points: 220,
    icon: "📈",
    category: "Amplificadores Operacionais",
    content: {
      configurations: [
        {
          type: "Amplificador Inversor",
          gain: "Av = -Rf/Ri",
          characteristics: "Inverte o sinal, ganho controlado por resistores",
        },
        {
          type: "Amplificador Não-Inversor",
          gain: "Av = 1 + Rf/Ri",
          characteristics: "Não inverte o sinal, alta impedância de entrada",
        },
        {
          type: "Seguidor de Tensão",
          gain: "Av = 1",
          characteristics: "Buffer, isolação entre estágios",
        },
        {
          type: "Amplificador Diferencial",
          gain: "Av = Rf/Ri",
          characteristics: "Amplifica diferença entre entradas",
        },
        {
          type: "Integrador",
          response: "Vo = -1/(RC) ∫ Vi dt",
          characteristics: "Integra o sinal de entrada",
        },
        {
          type: "Derivador",
          response: "Vo = -RC × dVi/dt",
          characteristics: "Deriva o sinal de entrada",
        },
      ],
    },
  },
  {
    id: "puzzle-programacao-clp-3ano",
    title: "Puzzle de Programação CLP",
    description: "Monte programas Ladder para controle de processos industriais",
    year: 3,
    subject: "Controle",
    difficulty: "hard",
    type: "puzzle",
    estimatedTime: 40,
    points: 280,
    icon: "🏭",
    category: "Controladores Lógicos Programáveis",
    content: {
      programs: [
        {
          title: "Comando de Motor com Botoeira",
          description: "Liga motor com botão Liga, desliga com botão Desliga",
          inputs: ["I0.0 (Botão Liga)", "I0.1 (Botão Desliga)", "I0.2 (Proteção Térmica)"],
          outputs: ["Q0.0 (Contator Motor)", "Q0.1 (Sinalização)"],
          logic: "Selo com intertravamento de segurança",
        },
        {
          title: "Semáforo Automático",
          description: "Controle sequencial de semáforo com temporizadores",
          inputs: ["I0.0 (Início Ciclo)"],
          outputs: ["Q0.0 (Verde)", "Q0.1 (Amarelo)", "Q0.2 (Vermelho)"],
          timers: ["T1 (30s Verde)", "T2 (5s Amarelo)", "T3 (25s Vermelho)"],
        },
        {
          title: "Esteira Transportadora",
          description: "Controle de esteira com sensores de presença",
          inputs: ["I0.0 (Sensor Entrada)", "I0.1 (Sensor Saída)", "I0.2 (Emergência)"],
          outputs: ["Q0.0 (Motor Esteira)", "Q0.1 (Alarme)"],
          counters: ["C1 (Contador Peças)"],
        },
      ],
    },
  },

  // MANUTENÇÃO - 3º ANO
  {
    id: "estrategia-diagnostico-falhas-3ano",
    title: "Estratégia de Diagnóstico de Falhas",
    description: "Use estratégias sistemáticas para diagnosticar falhas em equipamentos",
    year: 3,
    subject: "Manutenção",
    difficulty: "hard",
    type: "strategy",
    estimatedTime: 35,
    points: 240,
    icon: "🔧",
    category: "Diagnóstico de Falhas",
    content: {
      scenarios: [
        {
          equipment: "Motor Elétrico Trifásico",
          symptoms: ["Motor não parte", "Ruído excessivo", "Aquecimento"],
          possible_causes: ["Falta de fase", "Rolamento defeituoso", "Sobrecarga"],
          diagnostic_steps: [
            "Verificar alimentação elétrica",
            "Medir correntes das fases",
            "Verificar isolação dos enrolamentos",
            "Inspecionar acoplamentos mecânicos",
          ],
        },
        {
          equipment: "Fonte de Alimentação",
          symptoms: ["Tensão baixa", "Ripple excessivo", "Aquecimento"],
          possible_causes: ["Capacitor filtro defeituoso", "Regulador danificado", "Sobrecarga"],
          diagnostic_steps: [
            "Medir tensão de saída",
            "Verificar ripple com osciloscópio",
            "Testar capacitores",
            "Verificar corrente de carga",
          ],
        },
      ],
    },
  },
  {
    id: "quiz-confiabilidade-3ano",
    title: "Quiz de Confiabilidade",
    description: "Teste conhecimentos sobre MTBF, MTTR e análise de confiabilidade",
    year: 3,
    subject: "Manutenção",
    difficulty: "medium",
    type: "quiz",
    estimatedTime: 20,
    points: 170,
    icon: "📊",
    category: "Confiabilidade",
    content: {
      questions: [
        {
          question: "O que significa MTBF?",
          options: [
            "Mean Time Before Failure",
            "Mean Time Between Failures",
            "Maximum Time Before Failure",
            "Minimum Time Between Failures",
          ],
          correct: 1,
          explanation: "MTBF = Mean Time Between Failures (Tempo Médio Entre Falhas)",
        },
        {
          question: "Se um equipamento tem MTBF = 1000h, qual a taxa de falhas?",
          options: ["0,001 falhas/h", "0,01 falhas/h", "0,1 falhas/h", "1 falha/h"],
          correct: 0,
          explanation: "Taxa de falhas λ = 1/MTBF = 1/1000 = 0,001 falhas/h",
        },
        {
          question: "Qual tipo de manutenção é mais econômica a longo prazo?",
          options: ["Corretiva", "Preventiva", "Preditiva", "Detectiva"],
          correct: 2,
          explanation: "Manutenção preditiva otimiza recursos e evita falhas inesperadas",
        },
      ],
    },
  },

  // MATEMÁTICA - 3º ANO
  {
    id: "simulador-numeros-complexos-3ano",
    title: "Simulador de Números Complexos",
    description: "Visualize e opere com números complexos no plano complexo",
    year: 3,
    subject: "Matemática",
    difficulty: "hard",
    type: "simulation",
    estimatedTime: 25,
    points: 200,
    icon: "🔢",
    category: "Números Complexos",
    content: {
      operations: [
        {
          type: "Soma e Subtração",
          method: "Forma retangular: (a+bi) ± (c+di) = (a±c) + (b±d)i",
          visualization: "Soma vetorial no plano complexo",
        },
        {
          type: "Multiplicação",
          method: "Forma polar: r₁∠θ₁ × r₂∠θ₂ = r₁r₂∠(θ₁+θ₂)",
          visualization: "Multiplicação de módulos, soma de argumentos",
        },
        {
          type: "Divisão",
          method: "Forma polar: r₁∠θ₁ ÷ r₂∠θ₂ = (r₁/r₂)∠(θ₁-θ₂)",
          visualization: "Divisão de módulos, subtração de argumentos",
        },
        {
          type: "Potenciação",
          method: "Fórmula de De Moivre: (r∠θ)ⁿ = rⁿ∠(nθ)",
          visualization: "Potência do módulo, múltiplo do argumento",
        },
      ],
    },
  },

  // FÍSICA - FORÇA DA NATUREZA E CAMPO - 3º ANO
  {
    id: "simulador-eletromagnetismo-3ano",
    title: "Simulador de Eletromagnetismo",
    description: "Experimente com campos elétricos, magnéticos e indução eletromagnética",
    year: 3,
    subject: "Física - Força da Natureza e Campo",
    difficulty: "hard",
    type: "simulation",
    estimatedTime: 30,
    points: 220,
    icon: "🧲",
    category: "Eletromagnetismo",
    content: {
      phenomena: [
        {
          type: "Campo Elétrico",
          equations: ["E = kQ/r²", "F = qE", "V = kQ/r"],
          experiments: ["Carga pontual", "Dipolo elétrico", "Condutor carregado"],
        },
        {
          type: "Campo Magnético",
          equations: ["B = μI/(2πr)", "F = qvB", "F = BIL"],
          experiments: ["Fio retilíneo", "Espira circular", "Solenoide"],
        },
        {
          type: "Indução Eletromagnética",
          equations: ["ε = -dΦ/dt", "Φ = BA", "ε = BLv"],
          experiments: ["Bobina em movimento", "Campo variável", "Transformador"],
        },
      ],
    },
  },
  {
    id: "puzzle-leis-maxwell-3ano",
    title: "Puzzle das Leis de Maxwell",
    description: "Monte as quatro equações de Maxwell e suas interpretações físicas",
    year: 3,
    subject: "Física - Força da Natureza e Campo",
    difficulty: "hard",
    type: "puzzle",
    estimatedTime: 35,
    points: 260,
    icon: "⚡",
    category: "Equações de Maxwell",
    content: {
      equations: [
        {
          name: "Lei de Gauss para Eletricidade",
          equation: "∇·E = ρ/ε₀",
          interpretation: "Cargas elétricas são fontes de campo elétrico",
          integral_form: "∮E·dA = Q/ε₀",
        },
        {
          name: "Lei de Gauss para Magnetismo",
          equation: "∇·B = 0",
          interpretation: "Não existem monopolos magnéticos",
          integral_form: "∮B·dA = 0",
        },
        {
          name: "Lei de Faraday",
          equation: "∇×E = -∂B/∂t",
          interpretation: "Campo magnético variável gera campo elétrico",
          integral_form: "∮E·dl = -dΦB/dt",
        },
        {
          name: "Lei de Ampère-Maxwell",
          equation: "∇×B = μ₀J + μ₀ε₀∂E/∂t",
          interpretation: "Corrente e campo elétrico variável geram campo magnético",
          integral_form: "∮B·dl = μ₀I + μ₀ε₀dΦE/dt",
        },
      ],
    },
  },
]

// Funções auxiliares para busca e filtragem
export function getGamesByYear(year: 1 | 2 | 3): CurriculumGame[] {
  return curriculumGames.filter((game) => game.year === year)
}

export function getGamesBySubject(subject: string): CurriculumGame[] {
  return curriculumGames.filter((game) => game.subject === subject)
}

export function getGamesByDifficulty(difficulty: "easy" | "medium" | "hard"): CurriculumGame[] {
  return curriculumGames.filter((game) => game.difficulty === difficulty)
}

export function getGamesByType(type: string): CurriculumGame[] {
  return curriculumGames.filter((game) => game.type === type)
}

export function searchGames(query: string): CurriculumGame[] {
  const lowercaseQuery = query.toLowerCase()
  return curriculumGames.filter(
    (game) =>
      game.title.toLowerCase().includes(lowercaseQuery) ||
      game.description.toLowerCase().includes(lowercaseQuery) ||
      game.subject.toLowerCase().includes(lowercaseQuery) ||
      game.category.toLowerCase().includes(lowercaseQuery),
  )
}

export function getGameStats() {
  const totalGames = curriculumGames.length
  const gamesByYear = {
    1: getGamesByYear(1).length,
    2: getGamesByYear(2).length,
    3: getGamesByYear(3).length,
  }
  const gamesByDifficulty = {
    easy: getGamesByDifficulty("easy").length,
    medium: getGamesByDifficulty("medium").length,
    hard: getGamesByDifficulty("hard").length,
  }
  const gamesByType = {
    memory: getGamesByType("memory").length,
    quiz: getGamesByType("quiz").length,
    simulation: getGamesByType("simulation").length,
    matching: getGamesByType("matching").length,
    puzzle: getGamesByType("puzzle").length,
    strategy: getGamesByType("strategy").length,
  }

  return {
    totalGames,
    gamesByYear,
    gamesByDifficulty,
    gamesByType,
  }
}

// Função para obter jogos recomendados baseado no ano
export function getRecommendedGames(year: 1 | 2 | 3, limit = 6): CurriculumGame[] {
  const yearGames = getGamesByYear(year)
  // Embaralhar e retornar os primeiros 'limit' jogos
  return yearGames.sort(() => Math.random() - 0.5).slice(0, limit)
}

// Função para obter próximos jogos baseado na dificuldade
export function getNextLevelGames(currentDifficulty: "easy" | "medium" | "hard"): CurriculumGame[] {
  const difficultyOrder = { easy: "medium", medium: "hard", hard: "hard" }
  const nextDifficulty = difficultyOrder[currentDifficulty] as "easy" | "medium" | "hard"
  return getGamesByDifficulty(nextDifficulty).slice(0, 3)
}
