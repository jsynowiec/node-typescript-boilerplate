/* imports */
import express, { Request, Response } from 'express';
import httpErrors from 'http-errors';
import path from 'path';
import cookieparser from 'cookie-parser';
import morgan from 'morgan';

/* app declaration */
const app = express();
const logger = morgan;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req: Request, res: Response, next) {
  res.locals.message = 'Request:' + req.body + 'Response: error 404';
  next(httpErrors(404));
});

// error handler
app.use(function (
  err: { message: string; status: string },
  req: { app: { get: (arg0: string) => string } },
  res: {
    locals: { message: string; error: { message?: string; status?: string } };
    status: (arg0: any) => void;
    render: (arg0: string) => void;
  },
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
export default app;
