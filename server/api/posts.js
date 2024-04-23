const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = require("express").Router();

//PATH: localhost:3000/api/posts

//endpoints for posts can be accessed by anyone
//GET /api/posts - get all posts
router.get("/", async (req, res, next) => {
  try{
    const posts = await prisma.post.findMany();
    res.send(posts);
  }catch(error){
    next(error);
  }
});
//GET /api/posts/:id - get post by id
router.get("/:id", async( req, res, next) => {
  try{
    const currentPost = await prisma.post.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });
    if(!currentPost){
      return res.status(404).send("Cannot find post.");
    }
    res.send(currentPost);
  }catch(error){
    next(error);
  }
})

//These endpoints can only be accessed if a valid token is provided in the request headers. If a token is not provided, then the response should always be status 401.
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in to do that.");
  }
  next();
});
//POST /api/posts - create a new post as the currently logged-in user
router.post("/", async (req, res, next) => {
  try{
    const createPost = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        userid: req.user.id
      }
    })
    res.status(201).send(createPost);
  }catch(error){
    next(error);
  }
})
//PUT /api/posts/:id - update a post only if it was created by the currently logged-in user
router.put("/:id", async (req, res, next) => {
  try{
    const myPost = await prisma.post.update({
      where: {
        id: parseInt(req.params.id),
        userid: req.user.id
      },
      data: {
        title: req.body.title,
        content: req.body.content
      }
    });
    //if user puts wrong post id
    if(!currentPost){
      return res.status(404).send("Cannot find post.");
    }
  }catch(error){
    console.log(error);
  }
})
//DELETE /api/posts/:id - delete a post only if it was created by the currently logged-in user
router.delete("/:id", async (req, res, next) => {
  try{
    const hateThisPost = await prisma.post.delete({
      where: {
        id: parseInt(req.params.id),
        userid: req.user.id
      }
    })
    //if there's no post with that id
    if(!currentPost){
      return res.status(404).send("Post cannot be found or no longer exists.");
    }
    res.send(hateThisPost);
  }catch(error){
    next(error);
  }
})

module.exports = router;