import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { VideoTutorialCard } from "@/components/video-tutorial-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const tutorials = [
  {
    id: "1",
    title: "Funcionamento de Transistores",
    description:
      "Transístores como funcionam os transístores. Neste vídeo aprendemos como funcionam os transístores, os diferentes tipos de transístores, o básico do circuito electrónico, como construir um circuito transístor, amplificador transístor, ganho de corrente beta, npn, pnp, dissipador de calor, electrónica e engenharia eléctrica. E mais!",
    duration: "18:20",
    thumbnail: "https://i.ytimg.com/vi/JROzWgqDZrQ/hqdefault.jpg",
    href: "https://youtu.be/JROzWgqDZrQ?si=WPhU1Dj-s8i8R5JW",
  },
  {
    id: "2",
    title: "Diodo",
    description: "Aula teórica sobre Diodo",
    duration: "12:51",
    thumbnail: "https://i.ytimg.com/vi/gjX8JZq42mI/hqdefault.jpg",
    href: "https://youtu.be/gjX8JZq42mI?si=LSKn_GGqHIUHwxuw",
  },
  {
    id: "3",
    title: "Amplificadores Operacionais",
    description:
      "O que é um amplificador operacional? Como ele funciona? Quais as características, simbologia básica, terminais de um ampop? Estas são as questões respondidas nesta aula inaugural da série de aulas sobre amplificadores operacionais. Discutiremos também o modelo ideal de amplificadores operacionais, limites de saturação e terminamos apresentando a função comparadora, ou o circuito comparador (comparador de tensão) muito utilizado em comandos eletrônicos e modulação de sinais pulsados, como a modulação PWM (pulse width modulation), que é a base da eletrônica de potência.",
    duration: "15:32",
    thumbnail: "https://i.ytimg.com/vi/Ren-4Y1W8GE/hqdefault.jpg",
    href: "https://youtu.be/Ren-4Y1W8GE?si=0gJU-Dej97fWm-3T",
  },
  {
    id: "4",
    title: "Circuitos Digitais Básicos",
    description: "Introdução ao curso de Sistemas Digitais (SD)",
    duration: "8:41",
    thumbnail: "https://i.ytimg.com/vi/r3HhoxMRv4U/hqdefault.jpg",
    href: "https://youtu.be/r3HhoxMRv4U?list=PL1K59X-jJdii6ojXmSAzOuUJNNDXGRara",
  },
]

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/study">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Tutoriais em Vídeo</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tutorial) => (
            <VideoTutorialCard key={tutorial.id} {...tutorial} />
          ))}
        </div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
