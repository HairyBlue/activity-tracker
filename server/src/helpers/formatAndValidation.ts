import { DateTime } from "luxon";
import * as bcrypt from "bcrypt";
import jwt = require("jsonwebtoken");
import { configs } from "../settings";
import "dotenv/config";

let secret: any = "";
if (process.env.NODE_ENV == "production") secret = process.env.JWT_SECRET;
else secret = configs.default.secret;

function validateEmail(email: string) {
  const atPos = email.indexOf("@");
  const dotPos = email.lastIndexOf(".");
  return email.length > 0 && atPos > 0 && dotPos > atPos + 1 && dotPos < email.length - 1;
}

function validatePassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

function validateDates(startDate: string, endDate: string, activitySchoolYear: string) {
  if (startDate.length <= 0 && endDate.length <= 0) return false;

  if (!startDate || !endDate || !activitySchoolYear) return false;

  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  // const startMonth = start.toFormat("MMMM");
  // const startYear = start.toFormat("yyyy");

  // const endMonth = end.toFormat("MMMM");
  // const endYear = end.toFormat("yyyy");

  // console.log(start.toFormat("MM/dd/yyyy · h:mm a"), start.year.toString(), end.year.toString());


  if (
    !activitySchoolYear.includes(start.year.toString()) ||
    !activitySchoolYear.includes(end.year.toString())
  ) {
    return false;
  }

  if ( 
    // startMonth === endMonth &&
    start.day > end.day ||
    (start.day === end.day && start.hour > end.hour) ||
    (start.day === end.day && start.hour === end.hour && start.minute > end.minute) || 
    (start.day === end.day && start.hour === end.hour && start.minute === end.minute && start.second > end.second)
  ) {
    return false;
  }
  
  // if (startMonth === endMonth && start.day === end.day) {
  //   return `${start.day}-${startMonth.slice(0, 3)}-${startYear}`;
  // } else if (startMonth === endMonth) {
  //   return `${endMonth} ${start.day}-${end.day}, ${startYear}`;
  // } else {
  //   return `${startMonth}-${endMonth}, ${startYear}`;
  // }

  return `${start.toFormat('MM/dd/yyyy · h:mm a')} --- ${end.toFormat('MM/dd/yyyy · h:mm a')}`;
}

function bcryptHashPassword(password: string) {
  return bcrypt.hashSync(password, 12);
}

function bcryptCompareHashedPassword(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}

function jwtSignUser(user_uuid: string) {
  return jwt.sign({ user_uuid: user_uuid }, secret);
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
