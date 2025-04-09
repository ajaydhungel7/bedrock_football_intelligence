import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime"
import { NextRequest } from "next/server"

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
})

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const userInput = messages.map((m: any) => m.content).join("\n")

  const command = new InvokeAgentCommand({
    agentId: process.env.BEDROCK_AGENT_ID!,
    agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID!,
    sessionId: crypto.randomUUID(),
    input: {
      text: userInput,
    },
  })

  const response = await client.send(command)

  const completion = response.completion?.text || "No response from agent."

  return new Response(completion, {
    headers: { "Content-Type": "text/plain" },
  })
}
