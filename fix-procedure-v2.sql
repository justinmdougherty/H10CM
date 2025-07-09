USE TFPM;
GO

DROP PROCEDURE IF EXISTS usp_GetProjects;
GO

CREATE PROCEDURE [dbo].[usp_GetProjects]
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if there are any projects
    IF EXISTS (SELECT 1 FROM dbo.Projects)
    BEGIN
        -- Return projects as JSON
        SELECT
            p.project_id,
            p.project_name,
            p.project_description,
            p.status,
            p.date_created,
            p.last_modified
        FROM dbo.Projects p
        ORDER BY p.project_name
        FOR JSON PATH;
    END
    ELSE
    BEGIN
        -- Return empty JSON array
        SELECT '[]' AS json_result;
    END
END;
GO
