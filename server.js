const Queue = require("bull");
require("dotenv").config({ silent: true });

const { SERVER_NAMESPACE = "server", REDIS_URL } = process.env;

// default response
const mockData = {
  data: {
    message: "Hello World"
  }
};

console.log("Starting Server");

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

// server impl
const queue = new Queue(SERVER_NAMESPACE, REDIS_URL, {
  limiter: { max: 12000, duration: 3600000 }, // 12k per hour
  settings: {
    lockDuration: 90000,
    stalledInterval: 75000,
    maxStalledCount: 2
  }
});

queue.process((job, done) => {
  const { replyTo, correlationId } = job.data;

  console.log(`
    JOB ID: ${job.id}
    FROM: ${replyTo}
    REFERENCE: ${correlationId}
    DATA: ${JSON.stringify(job.data)}
  `);

  if (!replyTo || !correlationId) {
    const error = new Error("You must provide a replyTo and correlationId");
    console.error(error.message);
    done(error);
  }

  setTimeout(() => {
    const replyQueue = new Queue(replyTo, REDIS_URL);
    replyQueue.add({ ...mockData, replyTo, correlationId });
    job.progress(100);
    console.log(`Respond ${correlationId} to ${replyTo}`);

    done(null, { ...mockData, replyTo, correlationId });
  }, 1000);
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
setInterval(() => {
  trackQueueSize(queue);
}, 10000);
