# 🚨 Troubleshooting Guide - FreelanceHub Project

## Common Issues and Solutions

### 1. **Dependency Installation Issues**
**Problem**: npm install fails with dependency conflicts
**Solution**: 
```bash
# Clean install
cd frontend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
```

### 2. **Backend Not Starting**
**Problem**: Server doesn't start or crashes
**Solutions**:

#### Check if MongoDB is running:
```bash
# Windows - Check if MongoDB service is running
net start MongoDB

# Or start MongoDB manually
mongod
```

#### Check environment variables:
Make sure `backend/.env` exists with:
```env
MONGODB_URI=mongodb://localhost:27017/freelance-platform
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NODE_ENV=development
PORT=5000
```

#### Test backend manually:
```bash
cd backend
node server.js
```

### 3. **Frontend Not Starting**
**Problem**: React app doesn't start
**Solutions**:

#### Check environment variables:
Make sure `frontend/.env` exists with:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

#### Test frontend:
```bash
cd frontend
npm run dev
```

### 4. **MongoDB Connection Issues**
**Problem**: "MongoDB connection error"
**Solutions**:

#### Option 1: Install MongoDB locally
1. Download MongoDB Community Server
2. Install and start the service
3. Update MONGODB_URI in backend/.env

#### Option 2: Use MongoDB Atlas (Cloud)
1. Create free account at mongodb.com
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

### 5. **Port Already in Use**
**Problem**: "Port 5000 is already in use"
**Solutions**:
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

### 6. **API Connection Issues**
**Problem**: Frontend can't connect to backend
**Solutions**:
1. Make sure backend is running on port 5000
2. Check VITE_API_URL in frontend/.env
3. Verify CORS is enabled in backend

## Step-by-Step Setup

### 1. **Prerequisites Check**
```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version

# Check if MongoDB is installed
mongod --version
```

### 2. **Backend Setup**
```bash
cd backend
npm install
# Make sure .env file exists
node server.js
```

### 3. **Frontend Setup**
```bash
cd frontend
npm install
# Make sure .env file exists
npm run dev
```

### 4. **Test the Application**
1. Backend should show: "Server running on port 5000"
2. Frontend should show: "Local: http://localhost:5173"
3. Open browser to http://localhost:5173

## Quick Fix Commands

### Reset Everything:
```bash
# Backend
cd backend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install

# Frontend  
cd ../frontend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
```

### Start Both Servers:
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## What Should Work After Setup

1. ✅ **Registration**: Create client/freelancer accounts
2. ✅ **Login**: Sign in with credentials
3. ✅ **Dashboard**: View user dashboard
4. ✅ **Projects**: Browse and create projects
5. ✅ **Bidding**: Submit bids on projects
6. ✅ **Messaging**: Send messages (basic)
7. ✅ **Contracts**: Accept bids and create contracts

## Still Having Issues?

**Check these files exist:**
- `backend/.env`
- `frontend/.env`
- `backend/package.json`
- `frontend/package.json`

**Check these services are running:**
- MongoDB (port 27017)
- Backend server (port 5000)
- Frontend dev server (port 5173)

**Common Error Messages:**
- "Cannot find module" → Run `npm install`
- "Port already in use" → Kill process or change port
- "MongoDB connection error" → Start MongoDB service
- "CORS error" → Check backend CORS configuration

## Need Help?

If you're still having issues, please share:
1. The exact error message you're seeing
2. Which step is failing (backend/frontend)
3. Your operating system
4. Node.js version (`node --version`)



