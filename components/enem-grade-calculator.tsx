"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ENEMGradeCalculator() {
  const [grades, setGrades] = useState({
    naturalSciences: 0,
    humanSciences: 0,
    languages: 0,
    math: 0,
    essay: 0,
  })

  const updateGrade = (subject: keyof typeof grades, value: string) => {
    setGrades({ ...grades, [subject]: Number(value) })
  }

  const calculateAverage = () => {
    const { naturalSciences, humanSciences, languages, math, essay } = grades
    return ((naturalSciences + humanSciences + languages + math + essay) / 5).toFixed(2)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Calculadora de Nota ENEM</h3>
      <div className="space-y-2">
        <Label htmlFor="naturalSciences">Ciências da Natureza</Label>
        <Input
          id="naturalSciences"
          type="number"
          value={grades.naturalSciences}
          onChange={(e) => updateGrade("naturalSciences", e.target.value)}
          min={0}
          max={1000}
          step={0.01}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="humanSciences">Ciências Humanas</Label>
        <Input
          id="humanSciences"
          type="number"
          value={grades.humanSciences}
          onChange={(e) => updateGrade("humanSciences", e.target.value)}
          min={0}
          max={1000}
          step={0.01}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="languages">Linguagens e Códigos</Label>
        <Input
          id="languages"
          type="number"
          value={grades.languages}
          onChange={(e) => updateGrade("languages", e.target.value)}
          min={0}
          max={1000}
          step={0.01}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="math">Matemática</Label>
        <Input
          id="math"
          type="number"
          value={grades.math}
          onChange={(e) => updateGrade("math", e.target.value)}
          min={0}
          max={1000}
          step={0.01}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="essay">Redação</Label>
        <Input
          id="essay"
          type="number"
          value={grades.essay}
          onChange={(e) => updateGrade("essay", e.target.value)}
          min={0}
          max={1000}
          step={0.01}
        />
      </div>
      <div className="pt-4">
        <p className="text-lg font-semibold">Média ENEM: {calculateAverage()}</p>
      </div>
    </div>
  )
}
