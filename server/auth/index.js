const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = require("express").Router(); //chaining
const jwt = require("jsonwebtoken");

//PATH: localhost:3000/auth/

//TODO: HASH Passwords > should this go in db as well?
const bcrypt = require("bcrypt");

//new user registration
router.post('/register', async (req, res, next) => {
  try{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    
    const registeredUser = await prisma.user.create({
      data: {
        username: req.body.username,
        plainTextPassword: req.body.password
      }
    });
    //token will be allocated to user id
    const token = jwt.sign({id: registeredUser.id}, process.env.JWT_SECRET);
    res.status(201).send({token});
  } catch (error) {
    next(error);
  }
}) //tested on postMan

//retrieved a token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzEzOTAwMjQyfQ.kXjvyQeagAU7snlJhB-6bXuY_WCK94xrVsxPRtrrHKU"

//login + receives token
router.post("/login", async (req, res, next) => {
  try{
    const currentUser = await prisma.user.findUnique({
      where: {
        username: req.body.username,
        plainTextPassword: req.body.password
      }
    });
    if (!currentUser){
      return res.status(401).send("Cannot find user.");
    } else {
      const passwordsMatch = await bcrypt.compare(plainTextPassword, user.password);
    }
    if(passwordsMatch){
      const token = jwt.sign({ id: currentUser.id}, process.env.JWT_SECRET);
      res.send({ token });
    } else {
      res.sendStatus(401);
    }
  } catch(error) {
    next(error);
  }
});
//TODO: When user is currently logged in, they should be able to see posts privy to them.



module.exports = router;