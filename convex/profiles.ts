import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get profile by user ID
export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Create or update profile
export const upsertProfile = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    displayName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    hasOnboarded: v.boolean(),
    profileContext: v.optional(v.string()),
    useAzureOpenai: v.boolean(),
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
    // Azure settings
    azureOpenaiEndpoint: v.optional(v.string()),
    azureOpenai35TurboId: v.optional(v.string()),
    azureOpenai45TurboId: v.optional(v.string()),
    azureOpenai45VisionId: v.optional(v.string()),
    azureOpenaiEmbeddingsId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();
    const profileData = {
      ...args,
      updatedAt: now,
    };

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, profileData);
      return existingProfile._id;
    } else {
      return await ctx.db.insert("profiles", {
        ...profileData,
        createdAt: now,
      });
    }
  },
});

// Update API keys
export const updateApiKeys = mutation({
  args: {
    userId: v.string(),
    openaiApiKey: v.optional(v.string()),
    anthropicApiKey: v.optional(v.string()),
    googleGeminiApiKey: v.optional(v.string()),
    mistralApiKey: v.optional(v.string()),
    groqApiKey: v.optional(v.string()),
    perplexityApiKey: v.optional(v.string()),
    openrouterApiKey: v.optional(v.string()),
    azureOpenaiApiKey: v.optional(v.string()),
    togetherApiKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...apiKeys } = args;
    
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, {
      ...apiKeys,
      updatedAt: Date.now(),
    });
  },
});