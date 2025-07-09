# Database initialization script for PowerShell
# Run this after the container is up and running

Write-Host "Initializing TFPM database..." -ForegroundColor Green

# Wait for SQL Server to be ready
Write-Host "Waiting for SQL Server to be ready..." -ForegroundColor Yellow
do {
    $result = docker exec tfpm-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "TFPMPassword123!" -C -Q "SELECT 1" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "SQL Server is starting up..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
} while ($LASTEXITCODE -ne 0)

Write-Host "SQL Server is ready! Running database initialization..." -ForegroundColor Green


# Run the schema initialization script
Get-Content "mssql.sql" | docker exec -i tfpm-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "TFPMPassword123!" -C

# Run the sample data script
Get-Content "init-sample-data.sql" | docker exec -i tfpm-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "TFPMPassword123!" -C

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database initialization completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Connection Details:" -ForegroundColor Cyan
    Write-Host "  Server: localhost,1433" -ForegroundColor White
    Write-Host "  Username: SA" -ForegroundColor White
    Write-Host "  Password: TFPMPassword123!" -ForegroundColor White
    Write-Host "  Database: TFPM" -ForegroundColor White
} else {
    Write-Host "Database initialization failed!" -ForegroundColor Red
    exit 1
}
