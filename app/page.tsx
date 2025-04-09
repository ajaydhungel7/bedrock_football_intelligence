"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react" // Using AI SDK for chat functionality [^vercel_knowledge_base]
import {
  Send,
  Loader2,
  Download,
  Info,
  Sparkles,
  History,
  BookOpen,
  UsersIcon,
  TrendingUpIcon,
  BarChart3Icon,
  SearchIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function FootballIntelligenceDashboard() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([
    "Analyze potential striker targets under 25 years old",
    "Suggest tactical approach against low-block teams",
    "Compare our defensive metrics to top 4 teams",
    "Identify promising right-backs in Ligue 1 and Bundesliga",
    "Evaluate our pressing effectiveness this season",
    "Analyze the cost-benefit of midfield reinforcements",
  ])

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/football-intelligence",
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  // Detect query type to show appropriate badge
  const getQueryType = (query: string): { type: string; color: string; icon: JSX.Element } => {
    const lowerQuery = query.toLowerCase()

    if (
      lowerQuery.includes("sign") ||
      lowerQuery.includes("transfer") ||
      lowerQuery.includes("buy") ||
      lowerQuery.includes("sell") ||
      lowerQuery.includes("contract") ||
      lowerQuery.includes("target")
    ) {
      return { type: "Transfers", color: "bg-blue-100 text-blue-800", icon: <UsersIcon className="h-3 w-3" /> }
    }

    if (
      lowerQuery.includes("tactic") ||
      lowerQuery.includes("formation") ||
      lowerQuery.includes("approach") ||
      lowerQuery.includes("press") ||
      lowerQuery.includes("defend") ||
      lowerQuery.includes("attack")
    ) {
      return { type: "Strategy", color: "bg-amber-100 text-amber-800", icon: <TrendingUpIcon className="h-3 w-3" /> }
    }

    if (
      lowerQuery.includes("stat") ||
      lowerQuery.includes("metric") ||
      lowerQuery.includes("xg") ||
      lowerQuery.includes("data") ||
      lowerQuery.includes("performance") ||
      lowerQuery.includes("analysis")
    ) {
      return {
        type: "Analytics",
        color: "bg-emerald-100 text-emerald-800",
        icon: <BarChart3Icon className="h-3 w-3" />,
      }
    }

    if (
      lowerQuery.includes("scout") ||
      lowerQuery.includes("prospect") ||
      lowerQuery.includes("talent") ||
      lowerQuery.includes("young") ||
      lowerQuery.includes("promising") ||
      lowerQuery.includes("identify")
    ) {
      return { type: "Scouting", color: "bg-purple-100 text-purple-800", icon: <SearchIcon className="h-3 w-3" /> }
    }

    return { type: "General", color: "bg-gray-100 text-gray-800", icon: <Info className="h-3 w-3" /> }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Football Intelligence</h1>
              <p className="text-xs opacity-80">Advanced Analysis Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto p-4">
        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Intelligence Hub
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Query History
              </TabsTrigger>
            </TabsList>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Info className="h-3 w-3 mr-1" />
                    How It Works
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    This platform uses AI to analyze football data across transfers, tactics, statistics, and scouting.
                    Ask any football intelligence question and the system will route to the appropriate knowledge
                    domain.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <TabsContent value="chat" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Suggested queries sidebar */}
              <Card className="md:col-span-1 h-fit">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Suggested Queries</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    {suggestedQueries.map((query, i) => {
                      const { type, color, icon } = getQueryType(query)
                      return (
                        <div key={i} className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => handleQuickPrompt(query)}
                          >
                            {query}
                          </Button>
                          <Badge className={`self-start text-xs ${color} font-normal`}>
                            <span className="mr-1">{icon}</span>
                            {type}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Chat area */}
              <Card className="md:col-span-3 flex flex-col min-h-[70vh]">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-base">Football Intelligence Assistant</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/10 rounded-full flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-slate-800" />
                        </div>
                        <h3 className="text-lg font-medium">Football Intelligence Assistant</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                          Ask questions about transfers, tactics, statistics, or scouting to get comprehensive insights
                          and analysis to support football operations.
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        // Only show query type badge for user messages
                        const showBadge = message.role === "user"
                        const { type, color, icon } = showBadge
                          ? getQueryType(message.content)
                          : { type: "", color: "", icon: <></> }

                        return (
                          <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className="flex flex-col max-w-[85%]">
                              {showBadge && (
                                <Badge className={`self-end mb-1 text-xs ${color} font-normal`}>
                                  <span className="mr-1">{icon}</span>
                                  {type}
                                </Badge>
                              )}
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  message.role === "user"
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-100 border border-gray-200"
                                }`}
                              >
                                {message.content}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask about transfers, tactics, statistics, or scouting..."
                      className="flex-grow"
                    />
                    <Button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-700"
                      disabled={isLoading || !input.trim()}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Send
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Query History</CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No queries yet. Start a conversation to build your history.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {messages
                      .filter((m) => m.role === "user")
                      .map((message, index) => {
                        const { type, color, icon } = getQueryType(message.content)
                        return (
                          <div key={index} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto py-1"
                                onClick={() => handleQuickPrompt(message.content)}
                              >
                                {message.content}
                              </Button>
                            </div>
                            <Badge className={`text-xs ${color} font-normal`}>
                              <span className="mr-1">{icon}</span>
                              {type}
                            </Badge>
                          </div>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
