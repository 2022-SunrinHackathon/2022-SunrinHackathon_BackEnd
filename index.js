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

var db_user, db_list, db_api
var id_db = process.env.ID
var password_db = process.env.PASSWORD
var backurl = '@cluster0.fzore.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect('mongodb+srv://' + id_db + ':' + password_db + backurl,
    function(err, client) {
    if (err) {
        return console.log(err)
    }

    db_user = client.db('hack');

    app.listen(8080, function (req, res) {
        console.log('8080에 연결함')
        db_user.collection('user').insertOne({
            id: 'haram',
            pw: '12345678',
            name: '억울한라람',
            live_region: {
                house: '응암동',
                school: '청파동',
                most_visit: [
                    '역촌동',
                    '중산동',
                    '마두동'
                ]
            }
        },
        function (err, result) {
            if (err) {
                console.log('err')
            }
            else {
                console.log('success')
            }
        })
    });

    app.get('/signup', function(req, res){
        db_user.collection('user').findOne({ name: '억울한라람' },
            function(err, result) {
                console.log(result)
                res.json({
                    result
                })
            }
        );
    });

})

router.get('/', function(req, res, next){
    res.json([{

    }])
});
