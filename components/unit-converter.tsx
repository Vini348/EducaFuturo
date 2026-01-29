"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { conversions } from "@/data/calculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UnitConverter() {
  const [conversionType, setConversionType] = useState("")
  const [fromUnit, setFromUnit] = useState("")
  const [toUnit, setToUnit] = useState("")
  const [value, setValue] = useState("")
  const [result, setResult] = useState("")
  const [activeTab, setActiveTab] = useState("standard")

  // Função para conversão padrão (usando fatores)
  const handleStandardConvert = () => {
    const type = conversions.find((c) => c.id === conversionType)
    if (!type || !fromUnit || !toUnit || !value) return

    const fromFactor = type.units.find((u) => u.id === fromUnit)?.factor || 1
    const toFactor = type.units.find((u) => u.id === toUnit)?.factor || 1
    const baseValue = Number.parseFloat(value) * fromFactor
    const convertedValue = baseValue / toFactor

    // Formata o número removendo zeros desnecessários
    setResult(Number.parseFloat(convertedValue.toFixed(6)).toString())
  }

  // Estados para conversão de temperatura
  const [tempValue, setTempValue] = useState("")
  const [fromTemp, setFromTemp] = useState("celsius")
  const [toTemp, setToTemp] = useState("kelvin")
  const [tempResult, setTempResult] = useState("")

  // Função para conversão de temperatura
  const handleTempConvert = () => {
    if (!tempValue || !fromTemp || !toTemp) return

    const numValue = Number.parseFloat(tempValue)
    let baseKelvin = 0

    // Converter para Kelvin primeiro (base comum)
    switch (fromTemp) {
      case "celsius":
        baseKelvin = numValue + 273.15
        break
      case "fahrenheit":
        baseKelvin = ((numValue - 32) * 5) / 9 + 273.15
        break
      case "kelvin":
        baseKelvin = numValue
        break
    }

    // Converter de Kelvin para a unidade desejada
    let result = 0
    switch (toTemp) {
      case "celsius":
        result = baseKelvin - 273.15
        break
      case "fahrenheit":
        result = ((baseKelvin - 273.15) * 9) / 5 + 32
        break
      case "kelvin":
        result = baseKelvin
        break
    }

    // Formata o número removendo zeros desnecessários
    setTempResult(Number.parseFloat(result.toFixed(2)).toString())
  }

  // Estados para conversão de dBm
  const [powerValue, setPowerValue] = useState("")
  const [fromPower, setFromPower] = useState("w")
  const [toPower, setToPower] = useState("dbm")
  const [powerResult, setPowerResult] = useState("")

  // Função para conversão de potência com dBm
  const handlePowerConvert = () => {
    if (!powerValue || !fromPower || !toPower) return

    const numValue = Number.parseFloat(powerValue)
    let baseWatts = 0

    // Converter para Watts primeiro
    switch (fromPower) {
      case "w":
        baseWatts = numValue
        break
      case "mw":
        baseWatts = numValue / 1000
        break
      case "kw":
        baseWatts = numValue * 1000
        break
      case "dbm":
        baseWatts = Math.pow(10, numValue / 10) / 1000
        break
    }

    // Converter de Watts para a unidade desejada
    let result = 0
    switch (toPower) {
      case "w":
        result = baseWatts
        break
      case "mw":
        result = baseWatts * 1000
        break
      case "kw":
        result = baseWatts / 1000
        break
      case "dbm":
        result = 10 * Math.log10(baseWatts * 1000)
        break
    }

    // Formata o número removendo zeros desnecessários
    setPowerResult(Number.parseFloat(result.toFixed(4)).toString())
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="standard">Conversões Padrão</TabsTrigger>
          <TabsTrigger value="temperature">Temperatura</TabsTrigger>
          <TabsTrigger value="power">Potência (dBm)</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-4">
          <div>
            <Label>Tipo de Conversão</Label>
            <Select onValueChange={setConversionType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de conversão" />
              </SelectTrigger>
              <SelectContent>
                {conversions.map((conversion) => (
                  <SelectItem key={conversion.id} value={conversion.id}>
                    {conversion.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {conversionType && (
            <>
              <div className="grid gap-4">
                <div>
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Digite o valor"
                  />
                </div>

                <div>
                  <Label>De</Label>
                  <Select onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unidade inicial" />
                    </SelectTrigger>
                    <SelectContent>
                      {conversions
                        .find((c) => c.id === conversionType)
                        ?.units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Para</Label>
                  <Select onValueChange={setToUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unidade final" />
                    </SelectTrigger>
                    <SelectContent>
                      {conversions
                        .find((c) => c.id === conversionType)
                        ?.units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleStandardConvert} className="w-full">
                Converter
              </Button>

              {result && (
                <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                  {result} {conversions.find((c) => c.id === conversionType)?.units.find((u) => u.id === toUnit)?.name}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Digite o valor"
              />
            </div>

            <div>
              <Label>De</Label>
              <Select value={fromTemp} onValueChange={setFromTemp}>
                <SelectTrigger>
                  <SelectValue placeholder="Unidade inicial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Para</Label>
              <Select value={toTemp} onValueChange={setToTemp}>
                <SelectTrigger>
                  <SelectValue placeholder="Unidade final" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleTempConvert} className="w-full">
            Converter
          </Button>

          {tempResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-center">
              {tempResult} {toTemp === "celsius" ? "°C" : toTemp === "fahrenheit" ? "°F" : "K"}
            </div>
          )}
        </TabsContent>

        <TabsContent value="power" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                value={powerValue}
                onChange={(e) => setPowerValue(e.target.value)}
                placeholder="Digite o valor"
              />
            </div>

            <div>
              <Label>De</Label>
              <Select value={fromPower} onValueChange={setFromPower}>
                <SelectTrigger>
                  <SelectValue placeholder="Unidade inicial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="w">Watt (W)</SelectItem>
                  <SelectItem value="mw">Miliwatt (mW)</SelectItem>
                  <SelectItem value="kw">Quilowatt (kW)</SelectItem>
                  <SelectItem value="dbm">dBm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Para</Label>
              <Select value={toPower} onValueChange={setToPower}>
                <SelectTrigger>
                  <SelectValue placeholder="Unidade final" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="w">Watt (W)</SelectItem>
                  <SelectItem value="mw">Miliwatt (mW)</SelectItem>
                  <SelectItem value="kw">Quilowatt (kW)</SelectItem>
                  <SelectItem value="dbm">dBm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handlePowerConvert} className="w-full">
            Converter
          </Button>

          {powerResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-center">
              {powerResult} {toPower === "dbm" ? "dBm" : toPower === "mw" ? "mW" : toPower === "kw" ? "kW" : "W"}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
