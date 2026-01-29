export type CalculatorMode = "standard" | "formulas" | "conversion"

export interface FormulaOption {
  id: string
  name: string
  formula: string
  variables: {
    name: string
    unit: string
  }[]
}

export interface ConversionType {
  id: string
  name: string
  units: {
    id: string
    name: string
    factor: number
  }[]
}
