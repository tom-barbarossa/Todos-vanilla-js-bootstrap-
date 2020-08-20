const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile('/views/index.html', { root: __dirname })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Todo app server is listening on port ${PORT}...`);
});
