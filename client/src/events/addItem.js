module.exports = async (queue, payload = {}) => {
  console.log("Adding item", payload);
  await queue.add({ ...payload });
};
