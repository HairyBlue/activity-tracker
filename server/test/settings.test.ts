import { expect } from "@jest/globals";

import * as defaults from "../src/utils/settings";

// TODO Need to remove if need to use env config
describe("check default setting yaml where defined", function () {
  const user = defaults.defaultSettings.settings.user;
  const secret = defaults.defaultSettings.settings.secret;
  const db = defaults.defaultSettings.db;

  it("should check settings", function () {
    expect(typeof defaults.defaultSettings).toBe("object");
  });

  // CHECK FOR USER
  it("should check if has user", function () {
    expect(user.length).toBeGreaterThan(0);
  });

  // CHECK FOR SECRET
  it("should have secret", function () {
    expect(secret.length).toBeGreaterThan(16);
  });

  // CHECK FOR DB CONFIG
  it("should have db", function () {
    expect(typeof db).toBe("object");

    expect(db.host).toBe("localhost" || "127.0.0.1");
    expect(db.user).toBe("root");
    expect(db.password).toBe("Hairyblue" || "");
    expect(db.database).toBe("tracker");
    expect(db.connectionLimit).toBeGreaterThan(15);
  });
});
