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

  await initDB().then(() => {
    console.log("Database connected");
  });
  await server.start().then(() => {
    console.log("Server running on: ".green + server.info.uri, get("tada"));
  });
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

// Contoh penggunaan untuk InternetDefinition
const fakeEmail: string = faker.internet.email();
const fakeUsername: string = faker.internet.userName();
const fakeDomain: string = faker.internet.domainName();

console.log(
  `Email: ${fakeEmail}, Username: ${fakeUsername}, Domain: ${fakeDomain}`
);

init();
