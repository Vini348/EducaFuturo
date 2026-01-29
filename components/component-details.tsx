"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Copy, Check } from "lucide-react"
import type { ComponentCategory, ComponentModel } from "@/app/study/components/page"
import { useToast } from "@/components/ui/use-toast"

interface ComponentDetailsProps {
  component: ComponentCategory
  selectedModel: ComponentModel | null
  onSelectModel: (model: ComponentModel) => void
  onClose: () => void
}

export function ComponentDetails({ component, selectedModel, onSelectModel, onClose }: ComponentDetailsProps) {
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const handleCopyInfo = () => {
    if (!selectedModel) return

    const info = `
Componente: ${component.name}
Modelo: ${selectedModel.name}
Características:
${Object.entries(selectedModel.characteristics)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}
Aplicações:
${selectedModel.applications.map((app) => `- ${app}`).join("\n")}
${selectedModel.datasheet ? `Datasheet: ${selectedModel.datasheet}` : ""}
    `.trim()

    navigator.clipboard.writeText(info)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Informações copiadas",
      description: "As informações do componente foram copiadas para a área de transferência.",
      duration: 2000,
    })
  }

  const handleDownloadDatasheet = () => {
    if (selectedModel?.datasheet) {
      window.open(selectedModel.datasheet, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {component.name}
            <Badge variant="secondary" className="font-mono ml-2">
              {component.symbol}
            </Badge>
          </DialogTitle>
          <DialogDescription>{component.description}</DialogDescription>
        </DialogHeader>

        {component.models.length > 0 ? (
          <>
            <Tabs
              defaultValue={component.models[0]?.id}
              value={selectedModel?.id}
              onValueChange={(value) => {
                const model = component.models.find((m) => m.id === value)
                if (model) onSelectModel(model)
              }}
            >
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 w-full">
                {component.models.map((model) => (
                  <TabsTrigger key={model.id} value={model.id}>
                    {model.name.split(" ").pop()}
                  </TabsTrigger>
                ))}
              </TabsList>

              {component.models.map((model) => (
                <TabsContent key={model.id} value={model.id} className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {model.name}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyInfo}
                            className="flex items-center gap-1"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copiado" : "Copiar"}
                          </Button>

                          {model.datasheet && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleDownloadDatasheet}
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Datasheet
                            </Button>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-gray-700">Características:</h4>
                          <ul className="space-y-1 text-sm">
                            {Object.entries(model.characteristics).map(([key, value]) => (
                              <li key={key} className="flex">
                                <span className="font-medium min-w-[120px] text-gray-600">{key}:</span>
                                <span>{value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-gray-700">Aplicações:</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {model.applications.map((application, index) => (
                              <li key={index}>{application}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">
              Informações detalhadas sobre modelos deste componente ainda não estão disponíveis.
            </p>
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">Características gerais:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {component.characteristics.map((characteristic, index) => (
              <li key={index}>{characteristic}</li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
