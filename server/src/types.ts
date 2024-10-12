import * as express from "express";

interface GetUserRequest extends express.Request {
   user_uuid: string
 }

 interface DocLocation extends express.Request {
   docLocation: string
 }


type dbType = {
   host: string | undefined,
   user: string | undefined,
   password: string | undefined,
   name: string | undefined,
   limit: number | undefined
 }


type configType = { 
   [key: string]: any 
}


type overviewAll = {
   data: {
      co: any | null,
      target: any| null,
      latest: any| null,
   }
}

type clubOrgType = { 
   data: any[] 
}


type initAllType = {
   initClub: any,
   initCategory: any,
   initYear: any
}

type getAccessLevelType = {
   user: any,
   level: string
}


type accessby1 = "WEBMASTER"
type accessby2 = "WEBMASTER|ADMIN"
type accessby3 = "WEBMASTER|ADMIN|STAFF"
type accessAdmin = "ADMIN"
type accessStaff = "STAFF"
type accessStudent = "STUDENT"

type accessRightType = accessby1 | accessby2 | accessby3 | accessAdmin | accessStaff | accessStudent

export {
   GetUserRequest,
   DocLocation,
   dbType,
   configType,
   initAllType,
   overviewAll,
   clubOrgType,
   getAccessLevelType,
   accessRightType
}