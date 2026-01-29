"use client"

import { useAuth } from "@/lib/authContext"
import type { MultilingualContent } from "@/types/flashcards"

export function useTranslation() {
  const { user } = useAuth()
  const defaultLanguage = "pt-BR"

  const getLocalizedContent = (content: MultilingualContent): string => {
    const userLanguage = user?.settings?.language || defaultLanguage
    return content[userLanguage as keyof MultilingualContent] || content[defaultLanguage]
  }

  return {
    getLocalizedContent,
    t: (key: string) => {
      const translations: Record<string, MultilingualContent> = {
        question: {
          "pt-BR": "Pergunta",
          en: "Question",
          es: "Pregunta",
        },
        answer: {
          "pt-BR": "Resposta",
          en: "Answer",
          es: "Respuesta",
        },
      }
      return getLocalizedContent(translations[key])
    },
  }
}
