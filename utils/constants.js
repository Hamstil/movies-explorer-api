const rateLimit = require('express-rate-limit');

const regexUrl = /(http)?s?:\/\/(www\.)?[-a-zA-Z0-9:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+\-[\].$'*,;!~#?&//=]*)/;
const regexId = /^[0-9a-zA-Z]{24}$/;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const DB_ADRESS_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  regexUrl,
  regexId,
  limiter,
  DB_ADRESS_DEV,
};
