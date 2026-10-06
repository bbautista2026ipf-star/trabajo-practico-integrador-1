import { UserModel } from "./user.model.js";
import { ProfileModel } from "./profile.model.js";
import { ArticleModel } from "./article.model.js";
import { TagModel } from "./tag.model.js";
import { ArticleTagModel } from "./articleTag.model.js";

// User es paranoid: la cascada hacia Profile y Article solo actúa si el
// usuario se borra físicamente (force: true)

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
// Al borrar una etiqueta, o un artículo físicamente, la cascada elimina sus
// filas en ArticleTag. La eliminación lógica de un artículo no borra la fila,
// por eso su controlador elimina esas asociaciones
ArticleModel.belongsToMany(TagModel, {
  through: ArticleTagModel,
  foreignKey: "article_id",
  otherKey: "tag_id",
  as: "tags",
  onDelete: "CASCADE",
});
TagModel.belongsToMany(ArticleModel, {
  through: ArticleTagModel,
  foreignKey: "tag_id",
  otherKey: "article_id",
  as: "articles",
  onDelete: "CASCADE",
});

export { UserModel, ProfileModel, ArticleModel, TagModel, ArticleTagModel };
