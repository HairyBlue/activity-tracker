import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as logging from "./logger";
import { Settings , DateTime } from "luxon"
import { configs } from "./settings";
import { show, create, update, destroy } from "./db/dbcon";
import { GetUserRequest, DocLocation } from "./types";
import { getAccessLevel, getStudentProfile, approveAccess } from "./auth";
import { getDocuments, getActivityAndClub } from "./commonData";
import { r_uuid } from "./helpers/svcfunc";

import express = require("express");

import "dotenv/config";

// const basePath = process.env.NODE_ENV !== "production" ? "" : (process.env.VITE_PUBLIC_PATH ? `${process.env.VITE_PUBLIC_PATH}/`: "");
 
Settings.defaultZone = "Asia/Manila";
const logger = logging.wichFileToLog("file-upload-manager");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const attachmentsDir = "attachments";
let filePathExtented = "";

if (!fs.existsSync(attachmentsDir)) {
  fs.mkdirSync(attachmentsDir);
}

const attachments = configs.default.attachments;
const maxAttachments = attachments.maxUpload
const maxSizes = attachments.maxSize

// const maxImage = maxAttachments.images
// const maxPdf = maxAttachments.pdfs
// const maxVideo = maxAttachments.videos

// const maxImageSize = maxSizes.images
// const maxPdfSize = maxSizes.pdfs
// const maxVideoSize = maxSizes.videos

const maxImage = process.env.MAX_IMAGE_COUNT ? parseInt(process.env.MAX_IMAGE_COUNT) : maxAttachments.images;
const maxPdf = process.env.MAX_PDF_COUNT ? parseInt(process.env.MAX_PDF_COUNT): maxAttachments.pdfs;
const maxVideo = process.env.MAX_VIDEO_COUNT ? parseInt(process.env.MAX_VIDEO_COUNT): maxAttachments.videos;

const maxImageSize = process.env.MAX_IMAGE_SIZE ? (parseInt(process.env.MAX_IMAGE_SIZE) * 1024 * 1024) : maxSizes.images;
const maxPdfSize = process.env.MAX_PDF_SIZE ? (parseInt(process.env.MAX_PDF_SIZE) * 1024 * 1024) : maxSizes.pdfs;
const maxVideoSize = process.env.MAX_VIDEO_SIZE ? (parseInt(process.env.MAX_VIDEO_SIZE) * 1024 * 1024) : maxSizes.videos;

const multipartSize = (maxImage * maxImageSize) + (maxPdf * maxPdfSize) + (maxVideo * maxVideoSize)

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      let uploadPath = path.join(__dirname, filePathExtented);
   
      if (file.mimetype.startsWith("image/")) {
         uploadPath += "/images/";
      } else if (file.mimetype === "application/pdf") {
         uploadPath += "/pdfs/";
      } else if (file.mimetype.startsWith("video/")) {
         uploadPath += "/videos/";
      }
   
      if (!fs.existsSync(uploadPath)) {
         fs.mkdirSync(uploadPath, { recursive: true });
      }
 
      cb(null, uploadPath);
   },
   filename: function (req, file, cb) {
    //  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //  cb(null, file.fieldname + '-' + uniqueSuffix)
    //  console.log(file)
    // cb(null, Date.now() + "-" + file.originalname);
     cb(null, file.originalname);
   }
 });
 
 function filter(req: any, file: any, cb: any) {
   // const regx = attachments.regx;

   const imageRgx = /jpeg|jpg|png|gif/;
   const pdfRgx = /pdf/;
   const videoRgx = /mp4|webm|ogg/;

   const overhead = 300;  // add request has additional bytes
   const mimetype: string = file.mimetype;
   const fileSize = parseInt(req.headers["content-length"]) - overhead;
 
   if( fileSize > multipartSize ) {
     cb(
       "Total Files upload size exceed, following details should be follow: image-5mb, pdf-3mb, and video-25mb"
     );
   }
 
   if (mimetype.startsWith("image/")) {
     const imgextname = imageRgx.test(
       path.extname(file.originalname).toLowerCase()
     );
     if (!imgextname) {
       cb(
         "Image upload only supports the " + "following file types - " + imageRgx
       );
     }
 
     // if (fileSize > maxImageSize) {
     //   cb("Image upload only supports upto 5mb");
     // }
   } else if (mimetype === "application/pdf") {
     const pdfextname = pdfRgx.test(
       path.extname(file.originalname).toLowerCase()
     );
 
     if (!pdfextname) {
       cb(
         "Document upload only supports the " +
           "following file types - " +
           pdfRgx
       );
     }
 
     // if (fileSize > maxPdfSize) {
     //   cb("PDF upload only supports upto 20mb");
     // }
   } else if (mimetype.startsWith("video/")) {
     const videoextname = videoRgx.test(
       path.extname(file.originalname).toLowerCase()
     );
 
     if (!videoextname) {
       cb(
         "Video upload only supports the " + "following file types - " + videoRgx
       );
     }
 
     // if (fileSize > maxVideoSize) {
     //   cb("Video upload only supports upto 100mb");
     // }
   } else if (
     !mimetype.startsWith("image/") ||
     mimetype !== "application/pdf" ||
     !mimetype.startsWith("video/")
   ) {
     cb("File upload only supports image, pdf, and video");
   }
 
   cb(null, true);
 }

 async function generateFilePath(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    
     const activity_same_record_uuid = req.params.activity_same_record_uuid;

     if (!activity_same_record_uuid) {
       return res.status(400).json({ error: "Bad Request" });
     }
   
     let result: any = await getDocuments(activity_same_record_uuid);
    //  console.log(result)
     if (result.length > 0 && result[0].documentLocation) {
        filePathExtented = result[0].documentLocation;

        if (req.query.imageCaptions) {
          let imageCaptions: any = req.query.imageCaptions;

          const parseDoc: any[] = JSON.parse(result[0].documentInfo);

          const infos: string[] = imageCaptions.split("|");
  
          type cap = {[key: string] : string};

          if (infos) {
           let c: cap =  {};
           for (let i = 0; i < infos.length; i++) {
             if (infos[i] == "") {
               continue;
             }
  
             if (i % 2 == 0) {
               c["fileName"] = infos[i];
               
             } else if (i % 2 == 1) {
               c["fileCaption"] = infos[i];
               parseDoc.push(c);
               c = {};
             }
  
            }
          }
  
          const stringifyDoc = JSON.stringify(parseDoc);
          await update("Update Documents Set documentInfo = ? Where documentId = ?", [stringifyDoc, result[0].documentId]);
        }

     } else {
        const millis = DateTime.now().toMillis();
        const uuid = r_uuid();
        let clubName = ""
       
        if ( result[0].clubAcronym ) {
          clubName = result[0].clubAcronym
        } else if (result[0].clubName) {
          clubName = result[0].clubName
        } else {
          clubName = "UNKNOWN"
        }
       
         clubName = clubName
             .trim()
             .toUpperCase()
             .replace(/\//g, "_")
       
         const extendedpath = `/${result[0].activitySchoolYear}/${clubName}/${millis}/${uuid}`
         filePathExtented = attachmentsDir + extendedpath;
             
         let imageCaptions: any = req.query.imageCaptions;

         const infos: string[] = imageCaptions.split("|");

         type cap = {[key: string] : string};
         const captions = [];

         if (infos) {
          let c: cap =  {};
          for (let i = 0; i < infos.length; i++) {
            if (infos[i] == "") {
              continue;
            }

            if (i % 2 == 0) {
              c["fileName"] = infos[i];
              
            } else if (i % 2 == 1) {
              c["fileCaption"] = infos[i];
              captions.push(c);
              c = {};
            }

           }
         }

         imageCaptions = JSON.stringify(captions);
    
         // document.insertId
         await create(`INSERT INTO Documents (document_activity_same_uuid, documentInfo, documentLocation) values (?, ?, ?)`, [activity_same_record_uuid, imageCaptions, filePathExtented]);
   }

   next()
  } catch ( error ) {
     logger.error(error)
     return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function prepareFileUpload (req: express.Request, res: express.Response, next: express.NextFunction) {
   // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  for (let category of ["/images", "/pdfs", "/videos"]) {
    const loc =  path.join(__dirname, filePathExtented, category);
    if (fs.existsSync(loc)) {
      const count = fs.readdirSync(loc).length
      
      if ( category == "/images" && count >= maxImage) {
        return res.status(400).json({ error: "Maximum image upload reach, limit only two 5 uploads" });
      } else if ( category == "/pdfs" && count >= maxPdf ) {
        return res.status(400).json({ error: "Maximum pdf upload reach, limit only two 2 uploads" });
      } else if ( category == "/videos" && count >= maxVideo ) {
        return res.status(400).json({ error: "Maximum video upload reach, limit only 1 upload" });
      }
    }
   }
   
   next();
 }
 
 const upload = multer({
   storage: storage,
   fileFilter: filter
 });

 const uploadFields = upload.fields([
   { name: "image", maxCount: maxImage },
   { name: "pdf", maxCount: maxPdf },
   { name: "video", maxCount: maxVideo }
 ]);

 function handleFileUpload (req: express.Request, res: express.Response, next: express.NextFunction) {
   uploadFields(req, res, function (err) {
     // code: 'LIMIT_UNEXPECTED_FILE'
     if (err) {
       let errorMessage = err;
       if (err.code == `LIMIT_UNEXPECTED_FILE`) {
         if (err.field == "image") {
           errorMessage = "Limit image upload up to 5 images only";
         } else if (err.field == "pdf") {
           errorMessage = "Limit pdf upload up to 2 pdf's only";
         } else if (err.field == "video") {
           errorMessage = "Limit video upload up to 1 video only";
         }
       }
       res.status(400).json({ error: errorMessage.replace(/\//g, "") });
     } else {
       res.status(200).json({ success: "success" });
     }
     
   });
 }
 

async function getStaticFiles(req: express.Request, res: express.Response) {
  const activity_same_record_uuid = req.params.activity_same_record_uuid;

  if (!activity_same_record_uuid) {
    return res.status(400).json({ error: "Bad Request" });
  }

  let result: any = await getDocuments(activity_same_record_uuid);


  const filesInfo: any = {
    documentId: result[0].documentId,
    images: [],
    pdfs: [],
    videos: [],
    caption: null //result.documentInfo ? JSON.parse(result.documentInfo): null
  }

  if (result.length == 0) {
    res.status(200)
    res.json({data: filesInfo})

    return
  }

 
  if (result[0].documentLocation) {
    for (let category of ["/images/", "/pdfs/", "/videos/"]) {
      const filePath = path.join(__dirname, result[0].documentLocation);

      if (fs.existsSync(filePath + category)) {
        const files = fs.readdirSync(filePath + category);

        for (let file of files) {
          const cleanedCat = category.replace(/\//g, "");
          const generatedUrl = result[0].documentLocation + category + file;

          filesInfo[cleanedCat].push(generatedUrl);
        }
      }
    }
  }


  res.status(200)
  res.json({data: filesInfo})
}

function groupFile(file1: string, file2:string) {

  const group = /(\d+\-)(.*)/.exec(file1);
  if (group) {
    if (group[2] == file2) {
      return true;
    }
  }

  return false;
}

async function deleteFiles(req: express.Request, res: express.Response) {
  const { documentId, fileName, filePathToDelete } = req.body;

  const document: any = await show("Select * from Documents Where documentId = ?", [documentId]);
  const doc = document[0];
  
  const parseDoc: any[] = JSON.parse(doc.documentInfo);
  

  const filePath = path.join(__dirname, filePathToDelete);

  if (fs.existsSync(filePath)) {

    try {

      fs.unlinkSync(filePath);
      
      let newParseDoc = parseDoc.filter(file => file.fileName != fileName)
  
      await update("Update Documents Set documentInfo = ? Where documentId = ?", [JSON.stringify(newParseDoc), documentId]);

      res.status(200);
      res.json({message: "success"});

    } catch(e) {
      logger.error(e)
    }
  }

}


 router.post("/file-upload/:activity_same_record_uuid/", generateFilePath, prepareFileUpload, handleFileUpload);

 router.get("/file-upload/:activity_same_record_uuid/", getStaticFiles);

 router.delete("/file-upload", deleteFiles);

 export { 
   router
 }