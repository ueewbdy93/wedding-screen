import bunyan from 'bunyan';

export default bunyan.createLogger({
  name: 'logger',
  level: bunyan.DEBUG,
  src: true,
});

