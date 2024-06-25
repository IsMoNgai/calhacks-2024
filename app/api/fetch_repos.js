import { NextApiResponse, NextApiRequest } from 'next';
import corsMiddleware from '../../lib/cors';

const handler = (req, res) => {
  // Run the CORS middleware
  corsMiddleware(req, res, async () => {
    try {
      const { repository } = req.body;

      // Fetch data from GitHub API
      const response = await fetch(repository);
      if (!response.ok) {
        throw new Error('Failed to fetch data from GitHub API');
      }
      const data = await response.json();

      // Prepare FormData
      const formData = new FormData();
      formData.append('repository', JSON.stringify(data));

      // Send the FormData as response
      res.status(200).json(formData);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
};

export default handler;