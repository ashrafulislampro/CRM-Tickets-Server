const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

const setJWT = (key, value) => {
  // console.log(typeof key, typeof value);

  return new Promise((resolve, reject) => {
    try {
      client.set(key, value, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getJWT = (key) => {
  console.log(key);
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  setJWT,
  getJWT,
};
