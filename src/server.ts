import "source-map-support/register";
import errorhandler from "errorhandler";
import { Server } from "socket.io";
import app from "./app";
import { store, sagaMiddleware } from "./core/store";
import saga from './core/sagas';

const PORT = process.env.PORT || "5566";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorhandler());

/**
 * Start Express server.
 */
const server = app.listen(Number.parseInt(PORT, 10), () => {
  const address = server.address();
  // tslint:disable-next-line:no-console
  console.log(
    `  App is running at ${
      typeof address === "string"
        ? address
        : `${address.family} ${address.address}:${address.port}`
    } in %s mode`,
    app.get("env")
  );
  // tslint:disable-next-line:no-console
  console.log("  Press CTRL-C to stop\n");
});

const io = new Server(server);
sagaMiddleware.run(saga, io);

export default server;
