"use client"

import { Badge } from "@/components/ui/badge"
import { USER_LEVELS, type UserLevel } from "@/lib/user-level-system"
import { Shield } from "lucide-react"

interface UserLevelBadgeProps {
  level: UserLevel
  role?: string
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

export function UserLevelBadge({ level, role, showIcon = true, size = "md" }: UserLevelBadgeProps) {
  const levelInfo = USER_LEVELS[level]
  const isAdmin = role === "admin" || level === "admin"

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  }

  if (isAdmin) {
    return (
      <Badge className={`${levelInfo.badgeColor} font-bold ${sizeClasses[size]} animate-pulse`}>
        {showIcon && <Shield className="mr-1 h-3 w-3" />}
        ADMIN
      </Badge>
    )
  }

  return (
    <Badge className={`${levelInfo.badgeColor} font-semibold ${sizeClasses[size]}`}>
      {showIcon && <span className="mr-1">{levelInfo.icon}</span>}
      {levelInfo.title}
    </Badge>
  )
}
