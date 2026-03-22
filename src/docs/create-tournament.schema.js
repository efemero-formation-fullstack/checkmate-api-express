/**
 * @openapi
 * components:
 *   schemas:
 *     CreateTournamentSchema:
 *       type: object
 *       required:
 *         - name
 *         - minPlayers
 *         - maxPlayers
 *         - endRegistrationDate
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           description: Le nom du tournoi.
 *         location:
 *           type: string
 *           maxLength: 255
 *           description: Le lieu du tournoi. Optionnel.
 *         minPlayers:
 *           type: integer
 *           minimum: 2
 *           maximum: 32
 *           description: Le nombre minimum de joueurs.
 *         maxPlayers:
 *           type: integer
 *           minimum: 2
 *           maximum: 32
 *           description: Le nombre maximum de joueurs.
 *         minElo:
 *           type: integer
 *           minimum: 0
 *           maximum: 3000
 *           description: Le score ELO minimum requis. Optionnel.
 *         maxElo:
 *           type: integer
 *           minimum: 0
 *           maximum: 3000
 *           description: Le score ELO maximum autorisé. Optionnel.
 *         womenOnly:
 *           type: boolean
 *           description: Indique si le tournoi est réservé aux femmes. Optionnel.
 *         endRegistrationDate:
 *           type: string
 *           format: date-time
 *           description: La date limite d'inscription. Doit être au minimum la date actuelle + le nombre de joueurs minimum en jours.
 *         categories:
 *           type: array
 *           items:
 *             type: integer
 *           description: Liste des IDs des catégories associées. Optionnel.
 */
