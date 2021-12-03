import setCookieParser from "set-cookie-parser";
import supertest from "supertest";

import { Users } from "./models";

export const fakeUserPassword = "a crazy one";
export const parseCookies = (response: supertest.Response) => {
  return setCookieParser
    .parse(response.headers["set-cookie"])
    .filter((c) => (c.expires?.getTime() ?? 0) !== 0); // instead of clearing cookies, `res.clearCookies` sometimes just expires them (https://github.com/expressjs/express/issues/691#issuecomment-385054381)
};

export const seedUsers = () =>
  Users.seed([{ name: "John Doe", email: "john@petite.com", password: fakeUserPassword }]);

export const signIn = async (
  request: supertest.SuperTest<supertest.Test> | supertest.SuperAgentTest,
  password = fakeUserPassword,
) => {
  const response = await request.get("/index.html");

  const doubleSubmit = parseCookies(response).find((c) => c.name === "doubleSubmit")?.value;
  expect(doubleSubmit).toBeDefined();

  return request
    .post("/api/auth/session")
    .send({ email: "john@petite.com", password, doubleSubmit })
    .set("Cookie", `doubleSubmit=${doubleSubmit}`)
    .set("Content-Type", "application/json");
};
