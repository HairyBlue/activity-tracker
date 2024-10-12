import { expect } from "@jest/globals";

import {defaults, defaultSecret, defaultUser, developmentDB, stagingDB} from "../../src/settings";

// TODO Need to remove if need to use env config
describe("check default setting yaml where defined", function () {

  describe("check if there is a setting", function () {
    it("should check settings", function () {
      expect(typeof defaults).toBe("object");
    });
  })

  describe("check if there is a secret in setting", function () {
    it("should check secret and greater that 16", function () {
      expect(defaultSecret.length).toBeGreaterThan(16);
    });
  })

  describe("check if there is a user", function () {
    it("should username not empty", function () {
      expect(defaultUser.username.length).toBeGreaterThan(0);
    });
    it("should email not empty", function () {
      expect(defaultUser.email.length).toBeGreaterThan(0);
    });
    it("should passwowrd not empty", function () {
      expect(defaultUser.password.length).toBeGreaterThan(0);
    });
 })

  describe("check for development database", function () {
    it("should have db", function () {
       expect(typeof developmentDB).toBe("object");
    });
    it("should have config", function () {
      expect(developmentDB.host).toBe("localhost" || "127.0.0.1");
      // expect(developmentDB.user).toBe("root");
      // expect(developmentDB.password).toBe("Hairyblue");
      expect(developmentDB.name).toBe("activity_tracker");
      expect(developmentDB.limit).toBeGreaterThan(15);
    })
  })

  describe("check for staging database", function () {
    it("should have db", function () {
      expect(typeof stagingDB).toBe("object");
   });
   it("should have config", function () {
     expect(stagingDB.host).toBe("localhost" || "127.0.0.1");
    //  expect(stagingDB.user).toBe("root");
    //  expect(stagingDB.password).toBe("root");
     expect(stagingDB.name).toBe("activity_tracker");
     expect(stagingDB.limit).toBeGreaterThan(15);
   })
  })

  describe("check zip interval", function () {
    it("interval should be 3600000 ms or 1hour", function () {
      expect(defaults.zipInterval).toBe(3600000);
   });

  })
  
});
