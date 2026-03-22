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
 *             $ref: '#/components/schemas/RegisterMemberSchema'
 *     responses:
 *       204:
 *         description: Succès - Le membre a été créé avec succès. Aucune donnée n'est renvoyée.
 *       400:
 *         description: Erreur de validation - Données invalides, email ou nom d'utilisateur déjà existant.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
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

/**
 * @openapi
 * /member/me:
 *   get:
 *     tags:
 *       - Member
 *     summary: Récupérer le membre connecté
 *     description: Permet à un membre connecté de récupérer ses propres informations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès - Le membre a été récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberSchema'
 *       401:
 *         description: Non autorisé - L'utilisateur n'est pas connecté ou le token est invalide.
 *       500:
 *         description: Erreur serveur interne.
 */
memberRouter.get("/me", connected(), memberController.getConsumer);

/**
 * @openapi
 * /member/{id}:
 *   get:
 *     tags:
 *       - Member
 *     summary: Récupérer un membre par son ID
 *     description: Permet à un membre connecté de récupérer les informations d'un membre par son ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID du membre à récupérer.
 *     responses:
 *       200:
 *         description: Succès - Le membre a été récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberSchema'
 *       401:
 *         description: Non autorisé - L'utilisateur n'est pas connecté ou le token est invalide.
 *       404:
 *         description: Non trouvé - Le membre avec l'ID spécifié n'a pas été trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 *       500:
 *         description: Erreur serveur interne.
 */
memberRouter.get("/:id", connected(), memberController.getById);

export default memberRouter;
