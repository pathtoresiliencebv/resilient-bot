# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a resilient chatbot built on Next.js with adaptive learning capabilities, Together AI integration, and comprehensive MCP server support. The project combines multiple AI providers with a self-learning system that improves responses based on user feedback.

## Commands

### Development Workflow
```bash
# Start development (includes Convex dev and Next.js dev server)
npm run chat

# Standard development server only
npm run dev

# Production build
npm run build
npm run start

# Restart everything
npm run restart

# Update from git
npm run update
```

### Convex Database Commands
```bash
# Start Convex development environment
npm run convex:dev

# Deploy Convex functions and schema
npm run convex:deploy

# Generate TypeScript types from Convex schema
npm run convex:codegen

# Run Convex dev with file watching
convex dev

# Push schema changes
convex dev --once
```

### Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Format code
npm run format:write
npm run format:check

# Clean code (lint fix + format)
npm run clean
```

### Testing
```bash
# Run Jest tests
npm run test

# Single test file
npm run test -- path/to/test.spec.ts
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze
```

## Architecture

### Core Technologies
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Convex** for database, real-time features, and authentication
- **Convex Auth** for user authentication and session management
- **Together AI** for LLM inference
- **Tailwind CSS** + **Radix UI** for styling

### Key Directories

#### `/app` - Next.js App Router
- `api/` - API routes including chat endpoints for multiple providers
- `[locale]/` - Internationalized pages with dynamic routing
- Authentication, chat interface, and setup flows

#### `/components` - React Components
- `chat/` - Chat interface, input, messages, and learning integration
- `sidebar/` - Navigation and item management (assistants, files, etc.)
- `ui/` - Reusable UI components built with Radix
- `utility/` - Global utilities (providers, theme switcher, etc.)

#### `/lib` - Core Logic
- `learning/` - Adaptive learning system with pattern recognition
- `convex/` - Convex client configurations and hooks
- `models/` - LLM provider configurations
- `server/` - Server-side utilities and chat helpers
- `retrieval/` - Document processing (PDF, DOCX, etc.)

#### `/convex` - Convex Backend
- `schema.ts` - Database schema definitions
- `auth.ts` - Authentication configuration
- `profiles.ts` - User profile functions
- `chats.ts` - Chat management functions
- `messages.ts` - Message handling functions
- `learning.ts` - Adaptive learning functions

### Authentication Flow
The app uses Convex Auth with email/password authentication. The auth flow includes:
1. Login/signup pages with i18n support
2. Convex-based session management
3. Server and client-side auth hooks
4. Profile management with API key storage

### Chat System Architecture

#### Message Flow
1. **User Input** → `ChatInput` component
2. **Processing** → API route (`/api/chat/[provider]`)
3. **Streaming Response** → Real-time UI updates
4. **Learning Storage** → `AdaptiveLearningService`
5. **Feedback Loop** → User ratings improve future responses

#### Adaptive Learning System
- **Conversation Storage**: All interactions stored with context
- **Feedback Mechanism**: Thumbs up/down ratings
- **Pattern Recognition**: Keyword extraction and response templating
- **Effectiveness Scoring**: Weighted feedback system
- **Analytics Dashboard**: Learning progress tracking

#### Supported AI Providers
- Together AI (primary for this enhanced version)
- OpenAI GPT models
- Anthropic Claude
- Google Gemini
- Mistral AI
- Groq
- Perplexity
- Azure OpenAI

### Database Schema

#### Core Tables
- `profiles` - User profiles with API keys and preferences
- `workspaces` - Multi-tenant workspace support
- `chats` - Chat conversations
- `messages` - Individual chat messages
- `assistants` - Custom AI assistants
- `files` - Uploaded files and documents
- `tools` - Custom tools and integrations

#### Learning Tables
- `learning_conversations` - Conversation data for learning
- `response_patterns` - Learned response patterns with effectiveness scores

### File Processing
The system supports multiple file types:
- **PDF**: Text extraction with `pdf-parse`
- **DOCX**: Document processing with `mammoth`
- **TXT/MD**: Direct text processing
- **CSV/JSON**: Structured data parsing

### MCP Integration
Comprehensive Model Context Protocol server support for:
- **Web Automation**: Puppeteer, Playwright, Browserbase
- **Development**: GitHub, Continue, GPT Pilot
- **Data Processing**: Pandoc, Excel, Figma Context
- **Memory**: Sequential Thinking, Memory Bank, Knowledge Graph
- **Search**: DuckDuckGo integration

## Environment Setup

### Required Environment Variables
```bash
# Convex (required for database, auth, and real-time features)
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key

# Together AI (primary LLM provider)
TOGETHER_API_KEY=your_together_ai_key

# Optional: Keep Neon for specific use cases
DATABASE_URL=your_neon_connection_string
```

### Development Setup
1. Install dependencies: `npm install`
2. Copy environment: `cp .env.local.example .env.local`
3. Set up Convex: `npx convex dev --configure`
4. Update environment with your Convex deployment URL
5. Start development: `npm run chat`

## Key Files to Understand

### Context and State
- `context/context.tsx` - Global React context with all app state
- `components/utility/global-state.tsx` - State management wrapper

### Chat Implementation
- `components/chat/chat-ui.tsx` - Main chat interface
- `components/chat/chat-hooks/use-chat-handler.tsx` - Chat logic
- `lib/learning/adaptive-learning.ts` - Learning system core

### Database Clients
- `lib/supabase/browser-client.ts` - Client-side Supabase
- `lib/supabase/server.ts` - Server-side Supabase
- `lib/database/neon-client.ts` - Direct Neon PostgreSQL client

### API Routes
- `app/api/chat/together/route.ts` - Together AI integration
- `app/api/images/together/route.ts` - Image generation
- Pattern: Each provider has its own route file

## Common Development Patterns

### Adding New AI Providers
1. Create API route in `app/api/chat/[provider]/route.ts`
2. Add model definitions in `lib/models/llm/[provider]-llm-list.ts`
3. Update model fetching in `lib/models/fetch-models.ts`
4. Add provider icon in `components/icons/`

### Database Operations
- All database operations use typed functions in `/db` directory
- Server-side operations use `getServerProfile()` for auth
- Client-side operations use React context

### Adding Learning Features
- Extend `AdaptiveLearningService` for new learning algorithms
- Add database tables/functions for new learning data
- Update analytics in `components/chat/learning-analytics.tsx`

## Testing Strategy

### Test Files Location
- Component tests: `__tests__/` directory
- Integration tests: `__tests__/playwright-test/`
- API tests: Jest tests for route handlers

### Running Tests
- Unit tests: `npm run test`
- E2E tests: `cd __tests__/playwright-test && npm test`

## Deployment Notes

### Vercel Configuration
- Uses Edge Runtime for API routes
- PWA enabled with `next-pwa`
- Bundle analyzer available via `npm run analyze`

### Database Migrations
- Supabase migrations in `supabase/migrations/`
- Auto-generated types in `supabase/types.ts`
- Learning tables included in recent migrations

### Security Considerations
- API keys stored in user profiles (encrypted)
- Server-side validation for all chat requests
- File upload size limits configured
- CORS and CSP headers in middleware

## Troubleshooting

### Common Issues
- **Supabase client errors**: Ensure `supabase start` is running and env vars are set
- **Type errors**: Run `npm run db-types` to regenerate database types
- **Build failures**: Check `npm run type-check` for TypeScript issues
- **Missing models**: Verify API keys are configured in profile settings

### Development Tips
- Use `npm run clean` before commits
- Database schema changes require `npm run db-types`
- Learning system requires conversation data - test with multiple interactions
- MCP servers optional but enhance capabilities significantly