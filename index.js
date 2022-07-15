const express = require('express')
const passport = require('passport')
const dotenv = require('dotenv')
const session = require('express-session')
const axios = require("axios")
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const app = express()
dotenv.config()

app.use(express.static('public'))
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}))
app.use(passport.initialize(undefined))
app.use(passport.session(undefined))

app.use(express.urlencoded({extended: true}))

let db_user, db_list, db_api
const id_db = process.env.ID
const password_db = process.env.PASSWORD
const backurl = '@cluster0.fzore.mongodb.net/?retryWrites=true&w=majority'

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
        const email_value = 'iamraram@gmail.com'
        const pw_value = '12345678'
        const name_value = '이하람'
        const address_value = '서울특별시 은평구 응암동'

        function signup(data) {
            db_user.collection('user').insertOne(data,
                function (err) {
                    if (err) {
                        console.log('error occurred')
                    }
                    else {
                        console.log('success to signup someone user')
                    }
                })
        }

        const user_info = {
            user_email: email_value,
            user_pw: pw_value,
            user_name: name_value,
            user_accident: [],
            user_level_point: [1, 0],
            user_address: address_value,
            user_share_count: 0,
            user_profile_photo: ''
        }
        signup(user_info)
    })

    app.get('/login', function(req, res){
        const email_value = 'iamraram@gmail.com'
        const pw_value = '12345678'

        db_user.collection('user').findOne({ user_email: email_value, user_pw: pw_value },
            function(err, result) {
                if (err) {
                    console.log('incorrect user')
                }
                else {
                    res.json({
                        result
                    })
                }
            })
    })

})
