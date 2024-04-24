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
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const registeredUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword
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
      where: { username: req.body.username}
    });
    const passwordsMatch = await bcrypt.compare(req.body.password, currentUser?.password); //by using the ? if there is no user it results to null

    if (!currentUser || !passwordsMatch){
      res.status(401).send("Cannot find user.");
    } else {
      const token = jwt.sign({ id: currentUser.id}, process.env.JWT_SECRET);
      res.send({ token });
    } 
  } catch(error) {
    next(error);
  }
});
//TODO: When user is currently logged in, they should be able to see posts privy to them.



module.exports = router;