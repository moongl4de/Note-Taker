const fs = require("fs")
const express = require("express")
const path = require("path")
const app = express();
const PORT = process.env.PORT || 8000;
let db = require('./db/db.json');

//Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
//Express routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });

app.get("/api/notes", function(req, res) {
    res.json(db)
 });

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//POST - grabs the note and assigns it an ID so that we can reference it later for deletion, then push into db.JSON and finally write the file with the new note added
app.post("/api/notes", (req, res) => {
    const note = req.body;
    note.id = Math.floor(Math.random() * 9999)
    db.push(note)
    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(db), (err) => {
      if(err){
        throw err
      };
      res.json(db), console.log(`Note Added! Content: ${JSON.stringify(note.text)}, ID: ${note.id}`)
    }
  )
});
//DELETE - grabs the ID and then checks it against all IDs in db.JSON. If it finds a match, that entry is removed from the file and finally, it writes the file again with the desired data removed
app.delete("/api/notes/:id", (req, res) => {
  console.log(req.params.id)
  console.log(db.length)
  let grabId = req.params.id
  for(let i = 0; i < db.length; i++){
    if(grabId == db[i].id){
      db.splice(i, 1);
      break
    }
  }
  fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(db), (err) => {
    if(err){
      throw err
    };
    res.json(db), console.log(`Note Deleted! Note ID: ${grabId}`)
  }
)})
//Start the server on whatever port is assigned, either in the code or by Heroku
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});


