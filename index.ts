import * as Hapi from "@hapi/hapi";
import {
  faker,
  InternetDefinition,
  Randomizer,
  DateDefinition,
  CommerceProductNameDefinition,
} from "@faker-js/faker";
import { Server, ResponseToolkit, Request } from "@hapi/hapi";
import "colors";
import { get } from "node-emoji";
import { initDB } from "./src/db";
import { userController } from "./src/controllers";
import { DataSource } from "typeorm";
import { log } from "console";
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
  console.log(get("dvd"), "DB init => done!", get("tada"));
  
  server.route(userController(con));

  await server.start().then(() => {
    console.log("Server running on: ".green + server.info.uri, get("tada"));
  });
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
