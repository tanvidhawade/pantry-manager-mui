import { PredictionServiceClient } from '@google-cloud/automl';

const client = new PredictionServiceClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { imageUrl } = req.body;
    const projectId = 'your-gcp-project-id';
    const modelId = 'your-model-id';
    
    const payload = {
      image: {
        imageBytes: imageUrl,
      },
    };

    const request = {
      name: client.modelPath(projectId, 'us-central1', modelId),
      payload: payload,
    };

    try {
      const [response] = await client.predict(request);
      const classifications = response.payload.map(annotation => ({
        label: annotation.displayName,
        score: annotation.classification.score,
      }));
      res.status(200).json({ classifications });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
