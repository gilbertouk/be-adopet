import { createClient } from 'redis';
import dotenv from 'dotenv';

const client = createClient({
  url: process.env.REDIS_URL,
});

await client.connect(() => {
  console.log('Client connected to redis...');
});

client.on('ready', () => {
  console.log('Client connected to redis and ready to use...');
});

client.on('error', (err) => {
  console.log(err.message);
});

client.on('reconnecting', () => {
  console.log('Client is trying to reconnect to the server');
});

client.on('end', () => {
  console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
  client.quit();
});

export default client;
