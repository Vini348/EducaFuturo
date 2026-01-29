"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StandardCalculator } from "@/components/standard-calculator"
import { FormulaCalculator } from "@/components/formula-calculator"
import { UnitConverter } from "@/components/unit-converter"
import { GradeCalculator } from "@/components/grade-calculator"

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("standard")

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Calculadoras</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="standard">Padrão</TabsTrigger>
            <TabsTrigger value="formula">Fórmulas</TabsTrigger>
            <TabsTrigger value="converter">Conversão</TabsTrigger>
            <TabsTrigger value="grades">Notas</TabsTrigger>
          </TabsList>
          <TabsContent value="standard">
            <StandardCalculator />
          </TabsContent>
          <TabsContent value="formula">
            <FormulaCalculator />
          </TabsContent>
          <TabsContent value="converter">
            <UnitConverter />
          </TabsContent>
          <TabsContent value="grades">
            <GradeCalculator />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav active="calculator" />
    </div>
  )
}
