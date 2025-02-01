const { Router } = require("express");
const indexRouter = Router();

// POST ROUTES
indexRouter.get("/", (req,res,done)=>{
    res.send("Hello world!");
})

module.exports = indexRouter;