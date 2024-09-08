import * as Hapi from "@hapi/hapi";
import { Server, ResponseToolkit, Request, ServerRoute } from "@hapi/hapi";
import "colors";
import { get } from "node-emoji";
import { initDB } from "./src/db";
import { userController, authController } from "./src/controllers";
import { DataSource } from "typeorm";
import { validateBasic, validateJWT } from "./auth";
const init = async () => {
  const server: Server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request: Request, h: ResponseToolkit, err?: Error) => {
      return "Hello World!";
    },
  });

  const con: DataSource = await initDB();
  await server.register(require("hapi-auth-jwt2"));
  await server.register(require("@hapi/basic"));
  server.auth.strategy("simple", "basic", {
    validate: validateBasic(con),
  });
  server.auth.strategy("jwt", "jwt", {
    key: "secretKeyharusnyadienv",
    validate: validateJWT(con),
  });
  console.log(get("dvd"), "DB init => done!", get("tada"));

  server.route([
    ...userController(con),
    ...authController(con),
  ] as Array<ServerRoute>);

  await server.start().then(() => {
    console.log("Server running on: ".green + server.info.uri, get("tada"));
  });
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
