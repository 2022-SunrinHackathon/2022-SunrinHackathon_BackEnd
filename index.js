const express = require('express')
const passport = require('passport')
const dotenv = require('dotenv')
const session = require('express-session')
const axios = require("axios")
const parser = require('xml2json');
const fs = require('fs');
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

    app.get('/upload', function(req, res) {
        function upload(data) {
            db_user.collection('post').insertOne(data,
                function (err) {
                    if (err) {
                        console.log('error occurred')
                    }
                    else {
                        console.log('success to uploading post')
                    }
                })
        }
        const post_info = {
            post_type: 3,
            post_place: '선린인터넷고등학교',
            post_hori: 0.00001,
            post_verti: 0.00001,
            post_desc: '선린인고에서 화재가 발생했어요... 당분간 학교는 폐쇄할 것 같습니다.',
            post_photo: '~~~.jpg',
            post_video: 0,
            post_link: 'youtube/abc',
            post_share_count: 0,
            post_like_count: 0,
            post_user: '이하람',
            post_id: 1
        }
        upload(post_info)
    })

    app.get('/comment', function(req, res) {
        function upload_comment(data) {
            db_user.collection('comment').insertOne(data,
                function (err) {
                    if (err) {
                        console.log('error occurred')
                    }
                    else {
                        console.log('success to uploading comment')
                    }
                })
        }
        const comment_info = {
            comment_user: '이하람',
            comment_desc: '불난 것 같던데 ㅜㅜ',
            comment_id: 1
        }
        upload_comment(comment_info)
    })

    app.get('/api', function(req, res) {
        const private_key = process.env.KEY
        // const xml = fs.readFileSync( 'a.xml', 'utf-8');
        //
        // const json = JSON.parse(parser.toJson(xml));
        // for (let i = 0; i < json.length; i ++) {
        //
        // }
        // res.json(json);

        axios({
            method: 'get',
            url: 'http://openapi.seoul.go.kr:8088/' + private_key + '/xml/AccInfo/1/5/',
            responseType: 'xml'
        })
        .then(function (response, err) {
            if (err) {
                console.log('error occurred')
            }
            else {
                const json = JSON.parse(parser.toJson(response.data));
                res.json(json);
            }
        });
    })

})
