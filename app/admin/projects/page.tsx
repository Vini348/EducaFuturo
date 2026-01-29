"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/authContext"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface ProjectSubmission {
  id: string
  user_id: string
  project_id: string
  file_url: string
  status: "pending" | "approved" | "rejected"
  feedback?: string
  created_at: string
}

export default function AdminProjectsPage() {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([])
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/")
    } else {
      fetchSubmissions()
    }
  }, [user, router])

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("project_submissions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching submissions:", error)
    } else {
      setSubmissions(data)
    }
  }

  const handleFeedbackChange = (submissionId: string, value: string) => {
    setFeedback((prev) => ({
      ...prev,
      [submissionId]: value,
    }))
  }

  const handleApprove = async (submissionId: string) => {
    const { error } = await supabase
      .from("project_submissions")
      .update({
        status: "approved",
        feedback: feedback[submissionId] || "Projeto aprovado! Parabéns!",
      })
      .eq("id", submissionId)

    if (error) {
      console.error("Error approving submission:", error)
    } else {
      fetchSubmissions()
    }
  }

  const handleReject = async (submissionId: string) => {
    if (!feedback[submissionId]) {
      toast({
        title: "Erro",
        description: "Por favor, forneça um feedback para rejeição",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase
      .from("project_submissions")
      .update({
        status: "rejected",
        feedback: feedback[submissionId],
      })
      .eq("id", submissionId)

    if (error) {
      console.error("Error rejecting submission:", error)
    } else {
      fetchSubmissions()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin: Project Submissions</h1>

        <div className="grid gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle>Project: {submission.project_id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>User ID: {submission.user_id}</p>
                <p>Status: {submission.status}</p>
                <p>Submitted: {new Date(submission.created_at).toLocaleString()}</p>
                <a
                  href={submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Submission
                </a>

                {submission.status === "pending" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Feedback para o aluno:</label>
                    <Textarea
                      value={feedback[submission.id] || ""}
                      onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                      placeholder="Forneça um feedback detalhado, especialmente em caso de rejeição"
                      className="w-full mb-2"
                    />
                  </div>
                )}

                {submission.feedback && submission.status !== "pending" && (
                  <div className="mt-2 p-3 bg-gray-50 border rounded-md">
                    <p className="font-medium">Feedback:</p>
                    <p>{submission.feedback}</p>
                  </div>
                )}

                <div className="mt-4 space-x-2">
                  <Button onClick={() => handleApprove(submission.id)} disabled={submission.status !== "pending"}>
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(submission.id)}
                    disabled={submission.status !== "pending" || !feedback[submission.id]}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
