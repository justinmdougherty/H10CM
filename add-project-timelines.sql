-- Add Project Timeline Fields and Sample Data for Calendar Integration
-- This script adds start and end date fields to Projects table and populates with realistic timeline data
USE TFPM;
GO -- Step 1: Add timeline fields to Projects table
    PRINT 'Adding timeline fields to Projects table...';
-- Check if columns already exist before adding them
IF NOT EXISTS (
    SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.Projects')
        AND name = 'project_start_date'
) BEGIN
ALTER TABLE dbo.Projects
ADD project_start_date DATE NULL;
PRINT 'Added project_start_date column';
END
ELSE BEGIN PRINT 'project_start_date column already exists';
END IF NOT EXISTS (
    SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.Projects')
        AND name = 'project_end_date'
) BEGIN
ALTER TABLE dbo.Projects
ADD project_end_date DATE NULL;
PRINT 'Added project_end_date column';
END
ELSE BEGIN PRINT 'project_end_date column already exists';
END IF NOT EXISTS (
    SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.Projects')
        AND name = 'estimated_completion_date'
) BEGIN
ALTER TABLE dbo.Projects
ADD estimated_completion_date DATE NULL;
PRINT 'Added estimated_completion_date column';
END
ELSE BEGIN PRINT 'estimated_completion_date column already exists';
END -- Step 2: Update existing projects with realistic timeline dates
PRINT 'Updating existing projects with timeline data...';
-- Get current date for calculations
DECLARE @Today DATE = CAST(GETDATE() AS DATE);
DECLARE @ProjectCount INT;
SELECT @ProjectCount = COUNT(*)
FROM dbo.Projects;
PRINT 'Found ' + CAST(@ProjectCount AS NVARCHAR(10)) + ' projects to update';
-- Update projects with timeline data based on their status
UPDATE dbo.Projects
SET project_start_date = CASE
        -- Active projects: Started 2-4 weeks ago
        WHEN status = 'Active' THEN DATEADD(DAY, -14 - (ABS(CHECKSUM(NEWID())) % 14), @Today) -- Planning projects: Will start in 1-3 weeks
        WHEN status = 'Planning' THEN DATEADD(DAY, 7 + (ABS(CHECKSUM(NEWID())) % 14), @Today) -- Completed projects: Started 6-12 weeks ago
        WHEN status = 'Completed' THEN DATEADD(DAY, -42 - (ABS(CHECKSUM(NEWID())) % 42), @Today) -- On Hold projects: Started 3-6 weeks ago
        WHEN status = 'On Hold' THEN DATEADD(DAY, -21 - (ABS(CHECKSUM(NEWID())) % 21), @Today) -- Inactive projects: Placeholder future start
        WHEN status = 'Inactive' THEN DATEADD(DAY, 30 + (ABS(CHECKSUM(NEWID())) % 60), @Today) -- Archived projects: Started 12-24 weeks ago
        WHEN status = 'Archived' THEN DATEADD(DAY, -84 - (ABS(CHECKSUM(NEWID())) % 84), @Today) -- Default: Start 1 week ago
        ELSE DATEADD(DAY, -7, @Today)
    END,
    project_end_date = CASE
        -- Completed projects: Ended 1-4 weeks ago
        WHEN status = 'Completed' THEN DATEADD(DAY, -7 - (ABS(CHECKSUM(NEWID())) % 21), @Today) -- Archived projects: Ended 2-8 weeks ago  
        WHEN status = 'Archived' THEN DATEADD(DAY, -14 - (ABS(CHECKSUM(NEWID())) % 42), @Today) -- All other projects: NULL (ongoing or not yet ended)
        ELSE NULL
    END,
    estimated_completion_date = CASE
        -- Active projects: Estimated to complete in 2-8 weeks
        WHEN status = 'Active' THEN DATEADD(DAY, 14 + (ABS(CHECKSUM(NEWID())) % 42), @Today) -- Planning projects: Estimated to complete 4-12 weeks from start
        WHEN status = 'Planning' THEN DATEADD(DAY, 35 + (ABS(CHECKSUM(NEWID())) % 49), @Today) -- On Hold projects: Estimated 3-10 weeks from now (when resumed)
        WHEN status = 'On Hold' THEN DATEADD(DAY, 21 + (ABS(CHECKSUM(NEWID())) % 49), @Today) -- Inactive projects: Estimated completion 8-20 weeks from start
        WHEN status = 'Inactive' THEN DATEADD(DAY, 86 + (ABS(CHECKSUM(NEWID())) % 54), @Today) -- Completed/Archived: Use actual end date
        WHEN status IN ('Completed', 'Archived') THEN project_end_date -- Default: 6 weeks from now
        ELSE DATEADD(DAY, 42, @Today)
    END
WHERE project_start_date IS NULL
    OR project_end_date IS NULL
    OR estimated_completion_date IS NULL;
-- Step 3: Display updated project timeline data
PRINT 'Project timeline data updated successfully!';
PRINT '';
PRINT 'Current project timelines:';
PRINT '==========================';
SELECT project_name,
    status,
    project_start_date,
    project_end_date,
    estimated_completion_date,
    CASE
        WHEN project_end_date IS NOT NULL THEN DATEDIFF(DAY, project_start_date, project_end_date)
        WHEN estimated_completion_date IS NOT NULL THEN DATEDIFF(
            DAY,
            project_start_date,
            estimated_completion_date
        )
        ELSE NULL
    END AS duration_days
FROM dbo.Projects
ORDER BY CASE
        status
        WHEN 'Active' THEN 1
        WHEN 'Planning' THEN 2
        WHEN 'On Hold' THEN 3
        WHEN 'Completed' THEN 4
        WHEN 'Inactive' THEN 5
        WHEN 'Archived' THEN 6
        ELSE 7
    END,
    project_name;
-- Step 4: Verify the data makes sense
PRINT '';
PRINT 'Timeline validation:';
PRINT '===================';
-- Check for any invalid date combinations
SELECT COUNT(*) as invalid_timeline_count
FROM dbo.Projects
WHERE project_end_date IS NOT NULL
    AND project_start_date > project_end_date;
-- Show summary statistics
SELECT status,
    COUNT(*) as project_count,
    AVG(
        CASE
            WHEN project_end_date IS NOT NULL THEN DATEDIFF(DAY, project_start_date, project_end_date)
            WHEN estimated_completion_date IS NOT NULL THEN DATEDIFF(
                DAY,
                project_start_date,
                estimated_completion_date
            )
            ELSE NULL
        END
    ) as avg_duration_days
FROM dbo.Projects
GROUP BY status
ORDER BY CASE
        status
        WHEN 'Active' THEN 1
        WHEN 'Planning' THEN 2
        WHEN 'On Hold' THEN 3
        WHEN 'Completed' THEN 4
        WHEN 'Inactive' THEN 5
        WHEN 'Archived' THEN 6
        ELSE 7
    END;
PRINT '';
PRINT 'Timeline fields added and populated successfully!';
PRINT 'You can now integrate these dates with the calendar app.';