const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON

app.get("/",(req, res) => {
    res.send("Hello");
})

let user = [
    {id: 1, name:"Alice"},
    {id:2, name:"Bob"}
]

//Get all users
app.get("/users", (req, res) => {
    res.json(user);
})

//get user by id
app.get("/users/:id", (req, res) => {
    
})

app.listen(3000, () => {
    console.log("running");
});