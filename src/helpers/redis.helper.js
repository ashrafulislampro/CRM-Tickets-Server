const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

const setJWT = async (key, value) => {
  const result = await client.set(key, value);
  return result;
  // return new Promise((resolve, reject) => {
  //   try {
  //     client.set(key, value, (err, res) => {
  //       if (err) reject(err);
  //       resolve(res);
  //     });
  //   } catch (error) {
  //     reject(error);
  //   }
  // });
};
const getJWT = async (key) => {
  const value = await client.get(key);
  return value;
};

const deleteJWT = (key) => {
  try {
    client.del(key);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  setJWT,
  getJWT,
  deleteJWT,
};
