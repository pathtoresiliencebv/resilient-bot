# Vercel Environment Variables Setup

## 🚀 Live Deployment
**URL:** https://chatbot-izhyvqryz-jasons-projects-3108a48b.vercel.app

## Required Environment Variables

Add these environment variables in your Vercel dashboard or via CLI:

### Database Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://neondb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=npg_w3BGlc8LuaSt
SUPABASE_SERVICE_ROLE_KEY=npg_w3BGlc8LuaSt
DATABASE_URL=postgresql://neondb_owner:npg_w3BGlc8LuaSt@ep-icy-dawn-ae1ikgci-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### AI API Keys
```
TOGETHER_API_KEY=e706cfa837e27208074e200f9f1baf73902007e0af488c012f86a560b9409a97
```

### Optional MCP Server API Keys
```
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
BROWSERBASE_API_KEY=your_browserbase_api_key_here
BROWSERBASE_PROJECT_ID=your_browserbase_project_id_here
OPIK_API_KEY=your_opik_api_key_here
FIGMA_ACCESS_TOKEN=your_figma_access_token_here
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
```

## How to Add Environment Variables

### Option 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project: `chatbot-ui`
3. Go to Settings → Environment Variables
4. Add each variable with the values above

### Option 2: Vercel CLI
```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add DATABASE_URL
npx vercel env add TOGETHER_API_KEY
```

### Option 3: Bulk Import
Create a `.env.production` file and run:
```bash
npx vercel env pull .env.production
```

## Redeploy After Adding Variables
```bash
npx vercel --prod
```