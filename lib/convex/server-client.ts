import { ConvexHttpClient } from "convex/browser"
import { api } from "../../convex/_generated/api"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set")
}

export const convexClient = new ConvexHttpClient(convexUrl)

// Helper functions for server-side usage
export const serverConvex = {
  // Get profile by user ID
  getProfile: (userId: string) =>
    convexClient.query(api.profiles.getProfile, { userId }),

  // Create or update profile
  upsertProfile: (profileData: any) =>
    convexClient.mutation(api.profiles.upsertProfile, profileData),

  // Chat operations
  getChatsByWorkspaceId: (workspaceId: string) =>
    convexClient.query(api.chats.getChatsByWorkspaceId, { workspaceId }),

  createChat: (chatData: any) =>
    convexClient.mutation(api.chats.createChat, chatData),

  // Message operations
  getMessagesByChatId: (chatId: any) =>
    convexClient.query(api.messages.getMessagesByChatId, { chatId }),

  createMessage: (messageData: any) =>
    convexClient.mutation(api.messages.createMessage, messageData),

  // Learning operations
  storeLearningConversation: (learningData: any) =>
    convexClient.mutation(api.learning.storeLearningConversation, learningData),

  updateConversationFeedback: (
    conversationId: any,
    feedback: number,
    quality?: number
  ) =>
    convexClient.mutation(api.learning.updateConversationFeedback, {
      conversationId,
      userFeedback: feedback,
      responseQuality: quality
    }),

  getLearningAnalytics: (userId: string) =>
    convexClient.query(api.learning.getLearningAnalytics, { userId })
}
