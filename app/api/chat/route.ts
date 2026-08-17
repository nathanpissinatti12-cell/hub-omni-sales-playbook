import { CHAT_SYSTEM_PROMPT } from "@/lib/chatKnowledge";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 20;

export async function POST(req: Request) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return new Response("DEEPSEEK_API_KEY não configurada no servidor.", { status: 500 });
  }

  const body = (await req.json()) as { messages?: ChatMessage[] };
  const messages = (body.messages ?? []).slice(-MAX_MESSAGES);

  if (messages.length === 0) {
    return new Response("Nenhuma mensagem enviada.", { status: 400 });
  }

  const upstream = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-v4-flash",
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return new Response(
      `Erro ao chamar a DeepSeek (${upstream.status}). ${errText.slice(0, 300)}`,
      { status: 502 }
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // A API da DeepSeek manda eventos SSE ("data: {...}\n\n"), no mesmo
          // formato da OpenAI. Processa linha completa por linha completa e
          // guarda o resto (linha ainda incompleta) no buffer pra proxima leitura.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // linha SSE parcial/invalida - ignora, o resto vem no proximo chunk
            }
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode("\n\n[Erro ao gerar resposta. Tente novamente.]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
