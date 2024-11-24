import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(process.cwd(), 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
