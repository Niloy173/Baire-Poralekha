const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema(
  {
    date: {
      type: String,
    },
    articleImage: {
      data: Buffer,
      contentType: String,
      filename: String,
    },

    category: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ArticleSchema.methods = {
  CreateArticle: function (obj) {
    const newArticle = new mongoose.model("Article");
    return newArticle(obj);
  },
};

const ArticleModel = new mongoose.model("Article", ArticleSchema);

module.exports = {
  ArticleModel,
};
