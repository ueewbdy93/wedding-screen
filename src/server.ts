import errorhandler from 'errorhandler';

import app from './app';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorhandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get('port') || '30087', () => {
  const { port } = server.address();
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    port,
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});

export default server;
