"use client"

import { useQuery, useMutation } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { api } from "../../convex/_generated/api"

// Auth hooks
export function useConvexAuth() {
  const { signIn, signOut } = useAuthActions()

  return {
    signIn,
    signOut
    // Add any additional auth methods you need
  }
}

// Profile hooks
export function useProfile(userId: string) {
  return useQuery(api.profiles.getProfile, userId ? { userId } : "skip")
}

export function useUpdateProfile() {
  return useMutation(api.profiles.upsertProfile)
}

export function useUpdateApiKeys() {
  return useMutation(api.profiles.updateApiKeys)
}

// Chat hooks
export function useChats(workspaceId: string) {
  return useQuery(
    api.chats.getChatsByWorkspaceId,
    workspaceId ? { workspaceId } : "skip"
  )
}

export function useCreateChat() {
  return useMutation(api.chats.createChat)
}

export function useUpdateChat() {
  return useMutation(api.chats.updateChat)
}

export function useDeleteChat() {
  return useMutation(api.chats.deleteChat)
}

// Message hooks
export function useMessages(chatId: string) {
  return useQuery(
    api.messages.getMessagesByChatId,
    chatId ? { chatId: chatId as any } : "skip"
  )
}

export function useCreateMessage() {
  return useMutation(api.messages.createMessage)
}

export function useUpdateMessage() {
  return useMutation(api.messages.updateMessage)
}

export function useDeleteMessage() {
  return useMutation(api.messages.deleteMessage)
}

export function useNextSequenceNumber(chatId: string) {
  return useQuery(
    api.messages.getNextSequenceNumber,
    chatId ? { chatId: chatId as any } : "skip"
  )
}

// Learning hooks
export function useStoreLearningConversation() {
  return useMutation(api.learning.storeLearningConversation)
}

export function useUpdateConversationFeedback() {
  return useMutation(api.learning.updateConversationFeedback)
}

export function useLearningAnalytics(userId: string) {
  return useQuery(
    api.learning.getLearningAnalytics,
    userId ? { userId } : "skip"
  )
}

export function useCreateResponsePattern() {
  return useMutation(api.learning.createResponsePattern)
}

export function useFindResponsePatterns(keywords: string[]) {
  return useQuery(
    api.learning.findResponsePatterns,
    keywords.length > 0 ? { keywords } : "skip"
  )
}
