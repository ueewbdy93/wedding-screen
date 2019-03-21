import cookieParser from 'cookie-parser';
import express, {
  NextFunction,
  Request,
  Response,
} from 'express';
import basicAuth from 'express-basic-auth';
import httpErrors from 'http-errors';
import morgan from 'morgan';
import { join } from 'path';
import path from 'path';
import { config } from './config-helper';

const app = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public'),  {
  maxAge: '2h',
}));

app.get('/download', basicAuth({
  users: { admin: config.admin.password },
  challenge: true,
  realm: 'Imb4T3st4pp',
}), (_req: Request, res: Response) => {
  const dbFile = path.resolve(__dirname, '..', 'db', 'db-wedding-screen.sqlite');
  return res.download(dbFile, 'db-wedding-screen.sqlite');
});

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  return next(httpErrors(404));
});

// error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
