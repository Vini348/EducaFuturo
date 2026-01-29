export interface FlashcardTopic {
  id: string
  title: string
  cards: Flashcard[]
}

export interface FlashcardSubject {
  id: string
  title: string
  year: 1 | 2 | 3
  icon: string
  color: string
  topics: FlashcardTopic[]
}

export interface Flashcard {
  id: string
  subject: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  question: string
  answer: string
  explanation?: string
  tags: string[]
}

// Dados dos flashcards organizados por matéria e tópico
export const flashcardsData: FlashcardSubject[] = [
  // 1º ANO
  {
    id: "circuitos-1ano",
    title: "Circuitos Elétricos",
    year: 1,
    icon: "Zap",
    color: "from-blue-500 to-blue-600",
    topics: [
      {
        id: "ordem-grandeza",
        title: "Ordem de Grandeza",
        cards: [
          {
            id: "circuitos-001",
            subject: "circuitos-1ano",
            topic: "Ordem de Grandeza",
            difficulty: "easy",
            question: "Qual é a ordem de grandeza de 1 miliampère (1mA)?",
            answer: "10⁻³ A",
            explanation: "1 miliampère = 1×10⁻³ ampères. O prefixo 'mili' representa 10⁻³.",
            tags: ["ordem de grandeza", "corrente", "prefixos"],
          },
          {
            id: "circuitos-002",
            subject: "circuitos-1ano",
            topic: "Ordem de Grandeza",
            difficulty: "medium",
            question: "Quantos microfarads há em 0,001 F?",
            answer: "1000 µF",
            explanation: "0,001 F = 1×10⁻³ F = 1000×10⁻⁶ F = 1000 µF",
            tags: ["capacitância", "conversão", "microfarads"],
          },
          {
            id: "circuitos-003",
            subject: "circuitos-1ano",
            topic: "Ordem de Grandeza",
            difficulty: "hard",
            question: "Se uma resistência consome 2,5 mW, qual é a potência em notação científica?",
            answer: "2,5×10⁻³ W",
            explanation: "2,5 mW = 2,5 miliwatts = 2,5×10⁻³ watts",
            tags: ["potência", "notação científica", "miliwatts"],
          },
        ],
      },
      {
        id: "leis-kirchhoff",
        title: "Leis de Kirchhoff",
        cards: [
          {
            id: "circuitos-004",
            subject: "circuitos-1ano",
            topic: "Leis de Kirchhoff",
            difficulty: "easy",
            question: "O que estabelece a Lei das Correntes de Kirchhoff (LCK)?",
            answer: "A soma das correntes que entram em um nó é igual à soma das correntes que saem",
            explanation: "LCK: ΣIentrada = ΣIsaída. É baseada no princípio da conservação da carga elétrica.",
            tags: ["kirchhoff", "corrente", "nó"],
          },
          {
            id: "circuitos-005",
            subject: "circuitos-1ano",
            topic: "Leis de Kirchhoff",
            difficulty: "medium",
            question: "Em uma malha, se temos tensões de +12V, -5V e -3V, qual deve ser a quarta tensão?",
            answer: "-4V",
            explanation: "Pela LTK: ΣV = 0, então 12 - 5 - 3 + V₄ = 0, logo V₄ = -4V",
            tags: ["kirchhoff", "tensão", "malha"],
          },
          {
            id: "circuitos-006",
            subject: "circuitos-1ano",
            topic: "Leis de Kirchhoff",
            difficulty: "hard",
            question: "Quantas equações independentes podemos escrever para um circuito com 5 nós?",
            answer: "4 equações",
            explanation: "Para n nós, temos (n-1) equações independentes pela LCK. Com 5 nós: 5-1 = 4 equações.",
            tags: ["análise nodal", "equações", "independência"],
          },
        ],
      },
    ],
  },
  {
    id: "digital-1ano",
    title: "Eletrônica Digital",
    year: 1,
    icon: "Cpu",
    color: "from-indigo-500 to-indigo-600",
    topics: [
      {
        id: "sistemas-numeracao",
        title: "Sistemas de Numeração",
        cards: [
          {
            id: "digital-001",
            subject: "digital-1ano",
            topic: "Sistemas de Numeração",
            difficulty: "easy",
            question: "Converta o número decimal 25 para binário",
            answer: "11001",
            explanation:
              "25 ÷ 2 = 12 resto 1, 12 ÷ 2 = 6 resto 0, 6 ÷ 2 = 3 resto 0, 3 ÷ 2 = 1 resto 1, 1 ÷ 2 = 0 resto 1. Lendo os restos de baixo para cima: 11001",
            tags: ["conversão", "decimal", "binário"],
          },
          {
            id: "digital-002",
            subject: "digital-1ano",
            topic: "Sistemas de Numeração",
            difficulty: "medium",
            question: "Converta o número hexadecimal A3 para decimal",
            answer: "163",
            explanation: "A3₁₆ = A×16¹ + 3×16⁰ = 10×16 + 3×1 = 160 + 3 = 163",
            tags: ["conversão", "hexadecimal", "decimal"],
          },
          {
            id: "digital-003",
            subject: "digital-1ano",
            topic: "Sistemas de Numeração",
            difficulty: "hard",
            question: "Realize a operação binária: 1101 + 1011",
            answer: "11000",
            explanation: "Soma binária: 1101 + 1011 = 11000. Lembre-se que 1+1=10 em binário (vai 1)",
            tags: ["soma", "binário", "aritmética"],
          },
        ],
      },
      {
        id: "portas-logicas",
        title: "Portas Lógicas",
        cards: [
          {
            id: "digital-004",
            subject: "digital-1ano",
            topic: "Portas Lógicas",
            difficulty: "easy",
            question: "Qual é a saída de uma porta AND com entradas A=1 e B=0?",
            answer: "0",
            explanation: "A porta AND só produz saída 1 quando TODAS as entradas são 1. Como B=0, a saída é 0.",
            tags: ["porta AND", "lógica digital"],
          },
          {
            id: "digital-005",
            subject: "digital-1ano",
            topic: "Portas Lógicas",
            difficulty: "medium",
            question: "Qual porta lógica implementa a função Y = A ⊕ B?",
            answer: "XOR",
            explanation: "A porta XOR (OU Exclusivo) produz saída 1 quando as entradas são diferentes.",
            tags: ["porta XOR", "ou exclusivo"],
          },
          {
            id: "digital-006",
            subject: "digital-1ano",
            topic: "Portas Lógicas",
            difficulty: "hard",
            question: "Simplifique a expressão: A.B + A.B' + A'.B",
            answer: "A + B",
            explanation: "A.B + A.B' + A'.B = A(B + B') + A'.B = A.1 + A'.B = A + A'.B = A + B",
            tags: ["simplificação", "álgebra booleana"],
          },
        ],
      },
    ],
  },
  {
    id: "matematica-1ano",
    title: "Matemática",
    year: 1,
    icon: "Calculator",
    color: "from-green-500 to-green-600",
    topics: [
      {
        id: "funcoes",
        title: "Funções",
        cards: [
          {
            id: "math1-001",
            subject: "matematica-1ano",
            topic: "Funções",
            difficulty: "easy",
            question: "Se f(x) = 2x + 3, qual é f(5)?",
            answer: "13",
            explanation: "f(5) = 2(5) + 3 = 10 + 3 = 13",
            tags: ["função linear", "substituição"],
          },
          {
            id: "math1-002",
            subject: "matematica-1ano",
            topic: "Funções",
            difficulty: "medium",
            question: "Qual é o domínio da função f(x) = 1/(x-2)?",
            answer: "ℝ - {2}",
            explanation: "A função não está definida quando x-2 = 0, ou seja, quando x = 2.",
            tags: ["domínio", "função racional"],
          },
          {
            id: "math1-003",
            subject: "matematica-1ano",
            topic: "Funções",
            difficulty: "hard",
            question: "Se f(x) = x² - 4x + 3, quais são os zeros da função?",
            answer: "x = 1 e x = 3",
            explanation:
              "x² - 4x + 3 = 0. Usando a fórmula de Bhaskara: x = (4 ± √(16-12))/2 = (4 ± 2)/2, logo x = 1 ou x = 3",
            tags: ["zeros", "função quadrática", "bhaskara"],
          },
        ],
      },
    ],
  },
  {
    id: "fisica-1ano",
    title: "Física - Força da Natureza",
    year: 1,
    icon: "Atom",
    color: "from-purple-500 to-purple-600",
    topics: [
      {
        id: "grandezas-vetoriais",
        title: "Grandezas Vetoriais",
        cards: [
          {
            id: "fisica1-001",
            subject: "fisica-1ano",
            topic: "Grandezas Vetoriais",
            difficulty: "easy",
            question: "Qual é a diferença entre grandeza escalar e vetorial?",
            answer: "Escalar tem apenas módulo, vetorial tem módulo, direção e sentido",
            explanation:
              "Grandezas escalares (massa, tempo) são definidas apenas pelo valor. Vetoriais (força, velocidade) precisam de direção e sentido.",
            tags: ["vetor", "escalar", "grandezas"],
          },
          {
            id: "fisica1-002",
            subject: "fisica-1ano",
            topic: "Grandezas Vetoriais",
            difficulty: "medium",
            question: "Se dois vetores de 3N e 4N são perpendiculares, qual é o módulo da resultante?",
            answer: "5N",
            explanation: "Para vetores perpendiculares: |R| = √(3² + 4²) = √(9 + 16) = √25 = 5N",
            tags: ["resultante", "pitágoras", "perpendicular"],
          },
          {
            id: "fisica1-003",
            subject: "fisica-1ano",
            topic: "Grandezas Vetoriais",
            difficulty: "hard",
            question: "Qual é o produto escalar de dois vetores de módulo 5 que formam 60°?",
            answer: "12,5",
            explanation: "A⃗ · B⃗ = |A||B|cos(θ) = 5 × 5 × cos(60°) = 25 × 0,5 = 12,5",
            tags: ["produto escalar", "ângulo", "cosseno"],
          },
        ],
      },
    ],
  },
  {
    id: "computacao-1ano",
    title: "Introdução à Computação",
    year: 1,
    icon: "Monitor",
    color: "from-cyan-500 to-cyan-600",
    topics: [
      {
        id: "excel-planilhas",
        title: "Excel e Planilhas",
        cards: [
          {
            id: "comp1-001",
            subject: "computacao-1ano",
            topic: "Excel e Planilhas",
            difficulty: "easy",
            question: "Qual função do Excel calcula a soma de um intervalo de células?",
            answer: "SOMA() ou SUM()",
            explanation: "A função SOMA(A1:A10) calcula a soma de todas as células do intervalo A1 até A10.",
            tags: ["excel", "função", "soma"],
          },
          {
            id: "comp1-002",
            subject: "computacao-1ano",
            topic: "Excel e Planilhas",
            difficulty: "medium",
            question: "Como criar uma referência absoluta no Excel?",
            answer: "Usando $ antes da coluna e linha (ex: $A$1)",
            explanation:
              "A referência absoluta $A$1 não muda quando copiada para outras células, diferente de A1 que é relativa.",
            tags: ["referência", "absoluta", "cifrão"],
          },
          {
            id: "comp1-003",
            subject: "computacao-1ano",
            topic: "Excel e Planilhas",
            difficulty: "hard",
            question: "Qual função retorna um valor baseado em uma condição?",
            answer: "SE() ou IF()",
            explanation: "A função SE(condição; valor_se_verdadeiro; valor_se_falso) executa testes lógicos.",
            tags: ["função SE", "condicional", "lógica"],
          },
        ],
      },
    ],
  },

  // 2º ANO
  {
    id: "matematica-2ano",
    title: "Matemática",
    year: 2,
    icon: "Calculator",
    color: "from-green-600 to-green-700",
    topics: [
      {
        id: "analise-combinatoria",
        title: "Análise Combinatória",
        cards: [
          {
            id: "math2-001",
            subject: "matematica-2ano",
            topic: "Análise Combinatória",
            difficulty: "easy",
            question: "Quantas maneiras há de arranjar 3 pessoas em uma fila?",
            answer: "6",
            explanation: "P₃ = 3! = 3 × 2 × 1 = 6 maneiras",
            tags: ["permutação", "fatorial", "arranjo"],
          },
          {
            id: "math2-002",
            subject: "matematica-2ano",
            topic: "Análise Combinatória",
            difficulty: "medium",
            question: "De quantas formas podemos escolher 2 pessoas de um grupo de 5?",
            answer: "10",
            explanation: "C₅,₂ = 5!/(2!(5-2)!) = 5!/(2!3!) = (5×4)/(2×1) = 10",
            tags: ["combinação", "escolha", "binomial"],
          },
          {
            id: "math2-003",
            subject: "matematica-2ano",
            topic: "Análise Combinatória",
            difficulty: "hard",
            question: "Quantos números de 4 dígitos podem ser formados com os algarismos 1,2,3,4,5 sem repetição?",
            answer: "120",
            explanation: "A₅,₄ = 5!/(5-4)! = 5!/1! = 5 × 4 × 3 × 2 = 120",
            tags: ["arranjo", "sem repetição", "dígitos"],
          },
        ],
      },
      {
        id: "probabilidade",
        title: "Probabilidade",
        cards: [
          {
            id: "math2-004",
            subject: "matematica-2ano",
            topic: "Probabilidade",
            difficulty: "easy",
            question: "Qual é a probabilidade de sair cara ao lançar uma moeda?",
            answer: "1/2 ou 50%",
            explanation: "P(cara) = casos favoráveis/casos possíveis = 1/2 = 0,5 = 50%",
            tags: ["probabilidade", "moeda", "equiprovável"],
          },
          {
            id: "math2-005",
            subject: "matematica-2ano",
            topic: "Probabilidade",
            difficulty: "medium",
            question: "Qual é a probabilidade de tirar um ás de um baralho de 52 cartas?",
            answer: "4/52 = 1/13",
            explanation: "Há 4 ases em 52 cartas, então P(ás) = 4/52 = 1/13 ≈ 7,69%",
            tags: ["baralho", "ás", "fração"],
          },
          {
            id: "math2-006",
            subject: "matematica-2ano",
            topic: "Probabilidade",
            difficulty: "hard",
            question: "Se P(A) = 0,3 e P(B) = 0,4 e A e B são independentes, qual é P(A ∩ B)?",
            answer: "0,12",
            explanation: "Para eventos independentes: P(A ∩ B) = P(A) × P(B) = 0,3 × 0,4 = 0,12",
            tags: ["independência", "interseção", "produto"],
          },
        ],
      },
    ],
  },
  {
    id: "analogica-2ano",
    title: "Eletrônica Analógica",
    year: 2,
    icon: "Brain",
    color: "from-pink-500 to-pink-600",
    topics: [
      {
        id: "componentes-passivos",
        title: "Componentes Passivos",
        cards: [
          {
            id: "analog-001",
            subject: "analogica-2ano",
            topic: "Componentes Passivos",
            difficulty: "easy",
            question: "Qual é a unidade de medida da resistência elétrica?",
            answer: "Ohm (Ω)",
            explanation: "A resistência elétrica é medida em Ohms, representada pelo símbolo Ω (omega grego).",
            tags: ["resistência", "unidades"],
          },
          {
            id: "analog-002",
            subject: "analogica-2ano",
            topic: "Componentes Passivos",
            difficulty: "medium",
            question: "Qual é a reatância de um capacitor de 10µF em 60Hz?",
            answer: "265,3Ω",
            explanation: "Xc = 1/(2πfC) = 1/(2π×60×10×10⁻⁶) = 265,3Ω",
            tags: ["capacitor", "reatância", "frequência"],
          },
          {
            id: "analog-003",
            subject: "analogica-2ano",
            topic: "Componentes Passivos",
            difficulty: "hard",
            question: "Em um circuito RLC série, quando ocorre ressonância?",
            answer: "Quando XL = XC",
            explanation:
              "Na ressonância, a reatância indutiva iguala a capacitiva (XL = XC), resultando em impedância mínima.",
            tags: ["ressonância", "RLC", "impedância"],
          },
        ],
      },
      {
        id: "semicondutores",
        title: "Semicondutores",
        cards: [
          {
            id: "analog-004",
            subject: "analogica-2ano",
            topic: "Semicondutores",
            difficulty: "easy",
            question: "Qual é a tensão de limiar típica de um diodo de silício?",
            answer: "0,7V",
            explanation:
              "Diodos de silício começam a conduzir significativamente a partir de aproximadamente 0,7V de polarização direta.",
            tags: ["diodo", "silício", "polarização"],
          },
          {
            id: "analog-005",
            subject: "analogica-2ano",
            topic: "Semicondutores",
            difficulty: "medium",
            question: "Em um transistor BJT NPN, qual terminal deve ter a maior tensão?",
            answer: "Coletor",
            explanation:
              "Para operação normal (região ativa), o coletor deve ter tensão mais alta que o emissor (Vce > 0).",
            tags: ["transistor", "BJT", "polarização"],
          },
          {
            id: "analog-006",
            subject: "analogica-2ano",
            topic: "Semicondutores",
            difficulty: "hard",
            question: "Qual é o ganho de corrente típico (β) de um transistor BJT?",
            answer: "50 a 300",
            explanation:
              "O ganho de corrente β (beta) varia tipicamente entre 50 e 300, dependendo do tipo de transistor.",
            tags: ["ganho", "beta", "corrente"],
          },
        ],
      },
    ],
  },
  {
    id: "programacao-2ano",
    title: "Programação",
    year: 2,
    icon: "Code",
    color: "from-red-500 to-red-600",
    topics: [
      {
        id: "logica-programacao",
        title: "Lógica de Programação",
        cards: [
          {
            id: "prog-001",
            subject: "programacao-2ano",
            topic: "Lógica de Programação",
            difficulty: "easy",
            question: "O que é um algoritmo?",
            answer: "Uma sequência finita de instruções para resolver um problema",
            explanation:
              "Um algoritmo é um conjunto ordenado de passos que, quando executados, resolvem um problema específico.",
            tags: ["algoritmo", "definição", "problema"],
          },
          {
            id: "prog-002",
            subject: "programacao-2ano",
            topic: "Lógica de Programação",
            difficulty: "medium",
            question: "Qual estrutura de repetição executa pelo menos uma vez?",
            answer: "do-while",
            explanation: "A estrutura do-while executa o bloco de código primeiro e depois verifica a condição.",
            tags: ["loop", "do-while", "repetição"],
          },
          {
            id: "prog-003",
            subject: "programacao-2ano",
            topic: "Lógica de Programação",
            difficulty: "hard",
            question: "Qual é a complexidade temporal do algoritmo de busca binária?",
            answer: "O(log n)",
            explanation:
              "A busca binária divide o espaço de busca pela metade a cada iteração, resultando em complexidade logarítmica.",
            tags: ["complexidade", "busca binária", "big-o"],
          },
        ],
      },
    ],
  },
  {
    id: "siscom-2ano",
    title: "Sistemas de Comunicação",
    year: 2,
    icon: "Wifi",
    color: "from-cyan-500 to-cyan-600",
    topics: [
      {
        id: "enderecamento-ip",
        title: "Endereçamento IP",
        cards: [
          {
            id: "siscom-001",
            subject: "siscom-2ano",
            topic: "Endereçamento IP",
            difficulty: "easy",
            question: "Quantos bits tem um endereço IPv4?",
            answer: "32 bits",
            explanation: "Um endereço IPv4 tem 32 bits, divididos em 4 octetos de 8 bits cada.",
            tags: ["IPv4", "bits", "octetos"],
          },
          {
            id: "siscom-002",
            subject: "siscom-2ano",
            topic: "Endereçamento IP",
            difficulty: "medium",
            question: "Qual é a máscara de sub-rede padrão para uma rede classe C?",
            answer: "255.255.255.0 ou /24",
            explanation: "Classe C usa os primeiros 24 bits para rede, restando 8 bits para hosts.",
            tags: ["classe C", "máscara", "sub-rede"],
          },
          {
            id: "siscom-003",
            subject: "siscom-2ano",
            topic: "Endereçamento IP",
            difficulty: "hard",
            question: "Quantos hosts são possíveis em uma sub-rede /26?",
            answer: "62 hosts",
            explanation: "/26 deixa 6 bits para hosts: 2⁶ - 2 = 64 - 2 = 62 (subtraindo rede e broadcast)",
            tags: ["CIDR", "hosts", "sub-rede"],
          },
        ],
      },
    ],
  },

  // 3º ANO
  {
    id: "matematica-3ano",
    title: "Matemática",
    year: 3,
    icon: "Calculator",
    color: "from-green-700 to-green-800",
    topics: [
      {
        id: "numeros-complexos",
        title: "Números Complexos",
        cards: [
          {
            id: "math3-001",
            subject: "matematica-3ano",
            topic: "Números Complexos",
            difficulty: "easy",
            question: "Qual é a unidade imaginária?",
            answer: "i, onde i² = -1",
            explanation: "A unidade imaginária i é definida como a raiz quadrada de -1.",
            tags: ["imaginário", "unidade", "definição"],
          },
          {
            id: "math3-002",
            subject: "matematica-3ano",
            topic: "Números Complexos",
            difficulty: "medium",
            question: "Qual é o módulo do número complexo 3 + 4i?",
            answer: "5",
            explanation: "|z| = √(3² + 4²) = √(9 + 16) = √25 = 5",
            tags: ["módulo", "complexo", "pitágoras"],
          },
          {
            id: "math3-003",
            subject: "matematica-3ano",
            topic: "Números Complexos",
            difficulty: "hard",
            question: "Converta 1 + i para forma polar",
            answer: "√2 ∠ 45°",
            explanation: "r = √(1² + 1²) = √2, θ = arctan(1/1) = 45°",
            tags: ["forma polar", "conversão", "ângulo"],
          },
        ],
      },
    ],
  },
  {
    id: "potencia-3ano",
    title: "Eletrônica de Potência",
    year: 3,
    icon: "Zap",
    color: "from-orange-500 to-orange-600",
    topics: [
      {
        id: "conversores-dc-dc",
        title: "Conversores DC-DC",
        cards: [
          {
            id: "power-001",
            subject: "potencia-3ano",
            topic: "Conversores DC-DC",
            difficulty: "easy",
            question: "Em um conversor Buck, se Vin = 12V e D = 0,5, qual é Vout?",
            answer: "6V",
            explanation: "Em um conversor Buck: Vout = D × Vin = 0,5 × 12V = 6V, onde D é o duty cycle.",
            tags: ["buck", "conversor", "duty cycle"],
          },
          {
            id: "power-002",
            subject: "potencia-3ano",
            topic: "Conversores DC-DC",
            difficulty: "medium",
            question: "Qual é a principal vantagem do conversor Boost?",
            answer: "Eleva a tensão de saída",
            explanation: "O conversor Boost (elevador) produz tensão de saída maior que a de entrada.",
            tags: ["boost", "elevador", "tensão"],
          },
          {
            id: "power-003",
            subject: "potencia-3ano",
            topic: "Conversores DC-DC",
            difficulty: "hard",
            question: "Em que modo opera um conversor quando a corrente no indutor nunca chega a zero?",
            answer: "Modo de condução contínua (CCM)",
            explanation: "No CCM, a corrente no indutor nunca se anula durante o período de chaveamento.",
            tags: ["CCM", "condução contínua", "indutor"],
          },
        ],
      },
      {
        id: "pwm",
        title: "Modulação PWM",
        cards: [
          {
            id: "power-004",
            subject: "potencia-3ano",
            topic: "Modulação PWM",
            difficulty: "easy",
            question: "Se um sinal PWM tem período T = 1ms e ton = 0,3ms, qual é o duty cycle?",
            answer: "30%",
            explanation: "Duty cycle = (ton/T) × 100% = (0,3ms/1ms) × 100% = 30%",
            tags: ["PWM", "duty cycle", "período"],
          },
          {
            id: "power-005",
            subject: "potencia-3ano",
            topic: "Modulação PWM",
            difficulty: "medium",
            question: "Qual é a frequência de um sinal PWM com período de 20µs?",
            answer: "50kHz",
            explanation: "f = 1/T = 1/(20×10⁻⁶) = 50.000 Hz = 50kHz",
            tags: ["frequência", "período", "PWM"],
          },
          {
            id: "power-006",
            subject: "potencia-3ano",
            topic: "Modulação PWM",
            difficulty: "hard",
            question: "Qual técnica PWM reduz harmônicos de baixa ordem?",
            answer: "SPWM (Sinusoidal PWM)",
            explanation:
              "O SPWM usa uma portadora triangular comparada com uma referência senoidal, reduzindo harmônicos de baixa ordem.",
            tags: ["SPWM", "harmônicos", "senoidal"],
          },
        ],
      },
    ],
  },
  {
    id: "controle-3ano",
    title: "Controle",
    year: 3,
    icon: "Settings",
    color: "from-slate-500 to-slate-600",
    topics: [
      {
        id: "amplificadores-operacionais",
        title: "Amplificadores Operacionais",
        cards: [
          {
            id: "controle-001",
            subject: "controle-3ano",
            topic: "Amplificadores Operacionais",
            difficulty: "easy",
            question: "Qual é o ganho de um amplificador operacional ideal?",
            answer: "Infinito",
            explanation:
              "Um amp-op ideal tem ganho infinito, impedância de entrada infinita e impedância de saída zero.",
            tags: ["amp-op", "ganho", "ideal"],
          },
          {
            id: "controle-002",
            subject: "controle-3ano",
            topic: "Amplificadores Operacionais",
            difficulty: "medium",
            question: "Em um amplificador inversor com R1=1kΩ e Rf=10kΩ, qual é o ganho?",
            answer: "-10",
            explanation: "Ganho = -Rf/R1 = -10kΩ/1kΩ = -10. O sinal negativo indica inversão.",
            tags: ["inversor", "ganho", "resistores"],
          },
          {
            id: "controle-003",
            subject: "controle-3ano",
            topic: "Amplificadores Operacionais",
            difficulty: "hard",
            question: "Qual é a principal característica do seguidor de tensão?",
            answer: "Ganho unitário e alta impedância de entrada",
            explanation:
              "O seguidor de tensão (buffer) tem ganho 1, isolando circuitos com alta impedância de entrada.",
            tags: ["seguidor", "buffer", "impedância"],
          },
        ],
      },
      {
        id: "clps",
        title: "CLPs",
        cards: [
          {
            id: "controle-004",
            subject: "controle-3ano",
            topic: "CLPs",
            difficulty: "easy",
            question: "O que significa CLP?",
            answer: "Controlador Lógico Programável",
            explanation: "CLP é um computador industrial usado para automatizar processos de manufatura.",
            tags: ["CLP", "definição", "automação"],
          },
          {
            id: "controle-005",
            subject: "controle-3ano",
            topic: "CLPs",
            difficulty: "medium",
            question: "Qual linguagem de programação usa símbolos de contatos e bobinas?",
            answer: "Ladder",
            explanation: "A linguagem Ladder usa símbolos que lembram diagramas de relés elétricos.",
            tags: ["ladder", "contatos", "bobinas"],
          },
          {
            id: "controle-006",
            subject: "controle-3ano",
            topic: "CLPs",
            difficulty: "hard",
            question: "Qual é a diferença entre entrada digital e analógica em um CLP?",
            answer: "Digital: ON/OFF, Analógica: valores contínuos (0-10V, 4-20mA)",
            explanation:
              "Entradas digitais detectam estados discretos, analógicas medem valores contínuos como temperatura.",
            tags: ["digital", "analógica", "sinais"],
          },
        ],
      },
    ],
  },
  {
    id: "manutencao-3ano",
    title: "Manutenção",
    year: 3,
    icon: "Wrench",
    color: "from-gray-500 to-gray-600",
    topics: [
      {
        id: "diagnostico-falhas",
        title: "Diagnóstico de Falhas",
        cards: [
          {
            id: "manut-001",
            subject: "manutencao-3ano",
            topic: "Diagnóstico de Falhas",
            difficulty: "easy",
            question: "Qual instrumento mede tensão, corrente e resistência?",
            answer: "Multímetro",
            explanation: "O multímetro é o instrumento básico para medições elétricas em manutenção.",
            tags: ["multímetro", "medição", "básico"],
          },
          {
            id: "manut-002",
            subject: "manutencao-3ano",
            topic: "Diagnóstico de Falhas",
            difficulty: "medium",
            question: "Qual instrumento visualiza formas de onda?",
            answer: "Osciloscópio",
            explanation: "O osciloscópio permite visualizar sinais elétricos no domínio do tempo.",
            tags: ["osciloscópio", "forma de onda", "tempo"],
          },
          {
            id: "manut-003",
            subject: "manutencao-3ano",
            topic: "Diagnóstico de Falhas",
            difficulty: "hard",
            question: "Qual é a diferença entre manutenção preditiva e preventiva?",
            answer: "Preditiva: baseada em condição, Preventiva: baseada em tempo",
            explanation:
              "Manutenção preditiva monitora condições para prever falhas, preventiva segue cronograma fixo.",
            tags: ["preditiva", "preventiva", "estratégia"],
          },
        ],
      },
    ],
  },
]

// Funções auxiliares
export function getAllFlashcards(): Flashcard[] {
  return flashcardsData.flatMap((subject) => subject.topics.flatMap((topic) => topic.cards))
}

export function getFlashcardsBySubject(subjectId: string): Flashcard[] {
  const subject = flashcardsData.find((s) => s.id === subjectId)
  return subject ? subject.topics.flatMap((topic) => topic.cards) : []
}

export function getFlashcardsByYear(year: 1 | 2 | 3): Flashcard[] {
  return flashcardsData
    .filter((subject) => subject.year === year)
    .flatMap((subject) => subject.topics.flatMap((topic) => topic.cards))
}

export function getFlashcardsByDifficulty(difficulty: "easy" | "medium" | "hard"): Flashcard[] {
  return getAllFlashcards().filter((card) => card.difficulty === difficulty)
}

export function getFlashcardsByTopic(topicId: string): Flashcard[] {
  return getAllFlashcards().filter((card) => card.topic === topicId)
}

export function searchFlashcards(searchTerm: string): Flashcard[] {
  const term = searchTerm.toLowerCase()
  return getAllFlashcards().filter(
    (card) =>
      card.question.toLowerCase().includes(term) ||
      card.answer.toLowerCase().includes(term) ||
      card.topic.toLowerCase().includes(term) ||
      card.tags.some((tag) => tag.toLowerCase().includes(term)),
  )
}

export function shuffleFlashcards(cards: Flashcard[]): Flashcard[] {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getSubjectsByYear(year: 1 | 2 | 3): FlashcardSubject[] {
  return flashcardsData.filter((subject) => subject.year === year)
}
