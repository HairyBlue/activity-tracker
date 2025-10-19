import { expect } from "@jest/globals";

import { configs } from "../../src/settings";

const defaultConfig = configs.default;

// TODO Need to remove if need to use env config
describe("check default setting yaml where defined", function () {

  describe("check if there is a setting", function () {

    it("should check settings", function () {
      expect(typeof configs).toBe("object");
    });

    it("check if there is default settings", function () {
      expect(typeof configs["default"]).toBe("object");
    });

    it("check if there is local settings", function () {
      expect(typeof configs["local"]).toBe("object");
    });

  })

  describe("check if there is a secret in setting", function () {
    it("should check secret and greater that 16", function () {
      expect(defaultConfig.secret.length).toBeGreaterThan(16);
    });
  })

  describe("check if there is a client secret in setting", function () {
    it("should check secret and greater that 16", function () {
      expect(defaultConfig.client.secret.length).toBeGreaterThan(16);
    });
  })

  describe("check if there is attachment in setting", function () {
    it("should check attachments settings", function () {
      expect(typeof(defaultConfig.attachments)).toBe("object");
    });

    it("should check attachments settings maxUpload", function () {
      expect(typeof(defaultConfig.attachments.maxUpload)).toBe("object");
    });

    it("should check attachments settings maxUpload images", function () {
      expect(typeof(defaultConfig.attachments.maxUpload.images)).toBe("number");
    });

    it("should check attachments settings maxUpload pdfs", function () {
      expect(typeof(defaultConfig.attachments.maxUpload.pdfs)).toBe("number");
    });

    it("should check attachments settings maxUpload videos", function () {
      expect(typeof(defaultConfig.attachments.maxUpload.videos)).toBe("number");
    });


    it("should check attachments settings maxSize", function () {
      expect(typeof(defaultConfig.attachments.maxSize)).toBe("object");
    });

    it("should check attachments settings maxSize images", function () {
      expect(typeof(defaultConfig.attachments.maxSize.images)).toBe("number");
    });

    it("should check attachments settings maxSize pdfs", function () {
      expect(typeof(defaultConfig.attachments.maxSize.pdfs)).toBe("number");
    });

    it("should check attachments settings maxSize videos", function () {
      expect(typeof(defaultConfig.attachments.maxSize.videos)).toBe("number");
    });

  })


  describe("check zip interval", function () {
    it("interval should be 3600000 ms or 1hour", function () {
      expect(defaultConfig.zipInterval).toBe(10800000);
   });

  })
  
});
