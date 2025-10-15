@echo off
echo Setting up FreelanceHub Project...
echo.

echo Creating backend environment file...
echo MONGODB_URI=mongodb://localhost:27017/freelance-platform > backend\.env
echo JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure >> backend\.env
echo STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here >> backend\.env
echo STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here >> backend\.env
echo NODE_ENV=development >> backend\.env
echo PORT=5000 >> backend\.env

echo Creating frontend environment file...
echo VITE_API_URL=http://localhost:5000/api > frontend\.env
echo VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here >> frontend\.env

echo.
echo Environment files created!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running on your system
echo 2. Update the .env files with your actual MongoDB URI and Stripe keys
echo 3. Run: cd backend && npm run dev
echo 4. Run: cd frontend && npm run dev
echo.
echo The backend will run on http://localhost:5000
echo The frontend will run on http://localhost:5173
echo.
pause



