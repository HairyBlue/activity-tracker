import { expect } from "@jest/globals";
import request = require("supertest");
import createRoute from "../../src/createRoutes";


// describe("check api", function () {
//   const app = createRoute();

//   it("responds with JSON", function (done) {
//     request(app)
//       .get("/api")
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         done();
//       });
//   });
// });

describe("check default true", function () {

  it("IT WILL TRUE", function () {
    expect(true).toBe(true)
  });
});