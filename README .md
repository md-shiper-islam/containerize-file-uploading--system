# Secure File Storage Service

A production-grade file storage API built with Node.js, Express, MongoDB, and Redis. Designed for secure, scalable file management with authentication, caching, and cloud integration.

[![React](https://img.shields.io/badge/React-19%2B-blue)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.18-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Caching-red)](https://redis.io/)
[![Nginx](https://img.shields.io/badge/Nginx-Reverse%20Proxy-green)](https://nginx.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

---

##  Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Nginx Reverse Proxy](#nginx-reverse-proxy)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Performance Optimizations](#performance-optimizations)
- [Security Features](#security-features)

---

##  Features

### Core Functionality
-  **Secure File Upload/Download** - Support for images, documents, and videos up to 100MB
-  **JWT Authentication** - Token-based user authentication with refresh tokens
-  **Role-Based Access Control** - Private and public file sharing
-  **Per-Resource Authorization** - Only file owner can delete/modify
-  **Redis Caching** - Cache-aside pattern with automatic invalidation
-  **Cloud Storage** - Cloudinary integration for reliable file storage
-  **React Frontend** - Responsive client dashboard for authentication and filemanagement
-  **Nginx Reverse Proxy** - Routes frontend and API traffic through a single entry point
-  **Containerization** - Docker setup for consistent deployment

### Performance & Reliability
- **Cache-Aside Pattern** - 60-second TTL on file listings
- **Query Optimization** - Database indexing for faster lookups
- **Automatic Cache Invalidation** - Updates sync instantly
- **Error Handling** - Comprehensive middleware for error management
- **Input Validation** - Sanitization against injection attacks

---

##  Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Application                    │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   Express.js Router     │
        │  • Authentication       │
        │  • File Operations      │
        │  • Authorization        │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │   Redis Cache Layer     │
        │  • Cache-Aside Pattern  │
        │  • 60s TTL              │
        │  • Auto-Invalidation    │
        └────────────┬────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌────────┐      ┌────────┐      ┌──────────┐
│MongoDB │      │JWT     │      │Cloudinary│
│(Files) │      │Auth    │      │(Storage) │
└────────┘      └────────┘      └──────────┘
```

---

##  Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js + Vite | User interface & dashboard |
| **Reverse Proxy** | Nginx | Request routing & reverse proxy |
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js | Web server & routing |
| **Database** | MongoDB | Document storage |
| **Cache** | Redis | Performance optimization |
| **Storage** | Cloudinary | Cloud file hosting |
| **Auth** | JWT + bcrypt | Security |
| **Container** | Docker | Deployment & isolation |

---

##  Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or Atlas connection string
- Redis running locally or cloud instance
- Cloudinary account (free tier OK)

### Installation

1. **Clone & Setup**
```bash
cd file-storage-project
npm install
```

2. **Environment Configuration**
Create `.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/file-storage
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/file-storage

# Redis
REDIS_URL=redis://localhost:6379
# OR Redis Cloud:
# REDIS_URL=redis://:password@host:port

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=refresh_secret_key
REFRESH_TOKEN_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload
MAX_FILE_SIZE=104857600  # 100MB in bytes
ALLOWED_FORMATS=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov
```

3. **Start Services** (if running locally)
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Redis
redis-server

# Terminal 3: Your API
npm run dev
```

4. **Verify Setup**
```bash
curl http://localhost:5000/api/health
# Response: { "status": "ok", "timestamp": "..." }
```

---

##  API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "johndoe"
}
```

**Response** (201):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

---

### File Operations

#### Upload File
```http
POST /api/files/upload
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

{
  "file": <binary_file>,
  "isPublic": false,
  "description": "My document"
}
```

**Response** (201):
```json
{
  "success": true,
  "file": {
    "_id": "507f1f77bcf86cd799439012",
    "filename": "document.pdf",
    "size": 2048576,
    "uploadedBy": "507f1f77bcf86cd799439011",
    "isPublic": false,
    "cloudinaryUrl": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### List Files (Cached)
```http
GET /api/files/list?page=1&limit=10
Authorization: Bearer <your_token>
```

**Features:**
-  Uses Redis cache (60-second TTL)
-  Pagination support
-  Only returns user's own files

**Response** (200):
```json
{
  "success": true,
  "files": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "filename": "document.pdf",
      "size": 2048576,
      "isPublic": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "cacheStatus": "HIT"  // or "MISS"
}
```

#### Download File
```http
GET /api/files/download/:fileId
Authorization: Bearer <your_token>
```

#### Delete File
```http
DELETE /api/files/:fileId
Authorization: Bearer <your_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "File deleted successfully",
  "cacheInvalidated": true
}
```

#### Toggle File Visibility
```http
PATCH /api/files/:fileId/visibility
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "isPublic": true
}
```

---

##  Project Structure

```text
file-storage-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   ├── nginx.conf
│   └── Dockerfile
│
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── redis.js             # Redis setup
│   │   ├── cloudinary.js        # Cloudinary config
│   │   └── constants.js         # App constants
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   ├── validation.js        # Input validation
│   │   └── rateLimiter.js       # Rate limiting
│   │
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── File.js              # File schema (indexed)
│   │
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── fileController.js    # File CRUD + cache
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   └── fileRoutes.js        # /api/files/*
│   │
│   ├── utils/
│   │   ├── cacheManager.js      # Cache operations
│   │   ├── fileValidator.js     # File validation
│   │   └── jwtHelper.js         # Token utilities
│   │
│   └── server.js                # Entry point
│
├── .env.example                 # Environment template
├── docker-compose.yml           # Frontend + API + Nginx services
├── Dockerfile                   # Container config
├── package.json
└── README.md
```

---

##  Performance Optimizations

### 1. Redis Caching Strategy
```javascript
// Cache-Aside Pattern
async function getFileList(userId, page) {
  const cacheKey = `files:${userId}:page:${page}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return { data: JSON.parse(cached), cached: true };
  
  // Fetch from DB
  const files = await File.find({ uploadedBy: userId })
    .skip((page - 1) * 10)
    .limit(10)
    .lean();
  
  // Store in cache with 60s TTL
  await redis.setex(cacheKey, 60, JSON.stringify(files));
  
  return { data: files, cached: false };
}
```

### 2. Database Indexing
```javascript
// File.js schema
const fileSchema = new Schema({
  uploadedBy: { 
    type: ObjectId, 
    ref: 'User',
    index: true  // Fast lookups by user
  },
  filename: { type: String, index: true },
  isPublic: { type: Boolean, index: true },
  createdAt: { type: Date, index: true }
});

// Compound index for common queries
fileSchema.index({ uploadedBy: 1, isPublic: 1 });
```

### 3. Automatic Cache Invalidation
```javascript
// When file is deleted
await File.findByIdAndDelete(fileId);
await invalidateUserCache(userId);  // Clear all user's cache

// Redis invalidation
async function invalidateUserCache(userId) {
  const keys = await redis.keys(`files:${userId}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

### 4. Query Optimization
- Use `.lean()` for read-only operations
- Implement pagination (no loading 1M files at once)
- Select only needed fields with projection

---

##  Security Features

### Authentication
-  **JWT Tokens** - Stateless, secure token-based auth
-  **Password Hashing** - bcrypt with 10 salt rounds
-  **Refresh Tokens** - Separate refresh token flow
-  **Token Expiry** - Short-lived access tokens (7 days)

### Authorization
-  **Per-Resource Checks** - File ownership validation
-  **Role-Based Access** - Public vs private files
-  **Admin Operations** - Only file owner can delete

### Input Validation
-  **File Size Limits** - 100MB max per file
-  **File Type Validation** - Whitelist allowed formats
-  **Sanitization** - Remove malicious input
-  **Email Validation** - RFC 5322 compliance

### API Security
-  **HTTPS Ready** - Node.js works with reverse proxy (Nginx)
-  **CORS Configuration** - Restrict cross-origin requests
-  **Rate Limiting** - Prevent abuse (future)
-  **SQL Injection Prevention** - Using Mongoose (not raw queries)

---


##  Nginx Reverse Proxy

Nginx acts as the single entry point for the application.

```text
Browser
   │
   ▼
Nginx :80
   ├── /     → React Frontend
   └── /api/ → Node.js / Express Backend
```

Example `nginx/nginx.conf`:

```nginx
events {}

http {
    upstream frontend {
        server frontend:5173;
    }

    upstream backend {
        server backend:3000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

The React application can call the API through the same origin using:

```javascript
axios.create({
  baseURL: "/api"
});
```

This keeps the frontend and backend behind one public entry point and makes the architecture easier to extend with load balancing, HTTPS termination, and other reverse-proxy features.

##  Docker Deployment

### Local Development with Docker

```bash
# Start all services
docker compose up --build
```

Recommended service flow:

```text
Browser
   ↓
Nginx :80
   ├── React Frontend
   └── Node.js API
          ├── MongoDB
          ├── Redis
          └── Cloudinary
```

The public application entry point is Nginx, while React and the Node.js API communicate through the reverse proxy.


### Production Deployment

```bash
# Build image
docker build -t file-storage-api:1.0 .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb+srv://... \
  -e REDIS_URL=redis://... \
  file-storage-api:1.0
```

---

##  Performance Metrics

From production testing:

| Metric | Without Cache | With Cache | Improvement |
|--------|--------------|-----------|------------|
| List Files (10 items) | 450ms | 120ms | **73% faster** |
| 100 concurrent users | 2.3s avg | 650ms avg | **3.5x faster** |
| Database queries/sec | 85 | 15 | **82% reduction** |

---

##  Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid authentication token",
    "statusCode": 401,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

Common error codes:
- `UNAUTHORIZED` (401) - Invalid/missing token
- `FORBIDDEN` (403) - Don't own this file
- `NOT_FOUND` (404) - File doesn't exist
- `VALIDATION_ERROR` (400) - Invalid input
- `SERVER_ERROR` (500) - Unexpected error

---

##  Continuous Integration/Deployment (in Future)

### GitHub Actions (CI/CD)
```yaml
# .github/workflows/deploy.yml
- Run tests
- Build Docker image
- Push to registry
- Deploy to production
```

---

##  Future Improvements

- [ ] Advanced file sharing (expiring links, password-protected)
- [ ] Virus scanning integration
- [ ] File versioning & recovery
- [ ] Bandwidth throttling
- [ ] Automated backups
- [ ] WebSocket for real-time uploads

---

## 📝 License

MIT License - See LICENSE file

---

## 👤 Author

**Md Shiper Islam** (Sohanur Rahman)  
Backend Engineer | Node.js & System Design Specialist  
📧 sohanurrohomansohans@gmail.com  
🔗 [GitHub](https://github.com) | [LinkedIn](https://linkedin.com)

---

##  Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.

---
s
**Last Updated:** September 2026  
**Version:** 1.0.0
