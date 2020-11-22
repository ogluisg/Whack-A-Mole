/**
 * Loads environment variables.
 *
 * Environment variables are set using the NODE_ENV variable. For example, to
 * run in production, one should run:
 *
 *   NODE_ENV=production node index.js
 *
 * If no environment is specified, the "development" environment is assumed
 * by default.
 */

import path from 'path';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const configPath =  path.resolve(`${__dirname}/config/environments/${process.env.NODE_ENV}.env`);

require('dotenv').config({ path: configPath });
