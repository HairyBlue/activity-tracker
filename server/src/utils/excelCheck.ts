import * as path from "path";
import * as xlxs from "xlsx";
import { DateTime } from "luxon";

//! Check excel format for processing if invalid
function checkFormat(workBook: any) {
  //* check has title or club full name in column A row 1
  //* check if 2nd row is empty
  //* check row 3 for category name
  //* check category name in Column B - G in row 3
  let isValidData = true;
  let sheet = "";
  try {
    workBook.SheetNames.forEach((sheetName: any, idx: number) => {
      sheet = sheetName;
      const worksheet = workBook.Sheets[sheetName];
      const data: any = xlxs.utils.sheet_to_json(worksheet, { header: 1 });

      const title = typeof data[0][0] == "string";
      const nextTwoRow = data[1][0] == undefined;
      const category = function checkCat() {
        let isValid = false;
        data[2].forEach((el: any, idx: number) => {
          if (idx == 0 && el !== undefined) return;
          if (el == undefined) return;
          isValid = true;
        });
        return isValid;
      };

      if (!(title && nextTwoRow && category())) {
        return { valid: false, sheet: sheet };
      }
    });
    return { valid: true, sheet: sheet };
  } catch (e) {
    console.log(e);
    console.log("Error on: " + sheet);
  }
}

// TODO: NEED TO ADD TO CLEAN DATA and add to Test Date
function formatDate(date: any) {
  const parsedDate = DateTime.fromJSDate(date);
  try {
    if (parsedDate.toISO()) {
      // Format the parsed date to the desired format (29-Sep-23)
      const formattedDate = parsedDate.toFormat("dd-MMM-yy");
      // console.log(formattedDate);
      // console.log({ startDate: parsedDate.toISODate(), endDate: parsedDate.toISODate() });
    }

    if (parsedDate.toISO() == null) {
      const [monthRange, year] = date.split(",").map((part: any) => part.trim());
      // // Check if the month range contains a specific date range (e.g., "7-15")
      const dateRangeMatch = monthRange.match(/(\d+)-(\d+)/);
      if (dateRangeMatch) {
        const [_, startDay, endDay] = dateRangeMatch;
        const startISO = DateTime.fromFormat(`${monthRange.split(" ")[0]} ${startDay} ${year}`, "MMMM d yyyy").toISODate();
        const endISO = DateTime.fromFormat(`${monthRange.split(" ")[0]} ${endDay} ${year}`, "MMMM d yyyy").toISODate();
        //   // return { startDate: startISO, endDate: endISO };
        // console.log({ startDate: startISO, endDate: endISO });
      } else {
        //   // Parse the start and end months to get their numerical representations
        const [month, year] = date.split(/\s+/);
        const [startMonth, endMonth] = month.split("-");

        const startISO = DateTime.fromFormat(`${startMonth} 1, ${year}`, "MMMM d, yyyy");
        const endISO = DateTime.fromFormat(`${endMonth} 1, ${year}`, "MMMM d, yyyy").endOf("month");

        console.log({ startDate: startISO.toISODate(), endDate: endISO.toISODate() });
      }
    }
  } catch (e) {
    console.log(e);
  }

  // return date;
}

function excelCleanUp(sheet: any, data: any) {
  // const clubsFull = data[0][0];
  // const clubArb = sheet;
  const categories = data[2].filter((category: any) => category !== undefined);
  const cleanData = {
    clubName: sheet,
    clubsFullName: data[0][0],
    activity: [] as any,
  };

  //* loop to data [[], []]
  data.forEach((el: any, i: number) => {
    //* skip first 3 rows
    if (i >= 3) {
      let obj = {
        date: null,
        eventName: null,
        category: null,
      };
      //* loop to data []
      for (let j = 0; j < el.length; j++) {
        if (j == 0) {
          obj.date = el[j];
          formatDate(el[j]);
        }
        if (typeof el[j] == "string") {
          obj.category = categories[j - 1];
          obj.eventName = el[j];
        }
      }
      cleanData.activity.push(obj);
    }
  });

  // console.log(cleanData);
}

function readExcel() {
  const filePath = path.join(__dirname, "utils", "sample.xlsx");
  const workBook = xlxs.readFile(filePath, { cellDates: true });

  let isValid = true;
  let sheet = "";
  try {
    const isValid = checkFormat(workBook);
    if (isValid?.valid) {
      workBook.SheetNames.forEach((sheetName, idx) => {
        const worksheet = workBook.Sheets[sheetName];
        const data: any = xlxs.utils.sheet_to_json(worksheet, { header: 1 });
        if (idx == 0) {
          excelCleanUp(sheetName, data);
        }
      });
    }
  } catch (e) {
    console.log(e);
    console.log("Error on: " + sheet);
  }
}

readExcel();
