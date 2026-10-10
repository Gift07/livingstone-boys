# School System

Next.js app with Tailwind CSS and a MongoDB/Mongoose API running inside the Next.js server.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS
- MongoDB
- Mongoose

## Setup

1. Copy the env file and set your MongoDB URI:

```bash
cp .env.example .env.local
```

Default local value:

```
MONGODB_URI=mongodb://127.0.0.1:27017/school-system
```

Use a MongoDB Atlas connection string if you are not running MongoDB locally.

To run MongoDB with Docker:

```bash
docker run -d --name school-mongo -p 27017:27017 mongo:7
```

2. Install and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | MongoDB connection check |
| GET, POST | `/api/students` | List or create students |
| GET, PATCH, DELETE | `/api/students/[id]` | Student by id |
| GET, POST | `/api/teachers` | List or create teachers |
| GET, PATCH, DELETE | `/api/teachers/[id]` | Teacher by id |
| GET, POST | `/api/courses` | List or create courses |
| GET, PATCH, DELETE | `/api/courses/[id]` | Course by id |

Models live in `src/models`. The shared connection helper is `src/lib/mongodb.ts`.
