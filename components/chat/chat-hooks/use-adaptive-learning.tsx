import {
  AdaptiveLearningService,
  ResponsePattern
} from "@/lib/learning/adaptive-learning"
import { ChatbotUIContext } from "@/context/context"
import { useContext, useCallback } from "react"

export const useAdaptiveLearning = () => {
  const { profile } = useContext(ChatbotUIContext)
  const learningService = new AdaptiveLearningService()

  // Get adaptive response suggestions before generating response
  const getAdaptiveSuggestions = useCallback(
    async (
      conversationContext: string,
      userMessage: string
    ): Promise<ResponsePattern[]> => {
      try {
        return await learningService.getAdaptiveResponseSuggestions(
          conversationContext,
          userMessage
        )
      } catch (error) {
        console.error("Error getting adaptive suggestions:", error)
        return []
      }
    },
    [learningService]
  )

  // Store conversation after response is generated
  const storeConversation = useCallback(
    async (
      conversationContext: string,
      userMessage: string,
      botResponse: string
    ) => {
      if (!profile) return null

      try {
        return await learningService.storeConversation({
          user_id: profile.id,
          conversation_context: conversationContext,
          user_message: userMessage,
          bot_response: botResponse
        })
      } catch (error) {
        console.error("Error storing conversation:", error)
        return null
      }
    },
    [profile, learningService]
  )

  // Update conversation with feedback
  const updateFeedback = useCallback(
    async (conversationId: string, feedback: number, quality?: number) => {
      try {
        return await learningService.updateConversationFeedback(
          conversationId,
          feedback,
          quality
        )
      } catch (error) {
        console.error("Error updating feedback:", error)
        return null
      }
    },
    [learningService]
  )

  // Get learning analytics
  const getLearningAnalytics = useCallback(async () => {
    if (!profile) return null

    try {
      return await learningService.getLearningAnalytics(profile.id)
    } catch (error) {
      console.error("Error getting analytics:", error)
      return null
    }
  }, [profile, learningService])

  // Enhance prompt with adaptive suggestions
  const enhancePromptWithLearning = useCallback(
    async (
      originalPrompt: string,
      conversationContext: string,
      userMessage: string
    ): Promise<string> => {
      try {
        const suggestions = await getAdaptiveSuggestions(
          conversationContext,
          userMessage
        )

        if (suggestions.length === 0) {
          return originalPrompt
        }

        // Build adaptive enhancement
        const adaptiveGuidance = suggestions
          .map(
            pattern =>
              `Based on successful past interactions with similar context (effectiveness: ${pattern.effectiveness_score.toFixed(2)}), consider: "${pattern.response_template}"`
          )
          .join("\n")

        return `${originalPrompt}

ADAPTIVE LEARNING GUIDANCE:
${adaptiveGuidance}

Use these successful patterns as inspiration while maintaining your own voice and ensuring accuracy. Adapt the suggestions to the current context.`
      } catch (error) {
        console.error("Error enhancing prompt:", error)
        return originalPrompt
      }
    },
    [getAdaptiveSuggestions]
  )

  return {
    getAdaptiveSuggestions,
    storeConversation,
    updateFeedback,
    getLearningAnalytics,
    enhancePromptWithLearning
  }
}
