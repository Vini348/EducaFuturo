"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface SelfAssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  challengeTitle: string
  onComplete: (assessment: SelfAssessmentData) => void
}

export interface SelfAssessmentData {
  understanding: number // 1-5
  difficulty: number // 1-5
  confidence: number // 1-5
  timeSpent: number // minutes
  notes?: string
  completedAt: string
}

const assessmentQuestions = [
  {
    key: "understanding" as keyof SelfAssessmentData,
    title: "Nível de Compreensão",
    description: "O quanto você compreendeu o conteúdo?",
    options: [
      { value: 1, label: "Não compreendi", icon: XCircle, color: "text-red-500" },
      { value: 2, label: "Compreendi pouco", icon: AlertCircle, color: "text-orange-500" },
      { value: 3, label: "Compreendi parcialmente", icon: AlertCircle, color: "text-yellow-500" },
      { value: 4, label: "Compreendi bem", icon: CheckCircle, color: "text-blue-500" },
      { value: 5, label: "Compreendi completamente", icon: CheckCircle, color: "text-green-500" },
    ],
  },
  {
    key: "difficulty" as keyof SelfAssessmentData,
    title: "Nível de Dificuldade",
    description: "Como você avalia a dificuldade do desafio?",
    options: [
      { value: 1, label: "Muito fácil", icon: Star, color: "text-green-500" },
      { value: 2, label: "Fácil", icon: Star, color: "text-blue-500" },
      { value: 3, label: "Moderado", icon: Star, color: "text-yellow-500" },
      { value: 4, label: "Difícil", icon: Star, color: "text-orange-500" },
      { value: 5, label: "Muito difícil", icon: Star, color: "text-red-500" },
    ],
  },
  {
    key: "confidence" as keyof SelfAssessmentData,
    title: "Nível de Confiança",
    description: "Quão confiante você se sente sobre o tema?",
    options: [
      { value: 1, label: "Nada confiante", icon: XCircle, color: "text-red-500" },
      { value: 2, label: "Pouco confiante", icon: AlertCircle, color: "text-orange-500" },
      { value: 3, label: "Moderadamente confiante", icon: AlertCircle, color: "text-yellow-500" },
      { value: 4, label: "Confiante", icon: CheckCircle, color: "text-blue-500" },
      { value: 5, label: "Muito confiante", icon: CheckCircle, color: "text-green-500" },
    ],
  },
]

export function SelfAssessmentModal({ isOpen, onClose, challengeTitle, onComplete }: SelfAssessmentModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [assessmentData, setAssessmentData] = useState<Partial<SelfAssessmentData>>({})
  const [timeSpent, setTimeSpent] = useState(15) // Default 15 minutes

  const currentQuestion = assessmentQuestions[currentStep]
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100

  const handleOptionSelect = (value: number) => {
    setAssessmentData((prev) => ({
      ...prev,
      [currentQuestion.key]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step - time estimation
      setCurrentStep(assessmentQuestions.length)
    }
  }

  const handleComplete = () => {
    const completeAssessment: SelfAssessmentData = {
      understanding: assessmentData.understanding || 3,
      difficulty: assessmentData.difficulty || 3,
      confidence: assessmentData.confidence || 3,
      timeSpent,
      completedAt: new Date().toISOString(),
    }

    onComplete(completeAssessment)
    onClose()

    // Reset for next use
    setCurrentStep(0)
    setAssessmentData({})
    setTimeSpent(15)
  }

  const canProceed = () => {
    if (currentStep < assessmentQuestions.length) {
      return assessmentData[currentQuestion.key] !== undefined
    }
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Autoavaliação: {challengeTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Steps */}
          {currentStep < assessmentQuestions.length && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">{currentQuestion.title}</h3>
                  <p className="text-gray-600 text-sm">{currentQuestion.description}</p>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const Icon = option.icon
                    const isSelected = assessmentData[currentQuestion.key] === option.value

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? "text-blue-500" : option.color}`} />
                        <span className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Time Estimation Step */}
          {currentStep === assessmentQuestions.length && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">Tempo Dedicado</h3>
                  <p className="text-gray-600 text-sm">Quanto tempo você dedicou a este desafio?</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => setTimeSpent(Math.max(5, timeSpent - 5))}>
                      -5min
                    </Button>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timeSpent}</div>
                      <div className="text-sm text-gray-500">minutos</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setTimeSpent(timeSpent + 5)}>
                      +5min
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 30, 60].map((time) => (
                      <Button
                        key={time}
                        variant={timeSpent === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeSpent(time)}
                      >
                        {time}min
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            {currentStep < assessmentQuestions.length ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
                Próximo
              </Button>
            ) : (
              <Button onClick={handleComplete} className="flex-1">
                Concluir Avaliação
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
