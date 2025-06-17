const mongoose = require("mongoose");
const Schema = mongoose.Schema; // ce linge nous permet de faire un plan du document et son contenu.

const articleSchema = new Schema({
  title: String,
  body: String,
  numberOfLikes: Number,
});
/* 
mongoose.model("<nom de collection qui va s'affiche en BD>", <nom de plan de ce collection>)
*/
const article = mongoose.model("article", articleSchema);

module.exports= article // ce linge permet d'importer la collection par un autre fichier js.  