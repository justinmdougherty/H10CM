USE TFPM;
GO

DROP PROCEDURE IF EXISTS usp_GetProjects;
GO

CREATE PROCEDURE [dbo].[usp_GetProjects]
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @json NVARCHAR(MAX);
    
    -- Get the JSON result
    SELECT @json = (
        SELECT
            p.project_id,
            p.project_name,
            p.project_description,
            p.status,
            p.date_created,
            p.last_modified
        FROM dbo.Projects p
        ORDER BY p.project_name
        FOR JSON PATH
    );
    
    -- Return consistent result
    SELECT ISNULL(@json, '[]') AS json_result;
END;
GO
