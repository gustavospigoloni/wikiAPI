const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");
mongoose.set('strictQuery', false);

const articleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
});
  
const Article = mongoose.model("Article", articleSchema);

//all articles
app.route("/articles")
.get((req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post((req, res) => {
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            res.send("Successfully added new article.")
        } else {
            res.send(err);
        }
    });
})

.delete((req, res) => {
    Article.deleteMany({}, (err) => {
        if (!err) {
            res.send("Successfully deleted all articles.")
        } else {
            res.send(err);
        }
    });
});

//specific article by article title
app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if (!err){
            res.send(foundArticle);
        } else {
            res.send(err);
           }
    });
})

.put((req, res) => {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        (err) => {
            if (!err) {
                res.send("Succesfully updated article.")
            } else {
                res.send(err);
            }
        }
    );
})

.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if (!err) {
                res.send("Succesfully updated article.")
            } else {
                res.send(err);
            }
        }
    );
})

.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, (err) => {
        if (!err) {
            res.send("Succesfully deleted article.")
        } else {
            res.send(err);
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});