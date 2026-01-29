"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Save, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { exportGradesToPDF } from "@/utils/pdf-export"

interface Subject {
  id: string
  name: string
  finalAverage: number
  grades: (number | null)[]
  notes?: string
}

interface GradeCalculation {
  average: number
  needed: string
  excess: string
  status: "passing" | "failing" | "warning"
}

export function SchoolGradeCalculator() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("school-grades", [
    { id: "1", name: "Matemática", finalAverage: 6, grades: [null, null, null, null] },
    { id: "2", name: "Português", finalAverage: 6, grades: [null, null, null, null] },
  ])
  const [error, setError] = useState<string | null>(null)

  const validateGrade = (value: string): number | null => {
    if (value === "") return null
    const grade = Number(value)
    if (isNaN(grade)) return null
    if (grade < 0) return 0
    if (grade > 10) return 10
    return grade
  }

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        finalAverage: 6,
        grades: [null, null, null, null],
      },
    ])
  }

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id))
  }

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id
          ? { ...subject, [field]: field === "finalAverage" ? (validateGrade(value) ?? 6) : value }
          : subject,
      ),
    )
  }

  const updateGrade = (subjectId: string, gradeIndex: number, value: string) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              grades: subject.grades.map((grade, index) => (index === gradeIndex ? validateGrade(value) : grade)),
            }
          : subject,
      ),
    )
  }

  const calculateGrades = (subject: Subject): GradeCalculation => {
    const validGrades = subject.grades.filter((grade): grade is number => grade !== null)

    // Se não houver notas, retorna estado inicial
    if (validGrades.length === 0) {
      return {
        average: 0,
        needed: "0.00",
        excess: "0.00",
        status: "failing",
      }
    }

    // Calcula a média atual das notas inseridas
    const currentAverage = validGrades.reduce((acc, grade) => acc + grade, 0) / validGrades.length
    const remainingGrades = 4 - validGrades.length

    // Se todas as 4 notas estão preenchidas
    if (remainingGrades === 0) {
      const finalAverage = validGrades.reduce((acc, grade) => acc + grade, 0) / 4

      if (finalAverage >= subject.finalAverage) {
        return {
          average: finalAverage,
          needed: "0.00",
          excess: (finalAverage - subject.finalAverage).toFixed(2),
          status: "passing",
        }
      } else {
        return {
          average: finalAverage,
          needed: "Reprovado",
          excess: "0.00",
          status: "failing",
        }
      }
    }

    // Se tem pelo menos 3 notas (pode calcular o que precisa no último bimestre)
    if (validGrades.length >= 3) {
      const currentTotal = validGrades.reduce((acc, grade) => acc + grade, 0)
      const totalNeededForApproval = subject.finalAverage * 4
      const neededInLastGrade = totalNeededForApproval - currentTotal

      // Se já passou (mesmo tirando 0 no último bimestre)
      if (neededInLastGrade <= 0) {
        return {
          average: currentAverage,
          needed: "Aprovado",
          excess: Math.abs(neededInLastGrade / 4).toFixed(2),
          status: "passing",
        }
      }

      // Se precisa de uma nota impossível (maior que 10)
      if (neededInLastGrade > 10) {
        return {
          average: currentAverage,
          needed: "Impossível",
          excess: "0.00",
          status: "failing",
        }
      }

      // Mostra quanto precisa tirar no último bimestre
      return {
        average: currentAverage,
        needed: neededInLastGrade.toFixed(1),
        excess: "0.00",
        status: neededInLastGrade <= 6 ? "passing" : neededInLastGrade <= 8 ? "warning" : "failing",
      }
    }

    // Se tem menos de 3 notas, calcula a média necessária para os bimestres restantes
    const currentTotal = validGrades.reduce((acc, grade) => acc + grade, 0)
    const totalNeededForApproval = subject.finalAverage * 4
    const neededTotal = totalNeededForApproval - currentTotal
    const averageNeededPerRemaining = neededTotal / remainingGrades

    return {
      average: currentAverage,
      needed: averageNeededPerRemaining <= 10 ? averageNeededPerRemaining.toFixed(1) : "10.0+",
      excess: "0.00",
      status: averageNeededPerRemaining <= 6 ? "passing" : averageNeededPerRemaining <= 8 ? "warning" : "failing",
    }
  }

  const getStatusColor = (status: GradeCalculation["status"]) => {
    switch (status) {
      case "passing":
        return "border-l-4 border-green-500"
      case "warning":
        return "border-l-4 border-yellow-500"
      case "failing":
        return "border-l-4 border-red-500"
      default:
        return "border-l-4 border-gray-500"
    }
  }

  const handleExport = (format: "pdf" | "json") => {
    try {
      if (format === "pdf") {
        exportGradesToPDF(subjects)
      } else {
        const dataStr = JSON.stringify(subjects)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
        const exportFileDefaultName = "notas.json"

        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileDefaultName)
        linkElement.click()
      }
    } catch (err) {
      setError("Erro ao exportar notas")
    }
  }

  const importGrades = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const imported = JSON.parse(content)
          if (Array.isArray(imported)) {
            setSubjects(imported)
          }
        } catch {
          setError("Arquivo inválido")
        }
      }
      reader.readAsText(file)
    } catch (err) {
      setError("Erro ao importar notas")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button onClick={() => handleExport("pdf")}>
            <Save className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("json")}>
            <Save className="h-4 w-4 mr-2" />
            Exportar JSON
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button variant="outline" className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importGrades}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Notas
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Selecione um arquivo .json exportado anteriormente</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Matéria</TableHead>
              <TableHead>1º Bim</TableHead>
              <TableHead>2º Bim</TableHead>
              <TableHead>3º Bim</TableHead>
              <TableHead>4º Bim</TableHead>
              <TableHead>Média</TableHead>
              <TableHead>Média Final</TableHead>
              <TableHead>Nota Necessária</TableHead>
              <TableHead>Excedente</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {subjects.map((subject) => {
                const calculation = calculateGrades(subject)
                const isApproved = calculation.status === "passing" || calculation.needed === "Aprovado"
                return (
                  <motion.tr
                    key={subject.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`relative ${getStatusColor(calculation.status)}`}
                  >
                    <TableCell>
                      <Input
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                        placeholder="Nome da matéria"
                        className="w-full"
                      />
                    </TableCell>
                    {subject.grades.map((grade, index) => (
                      <TableCell key={index}>
                        <Input
                          type="number"
                          value={grade !== null ? grade : ""}
                          onChange={(e) => updateGrade(subject.id, index, e.target.value)}
                          placeholder="--"
                          className="w-20"
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Badge variant="secondary">{calculation.average.toFixed(2)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={subject.finalAverage}
                        onChange={(e) => updateSubject(subject.id, "finalAverage", e.target.value)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant={isApproved ? "success" : "destructive"} className="min-w-[60px]">
                              {isApproved ? <CheckCircle2 className="h-4 w-4" /> : calculation.needed}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isApproved ? "Aprovado!" : `Nota necessária para atingir a média ${subject.finalAverage}`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {calculation.excess !== "0.00" && (
                        <Badge variant="success" className="min-w-[60px]">
                          +{calculation.excess}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeSubject(subject.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <Button onClick={addSubject} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Matéria
      </Button>
    </div>
  )
}
