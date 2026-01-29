import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { WeeklySchedule, SubjectSchedule, CustomActivity } from "@/types/schedule"
import type { Subject } from "@/types/pas"

interface GradeCalculation {
  average: number
  needed: string
  excess: string
  status: "passing" | "failing" | "warning"
}

export function exportScheduleToPDF(
  schedule: WeeklySchedule,
  subjects: SubjectSchedule[],
  customActivities: CustomActivity[],
) {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text("Cronograma de Estudos", 14, 15)
  doc.setFontSize(10)
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 22)

  const days = [
    { key: "monday", label: "Segunda" },
    { key: "tuesday", label: "Terça" },
    { key: "wednesday", label: "Quarta" },
    { key: "thursday", label: "Quinta" },
    { key: "friday", label: "Sexta" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
  ]

  days.forEach((day, index) => {
    doc.addPage()
    doc.setFontSize(14)
    doc.text(day.label, 14, 15)

    const daySchedule = schedule[day.key as keyof WeeklySchedule]
    const tableData = daySchedule.map((slot) => [
      `${slot.startTime} - ${slot.endTime}`,
      slot.activity,
      slot.subject || "",
      slot.description || "",
    ])

    autoTable(doc, {
      startY: 20,
      head: [["Horário", "Atividade", "Matéria", "Descrição"]],
      body: tableData,
    })
  })

  // Add subjects page
  doc.addPage()
  doc.setFontSize(14)
  doc.text("Matérias", 14, 15)

  const subjectsData = subjects.map((subject) => [
    subject.name,
    subject.description,
    `${subject.frequency}x por semana`,
  ])

  autoTable(doc, {
    startY: 20,
    head: [["Matéria", "Descrição", "Frequência"]],
    body: subjectsData,
  })

  // Add custom activities page
  doc.addPage()
  doc.setFontSize(14)
  doc.text("Atividades Personalizadas", 14, 15)

  const activitiesData = customActivities.map((activity) => [activity.name])

  autoTable(doc, {
    startY: 20,
    head: [["Atividade"]],
    body: activitiesData,
  })

  // Save the PDF
  doc.save("cronograma-de-estudos.pdf")
}

export function exportGradesToPDF(subjects: Subject[]) {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text("Relatório de Notas Escolares", 14, 15)
  doc.setFontSize(10)
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 22)

  // Calculate grades for each subject
  const subjectsWithCalculations = subjects.map((subject) => {
    const validGrades = subject.grades.filter((grade: number | null): grade is number => grade !== null)
    const average =
      validGrades.length > 0
        ? validGrades.reduce((acc: number, grade: number) => acc + grade, 0) / validGrades.length
        : 0

    const remainingGrades = 4 - validGrades.length
    const totalNeeded = subject.finalAverage * 4
    const currentTotal = average * validGrades.length
    const needed = remainingGrades > 0 ? (totalNeeded - currentTotal) / remainingGrades : 0

    const excess = remainingGrades === 0 ? average - subject.finalAverage : 0

    const status =
      remainingGrades === 0
        ? average >= subject.finalAverage
          ? "passing"
          : "failing"
        : needed <= 10
          ? needed <= 7
            ? "passing"
            : "warning"
          : "failing"

    return {
      ...subject,
      calculation: {
        average,
        needed: needed <= 10 ? needed.toFixed(2) : "10.00",
        excess: excess > 0 ? excess.toFixed(2) : "0.00",
        status,
      },
    }
  })

  // Define table headers and data
  const headers = [["Matéria", "1º", "2º", "3º", "4º", "Méd", "M.Fin", "Nec", "Exc", "Status"]]

  const data = subjectsWithCalculations.map((subject) => [
    subject.name,
    subject.grades[0]?.toFixed(1) || "-",
    subject.grades[1]?.toFixed(1) || "-",
    subject.grades[2]?.toFixed(1) || "-",
    subject.grades[3]?.toFixed(1) || "-",
    subject.calculation.average.toFixed(1),
    subject.finalAverage.toFixed(1),
    subject.calculation.needed,
    subject.calculation.excess,
    getStatusText(subject.calculation.status),
  ])

  // Add table
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    styles: {
      fontSize: 7,
      cellPadding: 1,
    },
    columnStyles: {
      0: { cellWidth: 35 }, // Matéria
      1: { cellWidth: 10 }, // 1º Bim
      2: { cellWidth: 10 }, // 2º Bim
      3: { cellWidth: 10 }, // 3º Bim
      4: { cellWidth: 10 }, // 4º Bim
      5: { cellWidth: 13 }, // Média
      6: { cellWidth: 13 }, // Média Final
      7: { cellWidth: 13 }, // Necessária
      8: { cellWidth: 13 }, // Excedente
      9: { cellWidth: 18 }, // Status
    },
    didDrawCell: (data) => {
      // Add color to status cell
      if (data.section === "body" && data.column.index === 9) {
        const status = subjectsWithCalculations[data.row.index].calculation.status
        const color = getStatusColor(status)
        doc.setFillColor(...color)
        doc.circle(data.cell.x + 3, data.cell.y + data.cell.height / 2, 2, "F")
      }
    },
  })

  // Add legend
  const legendY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(10)
  doc.text("Legenda:", 14, legendY)

  // Status indicators
  const statuses = [
    { text: "Aprovado", color: getStatusColor("passing") },
    { text: "Em risco", color: getStatusColor("warning") },
    { text: "Reprovado", color: getStatusColor("failing") },
  ]

  statuses.forEach((status, index) => {
    const y = legendY + 7 + index * 7
    doc.setFillColor(...status.color)
    doc.circle(17, y, 2, "F")
    doc.text(status.text, 22, y + 1)
  })

  // Save the PDF
  doc.save("notas-escolares.pdf")
}

function getStatusText(status: "passing" | "failing" | "warning"): string {
  switch (status) {
    case "passing":
      return "Aprovado"
    case "warning":
      return "Em risco"
    case "failing":
      return "Reprovado"
  }
}

function getStatusColor(status: "passing" | "failing" | "warning"): [number, number, number] {
  switch (status) {
    case "passing":
      return [34, 197, 94] // green-500
    case "warning":
      return [234, 179, 8] // yellow-500
    case "failing":
      return [239, 68, 68] // red-500
  }
}
