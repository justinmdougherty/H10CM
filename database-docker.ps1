# TFPM Database Docker Management Script
# This script helps manage the MSSQL Docker container for the TFPM project

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "restart", "logs", "status", "clean", "connect", "init")]
    [string]$Action
)

$ContainerName = "tfpm-mssql"
$Password = "TFPMPassword123!"

function Show-Usage {
    Write-Host "Usage: .\database-docker.ps1 [ACTION]"
    Write-Host ""
    Write-Host "Actions:"
    Write-Host "  start    - Start the MSSQL container"
    Write-Host "  stop     - Stop the MSSQL container"
    Write-Host "  restart  - Restart the MSSQL container"
    Write-Host "  logs     - Show container logs"
    Write-Host "  status   - Show container status"
    Write-Host "  clean    - Stop and remove container and volumes"
    Write-Host "  connect  - Connect to the database using sqlcmd"
    Write-Host "  init     - Initialize the database schema"
    Write-Host ""
    Write-Host "Connection Details:"
    Write-Host "  Server: localhost,1433"
    Write-Host "  Username: SA"
    Write-Host "  Password: $Password"
    Write-Host "  Database: TFPM"
}

function Test-DockerRunning {
    try {
        docker version | Out-Null
        return $true
    } catch {
        Write-Host "Error: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
        return $false
    }
}

function Start-Database {
    Write-Host "Starting MSSQL database container..." -ForegroundColor Green
    
    # Check if container exists
    $containerExists = docker ps -a --filter "name=$ContainerName" --format "{{.Names}}" | Select-String $ContainerName
    
    if ($containerExists) {
        Write-Host "Container exists. Starting existing container..." -ForegroundColor Yellow
        docker start $ContainerName
    } else {
        Write-Host "Starting new container..." -ForegroundColor Yellow
        docker-compose up -d
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Container started successfully!" -ForegroundColor Green
        Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
        
        # Wait for health check to pass
        $timeout = 60
        $elapsed = 0
        
        do {
            Start-Sleep -Seconds 5
            $elapsed += 5
            $health = docker inspect --format='{{.State.Health.Status}}' $ContainerName 2>$null
            
            if ($health -eq "healthy") {
                Write-Host "Database is ready!" -ForegroundColor Green
                
                # Initialize database
                Write-Host "Initializing database schema..." -ForegroundColor Yellow
                & ".\init-database.ps1"
                
                if ($LASTEXITCODE -eq 0) {
                    Show-ConnectionInfo
                }
                return
            }
            
            Write-Host "Still waiting... ($elapsed/$timeout seconds)" -ForegroundColor Yellow
        } while ($elapsed -lt $timeout)
        
        Write-Host "Database startup may have taken longer than expected. Check logs with: .\database-docker.ps1 logs" -ForegroundColor Yellow
        Write-Host "You can manually initialize the database by running: .\init-database.ps1" -ForegroundColor Yellow
    } else {
        Write-Host "Failed to start container!" -ForegroundColor Red
    }
}

function Stop-Database {
    Write-Host "Stopping MSSQL database container..." -ForegroundColor Yellow
    docker stop $ContainerName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Container stopped successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to stop container!" -ForegroundColor Red
    }
}

function Restart-Database {
    Write-Host "Restarting MSSQL database container..." -ForegroundColor Yellow
    Stop-Database
    Start-Sleep -Seconds 3
    Start-Database
}

function Show-Logs {
    Write-Host "Showing container logs..." -ForegroundColor Green
    docker logs $ContainerName --follow
}

function Show-Status {
    Write-Host "Container Status:" -ForegroundColor Green
    docker ps -a --filter "name=$ContainerName" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    $health = docker inspect --format='{{.State.Health.Status}}' $ContainerName 2>$null
    if ($health) {
        Write-Host "Health Status: $health" -ForegroundColor Green
    }
}

function Clean-Database {
    Write-Host "This will remove the container and all data. Are you sure? (y/N): " -ForegroundColor Red -NoNewline
    $confirmation = Read-Host
    
    if ($confirmation -eq "y" -or $confirmation -eq "Y") {
        Write-Host "Cleaning up database container and volumes..." -ForegroundColor Yellow
        docker-compose down -v
        docker rmi $(docker images -q --filter "reference=*tfpm*") 2>$null
        Write-Host "Cleanup completed!" -ForegroundColor Green
    } else {
        Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    }
}

function Connect-Database {
    Write-Host "Connecting to database..." -ForegroundColor Green
    Write-Host "Note: You may need to install SQL Server command line tools if not already installed." -ForegroundColor Yellow
    Write-Host ""
    
    # Try to connect using sqlcmd if available
    try {
        sqlcmd -S "localhost,1433" -U "SA" -P "$Password" -d "TFPM"
    } catch {
        Write-Host "sqlcmd not found. You can connect using any SQL client with these details:" -ForegroundColor Yellow
        Show-ConnectionInfo
    }
}

function Initialize-Database {
    Write-Host "Initializing TFPM database schema..." -ForegroundColor Green
    
    # Check if container is running
    $containerStatus = docker ps --filter "name=$ContainerName" --format "{{.Status}}"
    if (-not $containerStatus) {
        Write-Host "Container is not running. Please start it first with: .\database-docker.ps1 start" -ForegroundColor Red
        return
    }
    
    # Run initialization script
    & ".\init-database.ps1"
}

function Show-ConnectionInfo {
    Write-Host ""
    Write-Host "=== Database Connection Information ===" -ForegroundColor Cyan
    Write-Host "Server: localhost,1433" -ForegroundColor White
    Write-Host "Username: SA" -ForegroundColor White
    Write-Host "Password: $Password" -ForegroundColor White
    Write-Host "Database: TFPM" -ForegroundColor White
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host ""
}

# Main execution
if (-not (Test-DockerRunning)) {
    exit 1
}

switch ($Action) {
    "start" { Start-Database }
    "stop" { Stop-Database }
    "restart" { Restart-Database }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "clean" { Clean-Database }
    "connect" { Connect-Database }
    "init" { Initialize-Database }
    default { Show-Usage }
}
