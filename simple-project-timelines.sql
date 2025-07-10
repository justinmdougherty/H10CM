-- Simplified Project Timeline Setup Script
USE TFPM;
GO -- Step 1: Add timeline fields to Projects table
    PRINT 'Adding timeline fields to Projects table...';
-- Add project_start_date column
IF NOT EXISTS (
    SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.Projects')
        AND name = 'project_start_date'
) BEGIN
ALTER TABLE dbo.Projects
ADD project_start_date DATE NULL;
PRINT 'Added project_start_date column';
END -- Add project_end_date column  
IF NOT EXISTS (
    SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.Projects')
        AND name = 'project_end_date'
) BEGIN
ALTER TABLE dbo.Projects
ADD project_end_date DATE NULL;
PRINT 'Added project_end_date column';
END -- Add estimated_completion_date column
IF NOT EXISTS (
    SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.Projects')
        AND name = 'estimated_completion_date'
) BEGIN
ALTER TABLE dbo.Projects
ADD estimated_completion_date DATE NULL;
PRINT 'Added estimated_completion_date column';
END PRINT 'Timeline columns added successfully!';
GO -- Step 2: Update existing projects with realistic timeline data
DECLARE @Today DATE = CAST(GETDATE() AS DATE);
PRINT 'Updating existing projects with timeline data...';
-- Update Active projects
UPDATE dbo.Projects
SET project_start_date = DATEADD(DAY, -20, @Today),
    -- Started 20 days ago
    estimated_completion_date = DATEADD(DAY, 30, @Today) -- Estimated completion in 30 days
WHERE status = 'Active';
-- Update Planning projects  
UPDATE dbo.Projects
SET project_start_date = DATEADD(DAY, 10, @Today),
    -- Will start in 10 days
    estimated_completion_date = DATEADD(DAY, 60, @Today) -- Estimated completion in 60 days
WHERE status = 'Planning';
-- Update Completed projects
UPDATE dbo.Projects
SET project_start_date = DATEADD(DAY, -60, @Today),
    -- Started 60 days ago
    project_end_date = DATEADD(DAY, -10, @Today),
    -- Ended 10 days ago
    estimated_completion_date = DATEADD(DAY, -10, @Today) -- Completed on time
WHERE status = 'Completed';
-- Update On Hold projects
UPDATE dbo.Projects
SET project_start_date = DATEADD(DAY, -30, @Today),
    -- Started 30 days ago
    estimated_completion_date = DATEADD(DAY, 45, @Today) -- Extended timeline
WHERE status = 'On Hold';
-- Update Inactive projects
UPDATE dbo.Projects
SET project_start_date = DATEADD(DAY, 60, @Today),
    -- Future start date
    estimated_completion_date = DATEADD(DAY, 120, @Today) -- Future completion
WHERE status = 'Inactive';
-- Update Archived projects
UPDATE dbo.Projects
SET project_start_date = DATEADD(DAY, -120, @Today),
    -- Started 120 days ago
    project_end_date = DATEADD(DAY, -30, @Today),
    -- Ended 30 days ago
    estimated_completion_date = DATEADD(DAY, -30, @Today) -- Completed
WHERE status = 'Archived';
PRINT 'Project timelines updated successfully!';
GO -- Step 3: Display the results
    PRINT 'Current project timelines:';
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
ORDER BY project_name;
PRINT 'Timeline setup complete! Projects now have calendar-ready dates.';