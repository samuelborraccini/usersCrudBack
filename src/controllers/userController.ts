import { Request, Response } from "express";
import { User, userRequest } from "../types/user";
import prisma from "../db/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
class UserController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const user: User[] = await prisma.users.findMany();
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "internal server error" });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const bodyUser: userRequest = req.body;
      if (!bodyUser.username || !bodyUser.password) {
        res.status(400).json({ message: "bad body" });
        return;
      }
      const hashedPassword = await bcrypt.hash(bodyUser.password, 10);
      const user: User = await prisma.users.create({
        data: { username: bodyUser.username, password: hashedPassword },
      });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ message: "internal server error" });
    }
  }
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      if (!id) {
        res.status(400).json({ message: "bad body" });
        return;
      }
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      const user: User = await prisma.users.update({
        where: { id: parseInt(id) },
        data: data,
      });
      if (!user) {
        res.status(401).json({ message: "user not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "internal server error" });
    }
  }
  async removeUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "bad body" });
        return;
      }
      const user: User = await prisma.users.delete({
        where: { id: parseInt(id) },
      });
      if (!user) {
        res.status(401).json({ message: "user not found" });
        return;
      }
      res.status(204).json(user);
    } catch (error) {
      res.status(400).json({ message: "internal server error" });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const user = await prisma.users.findUnique({
        where: { username: userData.username },
      });
      if (!user) {
        res.status(401).json({ message: "user not found" });
        return;
      }

      const passwordMatch = await bcrypt.compare(
        userData.password,
        user.password
      );
      if (!passwordMatch) {
        res.status(401).json({ message: "incorrect password" });
        return;
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ message: "internal server error" });
    }
  }
}

export const userController = new UserController();
