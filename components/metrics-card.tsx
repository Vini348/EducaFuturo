import type React from "react"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Loader2 } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  tooltip?: string
  icon?: React.ReactNode
  status?: "loading" | "error" | "success"
}

export function MetricsCard({ title, value, tooltip, icon, status }: MetricsCardProps) {
  return (
    <Card className="p-4 flex flex-col items-center text-center">
      <div className="flex items-center gap-1 mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-2">
        {icon}
        {status === "loading" ? (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">--</span>
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          </div>
        ) : (
          <span className="text-xl font-bold">{value}</span>
        )}
      </div>
    </Card>
  )
}
