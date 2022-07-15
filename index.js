export const express = require('express')
export const passport = require('passport')
export const dotenv = require('dotenv')
export const session = require('express-session')
export const axios = require("axios")
export const router = express.Router()
export const MongoClient = require('mongodb').MongoClient

export const app = express()
dotenv.config()

app.use(express.static('public'))
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}))
app.use(passport.initialize(undefined))
app.use(passport.session(undefined))

app.use(express.urlencoded({extended: true}))

export let db_user, db_list, db_api
export const id_db = process.env.ID
export const password_db = process.env.PASSWORD
export const backurl = '@cluster0.fzore.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect('mongodb+srv://' + id_db + ':' + password_db + backurl,
    function(err, client) {
    if (err) {
        return console.log(err)
    }

    db_user = client.db('hack');

    app.listen(8080, function (req, res) {
        console.log('8080에 연결함')
    });

    app.get('/signup', function(req, res){
        const email_value = 'iamraram'
        const pw_value = '123456'
        const pw_value2 = '123456'
        const name_value = '이하람'

        function signup(data) {
            db_user.collection('user').insertOne(data,
                function (err,result) {
                    if (err) {
                        console.log('error occurred')
                    }
                    else {
                        console.log('success to signup someone user')
                    }
                })
        }

        if (email_value === '^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$') {
            if (pw_value.length >= 8) {
                if (name_value === '/^[가-힣\\s]+$/') {
                    if (pw_value === pw_value2) {
                        const user_info = {
                            user_email: email_value,
                            user_pw: pw_value,
                            user_name: name_value
                        }
                        signup(user_info)
                    }
                    else {
                        res.end('incorrect password and checking password')
                    }
                }
                else {
                    res.end('incorrect name value')
                }
            }
            else {
                res.end('incorrect password length')
            }
        }
        else {
            res.end('incorrect email address')
        }
    });

})

router.get('/', function(req, res, next){
    res.json([{

    }])
});
