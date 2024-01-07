import request from "supertest";
import server from "../src";
import { faker } from "@faker-js/faker";

afterAll((done) => {
  server.close(done);
});
describe("POST /user/", () => {
  test("create user", async () => {
    const response = await request(server)
      .post("/user/")
      .send({
        username: faker.person.firstName(),
        password: faker.string.alphanumeric(10),
      });
    const { user } = response.body;
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        username: expect.any(String),
        password: expect.any(String),
      })
    );
  });
});
describe("GET /user/", () => {
  test("responds with json", async () => {
    const response = await request(server).get("/user");
    const users = response.body;
    users.forEach((user: any) => {
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          username: expect.any(String),
          password: expect.any(String),
        })
      );
    });
  });
});

describe("PUT /user/:id", () => {
  test("update user with id", async () => {
    const getUsers = await request(server).get("/user");
    const users = getUsers.body;

    const response = await request(server)
      .put(`/user/${users[0].id}`)
      .send({ username: "test" });
    expect(response.status).toBe(200);
  });
});

describe("DELETE /user/:id", () => {
  test("delete user with id 10", async () => {
    const getUsers = await request(server).get("/user");
    const users = getUsers.body;

    const response = await request(server).delete(`/user/${users[0].id}`);
    expect(response.status).toBe(204);
  });
});
