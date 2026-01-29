import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { challengeId, correctAnswers, totalQuestions, timeSpent, difficulty } = await request.json()

    if (!challengeId || correctAnswers === undefined || !totalQuestions || !difficulty) {
      return NextResponse.json({ error: "Dados de entrada inválidos" }, { status: 400 })
    }

    const accuracy = (correctAnswers / totalQuestions) * 100
    const timeBonus = timeSpent < 300 ? 10 : 0 // 5 minutos = bônus de tempo

    // Calcular pontos
    const basePoints = correctAnswers * 10
    const accuracyBonus = correctAnswers === totalQuestions ? 50 : 0
    const totalPoints = basePoints + accuracyBonus + timeBonus

    const { data: analysisData, error: analysisError } = await supabase
      .from("user_quiz_attempts")
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        accuracy,
        time_spent: timeSpent,
        points_earned: totalPoints,
        difficulty,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (analysisError) {
      return NextResponse.json({ error: "Erro ao salvar análise: " + analysisError.message }, { status: 500 })
    }

    const { data: profileData } = await supabase.from("profiles").select("total_points").eq("id", user.id).single()

    const newTotalPoints = (profileData?.total_points || 0) + totalPoints

    await supabase.from("profiles").update({ total_points: newTotalPoints }).eq("id", user.id)

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysisData,
        feedback: generateFeedback(accuracy, difficulty),
      },
      totalPoints: newTotalPoints,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

function generateFeedback(accuracy: number, difficulty: string): string {
  if (accuracy === 100) {
    return "Perfeito! Você dominou completamente este desafio! 🌟"
  } else if (accuracy >= 80) {
    return "Excelente desempenho! Continue assim! 🎉"
  } else if (accuracy >= 60) {
    return "Bom trabalho! Revise os tópicos que teve dificuldade. 💪"
  } else if (accuracy >= 40) {
    return "Você está no caminho certo. Pratique mais para melhorar! 📚"
  } else {
    return "Não desista! Revise os conceitos e tente novamente. 🔄"
  }
}
