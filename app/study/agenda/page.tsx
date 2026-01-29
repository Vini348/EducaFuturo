"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/authContext"
import { scheduleDb } from "@/lib/schedule-db"
import { useToast } from "@/components/ui/use-toast"
import { StudyCalendar } from "@/components/study-calendar"
import type { AgendaEvent, TodoItem } from "@/lib/schedule-db"

export default function AgendaPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [newEvent, setNewEvent] = useState("")
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const loadData = async () => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para ver sua agenda",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Load events
      const loadedEvents = await scheduleDb.getAgendaEvents(user.id)
      setEvents(loadedEvents)

      // Load todos
      const loadedTodos = await scheduleDb.getTodoItems(user.id)
      setTodos(loadedTodos)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da agenda",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addEvent = async () => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para adicionar eventos",
        variant: "destructive",
      })
      return
    }

    if (!newEvent.trim()) {
      toast({
        title: "Atenção",
        description: "O evento precisa ter um título",
        variant: "destructive",
      })
      return
    }

    try {
      const newEventData = await scheduleDb.addAgendaEvent(user.id, newEvent)

      if (newEventData) {
        setEvents((prev) => [...prev, newEventData])
        setNewEvent("")
        toast({
          title: "Sucesso",
          description: "Evento adicionado com sucesso",
        })
      }
    } catch (error) {
      console.error("Error adding event:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o evento. Verifique se você está logado.",
        variant: "destructive",
      })
    }
  }

  const addTodo = async () => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para adicionar tarefas",
        variant: "destructive",
      })
      return
    }

    if (!newTodo.trim()) {
      toast({
        title: "Atenção",
        description: "A tarefa precisa ter um texto",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("Tentando adicionar tarefa para usuário:", user.id)
      const newTodoItem = await scheduleDb.addTodoItem(user.id, newTodo)

      if (newTodoItem) {
        setTodos((prev) => [...prev, newTodoItem])
        setNewTodo("")
        toast({
          title: "Sucesso",
          description: "Tarefa adicionada com sucesso",
        })
      }
    } catch (error) {
      console.error("Error adding todo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a tarefa. Verifique se você está logado.",
        variant: "destructive",
      })
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para atualizar tarefas",
        variant: "destructive",
      })
      return
    }

    try {
      const success = await scheduleDb.updateTodoItem(id, completed)
      if (success) {
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)))
      }
    } catch (error) {
      console.error("Error toggling todo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: string) => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para remover tarefas",
        variant: "destructive",
      })
      return
    }

    try {
      const success = await scheduleDb.deleteTodoItem(id)
      if (success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
        toast({
          title: "Sucesso",
          description: "Tarefa removida com sucesso",
        })
      }
    } catch (error) {
      console.error("Error deleting todo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover a tarefa",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <TopNav />
        <main className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Carregando...</span>
              </div>
            </CardContent>
          </Card>
        </main>
        <BottomNav active="study" />
      </div>
    )
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
          <h1 className="text-2xl font-bold">Agenda</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StudyCalendar />

          <Card>
            <CardHeader>
              <CardTitle>Lista de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground mb-2">Você precisa estar logado para gerenciar tarefas</p>
                  <Link href="/login">
                    <Button>Fazer Login</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex space-x-2 mb-4">
                    <Input
                      type="text"
                      placeholder="Nova tarefa"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                    />
                    <Button onClick={addTodo}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {todos.length === 0 ? (
                    <p className="text-center text-muted-foreground">Nenhuma tarefa adicionada</p>
                  ) : (
                    <ul className="space-y-2">
                      {todos.map((todo) => (
                        <li key={todo.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={(checked) => toggleTodo(todo.id, checked as boolean)}
                            id={`todo-${todo.id}`}
                          />
                          <label
                            htmlFor={`todo-${todo.id}`}
                            className={`flex-grow ${todo.completed ? "line-through text-gray-500" : ""}`}
                          >
                            {todo.text}
                          </label>
                          <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
