import bunyan from 'bunyan';
import { config } from '../config-helper';
export default bunyan.createLogger({
  ...config.log,
});

