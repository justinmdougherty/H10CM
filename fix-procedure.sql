USE TFPM;
GO

DROP PROCEDURE IF EXISTS usp_GetProjects;
GO

CREATE PROCEDURE [dbo].[usp_GetProjects]
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Use ISNULL to ensure we always return a valid JSON array, even if empty
    SELECT ISNULL(
        (SELECT 
            p.project_id,
            p.project_name,
            p.project_description,
            p.status,
            p.date_created,
            p.last_modified
        FROM dbo.Projects p
        ORDER BY p.project_name
        FOR JSON PATH), 
        '[]'
    ) AS result;
END;
GO
