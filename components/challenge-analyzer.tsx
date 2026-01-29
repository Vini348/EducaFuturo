"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, TrendingUp } from "lucide-react"

interface ChallengeAnalysisProps {
  challengeId: string
  correctAnswers: number
  totalQuestions: number
  difficulty: "fácil" | "médio" | "difícil"
  timeSpent: number
}

export function ChallengeAnalyzer({
  challengeId,
  correctAnswers,
  totalQuestions,
  difficulty,
  timeSpent,
}: ChallengeAnalysisProps) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const accuracy = (correctAnswers / totalQuestions) * 100

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId,
          correctAnswers,
          totalQuestions,
          timeSpent,
          difficulty,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao analisar desafio")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Análise do Desafio
        </CardTitle>
        <CardDescription>Veja como você se saiu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Precisão</p>
            <p className="text-xl font-bold">{accuracy.toFixed(0)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Respostas Corretas</p>
            <p className="text-xl font-bold">
              {correctAnswers}/{totalQuestions}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tempo Gasto</p>
            <p className="text-xl font-bold">{Math.round(timeSpent / 60)}min</p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold">{accuracy.toFixed(1)}%</span>
          </div>
          <Progress value={accuracy} className="h-2" />
        </div>

        {/* Feedback */}
        {analysis && (
          <Alert className={accuracy >= 70 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={accuracy >= 70 ? "text-green-800" : "text-yellow-800"}>
              {analysis.feedback}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!analysis && (
          <Button onClick={handleAnalyze} disabled={loading} className="w-full">
            {loading ? "Analisando..." : "Analisar Desafio"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
