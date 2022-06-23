import express from 'express';
import jwt from 'jsonwebtoken'
import pgPromise from 'pg-promise';
import 'dotenv';
import bcrypt from 'bcrypt';
import { authToken, generateAccessToken } from './authToken';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const DATABASE_URL =  'postgres://pgadmin:pg123@localhost:5432/hearts_app';
const pgp = pgPromise({});

const db = pgp('postgres://pgadmin:pg123@localhost:5432/hearts_app');

// Testing
app.get("/api/hello", (req, res) => {
    res.json({ hello: "world" });
});

// API endpoint for creating a new user
app.post('/api/v1/create/user', async (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        // Store hash in your password DB.
        await db
            .none(`insert into love_user ( username, password, love_count) values($1,$2,$3) on conflict do nothing`,
                [username, hashedPassword, 0]); // insert a new user into the database
    });

    const token = generateAccessToken(username);

    res.json({
        status: 'success',
        token
    })
});

app.post('/api/v1/counter/increament', async (req, res) => {
    const { token, counter } = req.body;
    const { username } = jwt.verify(token, 'This-is-my-secret-code#1')
    console.log(req.body);

    await db.none(`update love_user set love_count = love_count + $1 where username = $2`, [counter, username])

});

app.get('/api/v1/auth', authToken, async (req, res) => {
    console.log(req.username);
    const verifyUser = await db.one('select * from love_user where username = $1', [req.username])
    if (verifyUser) {
        res.json({
            status: 'success',
            user: verifyUser,
            isloveUser: true
        })
    }
    res.json({
        status: 'failure',
        isloveUser: false
    })

})

app.post('/api/v1/counter/decreament', async (req, res) => {
    const { token, counter } = req.body;
    const { username } = jwt.verify(token, 'This-is-my-secret-code#1')
    console.log(req.body);

    await db.none(`update love_user set love_count = love_count - $1 where username = $2`, [counter, username])
});

app.get('/api/v1/love/user/:user', async (req, res) => {

    const loveUser = db.oneOrNone(`select * from love_user where username = $1`, [username]);
    res.json({
        status: 'success',
        user: loveUser
    })

})

app.post('/api/v1/login/user', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const userHashedPassword = await db.oneOrNone(`select * from love_user where username = $1`, [username]);
    console.log(userHashedPassword);
    bcrypt.compare(password, userHashedPassword.password, (err, results) => {
        if (err) return err;
        if (results) {

            res.json({
                status: 'success',
                isLoggedin: true,
                user: userHashedPassword

            })
        }

    })

})

export const handler = app;