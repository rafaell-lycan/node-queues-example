module.exports = () => {
  try {
    const { parsed, error } = require("dotenv").config();
    if (error) {
      throw error;
    }

    return parsed;
  } catch (error) {
    console.error(error.message);
    throw new Error("ENV: Environment file .env not found or not readable.");
  }
};
