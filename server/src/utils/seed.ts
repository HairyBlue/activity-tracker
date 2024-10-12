import { connection } from "../db/dbcon";
import { r_uuid, uuid } from "../helpers/svcfunc";

type Club = {
  name: string;
  acronym: string;
};


export const categories = [
  "ORGANIZATIONAL MANAGEMENT DEVELOPMENT",
  "SPIRITUAL RELIGIOUS FORMATION",
  "KNOWLEDGE AND SKILLS DEVELOPMENT",
  "COMMUNITY ENGAGEMENT AND SOCIAL ADVOCACY",
  "CAPACITY AND TEAM BUILDING",
  "RESEARCH AND PROJECT INITIATIVES",
];

export const clubs: Club[] = [
  {
    name: "Association of Computer Studies Students",
    acronym: "ACSS",
  },
  {
    name: "Association of Liberal Arts Students",
    acronym: "ALAS",
  },
  {
    name: "Association of Marketing Management Students",
    acronym: "AMMS",
  },
  {
    name: "Association of Student Assistants",
    acronym: "ASA",
  },
  {
    name: "College of Accountancy, Business and Entrepreneurship",
    acronym: "CABE",
  },
  {
    name: "College of Computing and Information Sciences",
    acronym: "CCIS",
  },
  {
    name: "College of Education, Arts and Sciences",
    acronym: "CEDAS",
  },
  {
    name: "College of Health Sciences",
    acronym: "CHS",
  },
  {
    name: "College of Special Programs",
    acronym: "CSP",
  },
  {
    name: "College of Special Programs Student Government",
    acronym: "CSPSG",
  },
  {
    name: "College Student Government",
    acronym: "CSG",
  },
  {
    name: "Crime Buster Club",
    acronym: "CBC",
  },
  {
    name: "Innovators",
    acronym: "",
  },
  {
    name: "Junior Association of Hospitality Management",
    acronym: "JAHM",
  },
  {
    name: "Junior Executives of Business Administration",
    acronym: "JEBA",
  },
  {
    name: "Junior Financial Executives",
    acronym: "JFINEX-Regular College",
  },
  {
    name: "Junior Financial Executives",
    acronym: "JFINEX-CSP",
  },
  {
    name: "Junior Philippine Association of Management Accountants",
    acronym: "JPAMA",
  },
  {
    name: "Junior Philippine Institute of Civil Engineers",
    acronym: "JPICE",
  },
  {
    name: "Junior Philippine Institute of Accountants",
    acronym: "JPIA",
  },
  {
    name: "Junior People Management Association of the Philippines",
    acronym: "JPMAP-Regular College",
  },
  {
    name: "Junior People Management Association of the Philippines",
    acronym: "JPMAP-CSP",
  },
  {
    name: "Kapisanan ng mga Mag-aaral sa Filipino",
    acronym: "KAMAFIL-Regular College",
  },
  {
    name: "Kapisanan ng mga Mag-aaral sa Filipino",
    acronym: "KAMAFIL-Socialize",
  },
  {
    name: "League of Science Majors",
    acronym: "LESCIEM",
  },
  {
    name: "Math Club",
    acronym: "",
  },
  {
    name: "Organization of Physical Education Major",
    acronym: "OPEM-Regular",
  },
  {
    name: "Organization of Physical Education Major",
    acronym: "OPEM-Socialize",
  },
  {
    name: "Peer Facilitators’ Club",
    acronym: "PFC",
  },
  {
    name: "Philippine Nursing Student Association",
    acronym: "PNSA",
  },
  {
    name: "Red Cross Youth",
    acronym: "RCY",
  },
  {
    name: "Student Association of Radiologic Technology",
    acronym: "START",
  },
  {
    name: "Society of Elementary Education Students",
    acronym: "SEEDS",
  },
  {
    name: "Society of English Majors",
    acronym: "SEM-Regular College",
  },
  {
    name: "Society of English Majors",
    acronym: "SEM-CSP",
  },
  {
    name: "Society of Junior Psychologists",
    acronym: "SJP",
  },
  {
    name: "Society of Math Majors",
    acronym: "SOMAMA",
  },
  {
    name: "TerpsiCORean Performing Group",
    acronym: "",
  },
  {
    name: "Vocation Club/Hummingbirds/Lectors",
    acronym: "",
  },
  {
    name: "Young Information Specialist",
    acronym: "YIS",
  },
  {
    name: "Youth for Christ",
    acronym: "YFC",
  },
];

export const schoolYears = [
  "2000-2001",
  "2001-2002",
  "2002-2003",
  "2003-2004",
  "2004-2005",
  "2005-2006",
  "2006-2007",
  "2007-2008",
  "2008-2009",
  "2009-2010",
  "2010-2011",
  "2011-2012",
  "2012-2013",
  "2013-2014",
  "2014-2015",
  "2015-2016",
  "2016-2017",
  "2017-2018",
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
  "2028-2029",
  "2029-2030",
  "2030-2031",
  "2031-2032",
  "2032-2033",
  "2033-2034",
  "2034-2035",
  "2035-2036",
  "2036-2037",
  "2037-2038",
  "2038-2039",
  "2039-2040",
  "2040-2041",
  "2041-2042",
  "2042-2043",
  "2043-2044",
  "2044-2045",
  "2045-2046",
  "2046-2047",
  "2047-2048",
  "2048-2049",
  "2049-2050"
]

async function seedCategory() {
  try {
    for (let category of categories) {
      (await connection).query(`INSERT INTO Category (category_uuid, categoryName) value ('${uuid.v4()}', '${category}')`);
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Seed Category Success");
    // (await connection).end();
  }
}

async function seedClub() {
  try {
    for (let club of clubs) {
      (await connection).query(`INSERT INTO Club (club_uuid, clubName, clubAcronym) values ('${uuid.v4()}', '${club.name}', '${club.acronym}')`);
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Seed Club Success");
  //  (await connection).end();
  }
}

async function seedSchoolYear() {
  try {
    for (let schoolYear of schoolYears) {
      const splitYear = schoolYear.trim().split("-");
      (await connection).query(`INSERT INTO SchoolYear (school_year_uuid, yearStart, yearEnd) values ('${uuid.v4()}', '${splitYear[0]}', '${splitYear[1]}')`);
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Seed School Year Success");
    // (await connection).end();
  }
}

async function doSeed() {
  try {
    await seedCategory();
    await seedClub();
    await seedSchoolYear();
  } finally {
    if (connection) {
      (await connection).end();
    }
  }
}

doSeed()
// async function endCon(){
//   (await connection).end();
// }

// setTimeout(() => {
//   endCon()
// }, 300)
