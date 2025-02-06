const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

// GET ROUTES
indexRouter.get("/", indexController.indexGet);
indexRouter.get("/folders/:folderId", indexController.folderGet);
indexRouter.get("/login", indexController.loginGet);
indexRouter.get("/register",indexController.registerGet);
indexRouter.get("/logout", indexController.logout);

// POST ROUTES
indexRouter.post("/login", indexController.loginPost);
indexRouter.post("/folders/:folderId", indexController.folderPost);
indexRouter.post("/register", indexController.registerPost);

module.exports = indexRouter;