import swaggerJSdoc from "swagger-jsdoc";

import { version } from "../../package.json";

const options: swaggerJSdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Knightfall API",
            version,
        },
    },
    apis: ["./src/routes/*.ts", "./src/schema/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSdoc(options);
