#!/bin/bash
# Database initialization script
# Run this after the container is up and running

echo "Initializing TFPM database..."

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to be ready..."
while ! docker exec tfpm-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "TFPMPassword123!" -C -Q "SELECT 1" > /dev/null 2>&1; do
    echo "SQL Server is starting up..."
    sleep 5
done

echo "SQL Server is ready! Running database initialization..."


# Run the schema initialization script
docker exec -i tfpm-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "TFPMPassword123!" -C < mssql.sql

# Run the sample data script
docker exec -i tfpm-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "TFPMPassword123!" -C < init-sample-data.sql

if [ $? -eq 0 ]; then
    echo "Database initialization completed successfully!"
    echo ""
    echo "Connection Details:"
    echo "  Server: localhost,1433"
    echo "  Username: SA"
    echo "  Password: TFPMPassword123!"
    echo "  Database: TFPM"
else
    echo "Database initialization failed!"
    exit 1
fi
