import { DateTime } from "luxon";
import * as bcrypt from "bcrypt";
import jwt = require("jsonwebtoken");
import { defaultSecret } from "../settings";
import "dotenv/config";

let secret: any = "";
if (process.env.NODE_ENV == "production") secret = process.env.JWT_SECRET;
else secret = defaultSecret;

function validateEmail(email: string) {
  const atPos = email.indexOf("@");
  const dotPos = email.lastIndexOf(".");
  return email.length > 0 && atPos > 0 && dotPos > atPos + 1 && dotPos < email.length - 1;
}

function validatePassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

function validateDates(startDate: string, endDate: string) {
  if (startDate.length <= 0 && endDate.length <= 0) return false;

  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  const startMonth = start.toFormat("MMMM");
  const startYear = start.toFormat("yyyy");

  const endMonth = end.toFormat("MMMM");
  const endYear = end.toFormat("yyyy");

  if (startYear !== endYear) {
    return false;
  } else {
    if (startMonth === endMonth && start.day === end.day) {
      return `${start.day}-${startMonth.slice(0, 3)}-${startYear}`;
    } else if (startMonth === endMonth) {
      return `${endMonth} ${start.day}-${end.day}, ${startYear}`;
    } else {
      return `${startMonth}-${endMonth}, ${startYear}`;
    }
  }
}

function bcryptHashPassword(password: string) {
  return bcrypt.hashSync(password, 12);
}

function bcryptCompareHashedPassword(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}

function jwtSignUser(emailOrUsername: string) {
  return jwt.sign({ emailOrUsername: emailOrUsername }, secret);
}

function jwtVerifyUser(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, function (err: any, decode: any) {
      if (err) reject(err);
      else resolve(decode);
    });
  });
}

export { validateEmail, validatePassword, validateDates, bcryptHashPassword, bcryptCompareHashedPassword, jwtSignUser, jwtVerifyUser };
