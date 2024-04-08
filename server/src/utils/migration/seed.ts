import { connection } from "../../db/dbcon";

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

async function seedCategory() {
  try {
    for (let category of categories) {
      (await connection).query(`INSERT INTO Category (categoryName) value ('${category}')`);
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
      (await connection).query(`INSERT INTO Club (clubName, clubAcronym) values ('${club.name}', '${club.acronym}')`);
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Seed Club Success");
    (await connection).end();
  }
}

seedCategory()
seedClub()