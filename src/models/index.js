import { UserModel } from "./user.model.js";
import { ProfileModel } from "./profile.model.js";
import { ArticleModel } from "./article.model.js";
import { TagModel } from "./tag.model.js";
import { ArticleTagModel } from "./articleTag.model.js";

// 1:1 User - Profile
UserModel.hasOne(ProfileModel, {
  foreignKey: "user_id",
  as: "profile",
  onDelete: "CASCADE",
});
ProfileModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });

// 1:N User - Article
UserModel.hasMany(ArticleModel, {
  foreignKey: "user_id",
  as: "articles",
  onDelete: "CASCADE",
});
ArticleModel.belongsTo(UserModel, { foreignKey: "user_id", as: "author" });

// N:M Article - Tag
// Al eliminar un artículo o una etiqueta se eliminan sus filas en ArticleTag
ArticleModel.belongsToMany(TagModel, {
  through: ArticleTagModel,
  foreignKey: "article_id",
  as: "tags",
  onDelete: "CASCADE",
});
TagModel.belongsToMany(ArticleModel, {
  through: ArticleTagModel,
  foreignKey: "tag_id",
  as: "articles",
  onDelete: "CASCADE",
});

export { UserModel, ProfileModel, ArticleModel, TagModel, ArticleTagModel };
