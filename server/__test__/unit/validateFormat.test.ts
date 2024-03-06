import {
  validateEmail,
  validatePassword,
  validateDates,
} from "../../src/helpers/validateFormat";

describe("Check email format", function () {
  it("return false when email is empty", function () {
    const result = validateEmail("");
    expect(result).toBe(false);
  });
  it("return false when email dont have a @ symbol", function () {
    const result = validateEmail("sampleemail.com");
    expect(result).toBe(false);
  });
  it("return false when email dont have a dot symbol", function () {
    const result = validateEmail("sampleemail@com");
    expect(result).toBe(false);
  });
  it("return false when email dont have a @ and dot symbol", function () {
    const result = validateEmail("sampleemail");
    expect(result).toBe(false);
  });
  it("return false when email dont have a @ and dot symbol", function () {
    const result = validateEmail("sampleemail");
    expect(result).toBe(false);
  });
  it("return true when email are correct", function () {
    const result = validateEmail("sample@email.com");
    expect(result).toBe(true);
  });
  it("return true when email includes special character and number", function () {
    const result = validateEmail("sample1+sample2@email.com");
    expect(result).toBe(true);
  });
});

describe("Check password format", function () {
  it("return false when password is empty", function () {
    const result = validatePassword("");
    expect(result).toBe(false);
  });
  it("return false when password contains speciall character", function () {
    const result = validatePassword("Samplepassword1@com");
    expect(result).toBe(false);
  });
  it("return false when password dont have Upper Case letter", function () {
    const result = validatePassword("samplepassword1");
    expect(result).toBe(false);
  });
  it("return false when password dont have Lower Case letter", function () {
    const result = validatePassword("SAMPLEPASSWORD1");
    expect(result).toBe(false);
  });
  it("return false when password dont have number", function () {
    const result = validatePassword("Samplepassword");
    expect(result).toBe(false);
  });

  it("return true when password correct", function () {
    const result = validatePassword("SamplePassword101");
    expect(result).toBe(true);
  });
});

describe("Check date formats", function () {
  it("return false when start date and end date are empty", function () {
    const result = validateDates("", "");
    expect(result).toBe(false);
  });
  it("return false when start date is empty", function () {
    const result = validateDates("", "2024-08-15");
    expect(result).toBe(false);
  });
  it("return false when end date is empty", function () {
    const result = validateDates("2024-08-15", "");
    expect(result).toBe(false);
  });
  it("return false when year are not the same", function () {
    const result = validateDates("2024-08-15", "2025-09-20");
    expect(result).toBe(false);
  });
    
  it("return date 2024-08-15 to 15-Aug-2024", function () {
    const result = validateDates("2024-08-15", "2024-08-15");
    expect(result).toBe("15-Aug-2024");
  });
  it("return date 2024-08-15 and 2024-08-20 to August 15-20, 2024", function () {
    const result = validateDates("2024-08-15", "2024-08-20");
    expect(result).toBe("August 15-20, 2024");
  });
    
  it("return date 2024-08-15 and 2024-09-20 to August-September, 2024", function () {
    const result = validateDates("2024-08-15", "2024-09-20");
    expect(result).toBe("August-September, 2024");
  });
});
