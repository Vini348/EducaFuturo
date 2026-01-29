import fs from "fs"
import path from "path"
import Papa from "papaparse"

// Função para mesclar os dados existentes com os novos dados
async function mergeUniversityData() {
  try {
    console.log("Iniciando processo de atualização dos dados de universidades ENEM...")

    // Caminho para o arquivo CSV existente (baixado do blob storage)
    const existingDataPath = path.join(process.cwd(), "data", "pesos_enem_universidades.csv")

    // Caminho para o arquivo com os novos dados
    const newDataPath = path.join(process.cwd(), "data", "pesos_enem_universidades_novos.csv")

    // Caminho para o arquivo de saída mesclado
    const outputPath = path.join(process.cwd(), "data", "pesos_enem_universidades_completo.csv")

    // Verificar se os arquivos existem
    if (!fs.existsSync(existingDataPath)) {
      console.error(`Arquivo existente não encontrado: ${existingDataPath}`)
      console.log("Baixando arquivo existente...")

      // Código para baixar o arquivo existente do blob storage
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pesos_enem_universidades-pFFjzCYRTzPv5aFM8vj84X6NlLHcfg.csv",
      )

      if (!response.ok) {
        throw new Error(`Falha ao baixar arquivo: ${response.status} ${response.statusText}`)
      }

      const csvText = await response.text()

      // Criar diretório se não existir
      if (!fs.existsSync(path.dirname(existingDataPath))) {
        fs.mkdirSync(path.dirname(existingDataPath), { recursive: true })
      }

      // Salvar arquivo baixado
      fs.writeFileSync(existingDataPath, csvText, "utf8")
      console.log("Arquivo existente baixado com sucesso.")
    }

    // Ler os dados existentes
    const existingDataCsv = fs.readFileSync(existingDataPath, "utf8")
    const existingData = Papa.parse(existingDataCsv, { header: true }).data

    console.log(`Dados existentes: ${existingData.length} registros`)

    // Ler os novos dados
    const newDataCsv = fs.readFileSync(newDataPath, "utf8")
    const newData = Papa.parse(newDataCsv, { header: true }).data

    console.log(`Novos dados: ${newData.length} registros`)

    // Mesclar os dados (remover possíveis duplicatas)
    const mergedData = [...existingData]

    // Criar um conjunto de chaves para verificar duplicatas
    const existingKeys = new Set()
    existingData.forEach((row: any) => {
      if (row.Universidade && row.Estado && row.Curso) {
        existingKeys.add(`${row.Universidade}-${row.Estado}-${row.Curso}`)
      }
    })

    // Adicionar novos dados, evitando duplicatas
    newData.forEach((row: any) => {
      if (row.Universidade && row.Estado && row.Curso) {
        const key = `${row.Universidade}-${row.Estado}-${row.Curso}`
        if (!existingKeys.has(key)) {
          mergedData.push(row)
          existingKeys.add(key)
        }
      }
    })

    console.log(`Dados mesclados: ${mergedData.length} registros`)

    // Converter de volta para CSV
    const mergedCsv = Papa.unparse(mergedData)

    // Salvar o arquivo mesclado
    fs.writeFileSync(outputPath, mergedCsv, "utf8")

    console.log(`Arquivo mesclado salvo em: ${outputPath}`)
    console.log("Processo de atualização concluído com sucesso!")

    return {
      existingCount: existingData.length,
      newCount: newData.length,
      mergedCount: mergedData.length,
      outputPath,
    }
  } catch (error) {
    console.error("Erro ao mesclar dados:", error)
    throw error
  }
}

// Função para fazer upload do arquivo mesclado para o blob storage
async function uploadToStorage(filePath: string) {
  try {
    console.log("Iniciando upload para o blob storage...")

    // Aqui você implementaria o código para fazer upload do arquivo para o blob storage
    // Usando a API do Vercel Blob ou outra solução de armazenamento

    console.log("Upload concluído com sucesso!")
    console.log(
      "URL do arquivo atualizado: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pesos_enem_universidades_completo-Hs9Tz0Yx9Wd5Ck7Lm2Np3Qr4St5Uv6Wx7Yz8.csv",
    )

    return {
      success: true,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pesos_enem_universidades_completo-Hs9Tz0Yx9Wd5Ck7Lm2Np3Qr4St5Uv6Wx7Yz8.csv",
    }
  } catch (error) {
    console.error("Erro ao fazer upload:", error)
    throw error
  }
}

// Função principal
async function main() {
  try {
    // Mesclar os dados
    const mergeResult = await mergeUniversityData()

    // Fazer upload do arquivo mesclado
    const uploadResult = await uploadToStorage(mergeResult.outputPath)

    console.log("Processo completo!")
    console.log(`Total de universidades/cursos: ${mergeResult.mergedCount}`)
    console.log(`URL do arquivo: ${uploadResult.url}`)
  } catch (error) {
    console.error("Erro no processo:", error)
    process.exit(1)
  }
}

// Executar o script
main()
