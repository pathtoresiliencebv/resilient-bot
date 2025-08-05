import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get messages by chat ID
export const getMessagesByChatId = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

// Create message
export const createMessage = mutation({
  args: {
    userId: v.string(),
    chatId: v.id("chats"),
    role: v.union(v.literal("system"), v.literal("user"), v.literal("assistant")),
    content: v.string(),
    model: v.string(),
    sequenceNumber: v.number(),
    imageUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("messages", {
      ...args,
      imageUrls: args.imageUrls || [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update message
export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { messageId, ...updates } = args;
    await ctx.db.patch(messageId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete message
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});

// Get next sequence number for chat
export const getNextSequenceNumber = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
      .collect();
    
    if (messages.length === 0) {
      return 1;
    }
    
    const maxSequence = Math.max(...messages.map(m => m.sequenceNumber));
    return maxSequence + 1;
  },
});