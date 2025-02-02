const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON

app.get("/",(req, res) => {
    res.send("Hello");
})

let users = [
    {id: 1, name:"Alice"},
    {id:2, name:"Bob"}
]

//Get all users
app.get("/users", (req, res) => {
    res.json(users);
})

//get user by id
app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id == req.id)
    if(!user){
        return res.status(404).send("User Not Fount");
    }
    user.name = req.body.name;
    res.json(user.name);

})

app.listen(5000, () => {
    console.log("running");
});