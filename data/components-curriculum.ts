interface CurriculumComponent {
  id: string
  name: string
  symbol: string
  description: string
  year: 1 | 2 | 3
  subject: string
  category: string
  image: string
  characteristics: string[]
  applications: string[]
  theory: string
}

export const curriculumComponents: CurriculumComponent[] = [
  // 1º ANO - CIRCUITOS
  {
    id: "resistor-basico",
    name: "Resistor Básico",
    symbol: "R",
    description: "Componente fundamental para limitação de corrente em circuitos básicos",
    year: 1,
    subject: "Circuitos",
    category: "passive",
    image: "/images/components/resistor.png",
    characteristics: ["Resistência medida em Ohms (Ω)", "Código de cores para identificação", "Potência de dissipação"],
    applications: ["Limitação de corrente em LEDs", "Divisores de tensão", "Circuitos de polarização básicos"],
    theory:
      "A resistência elétrica é a oposição que um material oferece à passagem da corrente elétrica. Lei de Ohm: V = R × I",
  },
  {
    id: "capacitor-basico",
    name: "Capacitor Básico",
    symbol: "C",
    description: "Componente para armazenamento de carga elétrica",
    year: 1,
    subject: "Circuitos",
    category: "passive",
    image: "/images/components/capacitor.png",
    characteristics: [
      "Capacitância medida em Farads (F)",
      "Tensão de trabalho máxima",
      "Tipos: cerâmico, eletrolítico",
    ],
    applications: ["Filtros em fontes de alimentação", "Acoplamento AC", "Circuitos de temporização"],
    theory:
      "Capacitância é a capacidade de armazenar carga elétrica. Q = C × V, onde Q é carga, C é capacitância e V é tensão",
  },
  {
    id: "indutor-basico",
    name: "Indutor Básico",
    symbol: "L",
    description: "Componente que armazena energia em campo magnético",
    year: 1,
    subject: "Circuitos",
    category: "passive",
    image: "/images/components/indutor.png",
    characteristics: [
      "Indutância medida em Henrys (H)",
      "Corrente máxima suportada",
      "Resistência série (DCR)",
      "Frequência de auto-ressonância",
    ],
    applications: ["Filtros passa-baixa", "Fontes chaveadas", "Circuitos LC", "Supressão de EMI"],
    theory: "Indutância é a propriedade de armazenar energia em campo magnético. V = L × (di/dt)",
  },
  {
    id: "fonte-tensao",
    name: "Fonte de Tensão",
    symbol: "V",
    description: "Fornece tensão constante para alimentar circuitos",
    year: 1,
    subject: "Circuitos",
    category: "power",
    image: "/images/components/fonte-tensao.png",
    characteristics: ["Tensão nominal de saída", "Corrente máxima", "Regulação de linha e carga", "Ripple de saída"],
    applications: ["Alimentação de circuitos", "Bancada de testes", "Laboratórios", "Prototipagem"],
    theory: "Fonte ideal mantém tensão constante independente da corrente demandada pela carga",
  },
  {
    id: "multimetro",
    name: "Multímetro",
    symbol: "MM",
    description: "Instrumento para medição de grandezas elétricas",
    year: 1,
    subject: "Circuitos",
    category: "instrument",
    image: "/images/components/multimetro.png",
    characteristics: [
      "Medição de tensão AC/DC",
      "Medição de corrente AC/DC",
      "Medição de resistência",
      "Teste de continuidade",
    ],
    applications: ["Medições em circuitos", "Diagnóstico de falhas", "Verificação de componentes", "Manutenção"],
    theory: "Instrumento que combina voltímetro, amperímetro e ohmímetro em um único dispositivo",
  },

  // 1º ANO - ELETRÔNICA DIGITAL
  {
    id: "porta-and",
    name: "Porta AND",
    symbol: "&",
    description: "Porta lógica que implementa a função E",
    year: 1,
    subject: "Eletrônica Digital",
    category: "integrated",
    image: "/images/logic-gates/and-gate.png",
    characteristics: [
      "Saída 1 apenas quando todas entradas são 1",
      "Família TTL ou CMOS",
      "Tensão de alimentação específica",
      "Tempo de propagação",
    ],
    applications: ["Circuitos combinacionais", "Decodificadores", "Controle de habilitação", "Álgebra booleana"],
    theory: "Implementa a operação lógica AND: S = A · B",
  },
  {
    id: "porta-or",
    name: "Porta OR",
    symbol: "≥1",
    description: "Porta lógica que implementa a função OU",
    year: 1,
    subject: "Eletrônica Digital",
    category: "integrated",
    image: "/images/logic-gates/or-gate.png",
    characteristics: [
      "Saída 1 quando pelo menos uma entrada é 1",
      "Múltiplas entradas possíveis",
      "Baixo consumo em CMOS",
      "Alta velocidade em TTL",
    ],
    applications: ["Somadores", "Multiplexadores", "Circuitos de alarme", "Lógica de controle"],
    theory: "Implementa a operação lógica OR: S = A + B",
  },
  {
    id: "porta-not",
    name: "Porta NOT (Inversor)",
    symbol: "1",
    description: "Porta lógica que inverte o sinal de entrada",
    year: 1,
    subject: "Eletrônica Digital",
    category: "integrated",
    image: "/images/logic-gates/not-gate.png",
    characteristics: [
      "Uma entrada e uma saída",
      "Saída sempre oposta à entrada",
      "Buffer de corrente",
      "Baixa impedância de saída",
    ],
    applications: ["Inversão de sinais", "Buffers", "Osciladores", "Drivers de linha"],
    theory: "Implementa a operação lógica NOT: S = Ā",
  },
  {
    id: "flip-flop-d",
    name: "Flip-Flop D",
    symbol: "FF-D",
    description: "Elemento de memória básico para armazenar 1 bit",
    year: 1,
    subject: "Eletrônica Digital",
    category: "integrated",
    image: "/images/components/flip-flop-d.png",
    characteristics: ["Armazena 1 bit de informação", "Sincronizado por clock", "Entradas Set e Reset", "Saídas Q e Q̄"],
    applications: ["Registradores", "Contadores", "Máquinas de estado", "Memórias"],
    theory: "Armazena o valor da entrada D na borda do clock",
  },

  // 1º ANO - FÍSICA
  {
    id: "dinamometro",
    name: "Dinamômetro",
    symbol: "DIN",
    description: "Instrumento para medição de forças",
    year: 1,
    subject: "Física - Força da Natureza",
    category: "instrument",
    image: "/images/components/dinamometro.png",
    characteristics: ["Escala em Newtons (N)", "Mola calibrada", "Precisão de medição", "Faixa de operação"],
    applications: ["Medição de peso", "Experimentos de força", "Calibração", "Ensaios mecânicos"],
    theory: "Baseia-se na Lei de Hooke: F = k × x, onde k é constante da mola",
  },

  // 2º ANO - INSTALAÇÃO
  {
    id: "disjuntor",
    name: "Disjuntor",
    symbol: "DJ",
    description: "Dispositivo de proteção contra sobrecorrente em instalações elétricas",
    year: 2,
    subject: "Instalação",
    category: "protection",
    image: "/images/components/disjuntor.png",
    characteristics: ["Corrente nominal", "Tensão de operação", "Curva de atuação (B, C, D)"],
    applications: ["Proteção de circuitos residenciais", "Proteção de motores", "Quadros de distribuição"],
    theory:
      "Dispositivo que interrompe automaticamente o circuito quando detecta sobrecorrente, protegendo a instalação",
  },
  {
    id: "dr-diferencial",
    name: "Dispositivo DR",
    symbol: "DR",
    description: "Proteção contra choques elétricos e fugas de corrente",
    year: 2,
    subject: "Instalação",
    category: "protection",
    image: "/images/components/dr-diferencial.png",
    characteristics: [
      "Corrente diferencial nominal (30mA, 300mA)",
      "Número de polos (2P, 4P)",
      "Tempo de atuação",
      "Botão de teste",
    ],
    applications: ["Proteção de pessoas", "Circuitos de tomadas", "Áreas molhadas", "Chuveiros elétricos"],
    theory: "Detecta diferença entre corrente de entrada e saída, indicando fuga para terra",
  },
  {
    id: "contator",
    name: "Contator",
    symbol: "K",
    description: "Chave eletromagnética para comando de cargas",
    year: 2,
    subject: "Instalação",
    category: "electromechanical",
    image: "/images/components/contator.png",
    characteristics: [
      "Corrente nominal dos contatos",
      "Tensão da bobina",
      "Número de contatos NA/NF",
      "Categoria de emprego",
    ],
    applications: ["Comando de motores", "Iluminação pública", "Aquecedores", "Sistemas automatizados"],
    theory: "Utiliza eletromagnetismo para abrir/fechar contatos através de bobina energizada",
  },
  {
    id: "rele-termico",
    name: "Relé Térmico",
    symbol: "F",
    description: "Proteção térmica para motores elétricos",
    year: 2,
    subject: "Instalação",
    category: "protection",
    image: "/images/components/rele-termico.png",
    characteristics: [
      "Faixa de regulagem de corrente",
      "Classe de disparo",
      "Reset manual/automático",
      "Contatos auxiliares",
    ],
    applications: ["Proteção de motores", "Sobrecarga térmica", "Partida direta", "Sistemas industriais"],
    theory: "Utiliza bimetálico que se deforma com aquecimento por sobrecorrente",
  },

  // 2º ANO - ELETRÔNICA ANALÓGICA
  {
    id: "diodo-retificador",
    name: "Diodo Retificador",
    symbol: "D",
    description: "Semicondutor para retificação de corrente alternada",
    year: 2,
    subject: "Eletrônica Analógica",
    category: "semiconductor",
    image: "/images/components/diodo.png",
    characteristics: ["Tensão direta (Vf)", "Corrente máxima direta", "Tensão reversa máxima", "Tempo de recuperação"],
    applications: ["Retificadores", "Proteção contra polaridade", "Grampeadores", "Ceifadores"],
    theory: "Permite passagem de corrente em apenas um sentido, baseado na junção PN",
  },
  {
    id: "transistor-bjt",
    name: "Transistor BJT",
    symbol: "Q",
    description: "Transistor bipolar para amplificação e chaveamento",
    year: 2,
    subject: "Eletrônica Analógica",
    category: "semiconductor",
    image: "/images/components/transistor.png",
    characteristics: [
      "Ganho de corrente (hFE)",
      "Tensão coletor-emissor máxima",
      "Corrente de coletor máxima",
      "Potência máxima",
    ],
    applications: ["Amplificadores", "Chaves eletrônicas", "Osciladores", "Reguladores"],
    theory: "Dispositivo de três terminais que controla corrente através de polarização da base",
  },
  {
    id: "transformador",
    name: "Transformador",
    symbol: "T",
    description: "Dispositivo para transformação de tensão AC",
    year: 2,
    subject: "Eletrônica Analógica",
    category: "electromechanical",
    image: "/images/components/transformer.png",
    characteristics: [
      "Relação de transformação",
      "Potência nominal",
      "Tensões primário/secundário",
      "Frequência de operação",
    ],
    applications: ["Fontes de alimentação", "Isolação galvânica", "Casamento de impedância", "Instrumentação"],
    theory: "Baseia-se na indução eletromagnética entre enrolamentos acoplados magneticamente",
  },

  // 2º ANO - PROGRAMAÇÃO
  {
    id: "microcontrolador",
    name: "Microcontrolador",
    symbol: "μC",
    description: "Computador completo em um único chip",
    year: 2,
    subject: "Programação",
    category: "integrated",
    image: "/images/components/microcontrolador.png",
    characteristics: ["CPU, RAM, ROM integrados", "Portas de I/O digitais", "Conversores A/D", "Timers e contadores"],
    applications: ["Automação residencial", "Robótica", "IoT", "Sistemas embarcados"],
    theory: "Sistema computacional completo otimizado para controle de dispositivos externos",
  },
  {
    id: "arduino-uno",
    name: "Arduino Uno",
    symbol: "ARD",
    description: "Plataforma de prototipagem eletrônica",
    year: 2,
    subject: "Programação",
    category: "controller",
    image: "/images/components/arduino.png",
    characteristics: ["Microcontrolador ATmega328P", "14 pinos digitais I/O", "6 entradas analógicas", "Interface USB"],
    applications: ["Prototipagem rápida", "Projetos educacionais", "Automação", "Sensoriamento"],
    theory: "Plataforma open-source que simplifica programação de microcontroladores",
  },

  // 2º ANO - SISTEMAS DE COMUNICAÇÃO
  {
    id: "roteador",
    name: "Roteador",
    symbol: "RTR",
    description: "Dispositivo para interconexão de redes",
    year: 2,
    subject: "Sistemas de Comunicação",
    category: "network",
    image: "/images/components/roteador.png",
    characteristics: ["Portas Ethernet", "Wi-Fi integrado", "Protocolos de roteamento", "Firewall integrado"],
    applications: ["Conexão à internet", "Redes locais", "VPN", "Segurança de rede"],
    theory: "Encaminha pacotes entre redes diferentes usando tabelas de roteamento",
  },
  {
    id: "switch",
    name: "Switch",
    symbol: "SW",
    description: "Comutador para redes Ethernet",
    year: 2,
    subject: "Sistemas de Comunicação",
    category: "network",
    image: "/images/components/switch.png",
    characteristics: ["Número de portas", "Velocidade (10/100/1000 Mbps)", "Tabela MAC", "VLAN support"],
    applications: ["Redes locais", "Segmentação de rede", "VLANs", "Agregação de links"],
    theory: "Comuta frames Ethernet baseado em endereços MAC aprendidos dinamicamente",
  },

  // 3º ANO - CONTROLE
  {
    id: "amplificador-operacional",
    name: "Amplificador Operacional",
    symbol: "AO",
    description: "Circuito integrado para amplificação e processamento de sinais",
    year: 3,
    subject: "Controle",
    category: "integrated",
    image: "/images/components/opamp.png",
    characteristics: ["Alto ganho de tensão", "Alta impedância de entrada", "Baixa impedância de saída"],
    applications: [
      "Amplificadores de instrumentação",
      "Filtros ativos",
      "Comparadores",
      "Integradores e diferenciadores",
    ],
    theory:
      "Amplifica a diferença entre duas tensões de entrada. Configurações: inversor, não-inversor, seguidor de tensão",
  },
  {
    id: "clp-basico",
    name: "CLP (Controlador Lógico Programável)",
    symbol: "CLP",
    description: "Computador industrial para automação de processos",
    year: 3,
    subject: "Controle",
    category: "controller",
    image: "/images/components/clp.png",
    characteristics: [
      "Entradas digitais e analógicas",
      "Saídas digitais e analógicas",
      "Memória de programa",
      "Interface de comunicação",
    ],
    applications: ["Automação industrial", "Controle de motores", "Sistemas de supervisão", "Controle de processos"],
    theory:
      "Executa programas de controle em tempo real, processando sinais de entrada e acionando saídas conforme a lógica programada",
  },
  {
    id: "sensor-temperatura",
    name: "Sensor de Temperatura",
    symbol: "TMP",
    description: "Transdutor para medição de temperatura",
    year: 3,
    subject: "Controle",
    category: "sensor",
    image: "/images/components/sensor-temp.png",
    characteristics: [
      "Faixa de temperatura",
      "Precisão de medição",
      "Tipo de saída (analógica/digital)",
      "Tempo de resposta",
    ],
    applications: ["Controle de temperatura", "Monitoramento ambiental", "Proteção térmica", "HVAC"],
    theory: "Converte temperatura em sinal elétrico proporcional usando diferentes princípios físicos",
  },
  {
    id: "servo-motor",
    name: "Servo Motor",
    symbol: "SRV",
    description: "Motor com controle preciso de posição",
    year: 3,
    subject: "Controle",
    category: "electromechanical",
    image: "/images/components/servo-motor.png",
    characteristics: ["Controle de posição angular", "Feedback de posição", "Torque nominal", "Velocidade máxima"],
    applications: ["Robótica", "Automação industrial", "Máquinas CNC", "Sistemas de posicionamento"],
    theory: "Motor com sistema de controle em malha fechada para posicionamento preciso",
  },

  // 3º ANO - ELETRÔNICA DE POTÊNCIA
  {
    id: "igbt",
    name: "IGBT",
    symbol: "IGBT",
    description: "Transistor bipolar de porta isolada para alta potência",
    year: 3,
    subject: "Eletrônica de Potência",
    category: "semiconductor",
    image: "/images/components/igbt.png",
    characteristics: [
      "Alta tensão de bloqueio",
      "Alta corrente de condução",
      "Controle por tensão",
      "Baixas perdas de condução",
    ],
    applications: ["Inversores de frequência", "Fontes chaveadas", "Soldas eletrônicas", "Tração elétrica"],
    theory: "Combina características do MOSFET (controle) com BJT (condução) para alta potência",
  },
  {
    id: "tiristor-scr",
    name: "Tiristor SCR",
    symbol: "SCR",
    description: "Retificador controlado de silício",
    year: 3,
    subject: "Eletrônica de Potência",
    category: "semiconductor",
    image: "/images/components/scr.png",
    characteristics: ["Tensão de bloqueio", "Corrente máxima", "Corrente de gate", "Tempo de comutação"],
    applications: ["Controle de potência AC", "Dimmers", "Soft-starters", "Retificadores controlados"],
    theory: "Dispositivo de quatro camadas que conduz após disparo e mantém condução até corrente zero",
  },
  {
    id: "mosfet-potencia",
    name: "MOSFET de Potência",
    symbol: "M",
    description: "Transistor de efeito de campo para alta potência",
    year: 3,
    subject: "Eletrônica de Potência",
    category: "semiconductor",
    image: "/images/components/mosfet.png",
    characteristics: ["Resistência drain-source", "Tensão gate-source", "Corrente máxima", "Capacitâncias parasitas"],
    applications: ["Conversores DC-DC", "Inversores", "Fontes chaveadas", "Controle de motores"],
    theory: "Controle de corrente através de campo elétrico aplicado ao gate isolado",
  },

  // 3º ANO - MANUTENÇÃO
  {
    id: "osciloscopio",
    name: "Osciloscópio",
    symbol: "OSC",
    description: "Instrumento para visualização de sinais elétricos",
    year: 3,
    subject: "Manutenção",
    category: "instrument",
    image: "/images/components/osciloscopio.png",
    characteristics: ["Largura de banda", "Taxa de amostragem", "Número de canais", "Profundidade de memória"],
    applications: ["Análise de sinais", "Diagnóstico de circuitos", "Medição de ruído", "Desenvolvimento"],
    theory: "Mostra variação de tensão no tempo, permitindo análise detalhada de formas de onda",
  },
  {
    id: "gerador-funcoes",
    name: "Gerador de Funções",
    symbol: "GEN",
    description: "Gerador de sinais para testes e calibração",
    year: 3,
    subject: "Manutenção",
    category: "instrument",
    image: "/images/components/gerador.png",
    characteristics: [
      "Faixa de frequência",
      "Formas de onda disponíveis",
      "Amplitude ajustável",
      "Precisão de frequência",
    ],
    applications: ["Teste de circuitos", "Calibração", "Desenvolvimento", "Educação"],
    theory: "Gera sinais de diferentes formas (senoidal, quadrada, triangular) com parâmetros ajustáveis",
  },
  {
    id: "analisador-espectro",
    name: "Analisador de Espectro",
    symbol: "SA",
    description: "Instrumento para análise no domínio da frequência",
    year: 3,
    subject: "Manutenção",
    category: "instrument",
    image: "/images/components/analisador-espectro.png",
    characteristics: ["Faixa de frequência", "Resolução de frequência", "Faixa dinâmica", "Sensibilidade"],
    applications: ["Análise de EMI", "Caracterização de RF", "Medição de harmônicos", "Telecomunicações"],
    theory: "Mostra amplitude dos componentes espectrais de um sinal versus frequência",
  },
]

// Função para obter componentes por ano
export function getComponentsByYear(year: 1 | 2 | 3): CurriculumComponent[] {
  return curriculumComponents.filter((component) => component.year === year)
}

// Função para obter componentes por matéria
export function getComponentsBySubject(subject: string): CurriculumComponent[] {
  return curriculumComponents.filter((component) => component.subject === subject)
}

// Função para obter componentes por categoria
export function getComponentsByCategory(category: string): CurriculumComponent[] {
  return curriculumComponents.filter((component) => component.category === category)
}

// Função para obter todas as categorias disponíveis
export function getAllCategories(): string[] {
  const categories = curriculumComponents.map((comp) => comp.category)
  return [...new Set(categories)]
}

// Função para obter todas as matérias disponíveis
export function getAllSubjects(): string[] {
  const subjects = curriculumComponents.map((comp) => comp.subject)
  return [...new Set(subjects)]
}

// Função para buscar componentes por texto
export function searchComponents(query: string): CurriculumComponent[] {
  const searchTerm = query.toLowerCase()
  return curriculumComponents.filter(
    (component) =>
      component.name.toLowerCase().includes(searchTerm) ||
      component.description.toLowerCase().includes(searchTerm) ||
      component.subject.toLowerCase().includes(searchTerm) ||
      component.characteristics.some((char) => char.toLowerCase().includes(searchTerm)) ||
      component.applications.some((app) => app.toLowerCase().includes(searchTerm)),
  )
}
