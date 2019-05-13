const Queue = require("bull");
const uuid = require("uuid").v4;
require("dotenv").config({ silent: true });

const {
  SERVER_NAMESPACE = "server",
  CLIENT_NAMESPACE = "client",
  REDIS_URL
} = process.env;

const originalRef = uuid();

async function trackQueueSize(queue) {
  let queueStatus = await queue.getJobCounts();
  console.log(">>==========================>>");
  console.log(`
  Queues Stats:
  Completed: ${queueStatus.completed}
  Active: ${queueStatus.active}
  Waiting: ${queueStatus.waiting}
  Delayed: ${queueStatus.delayed}
  Paused: ${queueStatus.paused}
  Failed: ${queueStatus.failed}
  `);
  console.log("<<==========================<<");
}

// client impl
const queue = new Queue(CLIENT_NAMESPACE, REDIS_URL, {
  limiter: { max: 12000, duration: 3600000 }, // 12k per hour
  settings: {
    lockDuration: 90000,
    stalledInterval: 75000,
    maxStalledCount: 2
  }
});

const onQueue = {};
let count = 0;

queue.process((job, done) => {
  const keys = Object.keys(onQueue);
  const key = keys.indexOf(job.data.correlationId);
  console.log(`
    JOB ID: ${job.id}
    ORIGINAL REF: ${originalRef}
    REFERENCE: ${job.data.correlationId}
    POSITION: ${key}
    DATA: ${JSON.stringify(job.data)}
  `);

  count++;

  if (key < 0)
    throw new Error(
      `The reference ${job.data.correlationId} doesn't exist on ${keys.join(
        ","
      )}`
    );

  if (job.data.correlationId === originalRef) {
    console.log("We are done!", job.data);
  } else {
    console.log(`Wrong reference ${job.data.correlationId} at ${count} tries.`);
  }

  job.progress(100);
  done();
});

queue.on("error", err => {
  console.warn(
    `Queue ${queue.name} encountered an unexpected error: ${err.message}`
  );
});

queue.on("stalled", job => {
  console.warn(`Queue ${queue.name} job stalled: '${JSON.stringify(job)}'`);
});

queue.on("failed", (job, err) => {
  console.warn(
    `Queue ${queue.name} failed to process job '${JSON.stringify(job)}': ${
      err.message
    }`
  );
});

queue.on("completed", (job, result) => {
  console.log(`
    !!!Complete!!!
    JOB ID ${job.id}
    TIMING: ${new Date() - job.timestamp}
    DATA: ${JSON.parse(result)}
  `);
});

// Add to the Queue
const serverQueue = new Queue(SERVER_NAMESPACE, REDIS_URL);

for (let id = 0; id < 10; id++) {
  const correlationId = id < 1 ? originalRef : uuid();
  const sentTime = Date.now();
  onQueue[correlationId] = { id, sentTime };
  console.log(`Add process with ID ${id} and REF ${correlationId}`);
  serverQueue.add({ id, replyTo: CLIENT_NAMESPACE, correlationId });
}

setInterval(() => {
  // trackQueueSize(queue);
}, 10000);
