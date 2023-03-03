import express from 'express';
import path from 'path';

const typedocRouter = express.Router();

typedocRouter.use(express.static(path.join(__dirname, '../../../../docs')));

typedocRouter.get('/typedoc', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../docs/index.html'));
});

export default typedocRouter;
