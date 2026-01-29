import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AdminBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export function AdminBadge({ className = "", size = "md", showIcon = true }: AdminBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  return (
    <Badge
      variant="default"
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-r from-purple-600 to-pink-600 
        text-white font-semibold 
        shadow-lg border-0
        hover:from-purple-700 hover:to-pink-700 
        transition-all duration-200
        flex items-center gap-1.5
        ${className}
      `}
    >
      {showIcon && <Shield className="h-3.5 w-3.5" />}
      ADMIN
    </Badge>
  )
}

export function ModeratorBadge({ className = "", size = "md", showIcon = true }: AdminBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  return (
    <Badge
      variant="default"
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-r from-blue-600 to-cyan-600 
        text-white font-semibold 
        shadow-lg border-0
        hover:from-blue-700 hover:to-cyan-700 
        transition-all duration-200
        flex items-center gap-1.5
        ${className}
      `}
    >
      {showIcon && <Shield className="h-3.5 w-3.5" />}
      MODERADOR
    </Badge>
  )
}
