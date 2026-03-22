const { APP_PORT } = process.env;

export const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Mon API Express",
			version: "1.0.0",
			description: "Documentation interactive de l'API",
		},
		servers: [
			{
				// Utilise une valeur par défaut si APP_PORT n'est pas encore chargé
				url: `http://localhost:${process.env.APP_PORT || 3000}`,
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	// Vérifie bien ce chemin selon ton arborescence
	apis: ["./src/routers/*.js", "./src/docs/*.js"],
};
