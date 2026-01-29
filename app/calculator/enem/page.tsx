"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ENEMCalculatorPage() {
  const [natureza, setNatureza] = useState(0)
  const [humanas, setHumanas] = useState(0)
  const [linguagens, setLinguagens] = useState(0)
  const [matematica, setMatematica] = useState(0)
  const [redacao, setRedacao] = useState(0)
  const [media, setMedia] = useState(0)

  const calcularMedia = () => {
    const soma = natureza + humanas + linguagens + matematica + redacao
    setMedia(soma / 5)
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h1 className="text-2xl font-bold">Calculadora de Nota ENEM</h1>

        <div className="space-y-3">
          <div>
            <Label htmlFor="natureza">Ciências da Natureza</Label>
            <Input
              id="natureza"
              type="number"
              value={natureza || ""}
              onChange={(e) => setNatureza(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="humanas">Ciências Humanas</Label>
            <Input
              id="humanas"
              type="number"
              value={humanas || ""}
              onChange={(e) => setHumanas(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="linguagens">Linguagens e Códigos</Label>
            <Input
              id="linguagens"
              type="number"
              value={linguagens || ""}
              onChange={(e) => setLinguagens(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="matematica">Matemática</Label>
            <Input
              id="matematica"
              type="number"
              value={matematica || ""}
              onChange={(e) => setMatematica(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="redacao">Redação</Label>
            <Input
              id="redacao"
              type="number"
              value={redacao || ""}
              onChange={(e) => setRedacao(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <Button onClick={calcularMedia} className="w-full">
            Calcular
          </Button>

          <div className="pt-2">
            <p className="text-lg font-semibold">Média ENEM: {media.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
