import * as express from "express";
import * as logging from "./logger";

interface GetUserRequest extends express.Request {
  user?: string;
}

const logger = logging.wichFileToLog("manage");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const categoryData = {
  key: "category",
  result: [
    {
      categoryId: 0,
      categoryName: "SampleCategory0",
    },
    {
      categoryId: 1,
      categoryName: "SampleCategory1",
    },
    {
      categoryId: 2,
      categoryName: "SampleCategory2",
    },
    {
      categoryId: 3,
      categoryName: "SampleCategory3",
    },
  ],
};

router.get("/category", function (req, res) {
  res.json(categoryData);
});

router.post("/category", function (req, res) {
  const user = (req as GetUserRequest).user;

  const { categoryName } = req.body;
  if (categoryName === "") {
    logger.warn(`${user} is failed to post data in category`);
    res.status(400);
    return;
  }
  categoryData.result.push({
    categoryId: categoryData.result.length,
    categoryName: categoryName,
  });
  logger.info(`${user} is posting data in category`);
  res.json({ message: "success" });
});

router.put("/category", function (req, res) {
  const user = (req as GetUserRequest).user;
  const { categoryId, categoryName } = req.body;

  if (categoryId === null || categoryName === "") {
    logger.warn(`${user} is failed to update data in category`);
    res.status(400);
    return;
  }

  categoryData.result[categoryId].categoryName = categoryName;
  logger.info(`${user} is updating data in category`);
  res.json({ message: "success" });
});

const clubData = {
  key: "club",
  result: [
    {
      clubId: 0,
      clubName: "SampleClub0",
      clubAcronym: "SC0",
    },
    {
      clubId: 1,
      clubName: "SampleClub1",
      clubAcronym: "SC1",
    },
    {
      clubId: 2,
      clubName: "SampleClub2",
      clubAcronym: "SC2",
    },
    {
      clubId: 3,
      clubName: "SampleClub3",
      clubAcronym: "SC3",
    },
  ],
};

router.get("/club", function (req, res) {
  res.json(clubData);
});

router.post("/club", function (req, res) {
  const user = (req as GetUserRequest).user;
  const { clubName, clubAcronym } = req.body;
  if (clubName === "" || clubAcronym === "") {
    logger.warn(`${user} is failed to post data in club`);
    res.status(400);
    return;
  }
  clubData.result.push({
    clubId: clubData.result.length,
    clubName: clubName,
    clubAcronym: clubAcronym,
  });
  logger.info(`${user} is posting data in club`);
  res.json({ message: "success" });
});

router.put("/club", function (req, res) {
  const user = (req as GetUserRequest).user;
  const { clubId, clubName, clubAcronym } = req.body;
  if (clubId === null || clubName === "" || clubAcronym === "") {
    logger.warn(`${user} is failed to update data in club`);
    res.status(400);
    return;
  }
  clubData.result[clubId].clubName = clubName;
  clubData.result[clubId].clubAcronym = clubAcronym;
  logger.info(`${user} is updating data in club`);
  res.json({ message: "success" });
});

function yearGenerated() {
  let startYear = 2000;
  let endYear = 2050;
  let yearData: string[] = [];
  for (let i = startYear; i <= endYear; i++) {
    yearData.push(i.toString());
  }
  return yearData;
}
function targetActivityDummy() {
  let random = [];
  for (let i = 0; i < clubData.result.length; i++) {
    random.push(Math.floor(Math.random() * 21));
  }
  return random;
}
const targetActivityData = {
  key: "target-activity",
  formData: {
    clubs: clubData.result,
    years: yearGenerated(),
    // noOfActicities: targetActivityDummy(),
  },
  result: [],
};
router.get("/target-activity", function (req, res) {
  res.json(targetActivityData);
});
router.post("/target-activity", function (req, res) {
  const user = (req as GetUserRequest).user;
  logger.info(`${user} is positng data in target activity`);
  console.log(req.body);
  res.json({ message: "success" });
});
export { router };
