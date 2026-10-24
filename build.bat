@echo off
setlocal
echo ====================================================
echo      DAO MENH - HE THONG MENH LY CO THU
echo               BUILDING LOCAL BUNDLE
echo ====================================================

set "NODE_EXE=C:\Users\adminloc\AppData\Roaming\nvm\v22.22.3\node.exe"
if not exist "%NODE_EXE%" (
    set "NODE_EXE=node"
)

echo [1/2] Type-checking TypeScript...
"%NODE_EXE%" "%~dp0node_modules\typescript\bin\tsc" -b "%~dp0."
if %errorlevel% neq 0 (
    echo [ERROR] TypeScript build failed!
    exit /b %errorlevel%
)

echo [2/2] Building Vite bundle...
"%NODE_EXE%" "%~dp0node_modules\vite\bin\vite.js" build
if %errorlevel% neq 0 (
    echo [ERROR] Vite build failed!
    exit /b %errorlevel%
)

echo ====================================================
echo  BUILD THANH CONG! THU MUC DICH: dist/
echo ====================================================
