/**
 * @openapi
 * components:
 *   schemas:
 *     MemberListingSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: L'ID du membre.
 *           example: 1
 *         username:
 *           type: string
 *           description: Le nom d'utilisateur du membre.
 *           example: "JohnDoe"
 *         birthdate:
 *           type: string
 *           format: date
 *           description: La date de naissance au format ISO.
 *           example: "2000-01-01"
 *         gender:
 *           type: string
 *           description: Le genre du membre (M, F, O).
 *           example: "M"
 *         elo:
 *           type: integer
 *           description: Le score ELO du membre.
 *           example: 1500
 */
