import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const uploadPDF = async (filePath: string, fileName: string) => {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const { data, error } = await supabase.storage.from("mindmap-pdfs").upload(fileName, fileBuffer, {
      contentType: "application/pdf",
    })

    if (error) throw error
    console.log(`Uploaded ${fileName} successfully`)
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error)
  }
}

const uploadAllPDFs = async () => {
  const pdfDir = path.join(process.cwd(), "public", "pdfs")
  const files = [
    { path: path.join(pdfDir, "fontes-alimentacao.pdf"), name: "power-supplies.pdf" },
    { path: path.join(pdfDir, "amplificadores-operacionais.pdf"), name: "op-amps.pdf" },
    { path: path.join(pdfDir, "eletronica-digital-basica.pdf"), name: "digital-basics.pdf" },
  ]

  for (const file of files) {
    await uploadPDF(file.path, file.name)
  }
}

uploadAllPDFs()
