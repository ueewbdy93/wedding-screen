import bunyan from 'bunyan';
import { config } from '../config';
export default bunyan.createLogger({
  ...config.log,
});

