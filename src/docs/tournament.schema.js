/**
 * @openapi
 * components:
 *   schemas:
 *     TournamentSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: L'ID du tournoi.
 *         name:
 *           type: string
 *           description: Le nom du tournoi.
 *         location:
 *           type: string
 *           description: Le lieu du tournoi.
 *         minPlayers:
 *           type: integer
 *           description: Le nombre minimum de joueurs.
 *         maxPlayers:
 *           type: integer
 *           description: Le nombre maximum de joueurs.
 *         minElo:
 *           type: integer
 *           description: Le score ELO minimum requis.
 *         maxElo:
 *           type: integer
 *           description: Le score ELO maximum autorisé.
 *         womenOnly:
 *           type: boolean
 *           description: Indique si le tournoi est réservé aux femmes.
 *         endRegistrationDate:
 *           type: string
 *           format: date-time
 *           description: La date limite d'inscription.
 *         categories:
 *           type: array
 *           items:
 *             type: integer
 *           description: Liste des IDs des catégories associées.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: La date de création du tournoi.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: La date de mise à jour du tournoi.
 *         nbOfPlayers:
 *           type: integer
 *           description: Le nombre de joueurs inscrits.
 *         isRegistered:
 *           type: boolean
 *           description: Indique si l'utilisateur est inscrit au tournoi.
 *         canRegister:
 *           type: boolean
 *           description: Indique si l'utilisateur peut s'inscrire au tournoi.
 *         currentRound:
 *           type: integer
 *           description: Le numéro de la ronde actuelle.
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: L'ID du joueur.
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur du joueur.
 *               gender:
 *                 type: string
 *                 description: Le genre du joueur.
 *               elo:
 *                 type: integer
 *                 description: Le score ELO du joueur.
 */
