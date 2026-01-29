"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchoolGradeCalculator } from "./school-grade-calculator"
import { PASGradeCalculator } from "./pas-grade-calculator"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GradeCalculator() {
  const [activeTab, setActiveTab] = useState("school")

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="school">Nota Escola</TabsTrigger>
          <TabsTrigger value="pas">Nota PAS</TabsTrigger>
          <TabsTrigger value="enem">Nota ENEM</TabsTrigger>
        </TabsList>
        <TabsContent value="school">
          <SchoolGradeCalculator />
        </TabsContent>
        <TabsContent value="pas">
          <PASGradeCalculator />
        </TabsContent>
        <TabsContent value="enem">
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Calculadora de Nota ENEM</h3>
            <Button asChild className="w-full">
              <Link href="/study/enem-calculator">Acessar Calculadora Avançada</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
