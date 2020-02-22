const fs = require("fs")
const express = require("express")
const path = require("path")
const app = express();
const PORT = process.env.PORT || 8000;
let db = require('./db/db.json');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

  
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });

app.get("/api/notes", function(req, res) {
    res.json(db)
 });

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.post("/api/notes", (req, res) => {
    const note = req.body;
    note.id = Math.floor(Math.random() * 9999)
    db.push(note)
    fs.writeFile(path.join(__dirname, "db/db.json"), 
    JSON.stringify(db), 
    err => {
      if(err) {
        res.json(err)
      } else {
        res.json(db)
      }
  })
});



  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });



