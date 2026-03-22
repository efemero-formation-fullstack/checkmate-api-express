/**
 * @openapi
 * components:
 *   parameters:
 *     PageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         minimum: 1
 *       description: Numéro de la page pour la pagination.
 *     LimitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *       description: Nombre d'éléments par page.
 *     SortByParam:
 *       in: query
 *       name: sortBy
 *       schema:
 *         type: string
 *       description: Critère de tri.
 *     SortOrderParam:
 *       in: query
 *       name: sortOrder
 *       schema:
 *         type: string
 *         enum: [ASC, DESC]
 *       description: Ordre de tri (ASC ou DESC).
 *     UsernameFilterParam:
 *       in: query
 *       name: username
 *       schema:
 *         type: string
 *         minLength: 3
 *         maxLength: 20
 *       description: Filtrer par nom d'utilisateur.
 *     EmailFilterParam:
 *       in: query
 *       name: email
 *       schema:
 *         type: string
 *         format: email
 *       description: Filtrer par adresse email.
 *     BirthdateFilterParam:
 *       in: query
 *       name: birthdate
 *       schema:
 *         type: string
 *         format: date
 *       description: Filtrer par date de naissance.
 *     GenderFilterParam:
 *       in: query
 *       name: gender
 *       schema:
 *         type: string
 *         enum: [M, F, O]
 *       description: Filtrer par genre.
 *     EloFilterParam:
 *       in: query
 *       name: elo
 *       schema:
 *         type: integer
 *         minimum: 0
 *         maximum: 3000
 *       description: Filtrer par score ELO.
 */
