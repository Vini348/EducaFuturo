"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Delete, Divide, Minus, Plus, X } from "lucide-react"

export function StandardCalculator() {
  const [display, setDisplay] = useState("0")
  const [operation, setOperation] = useState<string | null>(null)
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const handleOperation = (op: string) => {
    const current = Number.parseFloat(display)
    if (previousValue === null) {
      setPreviousValue(current)
    } else if (operation) {
      const result = calculate(previousValue, current, operation)
      setPreviousValue(result)
      setDisplay(String(result))
    }
    setOperation(op)
    setNewNumber(true)
  }

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b
      case "-":
        return a - b
      case "×":
        return a * b
      case "÷":
        return a / b
      default:
        return b
    }
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = Number.parseFloat(display)
      const result = calculate(previousValue, current, operation)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setOperation(null)
    setPreviousValue(null)
    setNewNumber(true)
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
    }
  }

  const handlePlusMinus = () => {
    setDisplay(String(-Number.parseFloat(display)))
  }

  const handlePercent = () => {
    setDisplay(String(Number.parseFloat(display) / 100))
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <input
          type="text"
          value={display}
          readOnly
          className="w-full text-right text-2xl p-2 bg-background border rounded-md"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" onClick={handleClear}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={handleBackspace}>
          <Delete className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={handlePlusMinus}>
          +/-
        </Button>
        <Button variant="outline" onClick={() => handleOperation("÷")}>
          <Divide className="h-4 w-4" />
        </Button>

        <Button variant="outline" onClick={() => handleNumber("7")}>
          7
        </Button>
        <Button variant="outline" onClick={() => handleNumber("8")}>
          8
        </Button>
        <Button variant="outline" onClick={() => handleNumber("9")}>
          9
        </Button>
        <Button variant="outline" onClick={() => handleOperation("×")}>
          <X className="h-4 w-4" />
        </Button>

        <Button variant="outline" onClick={() => handleNumber("4")}>
          4
        </Button>
        <Button variant="outline" onClick={() => handleNumber("5")}>
          5
        </Button>
        <Button variant="outline" onClick={() => handleNumber("6")}>
          6
        </Button>
        <Button variant="outline" onClick={() => handleOperation("-")}>
          <Minus className="h-4 w-4" />
        </Button>

        <Button variant="outline" onClick={() => handleNumber("1")}>
          1
        </Button>
        <Button variant="outline" onClick={() => handleNumber("2")}>
          2
        </Button>
        <Button variant="outline" onClick={() => handleNumber("3")}>
          3
        </Button>
        <Button variant="outline" onClick={() => handleOperation("+")}>
          <Plus className="h-4 w-4" />
        </Button>

        <Button variant="outline" onClick={() => handleNumber("0")}>
          0
        </Button>
        <Button variant="outline" onClick={() => handleNumber(".")}>
          .
        </Button>
        <Button variant="outline" onClick={handlePercent}>
          %
        </Button>
        <Button variant="default" onClick={handleEquals}>
          =
        </Button>
      </div>
    </Card>
  )
}
