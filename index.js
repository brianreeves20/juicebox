// create a server that sends a get request from "/" and sends "hi from node"
require("dotenv")=config();
const express = require("express");
const { client } = require("./db");
const userRouter = require("./userRouter");
const jwt = require("jsonwebtoken")
const server = express();
server.use(express.json());

//create middleware to check if theres a token and if there is the create new property on req.user and add user info

server.use((req,res,next)=>{
    if(!req.headers.authorization){
        return next()
    }
    const token = req.headers.authorization.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("user logged in as:", decodedToken);
    req.user = decodedToken
    next();
    
})
server.use("/users", userRouter);

server.get("/", (req, res) => {
  res.send("Hi From Node!");
});

server.use((error, req, res, next) => {
  res.send(error);
});
// POST route for /users/register and send message "will register user":

// server.post("/users/register", (req, res) => {
//   res.send("will register user");
// });
// server.post("/users/login", (req, res) => {
//   res.send("Will login user");
// });

client.connect();
server.listen(2000, () => {
  console.log("server is running!");
});
