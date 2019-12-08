import express from 'express';
import { CompressionTypes } from 'kafkajs';

const routes = express.Router();

routes.post('/certifications', async (req, res) => {
  const message = {
    user: {
      id: 1,
      name: 'João Melo'
    },
    course: 'Kafka com NodeJS',
    grade: 5,
  };

  await req.producer.send({
    topic: 'issue-certificate',
    compression: CompressionTypes.GZIP,
    messages: [
      {
        value: JSON.stringify(message),
      },
    ]
  })

  return res.json({ ok: true });
});

export default routes;