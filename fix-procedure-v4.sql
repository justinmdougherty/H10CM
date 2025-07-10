USE TFPM;
GO -- Update the usp_GetProjects stored procedure to include timeline fields
    DROP PROCEDURE IF EXISTS usp_GetProjects;
GO CREATE PROCEDURE [dbo].[usp_GetProjects] AS BEGIN
SET NOCOUNT ON;
DECLARE @json NVARCHAR(MAX);
-- Get the JSON result with all fields including timeline fields
SELECT @json = (
        SELECT p.project_id,
            p.project_name,
            p.project_description,
            p.status,
            p.date_created,
            p.last_modified,
            p.project_start_date,
            p.project_end_date,
            p.estimated_completion_date
        FROM dbo.Projects p
        ORDER BY p.project_name FOR JSON PATH
    );
-- Return consistent result
SELECT ISNULL(@json, '[]') AS json_result;
END;
GO PRINT 'Updated usp_GetProjects procedure to include timeline fields';