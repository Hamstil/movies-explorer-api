require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { routes } = require('./routes');
const setErrors = require('./middlewares/setErrors');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const { limiter, DB_ADRESS_DEV } = require('./utils/constants');

const app = express();

const { PORT = 3001, DB_ADRESS, NODE_ENV } = process.env;

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(requestLogger);
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(setErrors);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? DB_ADRESS : DB_ADRESS_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await app.listen(PORT);
}

main();
