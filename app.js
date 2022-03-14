const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');
const db = require('./config/database');

const app = express();
dotenv.config();
const port = 5000 || process.env.PORT;

app.use(express.json());

db.authenticate()
    .then(async () => {
        console.log('Database connected');
        await db.sync()
            .then(() => console.log('All table sync'));
    })
    .catch((err) => console.log(err));

app.use('/', userRouter);

app.listen(port, () => {
    console.log('Server running on port', port);
});
