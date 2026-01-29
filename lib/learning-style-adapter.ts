// Sistema de adaptação de conteúdo baseado no estilo de aprendizado do usuário

export interface LearningStylePreference {
  style: "visual" | "auditivo" | "leitura" | "pratico"
  contentTypes: string[]
  icons: string[]
  description: string
}

export const LEARNING_STYLES: Record<string, LearningStylePreference> = {
  visual: {
    style: "visual",
    contentTypes: ["vídeos", "diagramas", "infográficos", "slides", "mapas mentais"],
    icons: ["📊", "🎨", "📸", "🎬"],
    description: "Você aprende melhor com conteúdo visual: vídeos, diagramas, gráficos e imagens",
  },
  auditivo: {
    style: "auditivo",
    contentTypes: ["áudios", "podcasts", "explicações faladas", "discussões"],
    icons: ["🎧", "🎙️", "📢", "🎵"],
    description: "Você aprende melhor ouvindo: áudios, podcasts e explicações faladas",
  },
  leitura: {
    style: "leitura",
    contentTypes: ["textos", "resumos", "artigos", "livros", "documentos"],
    icons: ["📚", "📖", "📝", "✍️"],
    description: "Você aprende melhor lendo: textos, resumos e artigos detalhados",
  },
  pratico: {
    style: "pratico",
    contentTypes: ["exercícios", "simulados", "problemas práticos", "projetos"],
    icons: ["⚙️", "🧪", "💻", "🎯"],
    description: "Você aprende melhor praticando: exercícios, simulados e problemas reais",
  },
}

export function getContentRecommendations(learningStyle: string): string[] {
  return LEARNING_STYLES[learningStyle]?.contentTypes || []
}

export function getStyleDescription(learningStyle: string): string {
  return LEARNING_STYLES[learningStyle]?.description || "Estilo de aprendizado não definido"
}

export function getAdaptedChallengeType(learningStyle: string, allTypes: string[]): string[] {
  const contentTypes = getContentRecommendations(learningStyle)
  return allTypes.filter((type) => contentTypes.some((ct) => type.toLowerCase().includes(ct.toLowerCase())))
}
