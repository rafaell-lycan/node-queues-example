const Queue = require('bull')
require('dotenv').config({ silent: true });

const {
  SERVER_NAMESPACE = 'server',
  REDIS_URL
} = process.env;

// default response
const mockData = {
  data: {
    message: "Hello World",
  }
}

console.log('Starting Server');

// server impl
const queue = new Queue(SERVER_NAMESPACE, REDIS_URL);

queue.process((job, done) => {
  const { replyTo, correlationId } = job.data;
  console.log(job.id, job.data);
  if (!replyTo || !correlationId) {
    console.error('You must provide a replyTo and correlationId');
    done(new Error('You must provide a replyTo and correlationId'));
  }

  setTimeout(() => {
    const responseQueue = new Queue(replyTo, REDIS_URL);
    responseQueue.add({ mockData, replyTo, correlationId });
    console.log(`Respond ${correlationId} to ${replyTo}`);
    job.progress(100);
    done(null, { mockData, replyTo, correlationId });
  }, 5000);
});

queue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result ${result}`);
});
