# Quick Start Guide - Zaratan Restaurant App

## ✅ What's Been Implemented

Your restaurant app now has:
- ✅ Supabase authentication (email/password)
- ✅ Database integration for clients and orders
- ✅ Drag-and-drop Kanban board (Placed → Paid → Ready)
- ✅ URL-based order sharing
- ✅ Support for both authenticated and anonymous orders
- ✅ Automatic order tracking and status updates

## 🚀 Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Note your project URL and API keys

### 2. Setup Database
1. In Supabase dashboard, go to **SQL Editor**
2. Copy contents of `supabase-setup.sql`
3. Paste and run it
4. Enable Email auth in **Authentication > Providers**

### 3. Configure Environment
Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
QSTASH_TOKEN=your-existing-qstash-token
```

### 4. Run the App
```bash
pnpm dev
```

Visit:
- http://localhost:3000 - Customer order page
- http://localhost:3000/management - Restaurant Kanban board

## 📋 How It Works

### Customer Flow
1. Customer adds items to cart (stored in URL)
2. Enters name and clicks "Start Order"
3. Order is saved to Supabase
4. Customer gets shareable link
5. Order appears in "Placed" column on Kanban board

### Restaurant Flow
1. Staff opens `/management` page
2. Sees all orders in 3 columns: Placed, Paid, Ready
3. Drags orders to update status
4. Changes saved automatically to database
5. Board auto-refreshes every 10 seconds

### Order Sharing
- Orders can be shared via URL token
- Anyone with link can view order
- Works for both logged-in and guest orders
- Tokens expire after 30 days

## 📁 Key Files Created

```
src/
├── app/
│   ├── _components/
│   │   ├── Auth/                   # Login/Signup forms
│   │   └── Kanban/                 # Drag-and-drop board
│   ├── _types/
│   │   └── database.ts             # Database types
│   ├── auth/
│   │   └── actions.ts              # Auth functions
│   ├── orders/
│   │   └── actions.ts              # Order management
│   └── management/
│       └── page.tsx                # Kanban page
├── lib/
│   └── supabase/                   # Supabase clients
└── middleware.ts                   # Session management

Config Files:
├── supabase-setup.sql              # Database schema
├── SUPABASE_SETUP.md               # Detailed Supabase guide
└── IMPLEMENTATION_GUIDE.md         # Full documentation
```

## 🎯 Next Steps

1. **Test the Flow**
   - Create a test order
   - Check it appears in management board
   - Drag it between columns
   - Share the order URL

2. **Customize**
   - Adjust order statuses if needed
   - Customize email templates in Supabase
   - Add your branding

3. **Deploy**
   - Deploy to Vercel
   - Update NEXT_PUBLIC_APP_URL in production env
   - Test with real orders

## 🔧 Common Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production server
pnpm start
```

## 📚 Documentation

- `SUPABASE_SETUP.md` - Detailed Supabase configuration
- `IMPLEMENTATION_GUIDE.md` - Complete feature documentation
- `supabase-setup.sql` - Database schema with comments

## 🆘 Troubleshooting

**Orders not appearing?**
- Check `.env.local` is configured
- Verify Supabase tables were created
- Check browser console for errors

**Can't login?**
- Ensure email provider is enabled in Supabase
- Check email/password meets requirements
- Verify Supabase URL is correct

**Drag and drop not working?**
- Refresh the page
- Check orders have valid status values
- Verify @dnd-kit is installed

## 💡 Pro Tips

1. Use Chrome DevTools to see network requests
2. Check Supabase logs for database errors
3. Test with different browsers
4. Share orders via incognito to test anonymous flow

## 🎉 You're Done!

Your restaurant app now has full order management with authentication and a beautiful Kanban board interface. Start testing and customizing!

Need help? Check the detailed guides:
- SUPABASE_SETUP.md
- IMPLEMENTATION_GUIDE.md

