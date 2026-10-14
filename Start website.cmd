@echo off
rem Double-click to run the Africell website on this computer.
rem It opens http://localhost:3000 in your browser. Close this window to stop the website.
cd /d "%~dp0"
title Africell website (close this window to stop)
echo Starting the Africell website... your browser will open in a few seconds.
echo Keep this window open while you look at the site. Close it to stop.
echo.
start "" cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:3000"
call npm.cmd run dev
pause
