import express from 'express';
import { router } from './controllers';
import bodyParser from 'body-parser';

const app: express.Application = express();
const port: number = (process.env.PORT !== undefined) ? parseInt(process.env.PORT): 3005;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
    next();
});
app.use('/', router);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});