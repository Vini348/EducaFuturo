import type { Quiz } from "@/types/quiz"

export const curriculumQuizzes: Quiz[] = [
  // 1º ANO
  {
    id: "circuitos-1ano-basico",
    title: "Circuitos Básicos - 1º Ano",
    subject: "digital",
    subjectName: "Circuitos",
    description: "Teste seus conhecimentos sobre circuitos elétricos básicos",
    difficulty: 1,
    icon: "Zap",
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
      },
      {
        id: "q3",
        text: "O que representa a ordem de grandeza de 0,001?",
        options: [
          { id: "a", text: "10³", isCorrect: false },
          { id: "b", text: "10⁻³", isCorrect: true },
          { id: "c", text: "10⁻¹", isCorrect: false },
          { id: "d", text: "10¹", isCorrect: false },
        ],
      },
    ],
  },

  // 2º ANO
  {
    id: "fisica-energia-2ano",
    title: "Física - Energia - 2º Ano",
    subject: "power",
    subjectName: "Física",
    description: "Avalie seus conhecimentos sobre energia e ondas",
    difficulty: 2,
    icon: "Atom",
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
      },
    ],
  },

  // 3º ANO
  {
    id: "controle-3ano-avancado",
    title: "Controle Avançado - 3º Ano",
    subject: "analog",
    subjectName: "Controle",
    description: "Teste avançado sobre amplificadores operacionais e CLPs",
    difficulty: 3,
    icon: "Settings",
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
      },
    ],
  },
]
