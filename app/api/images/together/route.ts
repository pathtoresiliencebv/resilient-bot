import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ServerRuntime } from "next"
import Together from "together-ai"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { prompt, model = "black-forest-labs/FLUX.1-schnell-Free" } = json as {
    prompt: string
    model?: string
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.together_api_key, "Together AI")

    const together = new Together({
      apiKey: profile.together_api_key || process.env.TOGETHER_API_KEY
    })

    const response = await together.images.create({
      model: model,
      prompt: prompt,
      width: 1024,
      height: 1024,
      steps: 4,
      n: 1
    })

    const imageData = response.data[0]
    const imageUrl =
      "b64_json" in imageData
        ? `data:image/png;base64,${imageData.b64_json}`
        : imageData.url

    return new Response(
      JSON.stringify({
        data: [
          {
            url: imageUrl
          }
        ]
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Together AI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "Together AI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
