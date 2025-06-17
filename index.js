const express = require("express");
const mongoose = require("mongoose");

const app = express();

const article = require("./models/article"); // ce ligne nous permet de manipuler notre BD (modifier , sauvegarder , supprimer ...)

mongoose
  .connect(
    "mongodb+srv://Adem_Arfaoui:ademadem@cluster0.kxnrozt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  ) // mongoose.connect(): permet de connecter à notre BD
  .then(() => {
    console.log("connection successfuly");
  })
  .catch((error) => {
    console.log("error with connection with the DB", error);
  });

//   code de mon Bd dans mango : mongodb+srv://Adem_Arfaoui:<db_password>@cluster0.kxnrozt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.get("/", (req, res) => {
  res.send("hello in node js project");
});

app.get("/Numbers", (req, res) => {
  let numbers = "";
  for (let i = 0; i <= 100; i++) {
    numbers += i + " -- ";
  }
  //res.send(`The numbers are ${numbers}`);
  //res.send(__dirname + "/views/numbers.html");
  //res.sendFile(__dirname + "/views/numbers.html");
  res.render("numbers.ejs", {
    name: "Adem",
    numbers: numbers,
  });
  /* 
  ejs cherche toujours un dossier appelée "views" par defaut le ficheir a retourner donc le dossier sur le nom 'views' et trés important.
  "sendFile": permet d'envoyer un fichier du serveur au client
  "__dirname": indique le chemin de principal de dossier du fichier à envoyer.
  */
});

app.get("/findSummation/:number1/:number2", (req, res) => {
  const num1 = req.params.number1;
  const num2 = req.params.number2;
  const total = Number(num1) + Number(num2);
  console.log(req.params);
  res.send(`The total is ${total}`);
});
// ':' avant number 1 et 2 dit au serverur que les params (number1 & number2)peut avoir comme valeur n'importe quel type.
// sans ':' on doit ecrire les strings "number1" et "number2" pour que le serveur accepte la request du client.

app.get("/sayHello", (req, res) => {
  //console.log(req.body);
  //console.log(req.query);
  // .qurey permet de afficher les query params de path (les query params sont les params apres '?' dans le root)
  //res.send(`hello ${req.body.name} , Age is ${req.query.age}`);

  res.json({
    name: req.body.name,
    age: req.query.age,
    language: "arabic",
  });
});
/* il y a 3 types de donner des informations dans une req:
    -- path parameters
    -- body parameters
    -- query parameters
*/
app.put("/test", (req, res) => {
  res.send("You visited test");
});

app.delete("/testDelete", (req, res) => {
  res.send("testing delete");
});

app.post("/addcomment", (req, res) => {
  res.send("post request on add coment");
});

// ======== ARTICLES ENDPOINT ========

app.post("/articles", async (req, res) => {
  const newArticle = new article();

  const artTitle = req.body.articleTitle; // c'est permet d'importer le titre de l'article du client.
  const artBody = req.body.articleBody; // c'est permet d'importer le contenu de l'article du client.

  // res.send(artTitle + " " + artBody)
  //return;
  newArticle.title = artTitle;
  newArticle.body = artBody;
  newArticle.numberOfLikes = 100;
  await newArticle.save(); // newArticle.save : nous permet d'ajouter les filds de newArticle dans notre BD .Cette fonction est asyncronous function (retourne un promise)
  // l'utilisation de async et await c'est pour dire attendez que le sauvgardage se termine et aprés envoyer "articles" .
  //res.send("the new article has been stored");
  res.json(newArticle);
});

/* ======= affichage des articles du BD ======= */

app.get("/articles", async (req, res) => {
  const articles = await article.find();
  res.json(articles);
  // .find() :impotre tous les articles dans le BD
  /* losrque on fait un action avec le BD, il va prend un peut de temps donc on doit conserner se code comme asyncronous code.Alors on ne peut pas le dit définir une variable 
  qui contient article.find() et ensuite retourner se variable directement et ce varible n'a pas encore résu les données.
  Pour cela on ajoute async et await pour résoudre ce probléme.
  */
});

/* retourner un article spésifique */

app.get("/articles/:articleID", async (req, res) => {
  const id = req.params.articleID;
  const Article = await article.findById(id);
  res.json(Article);
});

/* suppression d'un article */
app.delete("/articles/:articleID", async (req, res) => {
  const id = req.params.articleID;
  try {
    const Article = await article.findByIdAndDelete(id);
    res.json(Article);
    return;
  } catch (error) {
    console.log("error wwhile reading article of id ", id);
    return res.send("error");
  }
});
// le methode try / catch facilite l'identification des erreurs.


app.get("/showArticles", async (req , res) =>{
  const articles = await article.find()
  res.render("articles.ejs",{
    allArticles: articles
  })
})
app.listen(3000, () => {
  console.log("I am listening in port 3000");
});