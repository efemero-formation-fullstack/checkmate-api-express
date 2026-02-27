import { Router } from "express";
import { bodyValidator } from "../middlewares/validator.middleware.js";
import { registerValidator } from "../validators/member.validator.js";
import memberController from "../controllers/member.controller.js";
import { connected } from "../middlewares/auth.middleware.js";

const memberRouter = Router();

/**
 * @openapi
 * /member:
 *   post:
 *     tags:
 *       - Member
 *     summary: Inscription d'un nouveau membre
 *     description: Permet à un administrateur d'inscrire un nouveau membre (joueur).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - birthdate
 *               - gender
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 description: Le nom d'utilisateur du membre.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: L'adresse email du membre.
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 maxLength: 100
 *                 description: Le mot de passe du membre.
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: La date de naissance du membre (au format ISO, ex 2000-01-01).
 *               gender:
 *                 type: string
 *                 enum: [M, F, O]
 *                 description: Le genre du membre (M pour Masculin, F pour Féminin, O pour Autre).
 *               elo:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 3000
 *                 description: Le score ELO du membre. Optionnel.
 *     responses:
 *       204:
 *         description: Succès - Le membre a été créé avec succès. Aucune donnée n'est renvoyée.
 *       400:
 *         description: Erreur de validation - Données invalides, email ou nom d'utilisateur déjà existant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already exists"
 *       401:
 *         description: Non autorisé - L'utilisateur n'est pas connecté ou le token est invalide.
 *       403:
 *         description: Interdit - L'utilisateur n'a pas les droits nécessaires (admin requis).
 *       500:
 *         description: Erreur serveur interne.
 */
memberRouter.post(
	"/",
	connected(["admin"]),
	bodyValidator(registerValidator),
	memberController.register,
);

export default memberRouter;
