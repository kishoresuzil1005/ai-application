import { Request, Response } from 'express';

export class UserController {
  async register(req: Request, res: Response) {
    // Register user logic
    res.json({ message: 'User registered successfully' });
  }

  async login(req: Request, res: Response) {
    // Login user logic
    res.json({ message: 'User logged in successfully' });
  }
}