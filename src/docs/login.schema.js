/**
 * @openapi
 * components:
 *   schemas:
 *     LoginSchema:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Le nom d'utilisateur (requis si l'email n'est pas fourni).
 *         email:
 *           type: string
 *           format: email
 *           description: L'adresse email (requise si le nom d'utilisateur n'est pas fourni).
 *         password:
 *           type: string
 *           format: password
 *           description: Le mot de passe de l'utilisateur.
 */
