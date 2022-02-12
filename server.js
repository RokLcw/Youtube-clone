// express
const { response } = require('express');
const express = require('express');
const app = express();
// parser (전송값)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
// ejs
app.set('view engine', 'ejs');
//MongoDB
const MongoClient = require('mongodb').MongoClient;

app.use('/public', express.static('public'));   // 미들웨어?
app.use('/img', express.static('img'));   // 미들웨어?

var db;
MongoClient.connect ('',function(error, client) {
    if(error) {return console.log(error)};
    db = client.db('Basic');

    app.listen(8080, function() {   // 포트번호, 띄운 후 실행할 코드
        console.log('listen on 8080');
    });
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/comment', (req, res) => {
    console.log(req.body.comment);

    db.collection('counter').findOne({name : '댓글갯수'}, (error, result) => {
        console.log(result.totalComment);
        var commentCount = result.totalComment;

        db.collection('Youtube_clone_comment').insertOne({_id : commentCount+1, comment : req.body.comment}, (error, result) => {
            db.collection('counter').updateOne({name:'댓글갯수'},{$inc: {totalComment:1}}, (error, result) => {
                if(error){
                    return console.log(error)
                };
                res.send('전송완료');
            });
        });
    });
});

app.get('/CommentList', (req, res) => {
    db.collection('Youtube_clone_comment').find().toArray((error, result) => {
        console.log(result);
        res.render('index.ejs', {commentlist : result});
    });
});