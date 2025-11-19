# AI Receipt Generator

A production-level AI-powered receipt generator that analyzes receipt layouts using Claude Vision API and generates professional receipts with custom business data.

## Features

- **AI Layout Extraction**: Upload any receipt sample and AI analyzes its structure, fonts, spacing, and layout
- **Live Preview**: See your receipt update in real-time as you enter data
- **PDF & PNG Export**: Download receipts in multiple formats
- **Custom Branding**: Add your logo and business information
- **User Authentication**: Secure login with email/password or Google OAuth
- **Credit System**: Free tier with 3 receipts/month, unlimited for Pro users
- **Admin Panel**: Manage users, credits, and system settings
- **Stripe Integration**: Seamless payment processing for subscriptions

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **Zustand** for state management
- **React Hook Form** for forms
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- **Supabase** (Database, Auth, Storage)
- **Anthropic Claude Vision API** for layout extraction
- **Puppeteer** for PDF/PNG generation
- **Stripe** for payments

### DevOps
- **Docker** for containerization
- **Jest** for unit tests
- **Playwright** for E2E tests

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key
- Stripe account (for payments)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Receipt_Generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Supabase database**

Run the SQL schema in your Supabase SQL editor:

```bash
# The schema is located at:
lib/supabase/schema.sql
```

This will create:
- `users` table
- `receipts` table
- `files` table
- `subscriptions` table
- Storage buckets for uploads and receipts
- Row Level Security policies
- Triggers for user creation

5. **Configure Supabase Storage**

In your Supabase dashboard:
- Go to Storage
- Ensure buckets `receipts` and `uploads` are created (the schema does this automatically)
- Set both buckets to public

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Receipt_Generator/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── extract-layout/  # AI layout extraction endpoint
│   │   ├── generate/        # Receipt generation endpoint
│   │   ├── receipts/        # CRUD operations for receipts
│   │   ├── user/            # User data endpoint
│   │   └── auth/webhook/    # Stripe webhook handler
│   ├── auth/login/          # Authentication page
│   ├── dashboard/           # User dashboard
│   ├── generator/           # Receipt builder interface
│   ├── admin/               # Admin panel
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── layout/              # Layout components
├── lib/                     # Utility libraries
│   ├── ai/                  # AI integration
│   │   └── extractLayout.ts # Claude Vision API integration
│   ├── pdf/                 # PDF/PNG generation
│   │   └── generatePDF.ts   # Puppeteer-based generation
│   ├── supabase/            # Supabase configuration
│   │   ├── client.ts        # Client-side Supabase
│   │   ├── server.ts        # Server-side Supabase
│   │   └── schema.sql       # Database schema
│   ├── store/               # Zustand stores
│   │   └── useReceiptStore.ts
│   └── utils.ts             # Utility functions
├── tests/                   # Test files
│   ├── e2e/                 # Playwright E2E tests
│   └── unit/                # Jest unit tests
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose (optional)
└── README.md               # This file
```

## Usage

### For Users

1. **Sign Up/Login**
   - Navigate to the app
   - Click "Get Started" or "Dashboard"
   - Sign up with email/password or Google

2. **Create a Receipt**
   - Go to Dashboard
   - Click "Create New Receipt"
   - Upload a sample receipt (optional - for AI layout extraction)
   - Fill in business information
   - Add items with quantities and prices
   - Set tax rate and discount (optional)
   - Preview your receipt in real-time
   - Click "Generate Receipt" to download

3. **Manage Receipts**
   - View all receipts in Dashboard
   - Download PDF or PNG versions
   - Delete old receipts

### For Admins

1. **Access Admin Panel**
   - Must have `is_admin` flag set to `true` in database
   - Navigate to `/admin`

2. **Manage Users**
   - View all users
   - Adjust user credits
   - Ban/unban users
   - View user statistics

## API Endpoints

### POST `/api/extract-layout`
Extract receipt layout from uploaded image using AI.

**Request:**
- FormData with `file` field (image)

**Response:**
```json
{
  "layout": {
    "page": { "width": 384, "padding": 20 },
    "header": { ... },
    "table": { ... },
    "totals": { ... },
    "footer": { ... }
  },
  "sampleUrl": "https://..."
}
```

### POST `/api/generate`
Generate receipt PDF and PNG.

**Request:**
```json
{
  "layout": { ... },
  "businessInfo": { ... },
  "items": [ ... ],
  "subtotal": 100,
  "tax": 10,
  "total": 110,
  "receiptNumber": "REC-001",
  "notes": "Thank you!"
}
```

**Response:**
```json
{
  "pdfUrl": "https://...",
  "pngUrl": "https://...",
  "receipt": { ... },
  "remainingCredits": 2
}
```

### GET `/api/receipts`
Get user's receipts.

### DELETE `/api/receipts?id=<receipt_id>`
Delete a receipt.

### POST `/api/auth/webhook`
Stripe webhook for subscription updates.

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

### Docker

1. **Build the image**
```bash
docker build -t ai-receipt-generator .
```

2. **Run the container**
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_key \
  -e ANTHROPIC_API_KEY=your_anthropic_key \
  -e STRIPE_SECRET_KEY=your_stripe_key \
  -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pub_key \
  -e STRIPE_WEBHOOK_SECRET=your_webhook_secret \
  ai-receipt-generator
```

### Vercel

1. **Push to GitHub**

2. **Import to Vercel**
   - Connect your repository
   - Add environment variables
   - Deploy

3. **Configure Stripe Webhook**
   - Add webhook URL: `https://your-domain.com/api/auth/webhook`
   - Select events: `customer.subscription.*`, `checkout.session.completed`

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Security Features

- **Row Level Security (RLS)**: All Supabase tables use RLS policies
- **JWT Authentication**: Secure session management with Supabase Auth
- **Server-side API validation**: All API routes validate user sessions
- **Credit system**: Prevents abuse with usage limits
- **Ban system**: Admin can ban malicious users
- **Secure file uploads**: Files uploaded to Supabase Storage with proper permissions

## Credits System

- **Free Tier**: 3 receipts per month
- **Pro Monthly**: Unlimited receipts ($19/month)
- **Pro Yearly**: Unlimited receipts ($182/year, 20% discount)

## Troubleshooting

### Puppeteer Issues

If you encounter Chromium-related errors:

```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y \
  chromium-browser \
  fonts-liberation \
  libnss3 \
  libxss1
```

### Supabase Connection Issues

- Verify your Supabase URL and keys
- Check if RLS policies are enabled
- Ensure storage buckets are created and public

### AI Layout Extraction Fails

- Verify Anthropic API key is valid
- Check if you have sufficient API credits
- Ensure uploaded image is a valid receipt

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@aireceipt.com

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)

---

Built with ❤️ using Next.js, TypeScript, and AI
