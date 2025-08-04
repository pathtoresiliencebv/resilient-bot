"use client"

import { AdaptiveLearningService } from "@/lib/learning/adaptive-learning"
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react"
import { useContext, useState } from "react"
import { ChatbotUIContext } from "@/context/context"
import { Button } from "../ui/button"
import { toast } from "sonner"

interface LearningIntegrationProps {
  messageId: string
  conversationContext: string
  userMessage: string
  botResponse: string
}

export const LearningIntegration: React.FC<LearningIntegrationProps> = ({
  messageId,
  conversationContext,
  userMessage,
  botResponse
}) => {
  const { profile } = useContext(ChatbotUIContext)
  const [feedback, setFeedback] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const learningService = new AdaptiveLearningService()

  const handleFeedback = async (feedbackValue: number) => {
    if (!profile) return

    setIsSubmitting(true)

    try {
      // Store the conversation if not already stored
      const conversationData = await learningService.storeConversation({
        user_id: profile.id,
        conversation_context: conversationContext,
        user_message: userMessage,
        bot_response: botResponse,
        user_feedback: feedbackValue
      })

      if (conversationData) {
        setFeedback(feedbackValue)
        toast.success(
          feedbackValue > 0
            ? "Thanks for the positive feedback! I'm learning from this."
            : "Thanks for the feedback. I'll try to improve next time."
        )
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (feedback !== null) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Feedback recorded</span>
        {feedback > 0 ? (
          <IconThumbUp size={16} className="text-green-500" />
        ) : (
          <IconThumbDown size={16} className="text-red-500" />
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Was this helpful?</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback(1)}
        disabled={isSubmitting}
        className="size-8 p-0"
      >
        <IconThumbUp size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback(-1)}
        disabled={isSubmitting}
        className="size-8 p-0"
      >
        <IconThumbDown size={16} />
      </Button>
    </div>
  )
}
