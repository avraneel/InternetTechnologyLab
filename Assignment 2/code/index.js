const express = require('express');
const multer = require('multer');
const app = express();
const port = 8000;

//app.use(express.urlencoded)

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './img')
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + "_" + Date.now() + ".jpg")
    }
});

const upload = multer({storage: fileStorageEngine});

app.get('/', (req, res) => {
    res.send("Welcome to server");
});

app.post('/', upload.single('img'), (req, res) => {
    console.log(req.body)
    res.send('POST request to homepage');   
});

