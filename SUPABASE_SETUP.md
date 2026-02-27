# Supabase Setup Instructions

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase-setup.sql` and run it in the SQL Editor
4. This will create:
   - `clients` table for registered users
   - `orders` table for order management
   - `order_events` table for audit trail
   - All necessary indexes, triggers, and RLS policies

## Environment Variables

1. Copy your Supabase credentials:
   - Go to **Project Settings** > **API**
   - Copy your **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - Copy your **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Copy your **service_role** key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

2. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
QSTASH_TOKEN=your-existing-qstash-token
```

## Authentication Setup

1. Go to **Authentication** > **Providers** in Supabase
2. Enable **Email** provider
3. Configure email templates if desired
4. Optional: Enable other providers (Google, GitHub, etc.)

## Testing

After setup, you can:
- Register users through the app
- Create orders (both authenticated and anonymous)
- Share orders via URL tokens
- Track order status through the Kanban board

## Database Structure

### Clients Table
- Stores registered user information
- Links to Supabase Auth

### Orders Table
- Supports both authenticated and anonymous orders
- Stores order items as JSONB (matches your existing QuoteItem[] structure)
- Includes share tokens for URL-based order sharing
- Tracks order status: placed, paid, ready, completed, cancelled

### Order Events Table
- Audit trail for order changes
- Tracks status updates and modifications

