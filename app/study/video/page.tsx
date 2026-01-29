import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { VideoLessonCard } from "@/components/video-lesson-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const videoLessons = {
  digital: [
    {
      title: "Introdução à Eletrônica Digital",
      description: "Aprenda os conceitos básicos de eletrônica digital",
      instructor: "Brincando com Ideias",
      duration: "23:17",
      thumbnail: "https://i.ytimg.com/vi/mLc9xn6UxWY/hqdefault.jpg",
      videoUrl: "https://youtu.be/mLc9xn6UxWY",
    },
    {
      title: "Portas Lógicas - Teoria e Prática",
      description: "Tutorial completo sobre portas lógicas",
      instructor: "Professora Nattane",
      duration: "9:13",
      thumbnail: "https://i.ytimg.com/vi/0xbWVF1yzV4/hqdefault.jpg",
      videoUrl: "https://youtu.be/0xbWVF1yzV4?t=199",
    },
    {
      title: "Circuitos Combinacionais",
      description: "Aprenda a projetar circuitos combinacionais",
      instructor: "Prof. Tubarão",
      duration: "19:12",
      thumbnail: "https://i.ytimg.com/vi/RIlp0pg75oA/hqdefault.jpg",
      videoUrl: "https://youtu.be/RIlp0pg75oA",
    },
  ],
  analog: [
    {
      title: "Amplificadores Operacionais",
      description:
        "O que é um amplificador operacional? Como ele funciona? Quais as características, simbologia básica, terminais de um ampop? Estas são as questões respondidas nesta aula inaugural da série de aulas sobre amplificadores operacionais. Discutiremos também o modelo ideal de amplificadores operacionais, limites de saturação e terminamos apresentando a função comparadora, ou o circuito comparador (comparador de tensão) muito utilizado em comandos eletrônicos e modulação de sinais pulsados, como a modulação PWM (pulse width modulation), que é a base da eletrônica de potência.",
      instructor: "Eletrônica Geral",
      duration: "19:32",
      thumbnail: "https://i.ytimg.com/vi/Ren-4Y1W8GE/hqdefault.jpg",
      videoUrl: "https://youtu.be/Ren-4Y1W8GE?list=PLXAyyE5gW0i7uGeJmExz6iUEpp0BQgEeZ",
    },
    {
      title: "Filtros Analógicos",
      description: "Projeto e implementação de filtros ativos e passivos",
      instructor: "WR Kits",
      duration: "11:39",
      thumbnail: "https://i.ytimg.com/vi/NH6msPAScUE/hqdefault.jpg",
      videoUrl: "https://youtu.be/NH6msPAScUE?list=PLqnWlo4M8pvr5AeYu5S7piFW5QxaUqIU",
    },
  ],
  power: [
    {
      title: "Fontes Chaveadas",
      description: "Princípios de funcionamento e topologias",
      instructor: "Eletrônica Aplicada",
      duration: "31:48",
      thumbnail: "https://i.ytimg.com/vi/BMypjLBFDk4/hqdefault.jpg",
      videoUrl: "https://youtu.be/BMypjLBFDk4",
    },
    {
      title: "Inversores de Frequência",
      description: "Controle de motores e aplicações industriais",
      instructor: "Professor Emerson Leite",
      duration: "15:28",
      thumbnail: "https://i.ytimg.com/vi/j9o1BrpTKHE/hqdefault.jpg",
      videoUrl: "https://youtu.be/j9o1BrpTKHE",
    },
  ],
}

export default function VideoLessonsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-10">
        <div className="flex items-center gap-4">
          <Link href="/study">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Videoaulas</h1>
        </div>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Eletrônica Digital</h2>
          <div className="space-y-8">
            {videoLessons.digital.map((lesson, index) => (
              <VideoLessonCard key={index} {...lesson} onWatch={() => window.open(lesson.videoUrl, "_blank")} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Eletrônica Analógica</h2>
          <div className="space-y-8">
            {videoLessons.analog.map((lesson, index) => (
              <VideoLessonCard key={index} {...lesson} onWatch={() => window.open(lesson.videoUrl, "_blank")} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Eletrônica de Potência</h2>
          <div className="space-y-8">
            {videoLessons.power.map((lesson, index) => (
              <VideoLessonCard key={index} {...lesson} onWatch={() => window.open(lesson.videoUrl, "_blank")} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
