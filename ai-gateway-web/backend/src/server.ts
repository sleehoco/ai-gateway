import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-gateway-backend' });
});

// Basic Auth Middleware Placeholder
const authMiddleware = (req: any, res: any, next: any) => {
  // TODO: Implement JWT verification
  next();
};

// Routes
app.get('/api/models', authMiddleware, async (req, res) => {
  try {
    // Proxy to LiteLLM
    const response = await fetch(`${process.env.LITELLM_URL}/v1/models`, {
        headers: { 'Authorization': `Bearer ${process.env.LITELLM_MASTER_KEY}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
