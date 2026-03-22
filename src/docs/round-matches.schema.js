/**
 * @openapi
 * components:
 *   schemas:
 *     RoundMatchesSchema:
 *       type: object
 *       properties:
 *         round:
 *           type: integer
 *           description: Le numéro de la ronde.
 *         matches:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: L'ID du match.
 *               whitePlayer:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: L'ID du joueur blanc.
 *                   username:
 *                     type: string
 *                     description: Le nom d'utilisateur du joueur blanc.
 *                   gender:
 *                     type: string
 *                     description: Le genre du joueur blanc.
 *                   elo:
 *                     type: integer
 *                     description: Le score ELO du joueur blanc.
 *               blackPlayer:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: L'ID du joueur noir.
 *                   username:
 *                     type: string
 *                     description: Le nom d'utilisateur du joueur noir.
 *                   gender:
 *                     type: string
 *                     description: Le genre du joueur noir.
 *                   elo:
 *                     type: integer
 *                     description: Le score ELO du joueur noir.
 *               result:
 *                 type: string
 *                 description: Le résultat du match.
 *               round:
 *                 type: integer
 *                 description: Le numéro de la ronde.
 */
