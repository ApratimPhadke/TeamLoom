# TeamLoom Backend - Render Deployment Guide

Complete guide for deploying the TeamLoom Django backend to Render.com with PostgreSQL.

## 📋 Prerequisites

- [Render account](https://render.com) (free tier available)
- GitHub repository with your code
- Google OAuth credentials (optional, for Google Sign-In)

## 🚀 Quick Start Deployment

### Option 1: Deploy with Blueprint (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" → "Blueprint"

3. **Connect Repository**
   - Select your TeamLoom repository
   - Render will detect `render.yaml` automatically

4. **Review Services**
   - Web Service: `teamloom-backend`
   - Database: `teamloom-db` (PostgreSQL)
   - Click "Apply" to create services

5. **Configure Environment Variables** (see below)

### Option 2: Manual Deployment

1. **Create PostgreSQL Database**
   - Dashboard → "New +" → "PostgreSQL"
   - Name: `teamloom-db`
   - Region: Singapore (or closest to you)
   - Plan: Free
   - Click "Create Database"
   - Copy the "Internal Database URL"

2. **Create Web Service**
   - Dashboard → "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: `teamloom-backend`
     - **Region**: Singapore (match database)
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Environment**: Python 3
     - **Build Command**: `cd backend && chmod +x build.sh && ./build.sh`
     - **Start Command**: `cd backend && daphne -b 0.0.0.0 -p $PORT teamloom.asgi:application`
     - **Plan**: Free

3. **Add Environment Variables** (see below)

## 🔐 Environment Variables Configuration

Go to your web service → "Environment" tab and add these variables:

### Required Variables

```bash
# Database (if using Render PostgreSQL)
DATABASE_URL=<paste-internal-database-url>

# Django Security
SECRET_KEY=<click-generate-to-create-random-key>
DEBUG=False
ALLOWED_HOSTS=.onrender.com,localhost

# CORS - UPDATE with your frontend URL!
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

### Optional Variables

```bash
# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Redis (if using external Redis like Upstash)
USE_REDIS=true
REDIS_URL=redis://default:password@redis-xxxxx.upstash.io:6379

# Custom CSRF origins
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app
```

## 📝 Post-Deployment Steps

### 1. Verify Deployment

Once deployed, your backend URL will be: `https://teamloom-backend.onrender.com`

**Test the health check:**
```bash
curl https://teamloom-backend.onrender.com/api/health/
```

Expected response:
```json
{"status": "healthy", "service": "teamloom-backend"}
```

### 2. Create Superuser

Access the Render Shell:
- Go to your web service → "Shell" tab
- Run:
```bash
cd backend
python manage.py createsuperuser
```

### 3. Access Admin Panel

Visit: `https://teamloom-backend.onrender.com/admin/`

### 4. Update Frontend Configuration

Update your frontend `.env` file:
```bash
VITE_API_URL=https://teamloom-backend.onrender.com
VITE_WS_URL=wss://teamloom-backend.onrender.com
```

### 5. Configure Google OAuth (if using)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add Authorized Redirect URIs:
   - `https://teamloom-backend.onrender.com/api/auth/google/callback/`
   - `https://your-frontend.vercel.app` (your frontend URL)
4. Save changes

## 🔧 Redis Configuration Options

Render's Redis service costs $7/month minimum. You have alternatives:

### Option 1: Use External Free Redis (Recommended)

**Upstash** (Free tier: 10,000 commands/day)
1. Sign up at https://upstash.com
2. Create Redis database
3. Copy the connection URL
4. Add to Render environment:
   ```bash
   USE_REDIS=true
   REDIS_URL=redis://default:password@redis-xxxxx.upstash.io:6379
   ```

**Redis Cloud** (Free tier: 30MB)
1. Sign up at https://redis.com/try-free/
2. Create database
3. Get connection URL
4. Add to Render environment

### Option 2: Skip Redis (Development)

For development/testing, you can skip Redis:
- Don't set `USE_REDIS` or set it to `false`
- WebSockets will use in-memory channels
- Works fine for single instance (Render free tier)
- **Limitation**: Won't work if you scale to multiple instances

### Option 3: Use Render Redis (Paid)

If you need production-grade Redis:
1. Uncomment Redis section in `render.yaml`
2. Redeploy blueprint
3. Costs $7/month minimum

## 📦 Media Files Storage

⚠️ **Important**: Render's free tier has ephemeral storage. Uploaded files (avatars, etc.) will be deleted on redeploy.

### Option 1: Cloudinary (Recommended for Free Tier)

1. Sign up at https://cloudinary.com (free tier available)
2. Install package:
   ```bash
   pip install cloudinary django-cloudinary-storage
   ```
3. Update `settings.py`:
   ```python
   INSTALLED_APPS = [
       # ...
       'cloudinary_storage',
       'cloudinary',
   ]
   
   CLOUDINARY_STORAGE = {
       'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
       'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
       'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
   }
   
   DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
   ```
4. Add environment variables in Render

### Option 2: AWS S3

Use AWS S3 with `django-storages` (free tier for 12 months)

### Option 3: Accept Ephemeral Storage

For development, accept that files will be lost on redeploy.

## 🐛 Troubleshooting

### Build Fails

**Check logs**: Web Service → "Logs" tab

Common issues:
- Missing dependencies: Check `requirements.txt`
- Database connection: Verify `DATABASE_URL`
- Python version: Check `runtime.txt` or `PYTHON_VERSION`

### Database Connection Error

```
django.db.utils.OperationalError: could not connect to server
```

**Solution**:
- Verify `DATABASE_URL` is set correctly
- Use "Internal Database URL" from Render PostgreSQL
- Check database is in same region as web service

### Static Files Not Loading

```
GET /static/... 404
```

**Solution**:
- Verify build script runs `collectstatic`
- Check `STATIC_ROOT` in settings
- Ensure `whitenoise` is in `MIDDLEWARE`

### CORS Errors

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**:
- Update `CORS_ALLOWED_ORIGINS` with your frontend URL
- Include protocol: `https://your-frontend.vercel.app`
- No trailing slash

### WebSocket Connection Failed

```
WebSocket connection failed
```

**Solution**:
- If using Redis: Verify `REDIS_URL` is correct
- If not using Redis: Ensure `USE_REDIS=false`
- Check frontend WebSocket URL uses `wss://` (not `ws://`)

### Health Check Failing

**Solution**:
- Verify `/api/health/` endpoint exists
- Check `ALLOWED_HOSTS` includes `.onrender.com`
- Review application logs for errors

## 🔄 Redeployment

Render auto-deploys on git push to main branch.

**Manual redeploy**:
- Web Service → "Manual Deploy" → "Deploy latest commit"

**Clear build cache**:
- Web Service → "Settings" → "Clear build cache & deploy"

## 📊 Monitoring

### View Logs
- Web Service → "Logs" tab
- Real-time logs of your application

### Metrics
- Web Service → "Metrics" tab
- CPU, Memory, Request metrics

### Database
- PostgreSQL → "Info" tab
- Connection info, metrics

## 🎯 Production Checklist

Before going to production:

- [ ] `DEBUG=False` in environment variables
- [ ] Strong `SECRET_KEY` generated
- [ ] `ALLOWED_HOSTS` configured correctly
- [ ] `CORS_ALLOWED_ORIGINS` set to frontend URL only
- [ ] Database backups enabled (paid plan)
- [ ] Redis configured (if using WebSockets)
- [ ] Media files using cloud storage (Cloudinary/S3)
- [ ] Google OAuth redirect URIs updated
- [ ] SSL/HTTPS enabled (automatic on Render)
- [ ] Custom domain configured (optional)
- [ ] Monitoring/alerts set up
- [ ] Error tracking (Sentry) configured (optional)

## 🆘 Support

- **Render Docs**: https://render.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/
- **Render Community**: https://community.render.com

## 📚 Additional Resources

- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Django Channels Deployment](https://channels.readthedocs.io/en/stable/deploying.html)
- [Daphne Documentation](https://github.com/django/daphne)
