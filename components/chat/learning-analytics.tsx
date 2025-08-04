"use client"

import { useAdaptiveLearning } from "./chat-hooks/use-adaptive-learning"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card"
import { Progress } from "../ui/progress"
import { Badge } from "../ui/badge"
import {
  IconBrain,
  IconChartLine,
  IconThumbUp,
  IconThumbDown
} from "@tabler/icons-react"
import { useEffect, useState } from "react"

interface LearningAnalytics {
  totalConversations: number
  positiveFeedback: number
  negativeFeedback: number
  avgQuality: number
  learnedPatterns: number
  topPatterns: Array<{
    id: string
    pattern_type: string
    context_keywords: string[]
    effectiveness_score: number
    usage_count: number
  }>
}

export const LearningAnalytics: React.FC = () => {
  const { getLearningAnalytics } = useAdaptiveLearning()
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getLearningAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [getLearningAnalytics])

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBrain size={20} />
            Learning Analytics
          </CardTitle>
          <CardDescription>Loading learning data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBrain size={20} />
            Learning Analytics
          </CardTitle>
          <CardDescription>No learning data available yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const satisfactionRate =
    analytics.totalConversations > 0
      ? (analytics.positiveFeedback / analytics.totalConversations) * 100
      : 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBrain size={20} />
            Learning Analytics
          </CardTitle>
          <CardDescription>
            AI learning progress and user satisfaction metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-primary text-2xl font-bold">
                {analytics.totalConversations}
              </div>
              <div className="text-muted-foreground text-sm">
                Total Conversations
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics.positiveFeedback}
              </div>
              <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                <IconThumbUp size={14} />
                Positive
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {analytics.negativeFeedback}
              </div>
              <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                <IconThumbDown size={14} />
                Negative
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.learnedPatterns}
              </div>
              <div className="text-muted-foreground text-sm">
                Learned Patterns
              </div>
            </div>
          </div>

          {/* Satisfaction Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                User Satisfaction Rate
              </span>
              <span className="text-muted-foreground text-sm">
                {satisfactionRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={satisfactionRate} className="h-2" />
          </div>

          {/* Average Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Average Response Quality
              </span>
              <span className="text-muted-foreground text-sm">
                {analytics.avgQuality.toFixed(1)}/5.0
              </span>
            </div>
            <Progress
              value={(analytics.avgQuality / 5) * 100}
              className="h-2"
            />
          </div>

          {/* Top Patterns */}
          {analytics.topPatterns.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <IconChartLine size={16} />
                Most Effective Response Patterns
              </h4>
              <div className="space-y-2">
                {analytics.topPatterns.map((pattern, index) => (
                  <div
                    key={pattern.id}
                    className="bg-muted/30 flex items-center justify-between rounded-lg p-3"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium">
                          {pattern.pattern_type}
                        </span>
                      </div>
                      <div className="mb-1 flex flex-wrap gap-1">
                        {pattern.context_keywords.slice(0, 3).map(keyword => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Used {pattern.usage_count} times
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {(pattern.effectiveness_score * 100).toFixed(1)}%
                      </div>
                      <div className="text-muted-foreground text-xs">
                        effectiveness
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
