import type { AIPreset } from "@/lib/hooks/use-ai-presets";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIRequestOptions {
  messages: ChatMessage[];
  preset: AIPreset;
}

export async function makeAIRequest({ messages, preset }: AIRequestOptions): Promise<string> {
  let apiUrl: string;
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  switch (preset.provider) {
    case "openai":
      apiUrl = "https://api.openai.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${preset.apiKey}`;
      break;
    case "custom":
      if (preset.url?.includes("openrouter")) {
        apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        headers["Authorization"] = `Bearer ${preset.apiKey}`;
      } else {
        apiUrl = preset.url + "/v1/chat/completions";
        if (preset.apiKey) {
          headers["Authorization"] = `Bearer ${preset.apiKey}`;
        }
      }
      break;
    case "native-ollama":
      apiUrl = "http://localhost:11434/v1/chat/completions";
      break;
    case "screenpipe-cloud":
      apiUrl = "https://ai.screenpipe.ai/v1/chat/completions";
      headers["Authorization"] = `Bearer ${preset.apiKey}`;
      break;
    default:
      throw new Error(`Unsupported AI provider: ${preset.provider}`);
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: preset.model,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error("AI request failed: " + (error as Error).message);
  }
}

