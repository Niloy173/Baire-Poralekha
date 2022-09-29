const mongoose = require("mongoose");

const { ArticleModel } = require("../../model/CreateArticleSchema");

async function Delete_article(req, res, next) {
  try {
    const delete_id = req.params.id;
    const deleteArticle = await ArticleModel.deleteOne({
      _id: mongoose.Types.ObjectId(delete_id),
    });

    res.status(200).send("article deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("article deletion failed");
  }
}

module.exports = {
  Delete_article,
};
