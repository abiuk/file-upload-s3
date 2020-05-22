require("dotenv/config");

const express = require("express");
const AWS = require("aws-sdk");
var fileUpload = require("express-fileupload");
const app = express();

app.use(fileUpload());

const MAX_FILE_SIZE = 4 * 1000 * 1000;

const port = process.env.PORT || 3000;
app.use("/", express.static(__dirname + "/public"));

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

app.post("/upload", (req, res) => {
  if (req.files.file.size > MAX_FILE_SIZE) {
    console.log("should go validation");
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.files.file.name,
    Body: req.files.file.data,
    ACL: "public-read",
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send(data);
  });
});

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`listen port ${port}`);
});
