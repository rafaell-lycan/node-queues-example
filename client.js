const Queue = require('bull')
const uuid = require('uuid').v4
require('dotenv').config({ silent: true });

const {
  SERVER_NAMESPACE = 'server',
  CLIENT_NAMESPACE = 'client',
  REDIS_URL
} = process.env;

const correlationId = uuid();
const id = process.argv[2];

// client impl
const queue = new Queue(CLIENT_NAMESPACE, REDIS_URL);

queue.process((job, done) => {
  console.log('Processing on client', job.id, job.data);
  console.log('d', correlationId)
  console.log('r', job.data.correlationId)
  console.log(`Equal?: ${job.data.correlationId === correlationId}`)

  if (job.data.correlationId === correlationId) {
    console.log('We are done!', job.data);
    job.progress(100);
    done();
  }
});

queue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result ${result}`);
});

// Add to the Queue
const serverQueue = new Queue(SERVER_NAMESPACE, REDIS_URL);
serverQueue.add({ id, replyTo: CLIENT_NAMESPACE, correlationId });

console.log('Add process');
