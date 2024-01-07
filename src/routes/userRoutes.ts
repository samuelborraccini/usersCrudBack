import { Request, Response, Router } from "express";
import { userController } from "../controllers/userController";

const router = Router();

router.get("/", userController.getAll);
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.removeUser);

export default router;
