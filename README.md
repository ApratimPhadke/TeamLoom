# TeamLoom

A skill-based team formation platform for academic institutions. Find complementary teammates for your projects using intelligent skill-matching.

## Tech Stack

**Backend:** Django 4.2+, PostgreSQL, Redis, Django Channels (WebSockets), Celery  
**Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit  
**Auth:** JWT (access/refresh tokens)

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (optional - for PostgreSQL/Redis)

### Option A: Without Docker (SQLite - recommended for development)
```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_skills
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Option B: With Docker (PostgreSQL + Redis)
```bash
# Start databases
docker-compose up -d

# Set environment to use PostgreSQL
export USE_SQLITE=false
export USE_REDIS=true

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_skills
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 4. Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Admin: http://localhost:8000/admin

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| POST `/api/auth/register/` | Register new user |
| POST `/api/auth/login/` | Login (returns JWT) |
| GET `/api/profiles/me/` | Get/update profile |
| GET `/api/profiles/skills/` | List all skills |
| GET `/api/groups/` | List groups |
| POST `/api/groups/` | Create group |
| POST `/api/groups/{id}/join/` | Request to join |
| WS `/ws/chat/{group_id}/` | Group chat |
| WS `/ws/notifications/` | Real-time notifications |

## Project Structure

```
TeamLoom/
├── backend/
│   ├── teamloom/        # Django settings
│   ├── accounts/        # User auth
│   ├── profiles/        # Student profiles & skills
│   ├── groups/          # Project groups
│   ├── chat/            # WebSocket chat
│   └── notifications/   # Notification system
├── frontend/
│   ├── src/
│   │   ├── pages/       # Route components
│   │   ├── components/  # Reusable UI
│   │   ├── store/       # Redux slices
│   │   └── api/         # API client
└── docker-compose.yml
```

## Features

- ✅ User authentication (email + JWT)
- ✅ Student profiles with skills & portfolio
- ✅ Group creation with required skills
- ✅ Join request system
- ✅ Real-time group chat (WebSockets)
- ✅ Skill-based recommendations
- ✅ Profile view analytics
- ✅ In-app notifications

## License

MIT
