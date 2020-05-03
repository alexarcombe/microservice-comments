const express = require('express');
const bodyParser = require('body-parser');
const {
  addController,
  editController,
  getController,
  deleteController,
} = require('./controllers');
const makeCallback = require('./express-callback');

const app = express();

app.use(bodyParser.json());

app.post('/api/comments', makeCallback({ controller: addController }));
app.post(
  '/api/comments/edit/:id',
  makeCallback({ controller: editController })
);
app.post('/api/comments/edit', makeCallback({ controller: editController }));
app.delete('/api/comments/:id', makeCallback({ controller: deleteController }));
app.delete('/api/comments/', makeCallback({ controller: deleteController }));
app.get('/api/comments/', makeCallback({ controller: getController }));
app.use((req, res) => {
  res.set({ 'Content-Type': 'application/json' });
  res.status(404).send({ error: 'Not found.' });
});

const PORT = process.env.PORT || '3000';
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
