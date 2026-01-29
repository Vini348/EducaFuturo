"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, AlertTriangle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import type { PASGrade, Course, PASResult } from "@/types/pas"
import { unbCourses, admissionSystems } from "@/data/unb-courses"

interface StepProps {
  currentStep: number
  totalSteps: number
}

function StepIndicator({ currentStep, totalSteps }: StepProps) {
  return (
    <div className="space-y-2 mb-6">
      <Progress value={(currentStep / totalSteps) * 100} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Passo {currentStep} de {totalSteps}
        </span>
      </div>
    </div>
  )
}

function CourseSearch({
  courses,
  selectedCourse,
  onSelectCourse,
  userScore,
}: {
  courses: Course[]
  selectedCourse: Course | null
  onSelectCourse: (course: Course) => void
  userScore: number | undefined
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedCourse ? selectedCourse.name : "Selecione um curso..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Procurar curso..." />
          <CommandList>
            <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[200px]">
                {courses.map((course) => (
                  <CommandItem
                    key={course.id}
                    onSelect={() => {
                      onSelectCourse(course)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedCourse?.id === course.id ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex flex-col">
                      <span>{course.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {course.schedule} - {course.campus}
                      </span>
                      {userScore !== undefined && course.cutoffScores?.universal && (
                        <span className="text-xs text-muted-foreground">
                          Nota de corte: {course.cutoffScores.universal.toFixed(3)} - Diferença:{" "}
                          {userScore - course.cutoffScores.universal >= 0 ? "+" : ""}
                          {(userScore - course.cutoffScores.universal).toFixed(3)}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function PASGradeCalculator() {
  const [step, setStep] = useState(1)
  const [isPublicSchool, setIsPublicSchool] = useState<boolean | null>(null)
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [additionalInfo, setAdditionalInfo] = useState({
    lowIncome: false,
    ppi: false,
    pcd: false,
  })
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courseSearch, setCourseSearch] = useState("")
  const [pasGrades, setPASGrades] = useState<PASGrade[]>([
    { exam: "", essay: "", language: { type: "english", grade: "" } },
    { exam: "", essay: "", language: { type: "english", grade: "" } },
    { exam: "", essay: "", language: { type: "english", grade: "" } },
  ])
  const [results, setResults] = useState<PASResult | null>(null)

  const calculatePASScore = (grades: PASGrade[]): PASResult => {
    const breakdown = {
      pas1:
        (Number.parseFloat(grades[0].exam) || 0) * 0.989 +
        (Number.parseFloat(grades[0].essay) || 0) * 0.01 +
        (Number.parseFloat(grades[0].language.grade) || 0) * 0.001,
      pas2:
        (Number.parseFloat(grades[1].exam) || 0) * 0.984 +
        (Number.parseFloat(grades[1].essay) || 0) * 0.015 +
        (Number.parseFloat(grades[1].language.grade) || 0) * 0.001,
      pas3:
        (Number.parseFloat(grades[2].exam) || 0) * 0.979 +
        (Number.parseFloat(grades[2].essay) || 0) * 0.02 +
        (Number.parseFloat(grades[2].language.grade) || 0) * 0.001,
    }

    const finalScore = (breakdown.pas1 + breakdown.pas2 + breakdown.pas3) / 3

    const eligibleCourses = unbCourses
      .map((course) => {
        const cutoff = course.cutoffScores?.universal || 0
        const difference = finalScore - cutoff
        return {
          course,
          status: difference >= 0 ? "within" : "outside",
          difference,
        }
      })
      .sort((a, b) => b.difference - a.difference)

    return {
      finalScore,
      breakdown,
      eligibleCourses,
    }
  }

  const handleNext = () => {
    if (step === 4) {
      const results = calculatePASScore(pasGrades)
      setResults(results)
    }
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const filteredCourses = results?.eligibleCourses.filter((result) =>
    result.course.name.toLowerCase().includes(courseSearch.toLowerCase()),
  )

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <StepIndicator currentStep={1} totalSteps={5} />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Você é de Escola Pública?</h2>
              <RadioGroup
                value={isPublicSchool === null ? undefined : isPublicSchool.toString()}
                onValueChange={(value) => setIsPublicSchool(value === "true")}
              >
                <div className="flex flex-col space-y-3">
                  <Label className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="true" id="public-yes" />
                    <span>Sim</span>
                  </Label>
                  <Label className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="false" id="public-no" />
                    <span>Não</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <StepIndicator currentStep={2} totalSteps={5} />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Selecione Seus Sistemas de Concorrência</h2>
              <div className="space-y-3">
                {admissionSystems
                  .filter((system) => !system.isPublicSchool || isPublicSchool)
                  .map((system) => (
                    <Label
                      key={system.id}
                      className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSystems.includes(system.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSystems([...selectedSystems, system.id])
                          } else {
                            setSelectedSystems(selectedSystems.filter((id) => id !== system.id))
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{system.name}</p>
                        {system.description && <p className="text-sm text-muted-foreground">{system.description}</p>}
                      </div>
                    </Label>
                  ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <StepIndicator currentStep={3} totalSteps={5} />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Escolha seu Curso</h2>
              <CourseSearch
                courses={unbCourses}
                selectedCourse={selectedCourse}
                onSelectCourse={setSelectedCourse}
                userScore={results?.finalScore}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <StepIndicator currentStep={4} totalSteps={5} />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Insira suas notas do PAS</h2>
              {[1, 2, 3].map((edition, index) => (
                <Card key={edition}>
                  <CardHeader>
                    <CardTitle>PAS {edition}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nota da Prova</Label>
                        <Input
                          type="number"
                          value={pasGrades[index].exam}
                          onChange={(e) => {
                            const newGrades = [...pasGrades]
                            newGrades[index] = {
                              ...newGrades[index],
                              exam: e.target.value,
                            }
                            setPASGrades(newGrades)
                          }}
                          step="0.01"
                          min="0"
                          max="1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nota da Redação</Label>
                        <Input
                          type="number"
                          value={pasGrades[index].essay}
                          onChange={(e) => {
                            const newGrades = [...pasGrades]
                            newGrades[index] = {
                              ...newGrades[index],
                              essay: e.target.value,
                            }
                            setPASGrades(newGrades)
                          }}
                          step="0.01"
                          min="0"
                          max="1000"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Idioma</Label>
                        <Select
                          value={pasGrades[index].language.type}
                          onValueChange={(value: "english" | "spanish" | "french") => {
                            const newGrades = [...pasGrades]
                            newGrades[index] = {
                              ...newGrades[index],
                              language: {
                                ...newGrades[index].language,
                                type: value,
                              },
                            }
                            setPASGrades(newGrades)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">Inglês</SelectItem>
                            <SelectItem value="spanish">Espanhol</SelectItem>
                            <SelectItem value="french">Francês</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Nota do Idioma</Label>
                        <Input
                          type="number"
                          value={pasGrades[index].language.grade}
                          onChange={(e) => {
                            const newGrades = [...pasGrades]
                            newGrades[index] = {
                              ...newGrades[index],
                              language: {
                                ...newGrades[index].language,
                                grade: e.target.value,
                              },
                            }
                            setPASGrades(newGrades)
                          }}
                          step="0.01"
                          min="0"
                          max="1000"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <StepIndicator currentStep={5} totalSteps={5} />
            {results && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Seu Argumento Final</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-center">{results.finalScore.toFixed(3)}</div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>PAS 1:</span>
                          <span>{results.breakdown.pas1.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PAS 2:</span>
                          <span>{results.breakdown.pas2.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PAS 3:</span>
                          <span>{results.breakdown.pas3.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedCourse && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Status do Curso Selecionado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{selectedCourse.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedCourse.campus} - {selectedCourse.schedule}
                            </p>
                          </div>
                          <div className="text-right">
                            {results.finalScore >= (selectedCourse.cutoffScores?.universal || 0) ? (
                              <Badge variant="success" className="mb-2">
                                Aprovado
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="mb-2">
                                Não Aprovado
                              </Badge>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Nota de Corte: {selectedCourse.cutoffScores?.universal.toFixed(3)}
                            </p>
                          </div>
                        </div>
                        {results.finalScore < (selectedCourse.cutoffScores?.universal || 0) && (
                          <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>
                              Faltam{" "}
                              {Math.abs(results.finalScore - (selectedCourse.cutoffScores?.universal || 0)).toFixed(3)}{" "}
                              pontos para aprovação
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Simulador de Aprovação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Buscar cursos..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {(filteredCourses || results.eligibleCourses).map((result) => (
                          <div
                            key={result.course.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <h3 className="font-medium">{result.course.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {result.course.campus} - {result.course.schedule}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={result.status === "within" ? "success" : "destructive"}>
                                {result.status === "within" ? "Dentro" : "Fora"} ({result.difference > 0 ? "+" : ""}
                                {result.difference.toFixed(3)})
                              </Badge>
                              {result.status === "outside" && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Nota necessária: {result.course.cutoffScores?.universal.toFixed(3)}
                                  <br />
                                  Faltando: {Math.abs(result.difference).toFixed(3)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Nota PAS</CardTitle>
      </CardHeader>
      <CardContent>
        {renderStep()}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && isPublicSchool === null) ||
              (step === 2 && selectedSystems.length === 0) ||
              (step === 3 && !selectedCourse) ||
              step === 5
            }
          >
            {step === 4 ? "Calcular" : "Continuar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
