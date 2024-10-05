import { jwtSignUser  } from "../../helpers/formatAndValidation";

const uuid = "3d0df7c0-afd6-47ae-aa9a-ceffd1520778"
const result = jwtSignUser(uuid)

console.log(uuid + " =>  tocken: " + result);