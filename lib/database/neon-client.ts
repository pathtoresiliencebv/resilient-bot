import { Pool } from "@neondatabase/serverless"

// Neon PostgreSQL client without Supabase
let pool: Pool | null = null

export const getNeonPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL
    })
  }
  return pool
}

// Helper function to execute SQL queries
export const executeQuery = async (sql: string, params: any[] = []) => {
  const client = getNeonPool()

  try {
    const result = await client.query(sql, params)
    return { data: result.rows, error: null }
  } catch (error) {
    console.error("Database query error:", error)
    return { data: null, error }
  }
}

// Learning conversations functions
export const learningDatabase = {
  // Store conversation
  async storeConversation(data: {
    user_id: string
    conversation_context: string
    user_message: string
    bot_response: string
    user_feedback?: number
  }) {
    const sql = `
      INSERT INTO learning_conversations 
      (user_id, conversation_context, user_message, bot_response, user_feedback)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    return executeQuery(sql, [
      data.user_id,
      data.conversation_context,
      data.user_message,
      data.bot_response,
      data.user_feedback || 0
    ])
  },

  // Update conversation feedback
  async updateConversationFeedback(
    conversationId: string,
    feedback: number,
    quality?: number
  ) {
    const sql = `
      UPDATE learning_conversations 
      SET user_feedback = $2, response_quality = $3, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    return executeQuery(sql, [conversationId, feedback, quality || 0])
  },

  // Get conversation by ID
  async getConversation(conversationId: string) {
    const sql = `SELECT * FROM learning_conversations WHERE id = $1`
    return executeQuery(sql, [conversationId])
  },

  // Find response pattern by keywords
  async findResponsePattern(keywords: string[]) {
    const sql = `
      SELECT * FROM response_patterns 
      WHERE context_keywords && $1 
      ORDER BY effectiveness_score DESC 
      LIMIT 1
    `
    return executeQuery(sql, [keywords])
  },

  // Create response pattern
  async createResponsePattern(pattern: {
    pattern_type: string
    context_keywords: string[]
    response_template: string
    effectiveness_score: number
    usage_count: number
  }) {
    const sql = `
      INSERT INTO response_patterns 
      (pattern_type, context_keywords, response_template, effectiveness_score, usage_count)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    return executeQuery(sql, [
      pattern.pattern_type,
      pattern.context_keywords,
      pattern.response_template,
      pattern.effectiveness_score,
      pattern.usage_count
    ])
  },

  // Update response pattern
  async updateResponsePattern(
    id: string,
    updates: {
      effectiveness_score?: number
      usage_count?: number
      updated_at?: string
    }
  ) {
    const sql = `
      UPDATE response_patterns 
      SET effectiveness_score = COALESCE($2, effectiveness_score),
          usage_count = COALESCE($3, usage_count),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    return executeQuery(sql, [
      id,
      updates.effectiveness_score,
      updates.usage_count
    ])
  },

  // Get adaptive response suggestions
  async getAdaptiveResponseSuggestions(keywords: string[]) {
    const sql = `
      SELECT * FROM response_patterns 
      WHERE context_keywords && $1 
      AND effectiveness_score > 0
      ORDER BY effectiveness_score DESC 
      LIMIT 3
    `
    return executeQuery(sql, [keywords])
  },

  // Get learning analytics
  async getLearningAnalytics(userId: string) {
    const conversationsSql = `
      SELECT * FROM learning_conversations WHERE user_id = $1
    `
    const patternsSql = `
      SELECT * FROM response_patterns ORDER BY effectiveness_score DESC
    `

    const [conversationsResult, patternsResult] = await Promise.all([
      executeQuery(conversationsSql, [userId]),
      executeQuery(patternsSql)
    ])

    if (conversationsResult.error || patternsResult.error) {
      return {
        data: null,
        error: conversationsResult.error || patternsResult.error
      }
    }

    const conversations = conversationsResult.data || []
    const patterns = patternsResult.data || []

    const totalConversations = conversations.length
    const positiveFeedback = conversations.filter(
      (c: any) => c.user_feedback > 0
    ).length
    const negativeFeedback = conversations.filter(
      (c: any) => c.user_feedback < 0
    ).length
    const avgQuality =
      conversations.reduce(
        (sum: number, c: any) => sum + (c.response_quality || 0),
        0
      ) / totalConversations || 0

    return {
      data: {
        totalConversations,
        positiveFeedback,
        negativeFeedback,
        avgQuality,
        learnedPatterns: patterns.length,
        topPatterns: patterns.slice(0, 5)
      },
      error: null
    }
  }
}
