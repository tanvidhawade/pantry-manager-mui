import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { pantryItems } = req.body;
    const ingredients = pantryItems.map(item => item.item).join(', ');

    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        prompt: `Suggest a recipe using the following ingredients: ${ingredients}.`,
        max_tokens: 100,
        temperature: 0.7,
        model: 'text-davinci-003'
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const recipe = response.data.choices[0].text.trim();
      res.status(200).json({ recipe });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}