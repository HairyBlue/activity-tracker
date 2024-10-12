import * as uuid from "uuid"


function r_uuid() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
       return v.toString(16);
   });
 }

 function cleanQuery(query: string){
  return query
    .trim()
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
}

 export {
   uuid,
   r_uuid,
   cleanQuery
 }