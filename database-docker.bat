@echo off
REM This batch file is for managing the TFPM MSSQL Docker container
REM Usage: database-docker.bat [start|stop|restart|logs|status|clean|connect|init|sample]

set CONTAINER_NAME=tfpm-mssql
set PASSWORD=TFPMPassword123!

if "%1"=="start" (
    echo Starting MSSQL database container...
    docker-compose up -d --build
    if !errorlevel! equ 0 (
        echo Container started successfully!
        echo Waiting for database to be ready...
        timeout /t 30 /nobreak >nul
        echo Database should be ready now!
        echo.
        echo Connection Details:
        echo   Server: localhost,1433
        echo   Username: SA
        echo   Password: %PASSWORD%
        echo   Database: TFPM
    ) else (
        echo Failed to start container!
    )
) else if "%1"=="stop" (
    echo Stopping MSSQL database container...
    docker stop %CONTAINER_NAME%
    if !errorlevel! equ 0 (
        echo Container stopped successfully!
    ) else (
        echo Failed to stop container!
    )
) else if "%1"=="restart" (
    echo Restarting MSSQL database container...
    docker stop %CONTAINER_NAME%
    timeout /t 3 /nobreak >nul
    docker start %CONTAINER_NAME%
) else if "%1"=="logs" (
    echo Showing container logs...
    docker logs %CONTAINER_NAME% --follow
) else if "%1"=="status" (
    echo Container Status:
    docker ps -a --filter "name=%CONTAINER_NAME%"
) else if "%1"=="clean" (
    echo This will remove the container and all data.
    set /p confirm="Are you sure? (y/N): "
    if /i "!confirm!"=="y" (
        echo Cleaning up database container and volumes...
        docker-compose down -v
        echo Cleanup completed!
    ) else (
        echo Cleanup cancelled.
    )
) else if "%1"=="connect" (
    echo Connecting to database...
    echo Note: You may need to install SQL Server command line tools if not already installed.
    echo.
    sqlcmd -S "localhost,1433" -U "SA" -P "%PASSWORD%" -d "TFPM"
) else if "%1"=="init" (
    echo Initializing database schema...
    powershell -ExecutionPolicy Bypass -File init-database.ps1
) else if "%1"=="sample" (
    echo Loading sample data into the database...
    powershell -Command "Get-Content 'init-sample-data.sql' | docker exec -i %CONTAINER_NAME% /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P %PASSWORD% -C"
    echo Sample data loaded successfully!
) else (
    echo Invalid action: %1
    echo Use: database-docker.bat [start^|stop^|restart^|logs^|status^|clean^|connect^|init^|sample]
)

:end
