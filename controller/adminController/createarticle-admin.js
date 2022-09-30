const { ArticleModel } = require("../../model/CreateArticleSchema");

const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

async function PostArticle(req, res, next) {
  try {
    const articleInfo = {};

    const path_of_articleImage = path.join(
      __dirname + "/../" + "/../public/articleimage/"
    );

    if (req.originalUrl.split("/").reverse()[0] != "create-article") {
      const updateInformation = await ArticleModel.updateOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          $set: {
            category: req.body.category,
            title: req.body.title,
            content: req.body.content,
            link: req.body.link ? req.body.link : " ",
          },
        },
        { new: true, useFindAndModify: false },
        function (err, data) {
          if (!err) {
            if (req.file) {
              fs.unlink(
                path.join(path_of_articleImage, req.file.filename),
                (err) => {
                  if (!err) {
                    // nothing to do here
                  }
                }
              );
            }

            res.redirect("/admin/dashboard");
            // res.redirect(`/admin/articles/${req.params.id}/preview-article`);
          }
        }
      ).clone();
    } else {
      if (req.file) {
        articleInfo.articleImage = {
          data: fs.readFileSync(
            path.join(path_of_articleImage, req.file.filename)
          ),
          contentType: path.extname(req.file.filename).replace(".", ""),
          filename: req.file.filename,
        };

        fs.unlink(path.join(path_of_articleImage, req.file.filename), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      articleInfo.date = new Date().toLocaleDateString();
      articleInfo.category = req.body.category;
      articleInfo.title = req.body.title;
      articleInfo.content = req.body.content;
      articleInfo.link = req.body.link ? req.body.link : " ";

      const Article = new ArticleModel().CreateArticle(articleInfo);

      Article.save();

      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

module.exports = {
  PostArticle,
};
