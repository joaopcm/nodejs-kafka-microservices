import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'certificate',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'certificate-group' });
const producer = kafka.producer();

async function run() {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'issue-certificate',
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix} ${message.key}#${message.value}`);

      const payload = JSON.parse(message.value);

      setTimeout(() => {
        producer.send({
          topic: 'certificate-response',
          messages: [
            {
              value: `Certificado do usuário ${payload.user.name} do curso ${payload.course} gerado!`,
            }
          ]
        })
      }, 3000);
    },
  });
}

run().catch(console.error);