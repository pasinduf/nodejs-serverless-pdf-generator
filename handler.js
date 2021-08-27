let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");

export const createReport = (event, context, callback) => {
  const record = event.body;
  var status = asyncCall(record);
  console.log(status);
  const result = {
    status: status,
    url: status ? `http://localhost:3001/reports/${fileName(record.date)}.pdf` : ''
  };
  //create a response
  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  callback(null, response);
};

function asyncCall(record) {
  let result = true;
  try {
    ejs.renderFile(path.join(__dirname, './templates/', "report.ejs"), { record: record }, (err, data) => {
      if (err) {
        console.log('error', err);
        result = false;
      } else {
        pdf.create(data).toFile(path.join(process.cwd(), 'public', 'reports', `${fileName(record.date)}.pdf`), function (err, data) {
          if (err) {
            console.log('error', err);
            result = false;
          }
        });
      }
    });
    return result;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

const fileName = function (dateValue) {
  var date = new Date(dateValue);
  var mm = date.getMonth() + 1;
  var dd = date.getDate();
  return [date.getFullYear(),
  (mm > 9 ? '' : '0') + mm,
  (dd > 9 ? '' : '0') + dd
  ].join('');
};