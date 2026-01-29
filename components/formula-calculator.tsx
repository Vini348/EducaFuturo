"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formulas } from "@/data/calculator"

export function FormulaCalculator() {
  const [selectedFormula, setSelectedFormula] = useState<string>("")
  const [values, setValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string>("")

  const calculateResult = () => {
    const formula = formulas.find((f) => f.id === selectedFormula)
    if (!formula) return

    const filledValues = Object.entries(values).filter(([_, value]) => value !== "")
    const emptyValues = Object.entries(values).filter(([_, value]) => value === "")

    if (filledValues.length < formula.variables.length - 1) {
      setResult("Preencha pelo menos " + (formula.variables.length - 1) + " valores")
      return
    }

    switch (formula.id) {
      case "clock-frequency": {
        const t = Number.parseFloat(values["Período (T)"] || "")
        const f = Number.parseFloat(values["Frequência (f)"] || "")

        if (t) setResult(`f = ${(1 / t).toFixed(2)} Hz`)
        else if (f) setResult(`T = ${(1 / f).toFixed(2)} s`)
        break
      }

      case "voltage-divider-logic":
      case "voltage-divider": {
        const vout = Number.parseFloat(values["Tensão de Saída (Vout)"] || "")
        const vin = Number.parseFloat(values["Tensão de Entrada (Vin)"] || "")
        const r1 = Number.parseFloat(values["Resistência 1 (R1)"] || "")
        const r2 = Number.parseFloat(values["Resistência 2 (R2)"] || "")

        if (emptyValues.length !== 1) {
          setResult("Preencha exatamente três valores para calcular o quarto")
          return
        }

        const emptyField = emptyValues[0][0]

        if (emptyField === "Tensão de Saída (Vout)" && vin && r1 && r2) {
          const result = vin * (r2 / (r1 + r2))
          setResult(`Vout = ${result.toFixed(2)} V`)
        } else if (emptyField === "Tensão de Entrada (Vin)" && vout && r1 && r2) {
          const result = (vout * (r1 + r2)) / r2
          setResult(`Vin = ${result.toFixed(2)} V`)
        } else if (emptyField === "Resistência 1 (R1)" && vout && vin && r2) {
          const result = (r2 * (vin - vout)) / vout
          setResult(`R1 = ${result.toFixed(2)} Ω`)
        } else if (emptyField === "Resistência 2 (R2)" && vout && vin && r1) {
          const result = (r1 * vout) / (vin - vout)
          setResult(`R2 = ${result.toFixed(2)} Ω`)
        }
        break
      }

      case "ohms-law": {
        const v = Number.parseFloat(values["Tensão (V)"] || "")
        const i = Number.parseFloat(values["Corrente (I)"] || "")
        const r = Number.parseFloat(values["Resistência (R)"] || "")

        if (v && i) setResult(`R = ${(v / i).toFixed(2)} Ω`)
        else if (v && r) setResult(`I = ${(v / r).toFixed(2)} A`)
        else if (i && r) setResult(`V = ${(i * r).toFixed(2)} V`)
        break
      }

      case "op-amp-gain": {
        const g = Number.parseFloat(values["Ganho (G)"] || "")
        const rf = Number.parseFloat(values["Resistência de Realimentação (Rf)"] || "")
        const r1 = Number.parseFloat(values["Resistência de Entrada (R1)"] || "")

        if (g && r1) setResult(`Rf = ${(r1 * (g - 1)).toFixed(2)} Ω`)
        else if (g && rf) setResult(`R1 = ${(rf / (g - 1)).toFixed(2)} Ω`)
        else if (rf && r1) setResult(`G = ${(1 + rf / r1).toFixed(2)}`)
        break
      }

      case "capacitive-reactance": {
        const xc = Number.parseFloat(values["Reatância Capacitiva (Xc)"] || "")
        const f = Number.parseFloat(values["Frequência (f)"] || "")
        const c = Number.parseFloat(values["Capacitância (C)"] || "")

        if (f && c) setResult(`Xc = ${(1 / (2 * Math.PI * f * c)).toFixed(2)} Ω`)
        else if (xc && c) setResult(`f = ${(1 / (2 * Math.PI * xc * c)).toFixed(2)} Hz`)
        else if (xc && f) setResult(`C = ${(1 / (2 * Math.PI * f * xc)).toFixed(2)} F`)
        break
      }

      case "electric-power": {
        const p = Number.parseFloat(values["Potência (P)"] || "")
        const v = Number.parseFloat(values["Tensão (V)"] || "")
        const i = Number.parseFloat(values["Corrente (I)"] || "")
        const cos = Number.parseFloat(values["Fator de Potência (cos φ)"] || "")

        if (v && i && cos) setResult(`P = ${(v * i * cos).toFixed(2)} W`)
        else if (p && i && cos) setResult(`V = ${(p / (i * cos)).toFixed(2)} V`)
        else if (p && v && cos) setResult(`I = ${(p / (v * cos)).toFixed(2)} A`)
        else if (p && v && i) setResult(`cos φ = ${(p / (v * i)).toFixed(2)}`)
        break
      }

      case "buck-converter": {
        const vout = Number.parseFloat(values["Tensão de Saída (Vout)"] || "")
        const vin = Number.parseFloat(values["Tensão de Entrada (Vin)"] || "")
        const d = Number.parseFloat(values["Ciclo de Trabalho (D)"] || "")

        if (vin && d) setResult(`Vout = ${(d * vin).toFixed(2)} V`)
        else if (vout && vin) setResult(`D = ${(vout / vin).toFixed(2)}`)
        else if (vout && d) setResult(`Vin = ${(vout / d).toFixed(2)} V`)
        break
      }

      case "converter-efficiency": {
        const n = Number.parseFloat(values["Eficiência (η)"] || "")
        const pout = Number.parseFloat(values["Potência de Saída (Pout)"] || "")
        const pin = Number.parseFloat(values["Potência de Entrada (Pin)"] || "")

        if (pout && pin) setResult(`η = ${((pout / pin) * 100).toFixed(2)}%`)
        else if (n && pin) setResult(`Pout = ${((n / 100) * pin).toFixed(2)} W`)
        else if (n && pout) setResult(`Pin = ${((100 * pout) / n).toFixed(2)} W`)
        break
      }

      case "inductive-reactance": {
        const xl = Number.parseFloat(values["Reatância Indutiva (XL)"] || "")
        const f = Number.parseFloat(values["Frequência (f)"] || "")
        const l = Number.parseFloat(values["Indutância (L)"] || "")

        if (f && l) setResult(`XL = ${(2 * Math.PI * f * l).toFixed(2)} Ω`)
        else if (xl && l) setResult(`f = ${(xl / (2 * Math.PI * l)).toFixed(2)} Hz`)
        else if (xl && f) setResult(`L = ${(xl / (2 * Math.PI * f)).toFixed(2)} H`)
        break
      }
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Select
            onValueChange={(value) => {
              setSelectedFormula(value)
              setValues({})
              setResult("")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma fórmula" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital-header" disabled>
                Eletrônica Digital
              </SelectItem>
              {formulas.slice(0, 2).map((formula) => (
                <SelectItem key={formula.id} value={formula.id}>
                  {formula.name}
                </SelectItem>
              ))}
              <SelectItem value="analog-header" disabled>
                Eletrônica Analógica
              </SelectItem>
              {formulas.slice(2, 6).map((formula) => (
                <SelectItem key={formula.id} value={formula.id}>
                  {formula.name}
                </SelectItem>
              ))}
              <SelectItem value="power-header" disabled>
                Eletrônica de Potência
              </SelectItem>
              {formulas.slice(6).map((formula) => (
                <SelectItem key={formula.id} value={formula.id}>
                  {formula.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedFormula && (
          <>
            <div className="grid gap-4">
              {formulas
                .find((f) => f.id === selectedFormula)
                ?.variables.map((variable) => (
                  <div key={variable.name}>
                    <Label>{variable.name}</Label>
                    <Input
                      type="number"
                      placeholder={`Digite o valor em ${variable.unit}`}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [variable.name]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
            </div>

            <Button onClick={calculateResult} className="w-full">
              Calcular
            </Button>

            {result && <div className="mt-4 p-4 bg-muted rounded-lg text-center">{result}</div>}
          </>
        )}
      </div>
    </Card>
  )
}
