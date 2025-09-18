@echo off
echo 🔧 Fixing Database Setup Issue...
echo.

echo 📦 Installing dotenv package...
call npm install dotenv

if %errorlevel% neq 0 (
    echo ❌ Failed to install dotenv
    pause
    exit /b 1
)

echo ✅ dotenv installed successfully
echo.

echo 🗃️ Setting up database with environment variables...
call npm run db:setup

if %errorlevel% equ 0 (
    echo ✅ Database setup completed successfully!
) else (
    echo ❌ Database setup failed
    echo Please check your PostgreSQL connection and credentials
)

echo.
echo 🎉 Ready to start the server!
echo Run: npm run dev
echo.
pause