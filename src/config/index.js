import config from './config';

export const ENV = process.env.NODE_ENV;
const ENVIRONMENT = ENV || 'development';
const envConfig = config[ENVIRONMENT];

export default envConfig;
