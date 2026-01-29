-- Criar a tabela quiz_questions
CREATE TABLE quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subject TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    incorrect_answers TEXT[] NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir 45 questões (15 para cada assunto, 5 para cada nível de dificuldade)

-- Questões de Eletrônica Digital
INSERT INTO quiz_questions (subject, difficulty, question, correct_answer, incorrect_answers, explanation) VALUES
-- Questões Fáceis de Eletrônica Digital
('Digital', 'Fácil', 'O que faz uma porta AND?', 'Produz saída alta apenas quando todas as entradas são altas', ARRAY['Produz saída alta quando qualquer entrada é alta', 'Sempre produz saída baixa', 'Inverte a entrada'], 'A porta AND é uma porta lógica digital básica que implementa a conjunção lógica. Ela se comporta de acordo com a tabela verdade do AND lógico.'),
('Digital', 'Fácil', 'Quantas entradas tem uma porta XOR básica?', '2', ARRAY['1', '3', '4'], 'A porta XOR (OU Exclusivo) básica geralmente tem duas entradas. Ela produz uma saída 1 (verdadeira) se as entradas forem diferentes, e 0 (falsa) se forem iguais.'),
('Digital', 'Fácil', 'Qual é o propósito de um flip-flop em circuitos digitais?', 'Armazenar um bit de dados', ARRAY['Amplificar sinais', 'Converter analógico para digital', 'Realizar adição'], 'Flip-flops são usados em circuitos digitais para armazenar informações de estado, efetivamente lembrando um bit de dados até que seja direcionado a mudar.'),
('Digital', 'Fácil', 'Qual é a saída de uma porta NOT quando a entrada é 0?', '1', ARRAY['0', 'Indefinido', 'Depende do circuito'], 'A porta NOT, também conhecida como inversor, sempre produz o oposto de sua entrada. Quando a entrada é 0, a saída é 1.'),
('Digital', 'Fácil', 'Na álgebra booleana, o que A + B representa?', 'Operação OR', ARRAY['Operação AND', 'Operação XOR', 'Operação NOT'], 'Na álgebra booleana, o símbolo + representa a operação OR. A + B significa "A OU B".'),

-- Questões Médias de Eletrônica Digital
('Digital', 'Médio', 'Qual é a função de um multiplexador?', 'Selecionar um de vários sinais de entrada e encaminhá-lo para uma única linha de saída', ARRAY['Dividir uma única entrada em múltiplas saídas', 'Armazenar dados', 'Realizar operações aritméticas'], 'Um multiplexador, ou MUX, é um dispositivo que seleciona um de vários sinais de entrada e encaminha a entrada selecionada para uma única linha de saída.'),
('Digital', 'Médio', 'Qual é a diferença entre circuitos lógicos combinacionais e sequenciais?', 'Circuitos sequenciais têm memória, circuitos combinacionais não', ARRAY['Circuitos combinacionais são mais rápidos', 'Circuitos sequenciais usam menos portas', 'Não há diferença significativa'], 'A principal diferença é que os circuitos lógicos sequenciais têm elementos de memória e suas saídas dependem tanto das entradas atuais quanto das passadas, enquanto as saídas dos circuitos lógicos combinacionais dependem apenas da entrada presente.'),
('Digital', 'Médio', 'Qual é o propósito de um flip-flop D?', 'Atrasar e armazenar um único bit', ARRAY['Somar dois bits', 'Converter analógico para digital', 'Multiplicar frequências'], 'Um flip-flop D, ou flip-flop de dados, armazena o valor de sua entrada D em uma certa parte do ciclo do relógio, efetivamente atrasando e armazenando um único bit de dados.'),
('Digital', 'Médio', 'Em um contador binário de 4 bits, qual é a contagem após 1111?', '0000', ARRAY['10000', '0001', 'Para em 1111'], 'Um contador binário de 4 bits cicla por 16 valores (0-15 em decimal). Após atingir 1111 (15 em decimal), ele volta para 0000.'),
('Digital', 'Médio', 'Qual é a função de um decodificador em sistemas digitais?', 'Converter entradas codificadas em saídas codificadas', ARRAY['Codificar dados', 'Armazenar dados', 'Realizar operações aritméticas'], 'Um decodificador é um circuito lógico combinacional que converte entradas codificadas em saídas codificadas, onde as linhas de saída representam o código de entrada.'),

-- Questões Difíceis de Eletrônica Digital
('Digital', 'Difícil', 'Explique o conceito de tempos de setup e hold em flip-flops.', 'Tempo de setup é o tempo mínimo antes da borda do clock que os dados devem estar estáveis; tempo de hold é o tempo mínimo após a borda do clock que os dados devem permanecer estáveis', ARRAY['São a mesma coisa', 'Só se aplicam a circuitos combinacionais', 'Determinam a frequência máxima do circuito'], 'Os tempos de setup e hold são parâmetros cruciais em circuitos sequenciais, garantindo que os dados sejam capturados corretamente pelo flip-flop.'),
('Digital', 'Difícil', 'Qual é a importância dos mapas de Karnaugh no projeto de lógica digital?', 'Ajudam a minimizar expressões booleanas', ARRAY['Aumentam a complexidade do circuito', 'São usados para projeto de circuitos analógicos', 'Geram funções lógicas aleatórias'], 'Os mapas de Karnaugh (K-maps) são um método de simplificação de expressões de álgebra booleana, ajudando os projetistas a criar circuitos digitais mais eficientes com menos portas.'),
('Digital', 'Difícil', 'Descreva a função de um Phase-Locked Loop (PLL) em sistemas digitais.', 'Sincronizar a fase de um sinal de saída com um sinal de referência', ARRAY['Amplificar sinais digitais', 'Converter analógico para digital', 'Armazenar dados digitais'], 'PLLs são usados em sistemas digitais para tarefas como recuperação de clock, síntese de frequência e redução de jitter, mantendo uma relação de fase constante entre o sinal de saída e o sinal de referência.'),
('Digital', 'Difícil', 'Qual é o propósito do código Gray em sistemas digitais?', 'Minimizar erros na conversão digital-analógica', ARRAY['Criptografar dados', 'Comprimir dados', 'Aumentar a velocidade de processamento'], 'O código Gray é uma sequência de números binários onde números adjacentes diferem em apenas um bit, útil para minimizar erros na conversão digital-analógica e em codificadores rotativos.'),
('Digital', 'Difícil', 'Explique o conceito de metaestabilidade em circuitos digitais.', 'Um estado onde a saída de um dispositivo biestável é imprevisível por um curto período', ARRAY['Um estado de estabilidade máxima', 'Um tipo de porta lógica', 'Um método de projeto de circuito'], 'A metaestabilidade ocorre quando um flip-flop entra em um estado instável devido a violações nos tempos de setup e hold, potencialmente levando a comportamentos imprevisíveis em sistemas digitais.'),

-- Questões de Eletrônica Analógica
-- Questões Fáceis de Eletrônica Analógica
('Analógica', 'Fácil', 'Qual é a função de um resistor em um circuito elétrico?', 'Opor-se ao fluxo de corrente elétrica', ARRAY['Armazenar carga elétrica', 'Amplificar sinais', 'Gerar eletricidade'], 'Resistores são componentes passivos que criam uma diferença de potencial quando a corrente flui através deles, seguindo a lei de Ohm.'),
('Analógica', 'Fácil', 'O que um capacitor faz em um circuito?', 'Armazena energia elétrica', ARRAY['Amplifica corrente', 'Gera eletricidade', 'Reduz tensão'], 'Capacitores armazenam energia elétrica em um campo elétrico entre duas placas condutoras separadas por um material dielétrico.'),
('Analógica', 'Fácil', 'Qual é o propósito de um diodo?', 'Permitir o fluxo de corrente em uma direção', ARRAY['Resistir ao fluxo de corrente', 'Armazenar energia', 'Amplificar sinais'], 'Diodos são dispositivos semicondutores que permitem principalmente que a corrente flua em uma direção, do ânodo para o cátodo.'),
('Analógica', 'Fácil', 'O que significa AC em eletrônica?', 'Corrente Alternada', ARRAY['Corrente Amplificada', 'Circuito Analógico', 'Carga Média'], 'AC, ou Corrente Alternada, é uma corrente elétrica que inverte periodicamente sua direção e muda sua magnitude continuamente com o tempo.'),
('Analógica', 'Fácil', 'Qual é a função de um indutor?', 'Armazenar energia em um campo magnético', ARRAY['Resistir ao fluxo de corrente', 'Amplificar tensão', 'Filtrar sinais DC'], 'Indutores armazenam energia em um campo magnético quando a corrente flui através deles, e se opõem a mudanças na corrente que flui através deles.'),

-- Questões Médias de Eletrônica Analógica
('Analógica', 'Médio', 'Qual é o propósito de um circuito divisor de tensão?', 'Produzir uma fração da tensão de entrada', ARRAY['Aumentar a tensão', 'Armazenar energia', 'Amplificar corrente'], 'Um divisor de tensão é um circuito simples que produz uma tensão de saída que é uma fração de sua tensão de entrada, tipicamente usando dois resistores em série.'),
('Analógica', 'Médio', 'Explique o conceito de ganho em um amplificador.', 'A razão entre a magnitude do sinal de saída e a magnitude do sinal de entrada', ARRAY['A potência total do amplificador', 'A impedância de entrada', 'O número de transistores usados'], 'O ganho em um amplificador é uma medida de quanto o amplificador aumenta a magnitude do sinal de entrada, geralmente expresso como uma razão ou em decibéis.'),
('Analógica', 'Médio', 'Qual é a função de um filtro passa-baixa?', 'Atenuar sinais de alta frequência', ARRAY['Amplificar sinais de baixa frequência', 'Bloquear sinais DC', 'Aumentar a largura de banda'], 'Filtros passa-baixa permitem que sinais abaixo de uma certa frequência de corte passem, enquanto atenuam sinais acima desta frequência.'),
('Analógica', 'Médio', 'Qual é a diferença entre um BJT e um MOSFET?', 'BJTs são controlados por corrente, MOSFETs são controlados por tensão', ARRAY['BJTs usam efeito de campo, MOSFETs usam efeito de junção', 'BJTs são para circuitos digitais, MOSFETs para analógicos', 'Não há diferença significativa'], 'Transistores de Junção Bipolar (BJTs) são dispositivos controlados por corrente, enquanto Transistores de Efeito de Campo Metal-Óxido-Semicondutor (MOSFETs) são dispositivos controlados por tensão.'),
('Analógica', 'Médio', 'Qual é o propósito da realimentação negativa em um amplificador?', 'Melhorar a estabilidade e reduzir a distorção', ARRAY['Aumentar o ganho', 'Gerar oscilações', 'Converter AC para DC'], 'A realimentação negativa em amplificadores ajuda a estabilizar o ganho, reduzir a distorção e melhorar outras características de desempenho ao custo de redução do ganho geral.'),

-- Questões Difíceis de Eletrônica Analógica
('Analógica', 'Difícil', 'Explique o conceito de slew rate em amplificadores operacionais.', 'A taxa máxima de variação da tensão de saída por unidade de tempo', ARRAY['A tensão máxima de entrada', 'O ganho em altas frequências', 'A impedância de saída'], 'Slew rate é uma limitação em amplificadores operacionais que define quão rapidamente a tensão de saída pode mudar em resposta a mudanças na entrada, afetando o desempenho em alta frequência.'),
('Analógica', 'Difícil', 'Qual é a importância do efeito Early em BJTs?', 'Faz com que a corrente de coletor seja ligeiramente dependente da tensão coletor-emissor', ARRAY['Aumenta a corrente de base', 'Reduz a eficiência do emissor', 'Afeta apenas transistores PNP'], 'O efeito Early, nomeado após James M. Early, descreve a variação na largura efetiva da base devido à tensão coletor-base aplicada, afetando a corrente de coletor em BJTs.'),
('Analógica', 'Difícil', 'Descreva o conceito de figura de ruído em circuitos analógicos.', 'Uma medida da degradação da relação sinal-ruído causada por componentes em uma cadeia de sinal', ARRAY['O ruído total gerado por um circuito', 'O ruído máximo que um circuito pode tolerar', 'A razão entre o ruído de entrada e o ruído de saída'], 'A figura de ruído é uma medida de quanto um dispositivo ou circuito degrada a relação sinal-ruído de um sinal que passa por ele, importante no projeto de RF esinal-ruído de um sinal que passa por ele, importante no projeto de RF e amplificadores de baixo ruído.'),
('Analógica', 'Difícil', 'Qual é o propósito de um trigger de Schmitt?', 'Converter um sinal de entrada analógico em um sinal de saída digital com histerese', ARRAY['Amplificar sinais pequenos', 'Gerar ondas senoidais', 'Medir corrente em um circuito'], 'Um trigger de Schmitt é um circuito comparador com histerese, usado para limpar sinais ruidosos e produzir uma saída digital clara a partir de uma entrada analógica.'),
('Analógica', 'Difícil', 'Explique o conceito de distorção de intermodulação em sistemas analógicos.', 'A produção de frequências indesejadas quando dois ou mais sinais interagem em um sistema não linear', ARRAY['A distorção causada por uma única frequência', 'A perda de força do sinal ao longo da distância', 'O deslocamento de fase entre entrada e saída'], 'A distorção de intermodulação ocorre em sistemas não lineares quando múltiplas frequências de entrada criam frequências de saída adicionais que são combinações matemáticas das frequências de entrada.'),

-- Questões de Eletrônica de Potência
-- Questões Fáceis de Eletrônica de Potência
('Potência', 'Fácil', 'Qual é a função principal de uma fonte de alimentação?', 'Converter uma forma de energia elétrica em outra', ARRAY['Gerar eletricidade', 'Armazenar energia', 'Medir o consumo de energia'], 'Fontes de alimentação convertem a energia disponível (por exemplo, eletricidade da rede) na forma apropriada requerida por um dispositivo ou sistema, frequentemente envolvendo conversão de tensão, corrente ou frequência.'),
('Potência', 'Fácil', 'O que faz um retificador?', 'Converte AC para DC', ARRAY['Converte DC para AC', 'Amplifica potência', 'Armazena energia'], 'Retificadores são componentes fundamentais em eletrônica de potência que convertem corrente alternada (AC) em corrente contínua (DC).'),
('Potência', 'Fácil', 'Qual é o propósito de um transformador?', 'Mudar níveis de tensão', ARRAY['Armazenar energia', 'Gerar eletricidade', 'Converter AC para DC'], 'Transformadores são usados para aumentar ou diminuir tensões AC em aplicações de energia elétrica e para casamento de impedância em aplicações de áudio.'),
('Potência', 'Fácil', 'Qual é a função de um fusível em um circuito elétrico?', 'Proteger contra sobrecorrente', ARRAY['Aumentar a corrente', 'Armazenar energia', 'Converter AC para DC'], 'Fusíveis são dispositivos de segurança que derretem e interrompem o circuito se a corrente exceder um nível seguro, protegendo o circuito e os dispositivos contra danos.'),
('Potência', 'Fácil', 'O que significa PWM em eletrônica de potência?', 'Modulação por Largura de Pulso', ARRAY['Gerenciamento de Potência em Watts', 'Modificação de Forma de Onda Potencial', 'Motor de Enrolamento Passivo'], 'PWM é uma técnica usada para controlar a quantidade de energia entregue a uma carga sem incorrer nas perdas que resultariam da entrega linear de energia.'),

-- Questões Médias de Eletrônica de Potência
('Potência', 'Médio', 'Qual é a função de um conversor buck?', 'Reduzir a tensão DC', ARRAY['Aumentar a tensão DC', 'Converter DC para AC', 'Armazenar energia'], 'Um conversor buck é um conversor de potência DC-DC que reduz a tensão (enquanto aumenta a corrente) de sua entrada para sua saída.'),
('Potência', 'Médio', 'Explique o conceito de fator de potência em sistemas AC.', 'A razão entre potência real e potência aparente', ARRAY['A potência total no sistema', 'A eficiência da transmissão de energia', 'A taxa de consumo de energia'], 'O fator de potência é uma medida de quão efetivamente a energia elétrica está sendo usada, com um fator de potência de 1 indicando o uso mais eficiente de energia.'),
('Potência', 'Médio', 'Qual é o propósito de um dissipador de calor em eletrônica de potência?', 'Dissipar calor de componentes eletrônicos', ARRAY['Gerar energia', 'Aumentar a tensão', 'Armazenar energia elétrica'], 'Dissipadores de calor são componentes passivos que melhoram a dissipação de calor de um dispositivo, transferindo energia térmica do dispositivo para o ar circundante.'),
('Potência', 'Médio', 'Qual é a função de um diodo de roda livre em um circuito com carga indutiva?', 'Proteger contra picos de tensão quando a carga indutiva é desligada', ARRAY['Aumentar a corrente no indutor', 'Armazenar energia', 'Converter AC para DC'], 'Diodos de roda livre, também conhecidos como diodos de recirculação, fornecem um caminho para a corrente do indutor quando a energia é removida, evitando picos de alta tensão que poderiam danificar componentes sensíveis.'),
('Potência', 'Médio', 'Qual é o propósito de um circuito snubber?', 'Suprimir picos de tensão e reduzir interferência eletromagnética', ARRAY['Aumentar a tensão', 'Armazenar energia', 'Converter DC para AC'], 'Circuitos snubber são usados para proteger componentes contra transientes de tensão e para moldar a forma de onda de comutação para reduzir a interferência eletromagnética.'),

-- Questões Difíceis de Eletrônica de Potência
('Potência', 'Difícil', 'Explique o conceito de comutação em tensão zero (ZVS) em conversores de potência.', 'Uma técnica onde o interruptor liga ou desliga quando a tensão através dele é zero', ARRAY['Um método para eliminar toda a tensão em um circuito', 'Uma maneira de aumentar a frequência de comutação indefinidamente', 'Uma técnica para converter AC para DC'], 'ZVS é uma técnica de comutação suave usada em conversores de potência para reduzir perdas de comutação e interferência eletromagnética, garantindo que o interruptor mude de estado quando a tensão através dele é zero.'),
('Potência', 'Difícil', 'Qual é a importância do fator de qualidade (Q) em conversores de potência ressonantes?', 'Determina o estresse de tensão de pico nos componentes e afeta a eficiência', ARRAY['Afeta apenas a potência de entrada', 'Não tem impacto no desempenho do conversor', 'Determina a potência máxima de saída'], 'O fator de qualidade em conversores ressonantes influencia o estresse de tensão nos componentes, a nitidez do pico ressonante e a eficiência geral do conversor.'),
('Potência', 'Difícil', 'Descreva o conceito de controle de modo de corrente em fontes de alimentação chaveadas.', 'Um método de controle onde o ciclo de trabalho do interruptor é determinado comparando a corrente do indutor com um sinal de controle', ARRAY['Um método para eliminar toda a ondulação de corrente', 'Uma técnica para converter AC para DC', 'Uma maneira de aumentar a tensão de entrada'], 'O controle de modo de corrente é uma técnica usada em fontes de alimentação chaveadas que fornece resposta transiente mais rápida e limitação de corrente inerente ao controlar diretamente a corrente do indutor.'),
('Potência', 'Difícil', 'Qual é o propósito de um conversor de ponte completa com deslocamento de fase?', 'Alcançar comutação em tensão zero e reduzir perdas de comutação em aplicações de alta potência', ARRAY['Aumentar a tensão de entrada', 'Converter DC para AC', 'Armazenar energia em componentes magnéticos'], 'Conversores de ponte completa com deslocamento de fase são usados em aplicações de alta potência para alcançar comutação em tensão zero, reduzindo perdas de comutação e interferência eletromagnética.'),
('Potência', 'Difícil', 'Explique o conceito de rastreamento do ponto de máxima potência (MPPT) em sistemas de energia solar.', 'Uma técnica para extrair a máxima potência disponível de módulos fotovoltaicos operando na tensão e corrente mais eficientes', ARRAY['Um método para aumentar a eficiência do painel solar', 'Uma maneira de armazenar energia solar excedente', 'Uma técnica para converter DC para AC em sistemas solares'], 'MPPT é crucial em sistemas fotovoltaicos para garantir que os painéis solares operem em seu ponto mais eficiente, que varia com as condições ambientais como temperatura e irradiância.');

-- Criar índice para consultas mais rápidas
CREATE INDEX idx_quiz_questions_subject_difficulty ON quiz_questions(subject, difficulty);

-- Configurar Segurança em Nível de Linha (RLS)
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Criar políticas
CREATE POLICY "Permitir acesso de leitura a todos os usuários"
ON quiz_questions FOR SELECT
USING (true);

-- Permitir apenas inserção, atualização e exclusão para usuários autenticados (você pode querer restringir isso ainda mais)
CREATE POLICY "Permitir inserção para usuários autenticados"
ON quiz_questions FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados"
ON quiz_questions FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados"
ON quiz_questions FOR DELETE
USING (auth.role() = 'authenticated');
