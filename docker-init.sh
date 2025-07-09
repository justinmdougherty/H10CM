#!/bin/bash

# Start SQL Server in background
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to start..."
while ! /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "$SA_PASSWORD" -C -Q "SELECT 1" > /dev/null 2>&1; do
    echo "SQL Server is starting up..."
    sleep 5
done

echo "SQL Server is ready!"


# Run the schema initialization script
echo "Running database schema initialization script..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "$SA_PASSWORD" -C -i /opt/mssql-init/init.sql

# Run the sample data script
echo "Loading sample data..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "$SA_PASSWORD" -C -i /opt/mssql-init/init-sample-data.sql

if [ $? -eq 0 ]; then
    echo "Database initialization completed successfully!"
else
    echo "Database initialization failed!"
    exit 1
fi

# Keep the container running
wait
