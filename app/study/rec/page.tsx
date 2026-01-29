"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/authContext"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Clock,
  User,
  Target,
  BookOpen,
  Brain,
  Eye,
  Headphones,
  Hand,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Coffee,
  Moon,
  Sun,
  Zap,
  Edit,
  RefreshCw,
  Calendar,
  TrendingUp,
  Cpu,
  Calculator,
  Atom,
  Monitor,
  Home,
  Code,
  Wifi,
  Settings,
  Wrench,
  GraduationCap,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface StudyProfile {
  name: string
  studyType: string
  availableHours: string
  preferredTime: string[]
  subjects: string[]
  goals: string
  studyDuration: string
  breakDuration: string
  distractions: string
  motivation: string
  experience: string
  studyYear: string
  learningPace: string
  preferredResources: string[]
  weakAreas: string[]
  createdAt?: string
  lastUpdated?: string
  routineHistory?: number
}

interface RoutineItem {
  time: string
  activity: string
  duration: string
  type: "study" | "break" | "review" | "practice" | "assessment"
  subject?: string
  tips?: string
  difficulty?: "easy" | "medium" | "hard"
  resources?: string[]
  techniques?: string[]
}

export default function RECPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<StudyProfile>({
    name: "",
    studyType: "",
    availableHours: "",
    preferredTime: [],
    subjects: [],
    goals: "",
    studyDuration: "",
    breakDuration: "",
    distractions: "",
    motivation: "",
    experience: "",
    studyYear: "",
    learningPace: "",
    preferredResources: [],
    weakAreas: [],
  })
  const [generatedRoutine, setGeneratedRoutine] = useState<RoutineItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const allSubjects = {
    "1º Ano": [
      { id: "circuitos-1ano", name: "Circuitos", icon: "Zap", color: "blue" },
      { id: "digital-1ano", name: "Eletrônica Digital", icon: "Cpu", color: "indigo" },
      { id: "matematica-1ano", name: "Matemática", icon: "Calculator", color: "green" },
      { id: "fisica-1ano", name: "Física - Força da Natureza", icon: "Atom", color: "purple" },
      { id: "computacao-1ano", name: "Introdução à Computação", icon: "Monitor", color: "cyan" },
    ],
    "2º Ano": [
      { id: "matematica-2ano", name: "Matemática Avançada", icon: "Calculator", color: "green" },
      { id: "fisica-energia-2ano", name: "Física - Energia", icon: "Atom", color: "purple" },
      { id: "instalacao-2ano", name: "Instalação Elétrica", icon: "Home", color: "yellow" },
      { id: "analogica-2ano", name: "Eletrônica Analógica", icon: "Brain", color: "pink" },
      { id: "programacao-2ano", name: "Programação", icon: "Code", color: "red" },
      { id: "siscom-2ano", name: "Sistemas de Comunicação", icon: "Wifi", color: "cyan" },
    ],
    "3º Ano": [
      { id: "matematica-3ano", name: "Matemática Complexa", icon: "Calculator", color: "green" },
      { id: "fisica-campo-3ano", name: "Física - Campos", icon: "Atom", color: "purple" },
      { id: "potencia-3ano", name: "Eletrônica de Potência", icon: "Zap", color: "orange" },
      { id: "manutencao-3ano", name: "Manutenção", icon: "Wrench", color: "gray" },
      { id: "controle-3ano", name: "Controle e Automação", icon: "Settings", color: "slate" },
    ],
  }

  const saveProfile = (profileData: StudyProfile) => {
    const profileWithTimestamp = {
      ...profileData,
      lastUpdated: new Date().toISOString(),
      routineHistory: (profileData.routineHistory || 0) + 1,
    }
    localStorage.setItem("rec-profile", JSON.stringify(profileWithTimestamp))
    setProfile(profileWithTimestamp)
  }

  const loadProfile = () => {
    const savedProfile = localStorage.getItem("rec-profile")
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
        setHasExistingProfile(true)
        setCurrentStep(5) // Ajustando para novo número de steps
        return parsedProfile
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      }
    }
    return null
  }

  const startNewProfile = () => {
    setProfile({
      name: "",
      studyType: "",
      availableHours: "",
      preferredTime: [],
      subjects: [],
      goals: "",
      studyDuration: "",
      breakDuration: "",
      distractions: "",
      motivation: "",
      experience: "",
      studyYear: "",
      learningPace: "",
      preferredResources: [],
      weakAreas: [],
    })
    setHasExistingProfile(false)
    setIsEditingProfile(false)
    setCurrentStep(1)
    setGeneratedRoutine([])
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const savedProfile = loadProfile()
    if (savedProfile) {
      generateRoutineFromProfile(savedProfile)
    }
  }, [user, router])

  const handleInputChange = (field: keyof StudyProfile, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubjectToggle = (subject: string) => {
    setProfile((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const handleTimeToggle = (time: string) => {
    setProfile((prev) => ({
      ...prev,
      preferredTime: prev.preferredTime.includes(time)
        ? prev.preferredTime.filter((t) => t !== time)
        : [...prev.preferredTime, time],
    }))
  }

  const handleResourceToggle = (resource: string) => {
    setProfile((prev) => ({
      ...prev,
      preferredResources: prev.preferredResources.includes(resource)
        ? prev.preferredResources.filter((r) => r !== resource)
        : [...prev.preferredResources, resource],
    }))
  }

  const handleWeakAreaToggle = (area: string) => {
    setProfile((prev) => ({
      ...prev,
      weakAreas: prev.weakAreas.includes(area) ? prev.weakAreas.filter((a) => a !== area) : [...prev.weakAreas, area],
    }))
  }

  const generateRoutineFromProfile = async (profileData: StudyProfile) => {
    const routine: RoutineItem[] = []
    const studyDuration = Number.parseInt(profileData.studyDuration)
    const breakDuration = Number.parseInt(profileData.breakDuration)
    const totalHours = Number.parseInt(profileData.availableHours)

    let currentTime = profileData.preferredTime.includes("manhã")
      ? 8
      : profileData.preferredTime.includes("tarde")
        ? 14
        : 19

    if (profileData.experience === "iniciante") {
      currentTime = profileData.preferredTime.includes("manhã") ? 9 : currentTime
    }

    let subjects = profileData.subjects
    if (subjects.length === 0) {
      // Se não selecionou matérias, usar as do ano atual
      const yearSubjects = allSubjects[profileData.studyYear as keyof typeof allSubjects] || allSubjects["1º Ano"]
      subjects = yearSubjects.slice(0, 3).map((s) => s.name) // Pegar as 3 primeiras matérias do ano
    }

    let subjectIndex = 0
    const sessionsPerDay = Math.floor((totalHours * 60) / (studyDuration + breakDuration))

    for (let i = 0; i < sessionsPerDay; i++) {
      if (i % 3 === 0 && i > 0) {
        const practiceSubject = subjects[Math.floor(Math.random() * subjects.length)]
        routine.push({
          time: `${currentTime.toString().padStart(2, "0")}:00`,
          activity: `Prática Aplicada - ${practiceSubject}`,
          duration: `${Math.floor(studyDuration * 0.8)} min`,
          type: "practice",
          subject: practiceSubject,
          difficulty:
            profileData.experience === "iniciante"
              ? "easy"
              : profileData.experience === "intermediario"
                ? "medium"
                : "hard",
          tips: getPracticeTips(profileData.studyType, practiceSubject, profileData.experience),
          resources: getRecommendedResources(practiceSubject, profileData.studyType, profileData.preferredResources),
          techniques: getStudyTechniques(profileData.studyType, practiceSubject, profileData.learningPace),
        })
        currentTime += Math.floor((studyDuration * 0.8) / 60)
      } else {
        // Sessão de estudo regular
        const currentSubject = subjects[subjectIndex % subjects.length]
        const isWeakArea = profileData.weakAreas.includes(currentSubject)
        const difficulty = isWeakArea
          ? "easy" // Começar mais fácil em áreas fracas
          : profileData.experience === "iniciante"
            ? "easy"
            : profileData.experience === "intermediario"
              ? "medium"
              : "hard"

        routine.push({
          time: `${currentTime.toString().padStart(2, "0")}:00`,
          activity: `Estudo de ${currentSubject}${isWeakArea ? " (Área de Reforço)" : ""}`,
          duration: `${studyDuration} min`,
          type: "study",
          subject: currentSubject,
          difficulty,
          tips: getAdvancedStudyTips(
            profileData.studyType,
            currentSubject,
            profileData.experience,
            profileData.learningPace,
          ),
          resources: getRecommendedResources(currentSubject, profileData.studyType, profileData.preferredResources),
          techniques: getStudyTechniques(profileData.studyType, currentSubject, profileData.learningPace),
        })
        currentTime += Math.floor(studyDuration / 60)
        subjectIndex++
      }

      // Pausa personalizada
      if (i < sessionsPerDay - 1) {
        const breakActivity = getPersonalizedBreak(
          profileData.studyType,
          profileData.experience,
          profileData.learningPace,
        )
        routine.push({
          time: `${currentTime.toString().padStart(2, "0")}:00`,
          activity: breakActivity,
          duration: `${breakDuration} min`,
          type: "break",
          tips: getAdvancedBreakTips(profileData.studyType, profileData.learningPace),
        })
        currentTime += Math.floor(breakDuration / 60)
      }
    }

    routine.push({
      time: `${currentTime.toString().padStart(2, "0")}:00`,
      activity: "Autoavaliação e Planejamento",
      duration: "15 min",
      type: "assessment",
      tips: getAssessmentTips(profileData.studyType, profileData.experience),
      techniques: ["Reflexão sobre aprendizado", "Identificação de dificuldades", "Planejamento do próximo dia"],
    })

    setGeneratedRoutine(routine)
  }

  const getAdvancedStudyTips = (studyType: string, subject: string, experience: string, pace: string) => {
    const subjectTips = {
      Circuitos: {
        visual: "Use diagramas de circuitos e simuladores visuais. Desenhe os circuitos enquanto estuda.",
        auditivo: "Explique o funcionamento dos circuitos em voz alta. Grave suas explicações.",
        cinestésico: "Monte circuitos físicos sempre que possível. Use protoboard para experimentar.",
      },
      "Eletrônica Digital": {
        visual: "Crie tabelas verdade coloridas e diagramas de portas lógicas.",
        auditivo: "Verbalize as operações lógicas. Crie músicas ou rimas para lembrar das portas.",
        cinestésico: "Use simuladores interativos e monte circuitos digitais práticos.",
      },
      Matemática: {
        visual: "Use gráficos, cores para diferentes tipos de equações e mapas conceituais.",
        auditivo: "Explique os passos dos cálculos em voz alta. Estude em grupo.",
        cinestésico: "Resolva muitos exercícios práticos. Use objetos para visualizar conceitos abstratos.",
      },
      Física: {
        visual: "Desenhe diagramas de forças, use animações e simulações.",
        auditivo: "Discuta os conceitos físicos e explique os fenômenos.",
        cinestésico: "Faça experimentos práticos e demonstrações físicas.",
      },
      Programação: {
        visual: "Use diagramas de fluxo e códigos com syntax highlighting.",
        auditivo: "Explique o código linha por linha. Participe de code reviews.",
        cinestésico: "Programe constantemente. Faça projetos práticos.",
      },
      "Eletrônica Analógica": {
        visual: "Analise formas de onda no osciloscópio. Use gráficos de resposta em frequência.",
        auditivo: "Discuta o comportamento dos componentes. Explique os circuitos.",
        cinestésico: "Meça componentes reais. Monte e teste circuitos analógicos.",
      },
      "Instalação Elétrica": {
        visual: "Estude plantas baixas e diagramas unifilares.",
        auditivo: "Discuta normas e regulamentações. Explique procedimentos.",
        cinestésico: "Pratique instalações reais. Manuseie ferramentas e componentes.",
      },
      "Eletrônica de Potência": {
        visual: "Analise formas de onda de conversores. Use simulações SPICE.",
        auditivo: "Explique o funcionamento dos conversores de potência.",
        cinestésico: "Monte protótipos de fontes chaveadas e conversores.",
      },
      "Controle e Automação": {
        visual: "Use diagramas de blocos e gráficos de resposta do sistema.",
        auditivo: "Explique malhas de controle e estratégias de controle.",
        cinestésico: "Programe CLPs e implemente sistemas de controle reais.",
      },
      Manutenção: {
        visual: "Estude diagramas de falhas e fluxogramas de diagnóstico.",
        auditivo: "Discuta procedimentos de manutenção e casos práticos.",
        cinestésico: "Pratique diagnóstico com instrumentos reais.",
      },
    }

    const baseTip =
      subjectTips[subject as keyof typeof subjectTips]?.[
        studyType as keyof (typeof subjectTips)[keyof typeof subjectTips]
      ] || "Mantenha foco e concentração."

    const experienceModifier =
      experience === "iniciante"
        ? " Comece com conceitos básicos e exemplos simples."
        : experience === "intermediario"
          ? " Conecte com conhecimentos anteriores."
          : " Explore aplicações avançadas e casos complexos."

    const paceModifier =
      pace === "rapido"
        ? " Use técnicas de revisão espaçada."
        : pace === "normal"
          ? " Mantenha ritmo constante."
          : " Dedique tempo extra para assimilação."

    return baseTip + experienceModifier + paceModifier
  }

  const getPracticeTips = (studyType: string, subject: string, experience: string) => {
    const practiceTips = {
      visual: "Documente visualmente seu processo. Tire fotos dos resultados.",
      auditivo: "Explique o que está fazendo durante a prática. Grave reflexões.",
      cinestésico: "Experimente variações. Teste diferentes abordagens.",
    }

    const baseTip = practiceTips[studyType as keyof typeof practiceTips]
    const experienceAdd =
      experience === "iniciante" ? " Siga tutoriais passo a passo." : " Crie seus próprios desafios."

    return baseTip + experienceAdd
  }

  const getRecommendedResources = (subject: string, studyType: string, preferredResources: string[]) => {
    const resourceMap = {
      Circuitos: {
        visual: ["Simulador SPICE", "Diagramas esquemáticos", "Vídeos educativos"],
        auditivo: ["Podcasts de eletrônica", "Audiolivros técnicos", "Discussões em grupo"],
        cinestésico: ["Protoboard", "Multímetro", "Componentes físicos"],
      },
      "Eletrônica Digital": {
        visual: ["Logisim", "Tabelas verdade coloridas", "Animações de circuitos"],
        auditivo: ["Explicações verbais", "Grupos de estudo", "Apresentações"],
        cinestésico: ["Simuladores interativos", "Kits de desenvolvimento", "Projetos práticos"],
      },
      Programação: {
        visual: ["IDEs com syntax highlighting", "Diagramas UML", "Fluxogramas"],
        auditivo: ["Code reviews", "Pair programming", "Explicações de código"],
        cinestésico: ["Coding challenges", "Projetos práticos", "Hackathons"],
      },
    }

    const subjectResources = resourceMap[subject as keyof typeof resourceMap]
    if (!subjectResources) return ["Livros técnicos", "Exercícios práticos", "Vídeos educativos"]

    const typeResources = subjectResources[studyType as keyof typeof subjectResources] || subjectResources.visual

    // Filtrar por recursos preferidos se especificados
    if (preferredResources.length > 0) {
      return typeResources
        .filter((resource) => preferredResources.some((pref) => resource.toLowerCase().includes(pref.toLowerCase())))
        .concat(typeResources.slice(0, 2)) // Garantir pelo menos 2 recursos
    }

    return typeResources
  }

  const getStudyTechniques = (studyType: string, subject: string, pace: string) => {
    const techniques = {
      visual: ["Mapas mentais", "Diagramas", "Códigos de cores", "Resumos visuais"],
      auditivo: ["Repetição verbal", "Discussões", "Gravações", "Explicações em voz alta"],
      cinestésico: ["Prática hands-on", "Experimentos", "Projetos", "Simulações interativas"],
    }

    const baseTechniques = techniques[studyType as keyof typeof techniques]

    if (pace === "rapido") {
      return [...baseTechniques, "Revisão espaçada", "Técnica Pomodoro"]
    } else if (pace === "devagar") {
      return [...baseTechniques, "Estudo aprofundado", "Múltiplas repetições"]
    }

    return baseTechniques
  }

  const getPersonalizedBreak = (studyType: string, experience: string, pace: string) => {
    const breaks = {
      visual: experience === "iniciante" ? "Pausa visual (olhar paisagem)" : "Pausa criativa (organizar materiais)",
      auditivo: experience === "iniciante" ? "Pausa com música relaxante" : "Pausa reflexiva (resumir mentalmente)",
      cinestésico: experience === "iniciante" ? "Pausa ativa (caminhada leve)" : "Pausa dinâmica (exercícios)",
    }

    const basBreak = breaks[studyType as keyof typeof breaks] || "Pausa relaxante"

    if (pace === "rapido") {
      return basBreak + " (5-10 min)"
    } else if (pace === "devagar") {
      return basBreak + " (15-20 min)"
    }

    return basBreak
  }

  const getAdvancedBreakTips = (studyType: string, pace: string) => {
    const tips = {
      visual: "Descanse os olhos olhando para longe. Evite telas durante a pausa.",
      auditivo: "Ouça música instrumental ou sons da natureza para relaxar.",
      cinestésico: "Mova-se! Faça alongamentos ou uma caminhada rápida.",
    }

    const baseTip = tips[studyType as keyof typeof tips]
    const paceAdd =
      pace === "rapido" ? " Mantenha pausas curtas e eficientes." : " Use pausas mais longas para reflexão."

    return baseTip + paceAdd
  }

  const getAssessmentTips = (studyType: string, experience: string) => {
    const tips = {
      visual: "Crie um mapa visual do que aprendeu hoje. Use cores para diferentes níveis de compreensão.",
      auditivo: "Grave um resumo falado do que estudou. Explique os conceitos principais.",
      cinestésico: "Escreva um resumo prático. Liste o que consegue fazer agora que não conseguia antes.",
    }

    const baseTip = tips[studyType as keyof typeof tips]
    const experienceAdd =
      experience === "iniciante"
        ? " Foque no que conseguiu entender, mesmo que seja pouco."
        : " Identifique conexões com conhecimentos anteriores."

    return baseTip + experienceAdd
  }

  const generateRoutine = async () => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await generateRoutineFromProfile(profile)

    if (!profile.createdAt) {
      const profileWithCreation = { ...profile, createdAt: new Date().toISOString() }
      saveProfile(profileWithCreation)
    } else {
      saveProfile(profile)
    }

    setIsGenerating(false)
    setCurrentStep(5) // Ajustando para novo número de steps
    setHasExistingProfile(true)

    toast({
      title: "Rotina Gerada!",
      description: `Sua rotina personalizada foi ${profile.routineHistory ? "atualizada" : "criada"} com sucesso.`,
    })
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1) // Ajustando máximo de steps
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const editProfile = () => {
    setIsEditingProfile(true)
    setCurrentStep(1)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">R.E.C - Rotina de Estudo Consistente</h1>
            <p className="text-muted-foreground">
              Crie uma rotina de estudos personalizada adaptada ao seu perfil e objetivos para todas as matérias do
              currículo
            </p>
            {hasExistingProfile && !isEditingProfile && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Perfil salvo: {profile.name} • {profile.studyType} • {profile.studyYear} •{" "}
                      {profile.routineHistory || 1} rotina(s) gerada(s)
                    </p>
                    <p className="text-xs text-blue-700">
                      Última atualização:{" "}
                      {profile.lastUpdated ? new Date(profile.lastUpdated).toLocaleDateString("pt-BR") : "Hoje"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={editProfile}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={startNewProfile}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Novo
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-muted-foreground">{currentStep}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Perfil Pessoal */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Perfil Pessoal
                </CardTitle>
                <CardDescription>Vamos conhecer você melhor para criar a rotina ideal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Como você gostaria de ser chamado(a)?</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Seu nome ou apelido"
                  />
                </div>

                <div>
                  <Label>Em que ano você está estudando?</Label>
                  <Select value={profile.studyYear} onValueChange={(value) => handleInputChange("studyYear", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1º Ano">1º Ano - Fundamentos</SelectItem>
                      <SelectItem value="2º Ano">2º Ano - Desenvolvimento</SelectItem>
                      <SelectItem value="3º Ano">3º Ano - Especialização</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Qual é o seu tipo de aprendizagem?</Label>
                  <RadioGroup
                    value={profile.studyType}
                    onValueChange={(value) => handleInputChange("studyType", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="visual" id="visual" />
                      <Label htmlFor="visual" className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        Visual - Aprendo melhor com imagens, gráficos e diagramas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auditivo" id="auditivo" />
                      <Label htmlFor="auditivo" className="flex items-center">
                        <Headphones className="mr-2 h-4 w-4" />
                        Auditivo - Aprendo melhor ouvindo explicações e discussões
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cinestésico" id="cinestésico" />
                      <Label htmlFor="cinestésico" className="flex items-center">
                        <Hand className="mr-2 h-4 w-4" />
                        Cinestésico - Aprendo melhor fazendo e praticando
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Qual é o seu nível de experiência com rotinas de estudo?</Label>
                  <Select value={profile.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante - Nunca tive uma rotina consistente</SelectItem>
                      <SelectItem value="intermediario">Intermediário - Já tentei algumas vezes</SelectItem>
                      <SelectItem value="avancado">Avançado - Tenho experiência com rotinas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Como você prefere aprender?</Label>
                  <Select
                    value={profile.learningPace}
                    onValueChange={(value) => handleInputChange("learningPace", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu ritmo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rapido">Rápido - Gosto de cobrir muito conteúdo</SelectItem>
                      <SelectItem value="normal">Normal - Ritmo equilibrado</SelectItem>
                      <SelectItem value="devagar">Devagar - Prefiro aprofundar cada tópico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={nextStep}
                    disabled={
                      !profile.name ||
                      !profile.studyType ||
                      !profile.experience ||
                      !profile.studyYear ||
                      !profile.learningPace
                    }
                  >
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Disponibilidade e Preferências */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Disponibilidade e Preferências
                </CardTitle>
                <CardDescription>Quando e como você prefere estudar?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Quantas horas por dia você tem disponível para estudar?</Label>
                  <Select
                    value={profile.availableHours}
                    onValueChange={(value) => handleInputChange("availableHours", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as horas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="2">2 horas</SelectItem>
                      <SelectItem value="3">3 horas</SelectItem>
                      <SelectItem value="4">4 horas</SelectItem>
                      <SelectItem value="5">5+ horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quais períodos do dia você prefere estudar? (pode escolher mais de um)</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {["manhã", "tarde", "noite"].map((time) => (
                      <div
                        key={time}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          profile.preferredTime.includes(time)
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleTimeToggle(time)}
                      >
                        <div className="flex items-center justify-center">
                          {time === "manhã" && <Sun className="h-6 w-6 mb-2" />}
                          {time === "tarde" && <Clock className="h-6 w-6 mb-2" />}
                          {time === "noite" && <Moon className="h-6 w-6 mb-2" />}
                        </div>
                        <p className="text-center capitalize font-medium">{time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tempo ideal de estudo por sessão</Label>
                    <Select
                      value={profile.studyDuration}
                      onValueChange={(value) => handleInputChange("studyDuration", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Duração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 minutos (Pomodoro)</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1h30min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tempo de pausa entre sessões</Label>
                    <Select
                      value={profile.breakDuration}
                      onValueChange={(value) => handleInputChange("breakDuration", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pausa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutos</SelectItem>
                        <SelectItem value="10">10 minutos</SelectItem>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={
                      !profile.availableHours ||
                      profile.preferredTime.length === 0 ||
                      !profile.studyDuration ||
                      !profile.breakDuration
                    }
                  >
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Matérias por Ano */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Matérias do Currículo
                </CardTitle>
                <CardDescription>
                  Selecione as matérias que você quer focar baseado no seu ano de estudo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(allSubjects).map(([year, subjects]) => (
                  <div key={year} className={`${profile.studyYear !== year ? "opacity-50" : ""}`}>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Badge variant={profile.studyYear === year ? "default" : "secondary"} className="mr-2">
                        {year}
                      </Badge>
                      {profile.studyYear === year && <span className="text-sm text-green-600">(Seu ano atual)</span>}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            profile.subjects.includes(subject.name)
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          } ${profile.studyYear !== year ? "cursor-not-allowed" : ""}`}
                          onClick={() => profile.studyYear === year && handleSubjectToggle(subject.name)}
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg bg-${subject.color}-100 mr-3`}>
                              {subject.icon === "Zap" && <Zap className="h-5 w-5" />}
                              {subject.icon === "Cpu" && <Cpu className="h-5 w-5" />}
                              {subject.icon === "Calculator" && <Calculator className="h-5 w-5" />}
                              {subject.icon === "Atom" && <Atom className="h-5 w-5" />}
                              {subject.icon === "Monitor" && <Monitor className="h-5 w-5" />}
                              {subject.icon === "Brain" && <Brain className="h-5 w-5" />}
                              {subject.icon === "Home" && <Home className="h-5 w-5" />}
                              {subject.icon === "Code" && <Code className="h-5 w-5" />}
                              {subject.icon === "Wifi" && <Wifi className="h-5 w-5" />}
                              {subject.icon === "Settings" && <Settings className="h-5 w-5" />}
                              {subject.icon === "Wrench" && <Wrench className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium">{subject.name}</p>
                              <p className="text-xs text-muted-foreground">{subject.id}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <Label>Quais áreas você considera mais desafiadoras? (opcional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Essas áreas receberão atenção especial na sua rotina
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Matemática", "Física", "Programação", "Circuitos", "Teoria", "Prática"].map((area) => (
                      <div
                        key={area}
                        className={`p-2 border rounded cursor-pointer transition-all text-sm ${
                          profile.weakAreas.includes(area)
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleWeakAreaToggle(area)}
                      >
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                  <Button onClick={nextStep} disabled={profile.subjects.length === 0}>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Recursos e Objetivos */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Recursos e Objetivos
                </CardTitle>
                <CardDescription>Personalize ainda mais sua experiência de estudo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Que tipos de recursos você prefere usar? (pode escolher vários)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      "Vídeos educativos",
                      "Simuladores",
                      "Livros técnicos",
                      "Exercícios práticos",
                      "Projetos hands-on",
                      "Discussões em grupo",
                      "Tutoriais online",
                      "Laboratórios virtuais",
                    ].map((resource) => (
                      <div
                        key={resource}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          profile.preferredResources.includes(resource)
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleResourceToggle(resource)}
                      >
                        <p className="text-sm font-medium">{resource}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="goals">Qual é o seu principal objetivo de estudo?</Label>
                  <Textarea
                    id="goals"
                    value={profile.goals}
                    onChange={(e) => handleInputChange("goals", e.target.value)}
                    placeholder="Ex: Passar no vestibular, melhorar notas, conseguir estágio, dominar uma tecnologia específica..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="motivation">O que mais te motiva a estudar?</Label>
                  <Textarea
                    id="motivation"
                    value={profile.motivation}
                    onChange={(e) => handleInputChange("motivation", e.target.value)}
                    placeholder="Ex: Conseguir um emprego melhor, realizar um sonho, ajudar outras pessoas, inovação tecnológica..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="distractions">Quais são suas principais distrações durante o estudo?</Label>
                  <Textarea
                    id="distractions"
                    value={profile.distractions}
                    onChange={(e) => handleInputChange("distractions", e.target.value)}
                    placeholder="Ex: Celular, redes sociais, barulho, cansaço, falta de organização..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                  <Button onClick={generateRoutine} disabled={!profile.goals}>
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Gerando Rotina...
                      </>
                    ) : (
                      <>
                        Gerar Rotina
                        <Zap className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Rotina Gerada */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    Sua Rotina Personalizada
                    {profile.routineHistory && profile.routineHistory > 1 && (
                      <Badge variant="secondary" className="ml-2">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {profile.routineHistory}ª versão
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Baseada no seu perfil: {profile.studyType} • {profile.studyYear} • {profile.availableHours}h/dia •{" "}
                    {profile.preferredTime.join(", ")} • Ritmo {profile.learningPace} • Nível {profile.experience}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedRoutine.map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          item.type === "study"
                            ? "border-l-blue-500 bg-blue-50"
                            : item.type === "break"
                              ? "border-l-green-500 bg-green-50"
                              : item.type === "practice"
                                ? "border-l-orange-500 bg-orange-50"
                                : item.type === "assessment"
                                  ? "border-l-purple-500 bg-purple-50"
                                  : "border-l-gray-500 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start flex-1">
                            {item.type === "study" && <BookOpen className="mr-3 h-5 w-5 text-blue-500 mt-0.5" />}
                            {item.type === "break" && <Coffee className="mr-3 h-5 w-5 text-green-500 mt-0.5" />}
                            {item.type === "practice" && <Hand className="mr-3 h-5 w-5 text-orange-500 mt-0.5" />}
                            {item.type === "assessment" && <Brain className="mr-3 h-5 w-5 text-purple-500 mt-0.5" />}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{item.activity}</p>
                                <Badge variant="outline">{item.duration}</Badge>
                                {item.difficulty && (
                                  <Badge
                                    variant={
                                      item.difficulty === "easy"
                                        ? "secondary"
                                        : item.difficulty === "medium"
                                          ? "default"
                                          : "destructive"
                                    }
                                  >
                                    {item.difficulty === "easy"
                                      ? "Fácil"
                                      : item.difficulty === "medium"
                                        ? "Médio"
                                        : "Avançado"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{item.time}</p>
                              {item.tips && <p className="text-xs text-muted-foreground mb-2 italic">💡 {item.tips}</p>}
                              {item.resources && item.resources.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Recursos recomendados:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.resources.map((resource, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {resource}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.techniques && item.techniques.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Técnicas sugeridas:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.techniques.map((technique, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {technique}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                    Dicas Personalizadas para {profile.studyYear}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.studyType === "visual" && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Para você (Visual - {profile.studyYear}):</strong> Use diagramas específicos das
                          matérias do seu ano, mapas conceituais coloridos e simuladores visuais.
                          {profile.studyYear === "1º Ano" &&
                            " Foque em esquemas básicos de circuitos e conceitos fundamentais."}
                          {profile.studyYear === "2º Ano" &&
                            " Explore diagramas de sistemas mais complexos e fluxogramas de programação."}
                          {profile.studyYear === "3º Ano" &&
                            " Use visualizações avançadas de sistemas de controle e análise de potência."}
                        </p>
                      </div>
                    )}
                    {profile.studyType === "auditivo" && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Para você (Auditivo - {profile.studyYear}):</strong> Participe de discussões técnicas,
                          explique conceitos em voz alta e grave resumos.
                          {profile.studyYear === "1º Ano" && " Comece explicando conceitos básicos de eletrônica."}
                          {profile.studyYear === "2º Ano" &&
                            " Discuta algoritmos de programação e funcionamento de sistemas."}
                          {profile.studyYear === "3º Ano" && " Explique sistemas complexos de controle e automação."}
                        </p>
                      </div>
                    )}
                    {profile.studyType === "cinestésico" && (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Para você (Cinestésico - {profile.studyYear}):</strong> Pratique com projetos
                          hands-on, monte circuitos e programe sistemas reais.
                          {profile.studyYear === "1º Ano" && " Monte circuitos básicos em protoboard."}
                          {profile.studyYear === "2º Ano" &&
                            " Desenvolva projetos de programação e instalações práticas."}
                          {profile.studyYear === "3º Ano" && " Implemente sistemas de controle e automação completos."}
                        </p>
                      </div>
                    )}
                    {profile.weakAreas.length > 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Áreas de Reforço:</strong> Sua rotina dedica tempo extra para{" "}
                          {profile.weakAreas.join(", ")}. Use técnicas de repetição espaçada e comece sempre com
                          conceitos mais simples nessas áreas.
                        </p>
                      </div>
                    )}
                    {profile.routineHistory && profile.routineHistory > 1 && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Progresso Contínuo:</strong> Esta é sua {profile.routineHistory}ª rotina! Sua
                          experiência está evoluindo. Continue ajustando conforme seu desenvolvimento nas matérias do{" "}
                          {profile.studyYear}.
                        </p>
                      </div>
                    )}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Lembre-se:</strong> Esta rotina foi criada especificamente para as matérias do{" "}
                        {profile.studyYear} e seu estilo de aprendizagem {profile.studyType}. Ajuste conforme necessário
                        e mantenha a consistência. O R.E.C. é sua principal ferramenta de suporte ao estudo!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={editProfile}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={startNewProfile}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Nova Rotina
                  </Button>
                  <Button onClick={() => router.push("/study")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Voltar aos Estudos
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
