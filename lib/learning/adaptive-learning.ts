import { supabase } from "@/lib/supabase/browser-client"

export interface LearningData {
  id?: string
  user_id: string
  conversation_context: string
  user_message: string
  bot_response: string
  user_feedback?: number // -1, 0, 1 for negative, neutral, positive
  response_quality?: number // 1-5 rating
  created_at?: string
  updated_at?: string
}

export interface ResponsePattern {
  id?: string
  pattern_type: string
  context_keywords: string[]
  response_template: string
  effectiveness_score: number
  usage_count: number
  created_at?: string
  updated_at?: string
}

export class AdaptiveLearningService {
  // Store conversation for learning
  async storeConversation(
    data: Omit<LearningData, "id" | "created_at" | "updated_at">
  ) {
    try {
      const { data: result, error } = await supabase
        .from("learning_conversations")
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return result
    } catch (error) {
      console.error("Error storing conversation:", error)
      return null
    }
  }

  // Update conversation with feedback
  async updateConversationFeedback(
    conversationId: string,
    feedback: number,
    quality?: number
  ) {
    try {
      const { data, error } = await supabase
        .from("learning_conversations")
        .update({
          user_feedback: feedback,
          response_quality: quality,
          updated_at: new Date().toISOString()
        })
        .eq("id", conversationId)
        .select()
        .single()

      if (error) throw error

      // Trigger pattern learning based on feedback
      await this.updateResponsePatterns(conversationId, feedback)

      return data
    } catch (error) {
      console.error("Error updating feedback:", error)
      return null
    }
  }

  // Learn from user feedback and update response patterns
  private async updateResponsePatterns(
    conversationId: string,
    feedback: number
  ) {
    try {
      // Get conversation details
      const { data: conversation } = await supabase
        .from("learning_conversations")
        .select("*")
        .eq("id", conversationId)
        .single()

      if (!conversation) return

      // Extract keywords from context and message
      const keywords = this.extractKeywords(
        `${conversation.conversation_context} ${conversation.user_message}`
      )

      // Find or create response pattern
      let pattern = await this.findResponsePattern(keywords)

      if (!pattern) {
        // Create new pattern
        pattern = await this.createResponsePattern({
          pattern_type: "contextual",
          context_keywords: keywords,
          response_template: conversation.bot_response,
          effectiveness_score: feedback > 0 ? 1 : -1,
          usage_count: 1
        })
      } else {
        // Update existing pattern
        const newScore = this.calculateNewEffectivenessScore(
          pattern.effectiveness_score,
          pattern.usage_count,
          feedback
        )

        await this.updateResponsePattern(pattern.id!, {
          effectiveness_score: newScore,
          usage_count: pattern.usage_count + 1,
          updated_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error("Error updating response patterns:", error)
    }
  }

  // Extract keywords from text
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - in production, use more sophisticated NLP
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(
        word =>
          ![
            "this",
            "that",
            "with",
            "have",
            "will",
            "from",
            "they",
            "know",
            "want",
            "been",
            "good",
            "much",
            "some",
            "time",
            "very",
            "when",
            "come",
            "here",
            "just",
            "like",
            "long",
            "make",
            "many",
            "over",
            "such",
            "take",
            "than",
            "them",
            "well",
            "were"
          ].includes(word)
      )

    // Return top 5 most relevant keywords
    return [...new Set(words)].slice(0, 5)
  }

  // Find existing response pattern
  private async findResponsePattern(
    keywords: string[]
  ): Promise<ResponsePattern | null> {
    try {
      const { data } = await supabase
        .from("response_patterns")
        .select("*")
        .contains("context_keywords", keywords)
        .order("effectiveness_score", { ascending: false })
        .limit(1)
        .single()

      return data
    } catch {
      return null
    }
  }

  // Create new response pattern
  private async createResponsePattern(
    pattern: Omit<ResponsePattern, "id" | "created_at" | "updated_at">
  ) {
    try {
      const { data, error } = await supabase
        .from("response_patterns")
        .insert(pattern)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating response pattern:", error)
      return null
    }
  }

  // Update existing response pattern
  private async updateResponsePattern(
    id: string,
    updates: Partial<ResponsePattern>
  ) {
    try {
      const { data, error } = await supabase
        .from("response_patterns")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating response pattern:", error)
      return null
    }
  }

  // Calculate new effectiveness score using weighted average
  private calculateNewEffectivenessScore(
    currentScore: number,
    usageCount: number,
    newFeedback: number
  ): number {
    // Weight current score by usage count, add new feedback
    const totalWeight = usageCount + 1
    return (currentScore * usageCount + newFeedback) / totalWeight
  }

  // Get adaptive response suggestions based on context
  async getAdaptiveResponseSuggestions(
    context: string,
    userMessage: string
  ): Promise<ResponsePattern[]> {
    try {
      const keywords = this.extractKeywords(`${context} ${userMessage}`)

      const { data, error } = await supabase
        .from("response_patterns")
        .select("*")
        .overlaps("context_keywords", keywords)
        .gt("effectiveness_score", 0) // Only positive patterns
        .order("effectiveness_score", { ascending: false })
        .limit(3)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting adaptive suggestions:", error)
      return []
    }
  }

  // Get learning analytics
  async getLearningAnalytics(userId: string) {
    try {
      const { data: conversations } = await supabase
        .from("learning_conversations")
        .select("*")
        .eq("user_id", userId)

      const { data: patterns } = await supabase
        .from("response_patterns")
        .select("*")
        .order("effectiveness_score", { ascending: false })

      const totalConversations = conversations?.length || 0
      const positiveFeedback =
        conversations?.filter(c => c.user_feedback > 0).length || 0
      const negativeFeedback =
        conversations?.filter(c => c.user_feedback < 0).length || 0

      const avgQuality =
        conversations?.reduce((sum, c) => sum + (c.response_quality || 0), 0) /
          totalConversations || 0

      return {
        totalConversations,
        positiveFeedback,
        negativeFeedback,
        avgQuality,
        learnedPatterns: patterns?.length || 0,
        topPatterns: patterns?.slice(0, 5) || []
      }
    } catch (error) {
      console.error("Error getting learning analytics:", error)
      return null
    }
  }
}
