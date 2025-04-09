import { streamText } from "ai" // Using AI SDK for streaming text [^1]
import { bedrock } from "@ai-sdk/amazon-bedrock" // Using AWS Bedrock integration [^vercel_knowledge_base]

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // This is where you would configure your AWS Bedrock model
  // You'll need to replace this with your actual AWS Bedrock configuration
  const result = streamText({
    model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"), // Example model, replace with your actual model
    messages,
    system:
      "You are a helpful football expert assistant. Provide knowledgeable and enthusiastic responses about football topics including teams, players, rules, history, and statistics. Keep responses concise and engaging with a touch of football enthusiasm.",
  })

  return result.toDataStreamResponse()
}
