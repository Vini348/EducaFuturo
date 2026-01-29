import type { FlashcardSubject } from "@/types/flashcards"

export const curriculumFlashcards: FlashcardSubject[] = [
  // 1º ANO - CIRCUITOS
  {
    id: "circuitos-1ano",
    title: "Circuitos - 1º Ano",
    topics: [
      {
        id: "ordem-grandeza",
        title: "Ordem de Grandeza",
        cards: [
          {
            id: "og1",
            question: "O que é ordem de grandeza?",
            answer: "É uma estimativa aproximada do valor de uma grandeza física, expressa como potência de 10",
            difficulty: "easy",
            subject: "digital",
          },
          {
            id: "og2",
            question: "Como expressar 0,000001 em notação científica?",
            answer: "1 × 10⁻⁶ ou 10⁻⁶",
            difficulty: "easy",
            subject: "digital",
          },
          {
            id: "og3",
            question: "Qual a ordem de grandeza de 2.500.000?",
            answer: "10⁶ (aproximadamente 2,5 × 10⁶)",
            difficulty: "medium",
            subject: "digital",
          },
        ],
      },
      {
        id: "potenciacao",
        title: "Potenciação",
        cards: [
          {
            id: "pot1",
            question: "Qual o resultado de 2³?",
            answer: "8 (2 × 2 × 2 = 8)",
            difficulty: "easy",
            subject: "digital",
          },
          {
            id: "pot2",
            question: "Como calcular 10⁻³?",
            answer: "1/10³ = 1/1000 = 0,001",
            difficulty: "medium",
            subject: "digital",
          },
          {
            id: "pot3",
            question: "Qual a propriedade da multiplicação de potências de mesma base?",
            answer: "aᵐ × aⁿ = aᵐ⁺ⁿ (soma-se os expoentes)",
            difficulty: "medium",
            subject: "digital",
          },
        ],
      },
    ],
  },

  // 1º ANO - MATEMÁTICA
  {
    id: "matematica-1ano",
    title: "Matemática - 1º Ano",
    topics: [
      {
        id: "funcoes",
        title: "Funções",
        cards: [
          {
            id: "func1",
            question: "O que é uma função?",
            answer:
              "É uma relação entre dois conjuntos onde cada elemento do domínio se relaciona com um único elemento do contradomínio",
            difficulty: "medium",
            subject: "analog",
          },
          {
            id: "func2",
            question: "Como identificar se uma relação é função?",
            answer: "Cada valor de x deve corresponder a apenas um valor de y",
            difficulty: "medium",
            subject: "analog",
          },
        ],
      },
      {
        id: "fracoes",
        title: "Frações e Números Negativos",
        cards: [
          {
            id: "frac1",
            question: "Como somar frações com denominadores diferentes?",
            answer: "Encontra-se o MMC dos denominadores, iguala-se os denominadores e soma-se os numeradores",
            difficulty: "easy",
            subject: "analog",
          },
          {
            id: "frac2",
            question: "Qual o resultado de (-3) × (-4)?",
            answer: "+12 (produto de dois números negativos é positivo)",
            difficulty: "easy",
            subject: "analog",
          },
        ],
      },
    ],
  },

  // 2º ANO - FÍSICA ENERGIA
  {
    id: "fisica-energia-2ano",
    title: "Física - Energia - 2º Ano",
    topics: [
      {
        id: "movimento-harmonico",
        title: "Movimento Harmônico Simples",
        cards: [
          {
            id: "mhs1",
            question: "O que caracteriza um movimento harmônico simples?",
            answer: "É um movimento periódico onde a força restauradora é proporcional ao deslocamento",
            difficulty: "hard",
            subject: "power",
          },
          {
            id: "mhs2",
            question: "Qual a equação da posição no MHS?",
            answer: "x(t) = A·cos(ωt + φ), onde A é amplitude, ω é frequência angular e φ é fase inicial",
            difficulty: "hard",
            subject: "power",
          },
        ],
      },
      {
        id: "ondas",
        title: "Ondas e Som",
        cards: [
          {
            id: "onda1",
            question: "O que é uma onda?",
            answer:
              "É uma perturbação que se propaga no espaço e no tempo, transportando energia sem transportar matéria",
            difficulty: "medium",
            subject: "power",
          },
          {
            id: "onda2",
            question: "Qual a equação fundamental das ondas?",
            answer: "v = λ·f, onde v é velocidade, λ é comprimento de onda e f é frequência",
            difficulty: "medium",
            subject: "power",
          },
        ],
      },
    ],
  },

  // 3º ANO - CONTROLE
  {
    id: "controle-3ano",
    title: "Controle - 3º Ano",
    topics: [
      {
        id: "amplificadores-op",
        title: "Amplificadores Operacionais",
        cards: [
          {
            id: "opamp1",
            question: "Quais são as características ideais de um amplificador operacional?",
            answer:
              "Ganho infinito, impedância de entrada infinita, impedância de saída zero, largura de banda infinita",
            difficulty: "hard",
            subject: "analog",
          },
          {
            id: "opamp2",
            question: "O que é realimentação negativa em amplificadores operacionais?",
            answer: "É quando parte do sinal de saída é realimentado para a entrada inversora, estabilizando o ganho",
            difficulty: "hard",
            subject: "analog",
          },
        ],
      },
      {
        id: "clps",
        title: "CLPs - Controladores Lógicos Programáveis",
        cards: [
          {
            id: "clp1",
            question: "O que é um CLP?",
            answer: "É um computador industrial programável usado para automatizar processos industriais",
            difficulty: "medium",
            subject: "digital",
          },
          {
            id: "clp2",
            question: "Quais são as linguagens de programação mais comuns para CLPs?",
            answer: "Ladder (LAD), Blocos Funcionais (FBD), Lista de Instruções (IL) e Texto Estruturado (ST)",
            difficulty: "hard",
            subject: "digital",
          },
        ],
      },
    ],
  },
]
