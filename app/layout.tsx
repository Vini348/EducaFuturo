import type React from "react"
import { Providers } from "@/components/providers"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Remover Content-Security-Policy para evitar bloqueios de requisições */}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
