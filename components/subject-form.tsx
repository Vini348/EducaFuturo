"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { SubjectSchedule } from "@/types/schedule"

interface SubjectFormProps {
  onSave: (subject: Omit<SubjectSchedule, "id">) => void
}

export function SubjectForm({ onSave }: SubjectFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#4F46E5")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
      color,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Matéria</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição/Observações</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="O que você planeja estudar nesta matéria?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor (para identificação)</Label>
        <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10" />
      </div>

      <Button type="submit" className="w-full">
        Adicionar Matéria
      </Button>
    </form>
  )
}
