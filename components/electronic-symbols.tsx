import type React from "react"

export const ElectronicSymbols = {
  LED: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="60" height="60" {...props}>
      <path
        d="M 50,20 L 70,40 L 30,40 Z M 50,20 L 50,80 M 30,40 L 70,40"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />
      <path d="M 65,15 L 75,5 M 75,15 L 85,5" stroke="currentColor" strokeWidth="4" />
    </svg>
  ),
  Ground: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="60" height="60" {...props}>
      <path
        d="M 50,20 L 50,40 M 30,40 L 70,40 M 35,50 L 65,50 M 40,60 L 60,60"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />
    </svg>
  ),
  Inductor: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="60" height="60" {...props}>
      <path
        d="M 20,50 C 30,50 30,30 40,30 C 50,30 50,70 60,70 C 70,70 70,30 80,30"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />
    </svg>
  ),
  Transistor: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="60" height="60" {...props}>
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="6" fill="none" />
      <path d="M 35,35 L 65,65 M 50,20 L 50,35 M 50,65 L 50,80" stroke="currentColor" strokeWidth="6" fill="none" />
    </svg>
  ),
  Capacitor: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="60" height="60" {...props}>
      <path d="M 40,20 L 40,80 M 60,20 L 60,80" stroke="currentColor" strokeWidth="8" fill="none" />
    </svg>
  ),
  OpAmp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="60" height="60" {...props}>
      <path d="M 20,20 L 80,50 L 20,80 Z" stroke="currentColor" strokeWidth="6" fill="none" />
      <text x="30" y="45" fontSize="20" fill="currentColor">
        +
      </text>
      <text x="30" y="65" fontSize="20" fill="currentColor">
        -
      </text>
    </svg>
  ),
  Transformer: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="60" height="60" {...props}>
      <path d="M 30,20 L 30,80 M 70,20 L 70,80" stroke="currentColor" strokeWidth="6" fill="none" />
      <path
        d="M 35,40 C 40,40 40,60 45,60 M 45,40 C 50,40 50,60 55,60"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />
      <path
        d="M 75,40 C 80,40 80,60 85,60 M 85,40 C 90,40 90,60 95,60"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        transform="translate(-40,0)"
      />
    </svg>
  ),
  Resistor: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="60" height="60" {...props}>
      <path
        d="M 20,50 L 30,50 L 35,40 L 45,60 L 55,40 L 65,60 L 70,50 L 80,50"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />
    </svg>
  ),
}
