import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY =
  "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"

export async function POST(request: NextRequest) {
  try {
    const { textoRedacao } = await request.json()

    if (!textoRedacao || textoRedacao.trim().length === 0) {
      return NextResponse.json({ error: "Texto da redação é obrigatório" }, { status: 400 })
    }

    const prompt = `
    Você é um corretor oficial do ENEM. Avalie a redação abaixo conforme as 5 competências do ENEM.
    Para cada competência, dê nota de 0 a 200, com justificativa.
    Ao final, forneça a nota total (0 a 1000), pontos positivos, pontos a melhorar e uma sugestão de reescrita.

    Competências do ENEM:
    1. Demonstrar domínio da modalidade escrita formal da língua portuguesa
    2. Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento
    3. Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos
    4. Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação
    5. Elaborar proposta de intervenção para o problema abordado

    Texto da redação:
    ${textoRedacao}

    Responda APENAS em JSON válido com a seguinte estrutura:
    {
      "nota_total": 800,
      "competencias": {
        "1": {"nota": 160, "justificativa": "Boa demonstração do domínio da norma culta..."},
        "2": {"nota": 160, "justificativa": "Compreensão adequada da proposta..."},
        "3": {"nota": 160, "justificativa": "Argumentos bem organizados..."},
        "4": {"nota": 160, "justificativa": "Boa coesão e coerência..."},
        "5": {"nota": 160, "justificativa": "Proposta de intervenção presente..."}
      },
      "pontos_positivos": "Texto bem estruturado com argumentos consistentes...",
      "pontos_a_melhorar": "Poderia desenvolver melhor os argumentos...",
      "sugestao_de_reescrita": "Para melhorar o texto, sugiro..."
    }
    `

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    let avaliacao = data.choices[0].message.content

    // Remove \`\`\`json e \`\`\` da resposta se estiverem presentes
    avaliacao = avaliacao
      .replace(/```json\s*/g, "")
      .replace(/```\s*$/g, "")
      .trim()

    try {
      const avaliacaoObj = JSON.parse(avaliacao)
      return NextResponse.json({ avaliacao: avaliacaoObj })
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError)
      console.error("Resposta original:", avaliacao)
      // Retorna a resposta como texto se não conseguir fazer parse
      return NextResponse.json({ avaliacao: { error: "Erro no formato da resposta", raw: avaliacao } })
    }
  } catch (error) {
    console.error("Erro na correção:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
