@echo off
echo 🚀 Starting FreelanceHub Project...
echo.

echo 📡 Starting Backend Server (Mock - No MongoDB needed)...
start "Backend Server" cmd /k "cd backend && node mock-server.js"

echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:5000/api/test
echo.
echo 🔑 Test Login Credentials:
echo    Email: client@test.com
echo    Password: password
echo.
echo 📝 Press any key to close this window...
pause >nul



