"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/authContext"
import { supabase } from "@/lib/supabase"

const projects = [
  {
    id: "power-supply",
    icon: "Zap",
    title: "Fonte de Alimentação Ajustável",
    description: "Construa uma fonte DC ajustável com proteção contra curto-circuito",
    components: ["Transformador", "Ponte retificadora", "Capacitores", "LM317"],
    category: "Fontes",
    difficulty: "Iniciante" as const,
    requiredProjectId: null,
  },
  {
    id: "dimmer",
    icon: "Lightbulb",
    title: "Dimmer Digital",
    description: "Controle de intensidade luminosa com microcontrolador",
    components: ["Arduino", "TRIAC", "Optoacoplador", "Resistores"],
    category: "Controle",
    difficulty: "Intermediário" as const,
    requiredProjectId: "power-supply",
  },
  {
    id: "motor-control",
    icon: "Settings",
    title: "Controle de Motor DC",
    description: "Sistema de controle de velocidade para motor DC",
    components: ["Motor DC", "MOSFET", "Driver", "Sensores"],
    category: "Automação",
    difficulty: "Avançado" as const,
    requiredProjectId: "dimmer",
  },
]

export default function ProjectsPage() {
  const { user } = useAuth()
  const [completedProjects, setCompletedProjects] = useState<string[]>([])
  const [approvedProjects, setApprovedProjects] = useState<string[]>([])
  const [submissions, setSubmissions] = useState<{
    projectId: string
    status: "pending" | "approved" | "rejected"
    feedback?: string
  }>([])

  useEffect(() => {
    if (user) {
      fetchUserProjects()
    }
  }, [user])

  const fetchUserProjects = async () => {
    if (!user) return

    const { data: submissions, error } = await supabase
      .from("project_submissions")
      .select("project_id, status, feedback")
      .eq("user_id", user.id)

    if (error) {
      console.error("Error fetching user projects:", error)
      return
    }

    const submissionsData = submissions.map((s) => ({
      projectId: s.project_id,
      status: s.status,
      feedback: s.feedback,
    }))

    setSubmissions(submissionsData)

    const completed = submissions.map((s) => s.project_id)
    const approved = submissions.filter((s) => s.status === "approved").map((s) => s.project_id)

    setCompletedProjects(completed)
    setApprovedProjects(approved)
  }

  const isProjectLocked = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project?.requiredProjectId === null) return false
    return !approvedProjects.includes(project?.requiredProjectId || "")
  }

  const handleProjectUpload = async (projectId: string, file: File) => {
    if (!user) return

    const fileName = `${user.id}/${projectId}/${file.name}`
    const { error: uploadError } = await supabase.storage.from("project-submissions").upload(fileName, file, {
      upsert: true, // Sobrescrever arquivo existente se necessário
    })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      throw uploadError
    }

    const { data: publicUrl } = supabase.storage.from("project-submissions").getPublicUrl(fileName)

    const { error: submissionError } = await supabase.from("project_submissions").upsert({
      user_id: user.id,
      project_id: projectId,
      file_url: publicUrl.publicUrl,
      status: "pending",
      feedback: null, // Inicialmente sem feedback
      submitted_at: new Date().toISOString(), // Adiciona timestamp de envio
    })

    if (submissionError) {
      console.error("Error creating submission:", submissionError)
      throw submissionError
    }

    await fetchUserProjects()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/study">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Biblioteca de Projetos Práticos</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const submission = submissions.find((s) => s.projectId === project.id)
            return (
              <ProjectCard
                key={project.id}
                icon={project.icon as keyof typeof import("lucide-react")}
                title={project.title}
                description={project.description}
                components={project.components}
                category={project.category}
                difficulty={project.difficulty}
                isLocked={isProjectLocked(project.id)}
                onUpload={(file) => handleProjectUpload(project.id, file)}
                status={submission?.status}
                feedback={submission?.feedback}
              />
            )
          })}
        </div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
