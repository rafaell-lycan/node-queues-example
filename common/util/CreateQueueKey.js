module.exports = function(queue, event) {
  return ["app", "bull", queue.name, event].join(".");
};
