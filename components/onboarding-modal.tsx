"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/authContext"
import { GraduationCap, Home, Target, BookOpen, ChevronRight, ChevronLeft, X } from "lucide-react"

interface OnboardingModalProps {
  open: boolean
  onComplete: () => void
  onClose?: () => void
}

export default function OnboardingModal({ open, onComplete, onClose }: OnboardingModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Dados do formulário
  const [formData, setFormData] = useState({
    schoolId: "",
    gradeLevel: "",
    course: "",
    studyLocation: "",
    learningStyle: "",
    studyGoals: [] as string[],
  })

  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([])

  // Carregar escolas ao abrir
  useEffect(() => {
    if (open) {
      loadSchools()
    }
  }, [open])

  const loadSchools = async () => {
    const { data } = await supabase.from("schools").select("id, name").order("name")

    if (data) setSchools(data)
  }

  const handleSubmit = async () => {
    if (!user) {
      alert("Você precisa estar autenticado para completar o onboarding.")
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Iniciando salvamento do onboarding para user:", user.id)

      // Fazer UPSERT direto na tabela profiles
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            school_id: formData.schoolId,
            grade_level: formData.gradeLevel,
            course: formData.course,
            study_location: formData.studyLocation,
            learning_style: formData.learningStyle,
            study_goals: formData.studyGoals,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          },
        )
        .select()
        .single()

      if (error) {
        console.error("[v0] Erro ao salvar onboarding:", error)
        throw error
      }

      console.log("[v0] Onboarding salvo com sucesso:", data)

      // Marcar como completo no sessionStorage
      sessionStorage.setItem("onboarding_completed", "true")

      onComplete()
    } catch (error: any) {
      console.error("[v0] Erro ao salvar onboarding:", error)
      alert(`Erro ao salvar suas informações: ${error.message || "Por favor, tente novamente."}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      studyGoals: prev.studyGoals.includes(goal)
        ? prev.studyGoals.filter((g) => g !== goal)
        : [...prev.studyGoals, goal],
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.schoolId && formData.gradeLevel
      case 2:
        return formData.course && formData.studyLocation
      case 3:
        return formData.learningStyle && formData.studyGoals.length > 0
      default:
        return false
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </button>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Bem-vindo ao EducaFuturo! 🎓</DialogTitle>
          <p className="text-center text-muted-foreground">Vamos personalizar sua experiência de aprendizado</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Indicador de progresso */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Escola e Série */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary mb-4">
                <GraduationCap className="h-5 w-5" />
                <h3 className="font-semibold">Informações Acadêmicas</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">Sua Escola</Label>
                <select
                  id="school"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData.schoolId}
                  onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                >
                  <option value="">Selecione sua escola</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Série/Ano</Label>
                <RadioGroup
                  value={formData.gradeLevel}
                  onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1ano" id="1ano" />
                    <Label htmlFor="1ano" className="font-normal cursor-pointer">
                      1º Ano
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2ano" id="2ano" />
                    <Label htmlFor="2ano" className="font-normal cursor-pointer">
                      2º Ano
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3ano" id="3ano" />
                    <Label htmlFor="3ano" className="font-normal cursor-pointer">
                      3º Ano
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cursinho" id="cursinho" />
                    <Label htmlFor="cursinho" className="font-normal cursor-pointer">
                      Cursinho
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 2: Curso e Local de Estudo */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Target className="h-5 w-5" />
                <h3 className="font-semibold">Seus Objetivos</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Curso Pretendido</Label>
                <Input
                  id="course"
                  placeholder="Ex: Medicina, Engenharia, Direito..."
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Local de Estudo Preferido</Label>
                <RadioGroup
                  value={formData.studyLocation}
                  onValueChange={(value) => setFormData({ ...formData, studyLocation: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casa" id="casa" />
                    <Label htmlFor="casa" className="font-normal cursor-pointer">
                      <Home className="inline h-4 w-4 mr-1" />
                      Em casa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="biblioteca" id="biblioteca" />
                    <Label htmlFor="biblioteca" className="font-normal cursor-pointer">
                      <BookOpen className="inline h-4 w-4 mr-1" />
                      Biblioteca
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="escola" id="escola" />
                    <Label htmlFor="escola" className="font-normal cursor-pointer">
                      <GraduationCap className="inline h-4 w-4 mr-1" />
                      Na escola
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="qualquer" id="qualquer" />
                    <Label htmlFor="qualquer" className="font-normal cursor-pointer">
                      Qualquer lugar
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 3: Estilo de Aprendizagem e Objetivos */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary mb-4">
                <BookOpen className="h-5 w-5" />
                <h3 className="font-semibold">Preferências de Aprendizado</h3>
              </div>

              <div className="space-y-2">
                <Label>Como você aprende melhor?</Label>
                <RadioGroup
                  value={formData.learningStyle}
                  onValueChange={(value) => setFormData({ ...formData, learningStyle: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visual" id="visual" />
                    <Label htmlFor="visual" className="font-normal cursor-pointer">
                      Visual (vídeos, diagramas, imagens)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auditivo" id="auditivo" />
                    <Label htmlFor="auditivo" className="font-normal cursor-pointer">
                      Auditivo (áudios, explicações faladas)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="leitura" id="leitura" />
                    <Label htmlFor="leitura" className="font-normal cursor-pointer">
                      Leitura/Escrita (textos, resumos)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pratico" id="pratico" />
                    <Label htmlFor="pratico" className="font-normal cursor-pointer">
                      Prático (exercícios, simulados)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Seus Objetivos de Estudo (selecione todos que se aplicam)</Label>
                <div className="space-y-2">
                  {[
                    "Passar no ENEM",
                    "Passar no PAS",
                    "Melhorar notas escolares",
                    "Aprender novos conteúdos",
                    "Revisar matérias",
                    "Preparar para vestibulares específicos",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.studyGoals.includes(goal)}
                        onCheckedChange={() => toggleGoal(goal)}
                      />
                      <Label htmlFor={goal} className="font-normal cursor-pointer">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || loading}>
                {loading ? "Salvando..." : "Começar!"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
