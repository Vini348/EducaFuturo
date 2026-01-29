"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import type { Course } from "@/types/pas"

interface CourseSearchProps {
  courses: Course[]
  selectedCourse: Course | null
  onSelectCourse: (course: Course) => void
  userScore?: number
}

export function CourseSearch({ courses, selectedCourse, onSelectCourse, userScore }: CourseSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.schedule.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCourseStatus = (course: Course) => {
    if (!userScore || !course.cutoffScores) return null

    const difference = userScore - course.cutoffScores.universal
    if (difference >= 0) {
      return {
        status: "approved" as const,
        difference: difference.toFixed(3),
      }
    } else {
      return {
        status: "rejected" as const,
        difference: difference.toFixed(3),
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Pesquisar cursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {filteredCourses.map((course) => {
            const status = getCourseStatus(course)
            return (
              <Card
                key={course.id} //This line was updated.  The original key was incorrect and didn't use course.id
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedCourse?.name === course.name ? "border-primary" : ""
                }`}
                onClick={() => onSelectCourse(course)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-sm text-gray-500">
                      {course.schedule} • {course.campus}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">{course.degree}</Badge>
                    {status && (
                      <Badge variant={status.status === "approved" ? "success" : "destructive"} className="ml-2">
                        {status.status === "approved" ? "+" : ""}
                        {status.difference}
                      </Badge>
                    )}
                  </div>
                </div>
                {course.cutoffScores && (
                  <div className="mt-2 text-sm text-gray-500">
                    Nota de Corte: {course.cutoffScores.universal.toFixed(3)}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
