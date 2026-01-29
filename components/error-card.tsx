import { Card } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"

interface ErrorCardProps {
  title: string
  description: string
  consequences: string[]
  preventions: string[]
}

export function ErrorCard({ title, description, consequences, preventions }: ErrorCardProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
        <h3 className="font-medium text-lg">{title}</h3>
      </div>

      <p className="text-gray-600">{description}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-4 w-4" />
          <h4 className="font-medium">Consequências</h4>
        </div>
        <ul className="space-y-1 text-gray-600 ml-6 list-disc">
          {consequences.map((consequence, index) => (
            <li key={index}>{consequence}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="h-4 w-4" />
          <h4 className="font-medium">Como Evitar</h4>
        </div>
        <ul className="space-y-1 text-gray-600 ml-6 list-disc">
          {preventions.map((prevention, index) => (
            <li key={index}>{prevention}</li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
