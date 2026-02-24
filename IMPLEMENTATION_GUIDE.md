# Zaratan Restaurant App - Supabase Integration Guide

## Overview

This implementation adds complete user authentication and order management using Supabase to your restaurant ordering app. Users can register, place orders, and share orders via URLs. Restaurant staff can manage orders through a drag-and-drop Kanban board.

## Features Implemented

### 1. **User Authentication**
- Email/password authentication
- User registration with profile data
- Cookie-based session management
- Automatic session refresh via middleware

### 2. **Order Management**
- Create orders (authenticated and anonymous)
- Store orders in Supabase database
- Generate shareable order URLs
- Order status tracking (placed, paid, ready, completed, cancelled)
- Calculate order totals automatically

### 3. **Kanban Board**
- Drag-and-drop order management
- Three columns: Placed, Paid, Ready
- Real-time updates every 10 seconds
- Visual order cards with details
- Optimistic UI updates

### 4. **URL-Based Order Sharing**
- Each order gets a unique share token
- Orders can be shared via URL
- Token expiration (30 days default)
- Works for both authenticated and anonymous orders

## Setup Instructions

### Step 1: Configure Supabase

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Note your project URL and API keys

2. **Run Database Schema**
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Copy and run the contents of `supabase-setup.sql`
   - This creates all necessary tables, functions, and policies

3. **Enable Email Authentication**
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email templates (optional)

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Your app URL for sharing (must match your Cloudflare/Supabase Site URL in production)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Existing
QSTASH_TOKEN=your-qstash-token
```

**Important:** Never commit `.env.local` to version control!

### Step 3: Install Dependencies

Dependencies are already added to `package.json`. If you need to reinstall:

```bash
pnpm install
```

### Step 4: Run the Application

```bash
pnpm dev
```

## File Structure

```
src/
├── app/
│   ├── _components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx       # Login component
│   │   │   └── SignUpForm.tsx      # Registration component
│   │   ├── Kanban/
│   │   │   ├── KanbanBoard.tsx     # Main Kanban board with DnD
│   │   │   ├── KanbanColumn.tsx    # Individual columns
│   │   │   └── OrderCard.tsx       # Draggable order cards
│   │   └── StartJob/
│   │       └── index.tsx           # Updated to create orders in Supabase
│   ├── _types/
│   │   └── database.ts             # TypeScript types for database
│   ├── api/
│   │   └── register/
│   │       └── route.ts            # Updated to save to Supabase
│   ├── auth/
│   │   └── actions.ts              # Auth server actions
│   ├── orders/
│   │   └── actions.ts              # Order management server actions
│   └── management/
│       └── page.tsx                # Kanban board page
├── lib/
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       ├── server.ts               # Server Supabase client
│       └── middleware.ts           # Session management
└── middleware.ts                   # Next.js middleware for auth

Files:
├── supabase-setup.sql              # Database schema
├── SUPABASE_SETUP.md               # Detailed setup guide
└── IMPLEMENTATION_GUIDE.md         # This file
```

## Usage

### For Customers

1. **Browse Menu** - View available items on the main page
2. **Add to Order** - Click items to add to your order (stored in URL)
3. **Place Order** - Enter your name and click "Start Order"
4. **Share Order** - Copy the generated URL to share your order
5. **Track Order** - Use the share link to view order status

### For Restaurant Staff

1. **Access Management** - Go to `/management`
2. **View Orders** - See all orders in three columns
3. **Update Status** - Drag orders between columns to update status
4. **Monitor** - Auto-refreshes every 10 seconds

### For Developers

#### Create an Order (Server Action)

```typescript
import { createOrder } from '@/app/orders/actions';

const result = await createOrder(items, {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890'
});

if (result.order) {
  console.log('Order created:', result.order.order_number);
}
```

#### Get User Orders

```typescript
import { getMyOrders } from '@/app/orders/actions';

const result = await getMyOrders();
const orders = result.orders || [];
```

#### Update Order Status

```typescript
import { updateOrderStatus } from '@/app/orders/actions';

await updateOrderStatus(orderId, 'paid');
```

#### Get Order by Share Token

```typescript
import { getOrderByShareToken } from '@/app/orders/actions';

const result = await getOrderByShareToken(token);
```

## Database Schema

### Tables

1. **clients** - Registered users
   - id (UUID, primary key)
   - email (unique)
   - name, phone
   - timestamps

2. **orders** - All orders (authenticated and anonymous)
   - id (UUID, primary key)
   - client_id (nullable, references clients)
   - items (JSONB - your QuoteItem[] structure)
   - order_number (auto-generated)
   - status (placed, paid, ready, completed, cancelled)
   - total_amount
   - guest info (for anonymous orders)
   - share_token (for URL sharing)
   - timestamps

3. **order_events** - Audit trail
   - id (UUID, primary key)
   - order_id (references orders)
   - event_type
   - old_value, new_value
   - created_by

### Row Level Security (RLS)

- Users can only see their own profile data
- Users can only see their own orders
- Orders with valid share tokens are publicly accessible
- Service role can manage all orders (for restaurant staff)

## Key Features Explained

### URL-Based Order Sharing

Orders are stored in the URL using the existing `stateHash` system, but now also saved to Supabase:

1. Items are encoded in URL (`?o=...`)
2. When order is placed, it's saved to Supabase
3. A unique share token is generated
4. Share URL: `/order?token=abc123`
5. Anyone with the token can view the order

### Dual Mode Support

The app supports both:
- **Authenticated users**: Orders linked to their account
- **Anonymous users**: Orders saved as guest orders

### Session Management

- Middleware automatically refreshes sessions
- Cookies are used for session storage
- No manual token management needed

## API Endpoints

### Authentication
- `signUp(formData)` - Create new user
- `signIn(formData)` - Login user
- `signOut()` - Logout user
- `getCurrentUser()` - Get current user data
- `updateProfile(formData)` - Update user profile

### Orders
- `createOrder(items, guestInfo)` - Create new order
- `getOrder(orderId)` - Get order by ID
- `getOrderByShareToken(token)` - Get order by share token
- `getMyOrders()` - Get current user's orders
- `getAllOrders()` - Get all orders (staff)
- `getOrdersByStatus(status)` - Filter by status
- `updateOrderStatus(orderId, status)` - Change order status
- `updateOrderItems(orderId, items)` - Modify order items
- `getOrderShareUrl(orderId)` - Generate share URL
- `cancelOrder(orderId)` - Cancel order

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local`
   - Use separate keys for development/production
   - Service role key should only be used server-side

2. **Row Level Security**
   - All tables have RLS enabled
   - Users can only access their own data
   - Share tokens allow controlled public access

3. **Share Token Expiration**
   - Tokens expire after 30 days by default
   - Can be customized in database triggers

## Troubleshooting

### Orders Not Appearing
- Check Supabase database tables exist
- Verify environment variables are set
- Check browser console for errors
- Ensure RLS policies allow access

### Authentication Issues
- Verify email provider is enabled in Supabase
- Check that cookies are allowed in browser
- Ensure middleware is running

### Drag and Drop Not Working
- Verify @dnd-kit packages are installed
- Check that orders have unique IDs
- Ensure status is one of: placed, paid, ready

## Next Steps

1. **Add Email Notifications**
   - Configure Supabase email templates
   - Send order confirmation emails
   - Notify on status changes

2. **Add Real-time Updates**
   - Use Supabase Realtime subscriptions
   - Remove polling in Kanban board
   - Live order status updates

3. **Add Payment Integration**
   - Integrate Stripe or similar
   - Update status to 'paid' after payment
   - Store payment metadata

4. **Add Order History**
   - Create order history page
   - Show past orders
   - Reorder functionality

5. **Add Admin Dashboard**
   - Analytics and reports
   - User management
   - Order statistics

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review this guide and SUPABASE_SETUP.md
3. Check the database schema in supabase-setup.sql

