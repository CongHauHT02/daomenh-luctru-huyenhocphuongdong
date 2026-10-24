@echo off
setlocal
echo ====================================================
echo      DAO MENH - CHAY LOCAL DEV SERVER
echo ====================================================

set "NODE_EXE=C:\Users\adminloc\AppData\Roaming\nvm\v22.22.3\node.exe"
if not exist "%NODE_EXE%" (
    set "NODE_EXE=node"
)

"%NODE_EXE%" "%~dp0node_modules\vite\bin\vite.js"
