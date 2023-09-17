import { StreamingTextResponse, LangChainStream, Message } from 'ai';
import { ChatOllama } from 'langchain/chat_models/ollama';
import { AIMessage, HumanMessage } from 'langchain/schema';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { stream, handlers } = LangChainStream();

  const llm = new ChatOllama({
    baseUrl: 'http://localhost:11434',
    model: 'llama2:7b',
    temperature: 0.12,
  });

  llm
    .call(
      (messages as Message[]).map(m =>
        m.role == 'user'
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      ),
      {},
      [handlers],
    )
    .catch(console.error);

  return new StreamingTextResponse(stream);
}
