import { bcryptHashPassword  } from "../../helpers/formatAndValidation";

const password = "default@cjc"
const result = bcryptHashPassword(password)

console.log(password + " => " + result);