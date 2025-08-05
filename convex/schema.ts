import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles
  profiles: defineTable({
    userId: v.string(), // Auth user ID
    username: v.string(),
    displayName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    hasOnboarded: v.boolean(),
    imageUrl: v.optional(v.string()),
    
    // API Keys
    openaiApiKey: v.optional(v.string()),
    anthropicApiKey: v.optional(v.string()),
    googleGeminiApiKey: v.optional(v.string()),
    mistralApiKey: v.optional(v.string()),
    groqApiKey: v.optional(v.string()),
    perplexityApiKey: v.optional(v.string()),
    openrouterApiKey: v.optional(v.string()),
    azureOpenaiApiKey: v.optional(v.string()),
    togetherApiKey: v.optional(v.string()),
    
    // Settings
    profileContext: v.optional(v.string()),
    useAzureOpenai: v.boolean(),
    azureOpenaiEndpoint: v.optional(v.string()),
    azureOpenai35TurboId: v.optional(v.string()),
    azureOpenai45TurboId: v.optional(v.string()),
    azureOpenai45VisionId: v.optional(v.string()),
    azureOpenaiEmbeddingsId: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_username", ["username"]),

  // Workspaces
  workspaces: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    instructions: v.optional(v.string()),
    defaultContextLength: v.number(),
    defaultModel: v.string(),
    defaultPrompt: v.optional(v.string()),
    defaultTemperature: v.number(),
    embeddings: v.string(),
    includeProfileContext: v.boolean(),
    includeWorkspaceInstructions: v.boolean(),
    isHome: v.boolean(),
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_is_home", ["userId", "isHome"]),

  // Chats
  chats: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    assistantId: v.optional(v.string()),
    contextLength: v.number(),
    model: v.string(),
    prompt: v.string(),
    temperature: v.number(),
    embeddings: v.string(),
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_user_id_workspace_id", ["userId", "workspaceId"]),

  // Messages
  messages: defineTable({
    userId: v.string(),
    chatId: v.string(),
    role: v.union(v.literal("system"), v.literal("user"), v.literal("assistant")),
    content: v.string(),
    model: v.string(),
    sequenceNumber: v.number(),
    imageUrls: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_chat_id", ["chatId"])
    .index("by_chat_id_sequence", ["chatId", "sequenceNumber"]),

  // Folders
  folders: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("chats"),
      v.literal("presets"),
      v.literal("prompts"),
      v.literal("files"),
      v.literal("collections"),
      v.literal("assistants"),
      v.literal("tools"),
      v.literal("models")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_user_id_type", ["userId", "type"]),

  // Files
  files: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    folderId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    fileUrl: v.string(),
    fileType: v.string(),
    size: v.number(),
    tokens: v.number(),
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_folder_id", ["folderId"]),

  // File items (chunks)
  fileItems: defineTable({
    userId: v.string(),
    fileId: v.string(),
    content: v.string(),
    tokens: v.number(),
    embedding: v.array(v.number()),
    localEmbedding: v.optional(v.array(v.number())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_file_id", ["fileId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  // Assistants
  assistants: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    folderId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    instructions: v.string(),
    contextLength: v.number(),
    model: v.string(),
    prompt: v.string(),
    temperature: v.number(),
    embeddings: v.string(),
    imageUrl: v.optional(v.string()),
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_folder_id", ["folderId"]),

  // Presets
  presets: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    folderId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    contextLength: v.number(),
    model: v.string(),
    prompt: v.string(),
    temperature: v.number(),
    embeddings: v.string(),
    includeProfileContext: v.boolean(),
    includeWorkspaceInstructions: v.boolean(),
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_folder_id", ["folderId"]),

  // Prompts
  prompts: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    folderId: v.optional(v.string()),
    name: v.string(),
    content: v.string(),
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_folder_id", ["folderId"]),

  // Collections
  collections: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    folderId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_folder_id", ["folderId"]),

  // Tools
  tools: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    folderId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
    customHeaders: v.string(), // JSON string
    schema: v.string(), // JSON string
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_folder_id", ["folderId"]),

  // Custom Models
  models: defineTable({
    userId: v.string(),
    workspaceId: v.string(),
    folderId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    apiKey: v.string(),
    baseUrl: v.string(),
    modelId: v.string(),
    contextLength: v.number(),
    sharing: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_folder_id", ["folderId"]),

  // Learning conversations for adaptive learning
  learningConversations: defineTable({
    userId: v.string(),
    conversationContext: v.string(),
    userMessage: v.string(),
    botResponse: v.string(),
    userFeedback: v.optional(v.number()), // -1, 0, 1
    responseQuality: v.optional(v.number()), // 1-5
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_feedback", ["userId", "userFeedback"]),

  // Response patterns for learning
  responsePatterns: defineTable({
    patternType: v.string(),
    contextKeywords: v.array(v.string()),
    responseTemplate: v.string(),
    effectivenessScore: v.number(),
    usageCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_effectiveness_score", ["effectivenessScore"])
    .index("by_pattern_type", ["patternType"]),

  // Many-to-many relationships
  assistantFiles: defineTable({
    userId: v.string(),
    assistantId: v.string(),
    fileId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_assistant_id", ["assistantId"])
    .index("by_file_id", ["fileId"]),

  assistantCollections: defineTable({
    userId: v.string(),
    assistantId: v.string(),
    collectionId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_assistant_id", ["assistantId"])
    .index("by_collection_id", ["collectionId"]),

  assistantTools: defineTable({
    userId: v.string(),
    assistantId: v.string(),
    toolId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_assistant_id", ["assistantId"])
    .index("by_tool_id", ["toolId"]),

  collectionFiles: defineTable({
    userId: v.string(),
    collectionId: v.string(),
    fileId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_collection_id", ["collectionId"])
    .index("by_file_id", ["fileId"]),

  chatFiles: defineTable({
    userId: v.string(),
    chatId: v.string(),
    fileId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_chat_id", ["chatId"])
    .index("by_file_id", ["fileId"]),

  messageFileItems: defineTable({
    userId: v.string(),
    messageId: v.string(),
    fileItemId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_message_id", ["messageId"])
    .index("by_file_item_id", ["fileItemId"]),
});