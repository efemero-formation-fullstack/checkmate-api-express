/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterMemberSchema:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - birthdate
 *         - gender
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: Le nom d'utilisateur du membre.
 *         email:
 *           type: string
 *           format: email
 *           description: L'adresse email du membre.
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 100
 *           description: Le mot de passe du membre.
 *         birthdate:
 *           type: string
 *           format: date
 *           description: La date de naissance du membre (au format ISO, ex 2000-01-01).
 *         gender:
 *           type: string
 *           enum: [M, F, O]
 *           description: Le genre du membre (M pour Masculin, F pour Féminin, O pour Autre).
 *         elo:
 *           type: integer
 *           minimum: 0
 *           maximum: 3000
 *           description: Le score ELO du membre. Optionnel.
 */
