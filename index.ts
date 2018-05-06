import express from 'express';
import { router } from './controllers';
import bodyParser from 'body-parser';

const app: express.Application = express();
const port: number = (process.env.PORT !== undefined) ? parseInt(process.env.PORT): 3000;

app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});