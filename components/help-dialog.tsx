"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { useTranslation } from "@/hooks/useTranslation"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "help" | "about" | "report"
}

export function HelpDialog({ open, onOpenChange, type }: HelpDialogProps) {
  const { getLocalizedContent } = useTranslation()
  const [reportType, setReportType] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reportType || !reportDescription.trim()) {
      alert("Por favor, preencha todos os campos")
      return
    }

    const subject = encodeURIComponent(`[EducaFuturo] Relatório de Problema - ${reportType}`)
    const body = encodeURIComponent(`
Tipo: ${reportType}

Descrição:
${reportDescription}

Data: ${new Date().toLocaleString("pt-BR")}
`)

    window.location.href = `mailto:educafuturoo@gmail.com?subject=${subject}&body=${body}`

    // Reset form and close dialog
    setReportType("")
    setReportDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {getLocalizedContent({
              "pt-BR":
                type === "help"
                  ? "Central de Ajuda"
                  : type === "about"
                    ? "Sobre o EducaFuturo"
                    : "Reportar um Problema",
              en: type === "help" ? "Help Center" : type === "about" ? "About EducaFuturo" : "Report a Problem",
              es:
                type === "help"
                  ? "Centro de Ayuda"
                  : type === "about"
                    ? "Acerca de EducaFuturo"
                    : "Reportar un Problema",
            })}
          </DialogTitle>
          <DialogDescription>
            {getLocalizedContent({
              "pt-BR":
                type === "help"
                  ? "Encontre respostas para suas dúvidas e aprenda a usar todas as funcionalidades."
                  : type === "about"
                    ? "Conheça mais sobre nossa plataforma."
                    : "Ajude-nos a melhorar reportando problemas.",
              en:
                type === "help"
                  ? "Find answers to your questions and learn how to use all features."
                  : type === "about"
                    ? "Learn more about our platform."
                    : "Help us improve by reporting problems.",
              es:
                type === "help"
                  ? "Encuentre respuestas a sus preguntas y aprenda a usar todas las funcionalidades."
                  : type === "about"
                    ? "Conozca más sobre nuestra plataforma."
                    : "Ayúdenos a mejorar reportando problemas.",
            })}
          </DialogDescription>
        </DialogHeader>

        {type === "help" && (
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">
                {getLocalizedContent({
                  "pt-BR": "Conta",
                  en: "Account",
                  es: "Cuenta",
                })}
              </TabsTrigger>
              <TabsTrigger value="study">
                {getLocalizedContent({
                  "pt-BR": "Estudos",
                  en: "Studies",
                  es: "Estudios",
                })}
              </TabsTrigger>
              <TabsTrigger value="technical">
                {getLocalizedContent({
                  "pt-BR": "Técnico",
                  en: "Technical",
                  es: "Técnico",
                })}
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[500px] mt-4">
              <TabsContent value="account">
                <Accordion type="single" collapsible>
                  <AccordionItem value="change-password">
                    <AccordionTrigger>
                      {getLocalizedContent({
                        "pt-BR": "Como alterar minha senha?",
                        en: "How to change my password?",
                        es: "¿Cómo cambiar mi contraseña?",
                      })}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p>
                          {getLocalizedContent({
                            "pt-BR": "Para alterar sua senha, siga estes passos:",
                            en: "To change your password, follow these steps:",
                            es: "Para cambiar su contraseña, siga estos pasos:",
                          })}
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>
                            {getLocalizedContent({
                              "pt-BR": "Acesse seu perfil clicando no ícone de usuário no topo da página",
                              en: "Access your profile by clicking on the user icon at the top of the page",
                              es: "Acceda a su perfil haciendo clic en el icono de usuario en la parte superior de la página",
                            })}
                          </li>
                          <li>
                            {getLocalizedContent({
                              "pt-BR": 'Clique em "Configurações"',
                              en: 'Click on "Settings"',
                              es: 'Haga clic en "Configuración"',
                            })}
                          </li>
                          <li>
                            {getLocalizedContent({
                              "pt-BR": 'Na seção "Segurança", clique em "Alterar senha"',
                              en: 'In the "Security" section, click on "Change password"',
                              es: 'En la sección "Seguridad", haga clic en "Cambiar contraseña"',
                            })}
                          </li>
                          <li>
                            {getLocalizedContent({
                              "pt-BR": "Digite sua senha atual e a nova senha",
                              en: "Enter your current password and the new password",
                              es: "Ingrese su contraseña actual y la nueva contraseña",
                            })}
                          </li>
                          <li>
                            {getLocalizedContent({
                              "pt-BR": 'Confirme a nova senha e clique em "Salvar"',
                              en: 'Confirm the new password and click on "Save"',
                              es: 'Confirme la nueva contraseña y haga clic en "Guardar"',
                            })}
                          </li>
                        </ol>
                        <Button asChild>
                          <Link href="/account">
                            {getLocalizedContent({
                              "pt-BR": "Ir para Configurações",
                              en: "Go to Settings",
                              es: "Ir a la configuración",
                            })}
                          </Link>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Add more AccordionItems for other account-related help topics */}
                </Accordion>
              </TabsContent>

              <TabsContent value="study">
                <Accordion type="single" collapsible>
                  <AccordionItem value="flashcards">
                    <AccordionTrigger>
                      {getLocalizedContent({
                        "pt-BR": "Como usar os flashcards?",
                        en: "How to use flashcards?",
                        es: "¿Cómo usar las tarjetas didácticas?",
                      })}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p>
                          {getLocalizedContent({
                            "pt-BR": "Os flashcards são uma ferramenta eficiente de estudo:",
                            en: "Flashcards are an efficient study tool:",
                            es: "Las tarjetas didácticas son una herramienta de estudio eficiente:",
                          })}
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>
                            {getLocalizedContent({
                              "pt-BR": "Escolha uma matéria ou tópico na seção de flashcards",
                              en: "Choose a subject or topic in the flashcards section",
                              es: "Elija una materia o tema en la sección de tarjetas didácticas",
                            })}
                          </li>
                          <li>
                            {getLocalizedContent({
                              "pt-BR": "Clique no cartão para ver a resposta",
                              en: "Click on the card to see the answer",
                              es: "Haga clic en la tarjeta para ver la respuesta",
                            })}
                          </li>
                          <li>
                            {getLocalizedContent({
                              "pt-BR": "Marque se você acertou ou errou",
                              en: "Mark if you got it right or wrong",
                              es: "Marque si acertó o falló",
                            })}
                          </li>
                          <li>
                            {getLocalizedContent({
                              "pt-BR": "O sistema adaptará o conteúdo com base no seu desempenho",
                              en: "The system will adapt the content based on your performance",
                              es: "El sistema adaptará el contenido en función de su rendimiento",
                            })}
                          </li>
                        </ol>
                        <Button asChild>
                          <Link href="/flashcards">
                            {getLocalizedContent({
                              "pt-BR": "Começar a Estudar com Flashcards",
                              en: "Start Studying with Flashcards",
                              es: "Comenzar a estudiar con tarjetas didácticas",
                            })}
                          </Link>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Add more AccordionItems for other study-related help topics */}
                </Accordion>
              </TabsContent>

              <TabsContent value="technical">
                <Accordion type="single" collapsible>
                  <AccordionItem value="login-issues">
                    <AccordionTrigger>
                      {getLocalizedContent({
                        "pt-BR": "Problemas de login",
                        en: "Login issues",
                        es: "Problemas de inicio de sesión",
                      })}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <h4 className="font-medium">
                          {getLocalizedContent({
                            "pt-BR": "Soluções comuns para problemas de login:",
                            en: "Common solutions for login problems:",
                            es: "Soluciones comunes para problemas de inicio de sesión:",
                          })}
                        </h4>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>
                            <strong>
                              {getLocalizedContent({
                                "pt-BR": "Esqueceu a senha?",
                                en: "Forgot your password?",
                                es: "¿Olvidó su contraseña?",
                              })}
                            </strong>
                            <p>
                              {getLocalizedContent({
                                "pt-BR": 'Use a opção "Esqueci minha senha" na tela de login para redefinir.',
                                en: 'Use the "Forgot my password" option on the login screen to reset.',
                                es: 'Utilice la opción "Olvidé mi contraseña" en la pantalla de inicio de sesión para restablecerla.',
                              })}
                            </p>
                          </li>
                          {/* Add more login issue solutions */}
                        </ol>
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {getLocalizedContent({
                              "pt-BR": "Se o problema persistir, entre em contato com nosso suporte técnico.",
                              en: "If the problem persists, contact our technical support.",
                              es: "Si el problema persiste, póngase en contacto con nuestro soporte técnico.",
                            })}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Add more AccordionItems for other technical help topics */}
                </Accordion>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}

        {type === "about" && (
          <ScrollArea className="h-[500px]">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2">
                  {getLocalizedContent({ "pt-BR": "O EducaFuturo", en: "EducaFuturo", es: "EducaFuturo" })}
                </h3>
                <p className="text-gray-600">
                  {getLocalizedContent({
                    "pt-BR":
                      "O EducaFuturo é uma iniciativa inspiradora que nasce com o propósito de revolucionar a educação pública no Brasil. Focado nos princípios da ODS 4 da ONU, que visa garantir uma educação inclusiva, equitativa e de qualidade, o projeto busca oferecer novas possibilidades de aprendizagem através de métodos inovadores e criativos.",
                    en: "EducaFuturo is an inspiring initiative born with the purpose of revolutionizing public education in Brazil. Focused on the principles of SDG 4 of the UN, which aims to ensure inclusive, equitable and quality education, the project seeks to offer new learning possibilities through innovative and creative methods.",
                    es: "EducaFuturo es una iniciativa inspiradora que nace con el propósito de revolucionar la educación pública en Brasil. Enfocado en los principios del ODS 4 de la ONU, que busca garantizar una educación inclusiva, equitativa y de calidad, el proyecto busca ofrecer nuevas posibilidades de aprendizaje a través de métodos innovadores y creativos.",
                  })}
                </p>
              </section>

              {/* Add more sections for the about content */}
            </div>
          </ScrollArea>
        )}

        {type === "report" && (
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                {getLocalizedContent({ "pt-BR": "Tipo de problema", en: "Type of problem", es: "Tipo de problema" })}
              </Label>
              <select
                id="type"
                className="w-full p-2 border rounded-md"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
              >
                <option value="" disabled>
                  {getLocalizedContent({
                    "pt-BR": "Selecione o tipo",
                    en: "Select the type",
                    es: "Seleccione el tipo",
                  })}
                </option>
                <option value="bug">
                  {getLocalizedContent({ "pt-BR": "Bug/Erro", en: "Bug/Error", es: "Error/Bug" })}
                </option>
                <option value="content">
                  {getLocalizedContent({ "pt-BR": "Conteúdo", en: "Content", es: "Contenido" })}
                </option>
                <option value="suggestion">
                  {getLocalizedContent({ "pt-BR": "Sugestão", en: "Suggestion", es: "Sugerencia" })}
                </option>
                <option value="other">{getLocalizedContent({ "pt-BR": "Outro", en: "Other", es: "Otro" })}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                {getLocalizedContent({ "pt-BR": "Descrição", en: "Description", es: "Descripción" })}
              </Label>
              <textarea
                id="description"
                className="w-full h-32 p-2 border rounded-md resize-none"
                placeholder={getLocalizedContent({
                  "pt-BR": "Descreva o problema em detalhes...",
                  en: "Describe the problem in detail...",
                  es: "Describa el problema con detalle...",
                })}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {getLocalizedContent({ "pt-BR": "Cancelar", en: "Cancel", es: "Cancelar" })}
              </Button>
              <Button type="submit">{getLocalizedContent({ "pt-BR": "Enviar", en: "Send", es: "Enviar" })}</Button>
            </DialogFooter>
          </form>
        )}
        {reportType && (
          <p className="text-sm text-green-600 mt-2">
            {getLocalizedContent({
              "pt-BR":
                "Seu aplicativo de email será aberto para enviar o relatório. Obrigado por nos ajudar a melhorar!",
              en: "Your email application will open to send the report. Thank you for helping us improve!",
              es: "Su aplicación de correo electrónico se abrirá para enviar el informe. ¡Gracias por ayudarnos a mejorar!",
            })}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
