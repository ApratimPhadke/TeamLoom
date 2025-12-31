# TeamLoom Deployment Configuration

## Database (Supabase PostgreSQL)

### Connection Details
- **Host:** `db.ajwqqwkljairuvlspsij.supabase.co`
- **Port:** `5432`
- **Database Name:** `postgres`
- **User:** `postgres`
- **Region:** `ap-southeast-1` (Singapore)
- **Project ID:** `ajwqqwkljairuvlspsij`

### DATABASE_URL Format
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ajwqqwkljairuvlspsij.supabase.co:5432/postgres
```

### How to Get Your Password
1. Go to Supabase Dashboard → Your Project
2. Navigate to **Project Settings** → **Database**
3. Find the **Database password** section
4. Copy the password (or reset if forgotten)

---

## Backend Environment Variables (.env)

Create a `.env` file in `/backend/` with these values:

```env
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ajwqqwkljairuvlspsij.supabase.co:5432/postgres

# Individual DB settings (optional, DATABASE_URL takes precedence)
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_HOST=db.ajwqqwkljairuvlspsij.supabase.co
DB_PORT=5432

# Django Settings
SECRET_KEY=your-production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,.railway.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id

# CORS (add your frontend URLs)
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

---

## Next Steps

1. ✅ Database created on Supabase
2. ⏳ Configure backend with DATABASE_URL
3. ⏳ Run migrations on production database
4. ⏳ Deploy backend (Railway/Render)
5. ⏳ Deploy frontend (Vercel)

---

## Testing Connection Locally

To test the Supabase connection locally:

```bash
cd backend
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ajwqqwkljairuvlspsij.supabase.co:5432/postgres"
python manage.py migrate
python manage.py createsuperuser
```

---

*Created: December 31, 2025*
