import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { bodyValidator } from "../middlewares/validator.middleware.js";
import { loginValidator } from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connexion utilisateur
 *     description: Permet à un utilisateur de se connecter en utilisant soit son nom d'utilisateur, soit son adresse email, accompagné de son mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur (requis si l'email n'est pas fourni).
 *               email:
 *                 type: string
 *                 format: email
 *                 description: L'adresse email (requise si le nom d'utilisateur n'est pas fourni).
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Le mot de passe de l'utilisateur.
 *     responses:
 *       200:
 *         description: Succès - retourne un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token d'authentification JWT généré pour l'utilisateur.
 *       400:
 *         description: Erreur de validation - Mauvaise requête si l'email et le nom d'utilisateur sont manquants, ou si le mot de passe est absent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username or email is required"
 */
authRouter.post("/login", bodyValidator(loginValidator), authController.login);

export default authRouter;
