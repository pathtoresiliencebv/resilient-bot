import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get chats by workspace ID
export const getChatsByWorkspaceId = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();
  },
});

// Get chat by ID
export const getChatById = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.chatId);
  },
});

// Create chat
export const createChat = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("chats", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update chat
export const updateChat = mutation({
  args: {
    chatId: v.id("chats"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    assistantId: v.optional(v.string()),
    contextLength: v.optional(v.number()),
    model: v.optional(v.string()),
    prompt: v.optional(v.string()),
    temperature: v.optional(v.number()),
    embeddings: v.optional(v.string()),
    sharing: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { chatId, ...updates } = args;
    await ctx.db.patch(chatId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete chat
export const deleteChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    // Delete all messages in the chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
      .collect();
    
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the chat
    await ctx.db.delete(args.chatId);
  },
});