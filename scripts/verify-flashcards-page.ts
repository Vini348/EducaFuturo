// Script to verify flashcards page loads without errors
import { flashcardsData } from "../data/flashcards"

function verifyFlashcardsPage() {
  console.log("🔍 Verificando página de flashcards...")

  // Check if flashcardsData is available
  if (!flashcardsData) {
    console.error("❌ flashcardsData não está definido")
    return false
  }

  if (!Array.isArray(flashcardsData)) {
    console.error("❌ flashcardsData não é um array")
    return false
  }

  if (flashcardsData.length === 0) {
    console.warn("⚠️ flashcardsData está vazio")
    return false
  }

  console.log(`✅ flashcardsData carregado com ${flashcardsData.length} matérias`)

  // Verify data structure
  let totalCards = 0
  let digitalCards = 0
  let analogCards = 0
  let powerCards = 0

  flashcardsData.forEach((subject, index) => {
    console.log(`📚 Matéria ${index + 1}: ${subject.title} (ID: ${subject.id})`)

    if (!subject.topics || !Array.isArray(subject.topics)) {
      console.error(`❌ Matéria ${subject.title} não tem tópicos válidos`)
      return false
    }

    subject.topics.forEach((topic, topicIndex) => {
      if (!topic.cards || !Array.isArray(topic.cards)) {
        console.error(`❌ Tópico ${topicIndex + 1} da matéria ${subject.title} não tem cartões válidos`)
        return false
      }

      topic.cards.forEach((card) => {
        totalCards++

        if (card.subject === "digital") digitalCards++
        else if (card.subject === "analog") analogCards++
        else if (card.subject === "power") powerCards++
      })
    })
  })

  console.log(`📊 Estatísticas dos cartões:`)
  console.log(`   Total: ${totalCards}`)
  console.log(`   Digital: ${digitalCards}`)
  console.log(`   Analógica: ${analogCards}`)
  console.log(`   Potência: ${powerCards}`)

  // Verify required fields
  const requiredSubjectFields = ["id", "title", "topics"]
  const requiredTopicFields = ["id", "title", "cards"]
  const requiredCardFields = ["id", "question", "answer", "subject", "difficulty"]

  let hasErrors = false

  flashcardsData.forEach((subject) => {
    requiredSubjectFields.forEach((field) => {
      if (!subject[field]) {
        console.error(`❌ Matéria ${subject.title || "sem título"} está faltando o campo: ${field}`)
        hasErrors = true
      }
    })

    if (subject.topics) {
      subject.topics.forEach((topic) => {
        requiredTopicFields.forEach((field) => {
          if (!topic[field]) {
            console.error(`❌ Tópico ${topic.title || "sem título"} está faltando o campo: ${field}`)
            hasErrors = true
          }
        })

        if (topic.cards) {
          topic.cards.forEach((card, cardIndex) => {
            requiredCardFields.forEach((field) => {
              if (!card[field]) {
                console.error(`❌ Cartão ${cardIndex + 1} do tópico ${topic.title} está faltando o campo: ${field}`)
                hasErrors = true
              }
            })
          })
        }
      })
    }
  })

  if (hasErrors) {
    console.error("❌ Foram encontrados erros na estrutura dos dados")
    return false
  }

  console.log("✅ Estrutura dos dados verificada com sucesso")

  // Test safe data access (simulating the component logic)
  try {
    const safeFlashcardsData = flashcardsData || []

    const testDigitalCards =
      safeFlashcardsData.flatMap(
        (subject) =>
          subject.topics?.flatMap((topic) => topic.cards?.filter((card) => card.subject === "digital") || []) || [],
      ).length || 0

    const testAnalogCards =
      safeFlashcardsData.flatMap(
        (subject) =>
          subject.topics?.flatMap((topic) => topic.cards?.filter((card) => card.subject === "analog") || []) || [],
      ).length || 0

    const testPowerCards =
      safeFlashcardsData.flatMap(
        (subject) =>
          subject.topics?.flatMap((topic) => topic.cards?.filter((card) => card.subject === "power") || []) || [],
      ).length || 0

    console.log("✅ Lógica de contagem segura testada:")
    console.log(`   Digital: ${testDigitalCards}`)
    console.log(`   Analógica: ${testAnalogCards}`)
    console.log(`   Potência: ${testPowerCards}`)

    if (testDigitalCards !== digitalCards || testAnalogCards !== analogCards || testPowerCards !== powerCards) {
      console.error("❌ Inconsistência na contagem de cartões")
      return false
    }
  } catch (error) {
    console.error("❌ Erro ao testar lógica de contagem:", error)
    return false
  }

  console.log("🎉 Página de flashcards verificada com sucesso!")
  console.log("✅ Todos os testes passaram")

  return true
}

// Run verification
const result = verifyFlashcardsPage()

if (result) {
  console.log("\n🚀 A página de flashcards deve carregar sem erros!")
} else {
  console.log("\n💥 Foram encontrados problemas que podem causar erros na página")
}

export { verifyFlashcardsPage }
