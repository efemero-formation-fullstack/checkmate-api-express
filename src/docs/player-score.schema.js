/**
 * @openapi
 * components:
 *   schemas:
 *     PlayerScoreSchema:
 *       type: object
 *       properties:
 *         player:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: L'ID du joueur.
 *             username:
 *               type: string
 *               description: Le nom d'utilisateur du joueur.
 *             gender:
 *               type: string
 *               description: Le genre du joueur.
 *             elo:
 *               type: integer
 *               description: Le score ELO du joueur.
 *         score:
 *           type: integer
 *           description: Le score du joueur.
 *         victory:
 *           type: integer
 *           description: Le nombre de victoires du joueur.
 *         draw:
 *           type: integer
 *           description: Le nombre de matchs nuls du joueur.
 *         defeat:
 *           type: integer
 *           description: Le nombre de défaites du joueur.
 *         bye:
 *           type: integer
 *           description: Le nombre de matchs par absence du joueur.
 */
