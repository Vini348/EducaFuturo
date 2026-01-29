import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import type { DetailedPerformance } from "@/types/performance"

interface PerformanceReportProps {
  data: DetailedPerformance
}

export function PerformanceReport({ data }: PerformanceReportProps) {
  // Calculate overall quiz performance
  const quizPerformance = (data.quizzes.correctAnswers / data.quizzes.totalAttempted) * 100 || 0

  // Prepare skill data for radar chart
  const skillData = Object.entries(data.skillLevels).map(([skill, details]) => ({
    skill,
    level: details.level,
    progress: details.progress,
  }))

  // Prepare study time data
  const studyTimeData = Object.entries(data.studyTime.byActivity).map(([activity, time]) => ({
    activity,
    hours: time / 3600, // Convert seconds to hours
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Desempenho em Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Taxa de Acertos</span>
                <span>{quizPerformance.toFixed(1)}%</span>
              </div>
              <Progress value={quizPerformance} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total de Tentativas</p>
                <p className="text-2xl font-bold">{data.quizzes.totalAttempted}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tempo Médio por Questão</p>
                <p className="text-2xl font-bold">{data.quizzes.timePerQuestion.toFixed(1)}s</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Níveis de Habilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar name="Nível" dataKey="level" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tempo de Estudo por Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulações Práticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Taxa de Sucesso</span>
                <span>{(data.simulations.successRate * 100).toFixed(1)}%</span>
              </div>
              <Progress value={data.simulations.successRate * 100} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Completado</p>
                <p className="text-2xl font-bold">{data.simulations.totalCompleted}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">{Math.floor(data.simulations.averageTime / 60)}min</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
