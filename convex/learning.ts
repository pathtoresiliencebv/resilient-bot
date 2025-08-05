import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store learning conversation
export const storeLearningConversation = mutation({
  args: {
    userId: v.string(),
    conversationContext: v.string(),
    userMessage: v.string(),
    botResponse: v.string(),
    userFeedback: v.optional(v.number()),
    responseQuality: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("learningConversations", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update conversation feedback
export const updateConversationFeedback = mutation({
  args: {
    conversationId: v.id("learningConversations"),
    userFeedback: v.number(),
    responseQuality: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { conversationId, ...updates } = args;
    await ctx.db.patch(conversationId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Get learning analytics for user
export const getLearningAnalytics = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("learningConversations")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    const patterns = await ctx.db
      .query("responsePatterns")
      .withIndex("by_effectiveness_score")
      .order("desc")
      .take(5);

    const totalConversations = conversations.length;
    const positiveFeedback = conversations.filter(c => c.userFeedback && c.userFeedback > 0).length;
    const negativeFeedback = conversations.filter(c => c.userFeedback && c.userFeedback < 0).length;
    
    const qualityRatings = conversations.filter(c => c.responseQuality).map(c => c.responseQuality!);
    const avgQuality = qualityRatings.length > 0 
      ? qualityRatings.reduce((sum, rating) => sum + rating, 0) / qualityRatings.length 
      : 0;

    return {
      totalConversations,
      positiveFeedback,
      negativeFeedback,
      avgQuality,
      learnedPatterns: patterns.length,
      topPatterns: patterns,
    };
  },
});

// Create response pattern
export const createResponsePattern = mutation({
  args: {
    patternType: v.string(),
    contextKeywords: v.array(v.string()),
    responseTemplate: v.string(),
    effectivenessScore: v.number(),
    usageCount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("responsePatterns", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update response pattern
export const updateResponsePattern = mutation({
  args: {
    patternId: v.id("responsePatterns"),
    effectivenessScore: v.optional(v.number()),
    usageCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { patternId, ...updates } = args;
    await ctx.db.patch(patternId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Find response patterns by keywords
export const findResponsePatterns = query({
  args: { keywords: v.array(v.string()) },
  handler: async (ctx, args) => {
    // Simple keyword matching - in production you'd want more sophisticated matching
    const patterns = await ctx.db
      .query("responsePatterns")
      .withIndex("by_effectiveness_score")
      .order("desc")
      .collect();

    return patterns.filter(pattern => 
      pattern.contextKeywords.some(keyword => 
        args.keywords.some(searchKeyword => 
          keyword.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      )
    ).slice(0, 3);
  },
});