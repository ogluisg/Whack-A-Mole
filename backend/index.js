// Load environment variables first.
require("./config/environments/config.js");

import express from 'express';
import cors from 'cors';
import { json } from 'body-parser'
import { connectToDB } from './database/db.js';
import router from './router.js';

const app = express().use(cors()).use(json()).use('/api', router);

const port = process.env.PORT || 3000;

const host = '0.0.0.0'

connectToDB().then(() => {
  app.listen(port, host, () => console.log(`[info]: Server listening to port ${port}`))
})

