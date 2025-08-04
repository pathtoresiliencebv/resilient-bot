import { LLM } from "@/types"

const TOGETHER_PLATORM_LINK = "https://together.ai"

// Together AI Models (Free)
const LLAMA_3_3_70B_INSTRUCT_TURBO_FREE: LLM = {
  modelId: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
  modelName: "Llama 3.3 70B Instruct Turbo (Free)",
  provider: "together",
  hostedId: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
  platformLink: TOGETHER_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0
  }
}

const EXAONE_3_5_32B_INSTRUCT: LLM = {
  modelId: "lgai/exaone-3-5-32b-instruct",
  modelName: "EXAONE 3.5 32B Instruct",
  provider: "together",
  hostedId: "lgai/exaone-3-5-32b-instruct",
  platformLink: TOGETHER_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0
  }
}

const DEEPSEEK_R1_DISTILL_LLAMA_70B_FREE: LLM = {
  modelId: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
  modelName: "DeepSeek R1 Distill Llama 70B (Free)",
  provider: "together",
  hostedId: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
  platformLink: TOGETHER_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0
  }
}

const LLAMA_VISION_FREE: LLM = {
  modelId: "meta-llama/Llama-Vision-Free",
  modelName: "Llama Vision (Free)",
  provider: "together",
  hostedId: "meta-llama/Llama-Vision-Free",
  platformLink: TOGETHER_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0
  }
}

export const TOGETHER_LLM_LIST: LLM[] = [
  LLAMA_3_3_70B_INSTRUCT_TURBO_FREE,
  EXAONE_3_5_32B_INSTRUCT,
  DEEPSEEK_R1_DISTILL_LLAMA_70B_FREE,
  LLAMA_VISION_FREE
]
