import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { imageUrl } = req.body;
    try {
      const response = await axios.post('https://api.openai.com/v1/images/classifications', {
        image: imageUrl,
        // Add other necessary payload details according to the API documentation
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const { classifications } = response.data;
      res.status(200).json({ classifications });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
