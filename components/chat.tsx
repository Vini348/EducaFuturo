"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/authContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    if (user) {
      fetchMessages()
      const channel = supabase
        .channel("chat_messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          (payload) => {
            const newMessage = payload.new as ChatMessage
            if (newMessage.sender_id === user.id || newMessage.receiver_id === user.id) {
              setMessages((prev) => [...prev, newMessage])
            }
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  async function fetchMessages() {
    if (user) {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching messages:", error)
      } else {
        setMessages(data || [])
      }
    }
  }

  async function sendMessage() {
    if (user && newMessage.trim()) {
      const { error } = await supabase
        .from("chat_messages")
        .insert({ sender_id: user.id, receiver_id: "general", content: newMessage })

      if (error) {
        console.error("Error sending message:", error)
      } else {
        setNewMessage("")
      }
    }
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 mb-4">
          {messages.map((message) => (
            <div key={message.id} className={`mb-2 ${message.sender_id === user?.id ? "text-right" : "text-left"}`}>
              <span className="inline-block bg-blue-100 rounded px-2 py-1">{message.content}</span>
            </div>
          ))}
        </ScrollArea>
        <div className="flex">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 mr-2"
          />
          <Button onClick={sendMessage}>Enviar</Button>
        </div>
      </CardContent>
    </Card>
  )
}
