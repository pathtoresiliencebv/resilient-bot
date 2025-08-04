-- Create learning_conversations table for storing conversation data
CREATE TABLE IF NOT EXISTS learning_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_context TEXT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    user_feedback INTEGER DEFAULT 0, -- -1, 0, 1 for negative, neutral, positive
    response_quality INTEGER DEFAULT 0, -- 1-5 rating
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create response_patterns table for storing learned response patterns
CREATE TABLE IF NOT EXISTS response_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_type TEXT NOT NULL DEFAULT 'contextual',
    context_keywords TEXT[] NOT NULL DEFAULT '{}',
    response_template TEXT NOT NULL,
    effectiveness_score REAL NOT NULL DEFAULT 0,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_learning_conversations_user_id ON learning_conversations(user_id);
CREATE INDEX idx_learning_conversations_feedback ON learning_conversations(user_feedback);
CREATE INDEX idx_response_patterns_keywords ON response_patterns USING GIN(context_keywords);
CREATE INDEX idx_response_patterns_effectiveness ON response_patterns(effectiveness_score);

-- Enable RLS
ALTER TABLE learning_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_patterns ENABLE ROW LEVEL SECURITY;

-- RLS policies for learning_conversations
CREATE POLICY "Users can access their own learning conversations"
    ON learning_conversations
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- RLS policies for response_patterns (shared across all users for learning)
CREATE POLICY "Users can read all response patterns"
    ON response_patterns
    FOR SELECT
    USING (true);

CREATE POLICY "System can manage response patterns"
    ON response_patterns
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_learning_conversations_updated_at
    BEFORE UPDATE ON learning_conversations
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_response_patterns_updated_at
    BEFORE UPDATE ON response_patterns
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();