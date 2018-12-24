import errorhandler from 'errorhandler';
import socketIo from 'socket.io';
import app from './app';
import { configureStore } from './core/store';

const PORT = process.env.PORT || '5566';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorhandler());

/**
 * Start Express server.
 */
const server = app.listen(Number.parseInt(PORT, 10), () => {
  const { port } = server.address();
  // tslint:disable-next-line:no-console
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    port,
    app.get('env'),
  );
  // tslint:disable-next-line:no-console
  console.log('  Press CTRL-C to stop\n');
});

const io = socketIo(server);
configureStore({ io });

export default server;
