export interface CurriculumTopic {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  prerequisites?: string[]
  content?: string
}

export interface CurriculumSubject {
  id: string
  name: string
  year: 1 | 2 | 3
  topics: CurriculumTopic[]
  icon: string
  color: string
  description: string
  objectives: string[]
  prerequisites?: string[]
}

export const curriculumData: CurriculumSubject[] = [
  // 1º ANO
  {
    id: "circuitos-1ano",
    name: "Circuitos",
    year: 1,
    icon: "Zap",
    color: "bg-blue-500",
    description: "Fundamentos de circuitos elétricos e análise matemática aplicada",
    objectives: [
      "Compreender conceitos de ordem de grandeza",
      "Dominar operações com potenciação",
      "Resolver equações aplicadas a circuitos",
      "Analisar circuitos de malhas",
    ],
    prerequisites: [], // 1º ano não tem pré-requisitos
    topics: [
      {
        id: "ordem-grandeza",
        title: "Ordem de Grandeza",
        description: "Conceitos fundamentais sobre ordem de grandeza e notação científica",
        difficulty: "easy",
        content:
          "A ordem de grandeza é uma estimativa aproximada do valor de uma grandeza física, expressa como uma potência de 10. É fundamental para análise rápida de circuitos e dimensionamento de componentes.",
      },
      {
        id: "potenciacao",
        title: "Potenciação",
        description: "Operações com potências e suas propriedades",
        difficulty: "easy",
        content:
          "Estudo das propriedades das potências: produto de potências de mesma base, quociente de potências de mesma base, potência de potência, e aplicações em cálculos de circuitos elétricos.",
      },
      {
        id: "operacoes-potenciacao",
        title: "Operações Associadas à Potenciação",
        description: "Multiplicação, divisão e radiciação com potências",
        difficulty: "medium",
        content:
          "Aplicação das operações de potenciação em cálculos de impedância, reatância e análise de circuitos AC/DC.",
      },
      {
        id: "equacoes-1-2-grau",
        title: "Equações de 1º e 2º Grau",
        description: "Resolução de equações lineares e quadráticas",
        difficulty: "medium",
        content:
          "Métodos de resolução de equações lineares e quadráticas aplicadas à análise de circuitos, cálculo de correntes e tensões.",
      },
      {
        id: "circuitos-malhas",
        title: "Circuitos de Malhas",
        description: "Aplicação de equações na resolução de problemas de circuitos",
        difficulty: "hard",
        prerequisites: ["equacoes-1-2-grau"],
        content:
          "Análise de circuitos complexos usando o método das malhas, aplicação das Leis de Kirchhoff e resolução de sistemas de equações.",
      },
    ],
  },
  {
    id: "digital-1ano",
    name: "Eletrônica Digital",
    year: 1,
    icon: "Cpu",
    color: "bg-indigo-500",
    description: "Fundamentos da eletrônica digital e sistemas lógicos",
    objectives: [
      "Compreender sistemas de numeração",
      "Dominar portas lógicas básicas",
      "Analisar circuitos combinacionais",
      "Projetar circuitos digitais simples",
    ],
    topics: [
      {
        id: "sistemas-numeracao",
        title: "Sistemas de Numeração",
        description: "Binário, octal, decimal e hexadecimal",
        difficulty: "easy",
        content:
          "Estudo dos sistemas de numeração utilizados em eletrônica digital: binário (base 2), octal (base 8), decimal (base 10) e hexadecimal (base 16). Conversões entre bases e aplicações práticas.",
      },
      {
        id: "portas-logicas",
        title: "Portas Lógicas Básicas",
        description: "AND, OR, NOT, NAND, NOR, XOR",
        difficulty: "medium",
        content:
          "Funcionamento das portas lógicas fundamentais, tabelas verdade, símbolos lógicos e implementação física usando transistores.",
      },
      {
        id: "algebra-booleana",
        title: "Álgebra Booleana",
        description: "Teoremas e simplificação de expressões",
        difficulty: "medium",
        content:
          "Teoremas de De Morgan, propriedades da álgebra booleana, simplificação de expressões lógicas e mapas de Karnaugh.",
      },
      {
        id: "circuitos-combinacionais",
        title: "Circuitos Combinacionais",
        description: "Decodificadores, multiplexadores, somadores",
        difficulty: "hard",
        prerequisites: ["portas-logicas", "algebra-booleana"],
        content:
          "Projeto e análise de circuitos combinacionais: decodificadores, codificadores, multiplexadores, demultiplexadores e circuitos aritméticos.",
      },
    ],
  },
  {
    id: "matematica-1ano",
    name: "Matemática",
    year: 1,
    icon: "Calculator",
    color: "bg-green-500",
    description: "Fundamentos matemáticos para eletrônica",
    objectives: [
      "Dominar conceitos de funções",
      "Trabalhar com frações e números negativos",
      "Aplicar matemática em problemas técnicos",
    ],
    topics: [
      {
        id: "funcoes",
        title: "Funções",
        description: "Conceitos fundamentais de funções matemáticas",
        difficulty: "medium",
        content:
          "Definição de função, domínio, contradomínio, imagem. Tipos de funções: linear, quadrática, exponencial e logarítmica. Aplicações em análise de circuitos.",
      },
      {
        id: "fracoes-negativos",
        title: "Frações e Números Negativos",
        description: "Operações com frações e números negativos",
        difficulty: "easy",
        content:
          "Operações fundamentais com frações: adição, subtração, multiplicação e divisão. Trabalho com números negativos e suas aplicações em cálculos de corrente e tensão.",
      },
    ],
  },
  {
    id: "fisica-1ano",
    name: "Física - Força da Natureza",
    year: 1,
    icon: "Atom",
    color: "bg-purple-500",
    description: "Fundamentos físicos aplicados à eletrônica",
    objectives: [
      "Compreender grandezas vetoriais",
      "Analisar diferentes tipos de movimento",
      "Distinguir energia de momento linear",
    ],
    topics: [
      {
        id: "grandezas-vetoriais",
        title: "Grandezas Físicas Vetoriais",
        description: "Operações vetoriais na composição de movimentos",
        difficulty: "medium",
        content:
          "Conceitos de vetor, operações vetoriais (soma, subtração, produto escalar e vetorial), decomposição de vetores e aplicações em análise de forças e campos elétricos.",
      },
      {
        id: "movimento-obliquo",
        title: "Movimento Oblíquo",
        description: "Análise de movimentos em trajetórias oblíquas",
        difficulty: "medium",
        prerequisites: ["grandezas-vetoriais"],
        content:
          "Cinemática do movimento oblíquo, decomposição de velocidades, alcance máximo, altura máxima e tempo de voo.",
      },
      {
        id: "movimento-circular",
        title: "Movimento Circular",
        description: "Cinemática e dinâmica do movimento circular",
        difficulty: "medium",
        prerequisites: ["grandezas-vetoriais"],
        content:
          "Movimento circular uniforme e uniformemente variado, velocidade angular, aceleração centrípeta e aplicações em motores elétricos.",
      },
      {
        id: "energia-mecanica",
        title: "Energia Mecânica",
        description: "Conceitos de energia cinética e potencial",
        difficulty: "medium",
        content:
          "Definições de energia cinética e potencial, conservação da energia mecânica, trabalho e potência. Analogias com energia elétrica.",
      },
      {
        id: "momento-linear",
        title: "Momento Linear",
        description: "Diferenciação entre energia e momento linear",
        difficulty: "hard",
        prerequisites: ["energia-mecanica"],
        content:
          "Conceito de momento linear, impulso, conservação do momento linear e diferenciação clara entre energia e momento.",
      },
    ],
  },
  {
    id: "computacao-1ano",
    name: "Introdução à Computação",
    year: 1,
    icon: "Monitor",
    color: "bg-cyan-500",
    description: "Ferramentas computacionais para engenharia",
    objectives: ["Dominar planilhas eletrônicas", "Utilizar ferramentas do Office", "Aplicar normas ABNT"],
    topics: [
      {
        id: "excel-planilhas",
        title: "Excel e Planilhas Eletrônicas",
        description: "Uso de fórmulas e funções em planilhas",
        difficulty: "easy",
        content:
          "Criação de planilhas, uso de fórmulas básicas e avançadas, funções matemáticas, gráficos e aplicações em cálculos de engenharia.",
      },
      {
        id: "office-365",
        title: "Pacote Office 365",
        description: "Ferramentas do pacote Office para produtividade",
        difficulty: "easy",
        content:
          "Word para documentação técnica, PowerPoint para apresentações, Teams para colaboração e integração entre aplicativos.",
      },
      {
        id: "formatacao-abnt",
        title: "Formatação ABNT",
        description: "Normas ABNT para trabalhos acadêmicos",
        difficulty: "medium",
        content:
          "Estrutura de trabalhos acadêmicos, formatação de texto, citações, referências bibliográficas e normas técnicas.",
      },
    ],
  },

  // 2º ANO
  {
    id: "matematica-2ano",
    name: "Matemática",
    year: 2,
    icon: "Calculator",
    color: "bg-green-600",
    description: "Matemática avançada para eletrônica",
    objectives: ["Dominar análise combinatória", "Calcular probabilidades", "Aplicar em sistemas digitais"],
    topics: [
      {
        id: "analise-combinatoria",
        title: "Análise Combinatória",
        description: "Princípios de contagem e combinações",
        difficulty: "medium",
        content:
          "Princípio fundamental da contagem, arranjos, combinações, permutações e aplicações em sistemas digitais e confiabilidade.",
      },
      {
        id: "probabilidade",
        title: "Probabilidade",
        description: "Cálculos de probabilidade e estatística básica",
        difficulty: "medium",
        prerequisites: ["analise-combinatoria"],
        content:
          "Conceitos de probabilidade, eventos independentes, distribuições de probabilidade e aplicações em análise de confiabilidade de sistemas.",
      },
    ],
  },
  {
    id: "fisica-energia-2ano",
    name: "Física - Energia",
    year: 2,
    icon: "Atom",
    color: "bg-purple-600",
    description: "Fenômenos energéticos e ondulatórios",
    objectives: ["Compreender movimento harmônico", "Analisar propagação de ondas", "Estudar máquinas térmicas"],
    topics: [
      {
        id: "movimento-harmonico",
        title: "Movimento Harmônico Simples",
        description: "Equações e aplicações do MHS",
        difficulty: "hard",
        content:
          "Equação do MHS, período, frequência, amplitude, energia no MHS e aplicações em circuitos LC e sistemas de controle.",
      },
      {
        id: "equacao-onda",
        title: "Equação de Onda",
        description: "Propagação de ondas e suas equações",
        difficulty: "hard",
        content:
          "Equação diferencial da onda, velocidade de propagação, reflexão, refração e aplicações em linhas de transmissão.",
      },
      {
        id: "entropia-maquinas",
        title: "Entropia em Máquinas Térmicas",
        description: "Conceitos de entropia e eficiência térmica",
        difficulty: "hard",
        content:
          "Segunda lei da termodinâmica, entropia, ciclos térmicos, eficiência e aplicações em sistemas de refrigeração eletrônica.",
      },
    ],
  },
  {
    id: "instalacao-2ano",
    name: "Instalação",
    year: 2,
    icon: "Home",
    color: "bg-yellow-500",
    description: "Instalações elétricas e projetos",
    objectives: ["Dominar coordenadas cartesianas", "Usar AutoCAD eficientemente", "Calcular previsão de carga"],
    topics: [
      {
        id: "plano-cartesiano",
        title: "Plano Cartesiano",
        description: "Sistema de coordenadas cartesianas",
        difficulty: "easy",
        content:
          "Sistema de coordenadas, localização de pontos, distância entre pontos e aplicações em projetos elétricos.",
      },
      {
        id: "eixos-quadrantes",
        title: "Eixos X-Y e Quadrantes",
        description: "Orientação espacial e quadrantes no AutoCAD",
        difficulty: "medium",
        prerequisites: ["plano-cartesiano"],
        content: "Orientação no AutoCAD, comandos básicos de desenho, layers, blocos e criação de plantas baixas.",
      },
      {
        id: "previsao-carga",
        title: "Planilha de Previsão de Carga",
        description: "Cálculos para dimensionamento de instalações elétricas",
        difficulty: "hard",
        prerequisites: ["eixos-quadrantes"],
        content:
          "Cálculo de demanda, fator de demanda, fator de diversidade, dimensionamento de condutores e proteções.",
      },
    ],
  },
  {
    id: "analogica-2ano",
    name: "Eletrônica Analógica",
    year: 2,
    icon: "Brain",
    color: "bg-pink-500",
    description: "Fundamentos da eletrônica analógica",
    objectives: [
      "Compreender componentes analógicos",
      "Analisar circuitos lineares",
      "Projetar amplificadores básicos",
    ],
    prerequisites: ["circuitos-1ano"], // Requer circuitos do 1º ano
    topics: [
      {
        id: "componentes-passivos",
        title: "Componentes Passivos",
        description: "Resistores, capacitores e indutores",
        difficulty: "easy",
        content: "Características dos componentes passivos, códigos de cores, tolerâncias, comportamento em AC e DC.",
      },
      {
        id: "diodos-semicondutores",
        title: "Diodos e Semicondutores",
        description: "Funcionamento e aplicações de diodos",
        difficulty: "medium",
        content:
          "Teoria dos semicondutores, junção PN, características do diodo, circuitos retificadores e reguladores de tensão.",
      },
      {
        id: "transistores-basicos",
        title: "Transistores Básicos",
        description: "BJT e suas configurações",
        difficulty: "hard",
        prerequisites: ["diodos-semicondutores"],
        content:
          "Funcionamento do transistor bipolar, configurações emissor comum, base comum e coletor comum, polarização e amplificação.",
      },
    ],
  },
  {
    id: "programacao-2ano",
    name: "Programação",
    year: 2,
    icon: "Code",
    color: "bg-red-500",
    description: "Fundamentos de programação",
    objectives: ["Desenvolver lógica de programação", "Implementar algoritmos", "Criar programas funcionais"],
    topics: [
      {
        id: "logica-programacao",
        title: "Lógica de Programação",
        description: "Fundamentos da lógica aplicada à programação",
        difficulty: "easy",
        content: "Conceitos de algoritmo, fluxograma, pseudocódigo, estruturas de decisão e repetição.",
      },
      {
        id: "algoritmos-basicos",
        title: "Algoritmos Básicos",
        description: "Estruturas de controle e repetição",
        difficulty: "medium",
        content: "Estruturas condicionais (if, else, switch), loops (for, while, do-while) e aplicações práticas.",
      },
      {
        id: "pratica-programacao",
        title: "Prática de Programação",
        description: "Exercícios práticos e desenvolvimento de projetos",
        difficulty: "medium",
        prerequisites: ["logica-programacao"],
        content: "Desenvolvimento de programas simples, debugging, boas práticas de programação e projetos aplicados.",
      },
    ],
  },
  {
    id: "siscom-2ano",
    name: "Sistemas de Comunicação",
    year: 2,
    icon: "Wifi",
    color: "bg-cyan-500",
    description: "Redes e sistemas de comunicação",
    objectives: ["Compreender redes de computadores", "Calcular endereçamento IP", "Implementar virtualização"],
    topics: [
      {
        id: "enderecamento-ip",
        title: "Endereçamento IP",
        description: "Cálculo de endereçamento e submáscara de rede",
        difficulty: "medium",
        content: "Classes de IP, CIDR, VLSM, cálculo de sub-redes, roteamento básico e protocolos de rede.",
      },
      {
        id: "virtualizacao",
        title: "Virtualização",
        description: "Conceitos e aplicações de virtualização",
        difficulty: "hard",
        prerequisites: ["enderecamento-ip"],
        content:
          "Tipos de virtualização, hypervisors, máquinas virtuais, containers e aplicações em infraestrutura de TI.",
      },
    ],
  },

  // 3º ANO
  {
    id: "matematica-3ano",
    name: "Matemática",
    year: 3,
    icon: "Calculator",
    color: "bg-green-700",
    description: "Matemática avançada para eletrônica",
    objectives: ["Dominar números complexos", "Aplicar em análise AC", "Resolver circuitos complexos"],
    topics: [
      {
        id: "numeros-complexos",
        title: "Números Complexos",
        description: "Operações com números complexos e aplicações",
        difficulty: "hard",
        content:
          "Forma retangular e polar, operações com complexos, teorema de Euler, fasores e aplicações em circuitos AC.",
      },
    ],
  },
  {
    id: "fisica-campo-3ano",
    name: "Física - Força da Natureza e Campo",
    year: 3,
    icon: "Atom",
    color: "bg-purple-700",
    description: "Campos físicos e eletromagnetismo",
    objectives: ["Compreender campos elétricos", "Analisar campos magnéticos", "Estudar eletromagnetismo"],
    topics: [
      {
        id: "carga-eletrica",
        title: "Carga Elétrica",
        description: "Propriedades fundamentais da carga elétrica",
        difficulty: "medium",
        content: "Conceito de carga elétrica, quantização da carga, lei de Coulomb, princípio da superposição.",
      },
      {
        id: "corrente-eletrica",
        title: "Corrente Elétrica",
        description: "Fluxo de cargas elétricas em condutores",
        difficulty: "medium",
        prerequisites: ["carga-eletrica"],
        content: "Definição de corrente elétrica, densidade de corrente, resistividade, lei de Ohm microscópica.",
      },
      {
        id: "circuitos-eletricos",
        title: "Circuitos Elétricos",
        description: "Análise de circuitos elétricos básicos",
        difficulty: "hard",
        prerequisites: ["corrente-eletrica"],
        content:
          "Leis de Kirchhoff, análise nodal e de malhas, teoremas de Thévenin e Norton, máxima transferência de potência.",
      },
      {
        id: "campos-fisicos",
        title: "Campos Físicos",
        description: "Campo gravitacional, elétrico e magnético",
        difficulty: "hard",
        prerequisites: ["carga-eletrica"],
        content: "Conceito de campo, campo elétrico, campo magnético, força de Lorentz, indução eletromagnética.",
      },
    ],
  },
  {
    id: "potencia-3ano",
    name: "Eletrônica de Potência",
    year: 3,
    icon: "Zap",
    color: "bg-orange-600",
    description: "Sistemas de potência e conversão de energia",
    objectives: ["Analisar conversores de potência", "Projetar fontes chaveadas", "Controlar motores elétricos"],
    prerequisites: ["analogica-2ano", "matematica-2ano"], // Requer analógica e matemática do 2º ano
    topics: [
      {
        id: "conversores-dc-dc",
        title: "Conversores DC-DC",
        description: "Buck, Boost e Buck-Boost",
        difficulty: "hard",
        content:
          "Topologias de conversores, modo de condução contínua e descontínua, controle PWM, projeto de indutores e capacitores.",
      },
      {
        id: "inversores",
        title: "Inversores",
        description: "Conversão DC-AC",
        difficulty: "hard",
        content: "Inversores monofásicos e trifásicos, modulação PWM, controle de velocidade de motores AC.",
      },
      {
        id: "retificadores",
        title: "Retificadores",
        description: "Conversão AC-DC",
        difficulty: "medium",
        content: "Retificadores de meia onda e onda completa, filtros capacitivos e indutivos, fator de potência.",
      },
    ],
  },
  {
    id: "manutencao-3ano",
    name: "Manutenção",
    year: 3,
    icon: "Wrench",
    color: "bg-gray-600",
    description: "Manutenção de sistemas eletrônicos",
    objectives: ["Diagnosticar falhas em circuitos", "Aplicar técnicas de manutenção", "Usar instrumentos de medição"],
    topics: [
      {
        id: "analise-circuitos-manutencao",
        title: "Análise de Circuitos para Manutenção",
        description: "Aplicação de matemática na análise de circuitos",
        difficulty: "hard",
        content:
          "Técnicas de análise de falhas, uso de multímetros, osciloscópios, analisadores de espectro e geradores de função.",
      },
      {
        id: "diagnostico-falhas",
        title: "Diagnóstico de Falhas",
        description: "Técnicas para identificação de problemas em circuitos",
        difficulty: "hard",
        prerequisites: ["analise-circuitos-manutencao"],
        content:
          "Metodologias de diagnóstico, árvore de falhas, manutenção preditiva e corretiva, documentação técnica.",
      },
    ],
  },
  {
    id: "controle-3ano",
    name: "Controle",
    year: 3,
    icon: "Settings",
    color: "bg-slate-600",
    description: "Sistemas de controle e automação",
    objectives: ["Projetar sistemas de controle", "Programar CLPs", "Implementar malhas de controle"],
    topics: [
      {
        id: "amplificadores-operacionais",
        title: "Amplificadores Operacionais",
        description: "Teoria e aplicações de amplificadores operacionais",
        difficulty: "hard",
        content:
          "Características ideais e reais do amp-op, configurações básicas (inversor, não-inversor, seguidor), aplicações em controle.",
      },
      {
        id: "clps",
        title: "CLPs (Controladores Lógicos Programáveis)",
        description: "Programação e aplicação de CLPs",
        difficulty: "hard",
        content: "Arquitetura de CLPs, linguagens de programação (Ladder, FBD, ST), IHMs, redes industriais.",
      },
      {
        id: "instrumentacao-controle",
        title: "Instrumentação e Controle",
        description: "Sistemas de controle e instrumentação industrial",
        difficulty: "hard",
        prerequisites: ["amplificadores-operacionais", "clps"],
        content:
          "Sensores e transdutores, malhas de controle PID, sistemas SCADA, protocolos de comunicação industrial.",
      },
    ],
  },
]

// Função para obter matérias por ano
export function getSubjectsByYear(year: 1 | 2 | 3): CurriculumSubject[] {
  return curriculumData.filter((subject) => subject.year === year)
}

// Função para obter todos os tópicos de uma matéria
export function getTopicsBySubject(subjectId: string): CurriculumTopic[] {
  const subject = curriculumData.find((s) => s.id === subjectId)
  return subject?.topics || []
}

export function getSubjectById(id: string): CurriculumSubject | undefined {
  return curriculumData.find((subject) => subject.id === id)
}

export function getAllSubjects(): CurriculumSubject[] {
  return curriculumData
}
