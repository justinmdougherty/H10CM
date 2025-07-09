// Updated API endpoint for /api/projects
// This shows the fixed logic that should replace the existing code

app.get('/api/projects', async (req, res) => {
  try {
    const pool = app.locals.db;
    if (!pool) {
      throw new Error('Database not connected.');
    }

    const result = await pool.request().execute('usp_GetProjects');

    if (result.recordset && result.recordset.length > 0) {
      // Extract the result column (which contains the JSON)
      const jsonString = result.recordset[0].result;

      if (jsonString && jsonString !== '[]') {
        // Parse the string into a JavaScript array of project objects.
        let projects = JSON.parse(jsonString);

        // Sort the array numerically by project_id to guarantee order.
        projects.sort((a, b) => a.project_id - b.project_id);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(projects, null, 2));
      } else {
        // Empty result or empty array
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send('[]');
      }
    } else {
      // No recordset returned
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send('[]');
    }
  } catch (error) {
    console.error('Error in /api/projects:', error);
    res.status(500).json({ error: 'Failed to get projects.' });
  }
});
