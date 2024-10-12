require("source-map-support").install();
import * as http from "http";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { Settings , DateTime } from "luxon"
import express = require("express");
Settings.defaultZone = "Asia/Manila"

import { configs } from "../../settings";

import { verifyClient } from "../../verifyClient";


const attachmentsDir = "attachments";
let filePathExtented = "";

if (!fs.existsSync(attachmentsDir)) {
  fs.mkdirSync(attachmentsDir);
}

const app = express();
const server = http.createServer(app);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  //res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const maxAttachments = configs.default.attachments.maxUpload
const maxImage = maxAttachments.images
const maxPdf = maxAttachments.pdfs
const maxVideo = maxAttachments.videos

const maxSizes = configs.default.attachments.maxSize
const maxImageSize = maxSizes.images
const maxPdfSize = maxSizes.pdfs
const maxVideoSize = maxSizes.videos

const multipartSize = (maxImage * maxImageSize) + (maxPdf * maxPdfSize) + (maxVideo * maxVideoSize)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathAttachement = attachmentsDir + filePathExtented

    let uploadPath = path.join(__dirname, pathAttachement);

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
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, Date.now() + "-" + file.originalname);
  }
});

function filter(req: any, file: any, cb: any) {
  const imageRgx = /jpeg|jpg|png/;
  const pdfRgx = /pdf/;
  const videoRgx = /mp4|webm|ogg/;

  const overhead = 300;  // add request has additional bytes
  const mimetype: string = file.mimetype;
  const fileSize = parseInt(req.headers["content-length"]) - overhead;

  if( fileSize > multipartSize ) {
    cb(
      "Total Files upload size exceed, following details should be follow: image-5mb, pdf-20mb, and video-100mb"
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

const upload = multer({
  storage: storage,
  fileFilter: filter
});

const uploadFields = upload.fields([
  { name: "image", maxCount: maxImage },
  { name: "pdf", maxCount: maxPdf },
  { name: "video", maxCount: maxVideo }
]);

interface GetUserRequest extends express.Request {
  user?: string;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

function prepareRequestBody (req: express.Request, res: express.Response, next: express.NextFunction) {
  // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  // need to store databese
  const millis =  "1721566150920" // DateTime.now().toMillis();
  const uuid =  "c3625b7f-b73d-49ca-bc0d-6596964a7be5"  // uuidv4()
  
  filePathExtented = `/2024-2025/CCIS/${millis}/${uuid}`

  const fileStored = attachmentsDir + filePathExtented


  for (let category of ["/images", "/pdfs", "/videos"]) {
    const loc =  path.join(__dirname, fileStored, category);
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

  console.log("image", maxImage, maxImageSize)
  console.log("pdf", maxPdf, maxPdfSize)
  console.log("video", maxVideo, maxVideoSize)
  next();
}

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

function geturlFile() {
  const uploadPath = path.join(__dirname, "upload");
  const pdfPath = fs.readdirSync(path.join(uploadPath, "pdfs"));

  const pdfObj: any = {};

  for (let pdf of pdfPath) {
    pdfObj["url"] = "/upload/pdfs/" + `${pdf}`;
  }

  console.log(pdfObj);
}



app.use("/attachments", express.static(path.join(__dirname, "attachments")));

app.get("/getUrls", function (req, res) {
  geturlFile();
});

app.post("/file-upload", verifyClient, prepareRequestBody, handleFileUpload);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(3501, "0.0.0.0", () => {
  console.log("server is running");
});
