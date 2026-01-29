"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect, useCallback } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Play, RotateCcw, Settings } from "lucide-react"
import Link from "next/link"
// Mantenha os imports existentes e adicione o novo import para CircleProgress
import { CircleProgress } from "@/components/ui/circle-progress"

interface PomodoroSettings {
  workDuration: number
  breakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
}

export default function PomodoroPage() {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  })

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState(0)
  const [isBreak, setIsBreak] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const resetTimer = useCallback(() => {
    setTimeLeft(settings.workDuration * 60)
    setIsRunning(false)
    setIsBreak(false)
  }, [settings.workDuration])

  const handleSettingsUpdate = (newSettings: Partial<PomodoroSettings>) => {
    const validatedSettings = {
      ...settings,
      ...Object.fromEntries(
        Object.entries(newSettings).map(([key, value]) => [
          key,
          Math.max(1, Number(value) || settings[key as keyof PomodoroSettings]),
        ]),
      ),
    }
    setSettings(validatedSettings)
    // Removido: resetTimer()
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (!isBreak) {
        const newSession = currentSession + 1
        setCurrentSession(newSession)

        if (newSession % settings.sessionsBeforeLongBreak === 0) {
          setTimeLeft(settings.longBreakDuration * 60)
        } else {
          setTimeLeft(settings.breakDuration * 60)
        }

        setIsBreak(true)
      } else {
        setTimeLeft(settings.workDuration * 60)
        setIsBreak(false)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, currentSession, settings])

  useEffect(() => {
    // Atualiza o tempo automaticamente quando as configurações mudam
    if (!isRunning) {
      if (isBreak) {
        if (currentSession % settings.sessionsBeforeLongBreak === 0) {
          setTimeLeft(settings.longBreakDuration * 60)
        } else {
          setTimeLeft(settings.breakDuration * 60)
        }
      } else {
        setTimeLeft(settings.workDuration * 60)
      }
    }
  }, [settings, isBreak, currentSession, isRunning])

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/study">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Pomodoro</h1>
        </div>
        <Card className="max-w-md mx-auto p-8">
          <div className="flex justify-end mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações do Pomodoro</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Ajuste as configurações do seu timer Pomodoro de acordo com suas preferências.
                </DialogDescription>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Tempo de trabalho (minutos)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.workDuration.toString()}
                      onChange={(e) =>
                        handleSettingsUpdate({
                          workDuration: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Tempo de pausa curta (minutos)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.breakDuration.toString()}
                      onChange={(e) =>
                        handleSettingsUpdate({
                          breakDuration: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Tempo de pausa longa (minutos)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.longBreakDuration.toString()}
                      onChange={(e) =>
                        handleSettingsUpdate({
                          longBreakDuration: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Sessões antes da pausa longa</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.sessionsBeforeLongBreak.toString()}
                      onChange={(e) =>
                        handleSettingsUpdate({
                          sessionsBeforeLongBreak: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-center space-y-6">
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < currentSession % settings.sessionsBeforeLongBreak ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <div className="text-sm text-gray-600">{currentSession} pomodoros completados</div>

            <div className="relative flex justify-center">
              <CircleProgress
                value={timeLeft}
                maxValue={
                  isBreak
                    ? currentSession % settings.sessionsBeforeLongBreak === 0
                      ? settings.longBreakDuration * 60
                      : settings.breakDuration * 60
                    : settings.workDuration * 60
                }
                size={200}
                strokeWidth={10}
                counterClockwise={true}
                getColor={(percentage) => {
                  if (percentage > 0.66) return "stroke-emerald-500"
                  if (percentage > 0.33) return "stroke-amber-500"
                  return "stroke-rose-500"
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {isBreak ? "Hora de descansar!" : "Mantenha o foco!"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={() => setIsRunning(!isRunning)} className="gap-2">
                <Play className="h-4 w-4" />
                {isRunning ? "Pausar" : "Iniciar"}
              </Button>
              <Button variant="outline" onClick={resetTimer} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reiniciar
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
