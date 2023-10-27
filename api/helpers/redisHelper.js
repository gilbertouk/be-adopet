import { createClient } from 'redis';

const client = createClient();

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

// import { createClient } from 'redis';

// const client = await createClient()
//   .on('error', (err) => console.log('Redis Client Error', err))
//   .connect('connect', () => {
//     console.log('Client connected to redis...');
//   });

export default client;
