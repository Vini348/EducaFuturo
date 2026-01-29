import type { FormulaOption, ConversionType } from "@/types/calculator"

export const formulas: FormulaOption[] = [
  // Eletrônica Digital
  {
    id: "clock-frequency",
    name: "Frequência de Clock",
    formula: "f = 1/T",
    variables: [
      { name: "Frequência (f)", unit: "Hz" },
      { name: "Período (T)", unit: "s" },
    ],
  },
  {
    id: "voltage-divider-logic",
    name: "Divisor de Tensão (Pull-Up/Pull-Down)",
    formula: "Vout = Vin × (R2/(R1 + R2))",
    variables: [
      { name: "Tensão de Saída (Vout)", unit: "V" },
      { name: "Tensão de Entrada (Vin)", unit: "V" },
      { name: "Resistência 1 (R1)", unit: "Ω" },
      { name: "Resistência 2 (R2)", unit: "Ω" },
    ],
  },

  // Eletrônica Analógica
  {
    id: "ohms-law",
    name: "Lei de Ohm",
    formula: "V = I × R",
    variables: [
      { name: "Tensão (V)", unit: "V" },
      { name: "Corrente (I)", unit: "A" },
      { name: "Resistência (R)", unit: "Ω" },
    ],
  },
  {
    id: "voltage-divider",
    name: "Divisor de Tensão",
    formula: "Vout = Vin × (R2/(R1 + R2))",
    variables: [
      { name: "Tensão de Saída (Vout)", unit: "V" },
      { name: "Tensão de Entrada (Vin)", unit: "V" },
      { name: "Resistência 1 (R1)", unit: "Ω" },
      { name: "Resistência 2 (R2)", unit: "Ω" },
    ],
  },
  {
    id: "op-amp-gain",
    name: "Ganho do Amplificador Operacional",
    formula: "G = 1 + (Rf/R1)",
    variables: [
      { name: "Ganho (G)", unit: "" },
      { name: "Resistência de Realimentação (Rf)", unit: "Ω" },
      { name: "Resistência de Entrada (R1)", unit: "Ω" },
    ],
  },
  {
    id: "capacitive-reactance",
    name: "Reatância Capacitiva",
    formula: "Xc = 1/(2πfC)",
    variables: [
      { name: "Reatância Capacitiva (Xc)", unit: "Ω" },
      { name: "Frequência (f)", unit: "Hz" },
      { name: "Capacitância (C)", unit: "F" },
    ],
  },

  // Eletrônica de Potência
  {
    id: "electric-power",
    name: "Potência Elétrica",
    formula: "P = V × I × cos(φ)",
    variables: [
      { name: "Potência (P)", unit: "W" },
      { name: "Tensão (V)", unit: "V" },
      { name: "Corrente (I)", unit: "A" },
      { name: "Fator de Potência (cos φ)", unit: "" },
    ],
  },
  {
    id: "buck-converter",
    name: "Conversor Buck",
    formula: "Vout = D × Vin",
    variables: [
      { name: "Tensão de Saída (Vout)", unit: "V" },
      { name: "Ciclo de Trabalho (D)", unit: "" },
      { name: "Tensão de Entrada (Vin)", unit: "V" },
    ],
  },
  {
    id: "converter-efficiency",
    name: "Eficiência do Conversor",
    formula: "η = (Pout/Pin) × 100%",
    variables: [
      { name: "Eficiência (η)", unit: "%" },
      { name: "Potência de Saída (Pout)", unit: "W" },
      { name: "Potência de Entrada (Pin)", unit: "W" },
    ],
  },
  {
    id: "inductive-reactance",
    name: "Reatância Indutiva",
    formula: "XL = 2πfL",
    variables: [
      { name: "Reatância Indutiva (XL)", unit: "Ω" },
      { name: "Frequência (f)", unit: "Hz" },
      { name: "Indutância (L)", unit: "H" },
    ],
  },
]

export const conversions: ConversionType[] = [
  {
    id: "resistance",
    name: "Resistência",
    units: [
      { id: "ohm", name: "Ohm (Ω)", factor: 1 },
      { id: "kohm", name: "Kilohm (kΩ)", factor: 1000 },
      { id: "mohm", name: "Megaohm (MΩ)", factor: 1000000 },
    ],
  },
  {
    id: "voltage",
    name: "Tensão",
    units: [
      { id: "v", name: "Volt (V)", factor: 1 },
      { id: "kv", name: "Kilovolt (kV)", factor: 1000 },
      { id: "mv", name: "Millivolt (mV)", factor: 0.001 },
    ],
  },
  {
    id: "frequency",
    name: "Frequência",
    units: [
      { id: "hz", name: "Hertz (Hz)", factor: 1 },
      { id: "khz", name: "Kilohertz (kHz)", factor: 1000 },
      { id: "mhz", name: "Megahertz (MHz)", factor: 1000000 },
    ],
  },
  // Novas conversões
  {
    id: "current",
    name: "Corrente Elétrica",
    units: [
      { id: "a", name: "Ampère (A)", factor: 1 },
      { id: "ma", name: "Miliampère (mA)", factor: 0.001 },
      { id: "ua", name: "Microampère (µA)", factor: 0.000001 },
    ],
  },
  {
    id: "power",
    name: "Potência Elétrica",
    units: [
      { id: "w", name: "Watt (W)", factor: 1 },
      { id: "mw", name: "Miliwatt (mW)", factor: 0.001 },
      { id: "kw", name: "Quilowatt (kW)", factor: 1000 },
    ],
  },
  {
    id: "energy",
    name: "Energia Elétrica",
    units: [
      { id: "j", name: "Joule (J)", factor: 1 },
      { id: "wh", name: "Watt-hora (Wh)", factor: 3600 },
      { id: "kwh", name: "Quilowatt-hora (kWh)", factor: 3600000 },
    ],
  },
  {
    id: "capacitance",
    name: "Capacitância",
    units: [
      { id: "f", name: "Farad (F)", factor: 1 },
      { id: "uf", name: "Microfarad (µF)", factor: 0.000001 },
      { id: "nf", name: "Nanofarad (nF)", factor: 0.000000001 },
      { id: "pf", name: "Picofarad (pF)", factor: 0.000000000001 },
    ],
  },
  {
    id: "inductance",
    name: "Indutância",
    units: [
      { id: "h", name: "Henry (H)", factor: 1 },
      { id: "mh", name: "MiliHenry (mH)", factor: 0.001 },
      { id: "uh", name: "MicroHenry (µH)", factor: 0.000001 },
    ],
  },
  {
    id: "charge",
    name: "Carga Elétrica",
    units: [
      { id: "c", name: "Coulomb (C)", factor: 1 },
      { id: "mc", name: "MiliCoulomb (mC)", factor: 0.001 },
      { id: "uc", name: "MicroCoulomb (µC)", factor: 0.000001 },
    ],
  },
  {
    id: "conductance",
    name: "Condutância",
    units: [
      { id: "s", name: "Siemens (S)", factor: 1 },
      { id: "ms", name: "MiliSiemens (mS)", factor: 0.001 },
      { id: "us", name: "MicroSiemens (µS)", factor: 0.000001 },
    ],
  },
  {
    id: "magnetic_flux",
    name: "Fluxo Magnético",
    units: [
      { id: "wb", name: "Weber (Wb)", factor: 1 },
      { id: "mwb", name: "MiliWeber (mWb)", factor: 0.001 },
      { id: "uwb", name: "MicroWeber (µWb)", factor: 0.000001 },
    ],
  },
  {
    id: "magnetic_flux_density",
    name: "Densidade de Fluxo Magnético",
    units: [
      { id: "t", name: "Tesla (T)", factor: 1 },
      { id: "g", name: "Gauss (G)", factor: 0.0001 },
    ],
  },
]
