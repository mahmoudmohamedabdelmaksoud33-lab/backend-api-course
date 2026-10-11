const fs = require("fs");
const EventEmitter = require("events");

const fileEmitter = new EventEmitter();

let file1Data = null;
let file2Data = null;

fileEmitter.on("filesReady", (data1, data2) => {
  const combinedContent = `\({data1}\n\){data2}`;

  fs.writeFile("combined.txt", combinedContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Files merged successfully into combined.txt");
  });
});

function checkCompletion() {
  if (file1Data !== null && file2Data !== null) {
    fileEmitter.emit("filesReady", file1Data, file2Data);
  }
}

fs.readFile("file1.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file1.txt:", err);
    return;
  }
  file1Data = data;
  checkCompletion();
});

fs.readFile("file2.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file2.txt:", err);
    return;
  }
  file2Data = data;
  checkCompletion();
});
