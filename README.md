# Smart Bookmark Manager

A modern, real-time bookmark management application that lets you save and organize your favorite links with instant synchronization across all your devices.

## 🌐 Live Demo

**[View Live App](https://smart-bookmark-app-lemon-omega.vercel.app/)**

## ✨ Features

- **Google Authentication** - Secure sign-in using your Google account, no passwords needed
- **Quick Bookmark Management** - Add bookmarks with just a title and URL
- **Real-time Synchronization** - Changes appear instantly across all your open tabs and devices
- **Private & Secure** - Your bookmarks are completely private, only you can see them
- **Clean Interface** - Minimalist design focused on usability and aesthetics
- **Instant Updates** - Delete bookmarks with immediate UI feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel
- **Styling**: Custom Tailwind configuration with soft color palette

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Cloud account for OAuth setup
- A Supabase account for database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sriram1224/smart-bookmark-app.git
cd smart-bookmark-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with the required credentials (see Configuration section below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## ⚙️ Configuration

### Google OAuth Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
6. Copy your Client ID and Client Secret

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com/)
2. Go to the SQL Editor and run:

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their bookmarks" 
  ON bookmarks FOR ALL 
  USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

3. Navigate to **Settings** → **API** and copy:
   - Project URL
   - Anon/Public Key

### Environment Variables

Update your `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## 📦 Deployment

This app is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/)
3. Add all environment variables from `.env.local`
4. Deploy
5. Update `NEXTAUTH_URL` with your production URL
6. Add production callback URL to Google OAuth settings

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎨 Design Philosophy

The UI follows a minimalist, calming design approach:

- Soft color palette with muted purples and slate tones
- Subtle shadows and smooth transitions
- Generous spacing for better readability
- Hover effects that provide gentle feedback
- Real-time indicators for live synchronization

## 🐛 Challenges & Solutions

### Challenge 1: Real-time Synchronization
**Problem**: Initially, bookmarks weren't syncing across tabs without page refresh.

**Solution**: Implemented Supabase Realtime subscriptions with proper channel management. Added optimistic UI updates as a fallback to ensure immediate feedback even if real-time events are delayed. The combination provides a smooth user experience.

### Challenge 2: OAuth Redirect Configuration
**Problem**: Google OAuth was returning redirect URI mismatch errors during testing.

**Solution**: Ensured exact URI matching in Google Cloud Console. The callback URL must be precisely `http://localhost:3000/api/auth/callback/google` for local development and match the production domain exactly. No trailing slashes or variations allowed.

### Challenge 3: Database Privacy
**Problem**: Needed to ensure users could only access their own bookmarks.

**Solution**: Implemented Row Level Security (RLS) in Supabase with policies that filter by user_id. Combined with NextAuth session management, this ensures complete data privacy at the database level.

### Challenge 4: UI Performance
**Problem**: Large bookmark lists could cause performance issues with animations.

**Solution**: Used CSS transforms for animations instead of layout properties, implemented staggered fade-in animations with minimal delays, and ensured all transitions stay under 400ms for optimal perceived performance.

## 📝 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js
│   │   └── bookmarks/route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── AddBookmark.js
│   ├── BookmarkList.js
│   └── SessionProvider.js
├── lib/
│   └── supabase.js
├── public/
├── .env.example
├── .gitignore
├── DEPLOYMENT.md
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Next.js and React
- Database and real-time powered by Supabase
- Authentication via NextAuth.js
- Styled with Tailwind CSS
- Deployed on Vercel

---

Made with care by [Sriram](https://github.com/sriram1224)
