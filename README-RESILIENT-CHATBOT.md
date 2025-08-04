# Resilient Chatbot - Enhanced AI Assistant

This is an enhanced version of Chatbot UI with self-learning capabilities, Together AI integration, and comprehensive MCP server support.

## 🚀 Key Features

### 1. Together AI Integration
- **Models Available:**
  - `meta-llama/Llama-3.3-70B-Instruct-Turbo-Free` - Llama 3.3 70B Instruct Turbo (Free)
  - `lgai/exaone-3-5-32b-instruct` - EXAONE 3.5 32B Instruct
  - `deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free` - DeepSeek R1 Distill Llama 70B (Free)
  - `meta-llama/Llama-Vision-Free` - Llama Vision (Free) - supports image input

- **Image Generation:**
  - `black-forest-labs/FLUX.1-schnell-Free` - FLUX.1 Schnell (Free)

### 2. Self-Learning System
The chatbot learns from user interactions and adapts its responses over time:

- **Conversation Storage:** All interactions are stored with context for learning
- **Feedback Mechanism:** Users can rate responses with thumbs up/down
- **Pattern Recognition:** System identifies successful response patterns
- **Adaptive Enhancement:** Future responses incorporate learned patterns
- **Analytics Dashboard:** Track learning progress and effectiveness

### 3. Comprehensive MCP Server Support
Configured with the following MCP servers for enhanced functionality:

#### Core Functionality
- **Sequential Thinking** - Structured reasoning capabilities
- **Context7** - Advanced context management
- **Memory Bank** - Long-term memory storage
- **Knowledge Graph Memory** - Semantic knowledge storage

#### Web & Browser Automation
- **Puppeteer** - Web automation and scraping
- **Playwright** - Cross-browser automation
- **Browserbase** - Cloud browser automation
- **Firecrawl** - Advanced web scraping

#### Development Tools
- **GitHub** - Repository management and code operations
- **Continue** - AI-powered development assistance
- **GPT Pilot** - Automated development workflows
- **Desktop Commander** - Desktop automation

#### Data Processing
- **Pandoc** - Document conversion
- **Excel** - Spreadsheet processing
- **Figma Context** - Design file processing
- **DuckDuckGo** - Web search capabilities

#### Analysis & Monitoring
- **Opik** - Performance monitoring
- **Digma** - Code analysis
- **Magic** - Enhanced AI capabilities
- **Serena** - Advanced AI operations

#### Database & Storage
- **Supabase** - Database operations (configured with Neon PostgreSQL)

### 4. Database Configuration
- **Primary Database:** Neon PostgreSQL
- **Connection String:** Configured for `neondb` with SSL requirements
- **Learning Tables:** 
  - `learning_conversations` - Stores conversation data for learning
  - `response_patterns` - Stores learned response patterns
- **Profile Enhancement:** Added `together_api_key` field for API key storage

## 🛠️ Setup Instructions

### 1. Environment Configuration
Create `.env.local` with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_w3BGlc8LuaSt@ep-icy-dawn-ae1ikgci-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXT_PUBLIC_SUPABASE_URL=https://neondb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=npg_w3BGlc8LuaSt
SUPABASE_SERVICE_ROLE_KEY=npg_w3BGlc8LuaSt

# AI API Keys
TOGETHER_API_KEY=e706cfa837e27208074e200f9f1baf73902007e0af488c012f86a560b9409a97

# Optional MCP API Keys (add as needed)
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
BROWSERBASE_API_KEY=your_browserbase_api_key_here
BROWSERBASE_PROJECT_ID=your_browserbase_project_id_here
OPIK_API_KEY=your_opik_api_key_here
FIGMA_ACCESS_TOKEN=your_figma_access_token_here
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
```

### 2. Database Setup
Run the database migrations:

```bash
# Apply database migrations
npx supabase db push

# Or manually execute the SQL files:
# - supabase/migrations/20240804000001_add_together_api_key.sql
# - supabase/migrations/20240804000002_add_learning_tables.sql
```

### 3. Installation
```bash
npm install
npm run build
npm run dev
```

### 4. MCP Configuration
The `.mcp.json` file is pre-configured with all MCP servers. Update API keys as needed for specific services.

## 📊 Learning Analytics

Access learning analytics through the chat interface to view:
- Total conversations processed
- User satisfaction rates (positive/negative feedback)
- Average response quality scores
- Number of learned patterns
- Most effective response patterns

## 🎯 Usage

### Basic Chat
1. Select a Together AI model from the model picker
2. Start chatting - the system will automatically learn from interactions
3. Provide feedback using thumbs up/down buttons
4. View learning progress in the analytics dashboard

### Image Generation
1. Use the image generation feature with FLUX.1 model
2. Provide detailed prompts for best results
3. Images are generated as base64 data URLs

### Advanced Features
- The system automatically enhances prompts with learned patterns
- Response quality improves over time based on user feedback
- MCP servers provide additional capabilities for specific tasks

## 🔧 Technical Architecture

### Learning System Components
- `AdaptiveLearningService` - Core learning logic
- `useAdaptiveLearning` - React hook for learning integration
- `LearningIntegration` - Feedback UI component
- `LearningAnalytics` - Analytics dashboard

### API Endpoints
- `/api/chat/together` - Together AI chat completions
- `/api/images/together` - Together AI image generation

### Database Schema
- Enhanced profiles table with `together_api_key`
- New learning tables for conversation storage and pattern recognition

## 🚦 Development Status

✅ **Completed:**
- Together AI integration with all specified models
- Self-learning system with adaptive responses
- Comprehensive MCP server configuration
- Database setup with Neon PostgreSQL
- Learning analytics dashboard
- Build verification and testing

## 🌟 Key Benefits

1. **Continuous Improvement:** The AI learns from each interaction and gets better over time
2. **Multi-Model Support:** Access to various specialized AI models through Together AI
3. **Extensible Architecture:** Easy to add new MCP servers and capabilities
4. **User Feedback Integration:** Direct user feedback improves response quality
5. **Analytics Insights:** Track AI performance and learning progress
6. **Production Ready:** Fully built and tested application

## 📝 Notes

- All API routes use Edge Runtime for optimal performance
- Learning system is privacy-aware and stores data securely
- MCP servers can be enabled/disabled as needed
- System is designed for scalability and extensibility

---

*This enhanced chatbot represents a significant evolution in AI assistant technology, combining the power of multiple AI models with adaptive learning capabilities and extensive tool integration.*