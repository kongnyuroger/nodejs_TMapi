import createError from 'http-errors'; 
import cookieParser from 'cookie-parser'
import logger from 'morgan';
import express from 'express';
import initDB from './database/dbinit';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { swaggerDocs } from './utils/swagger.js';
const app = express();

initDB()

// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

swaggerDocs(app)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});
export default app;
