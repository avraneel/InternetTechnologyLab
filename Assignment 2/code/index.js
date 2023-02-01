const express = require('express');
const multer = require('multer');
const app = express();
const port = 8000;

//app.use(express.urlencoded)

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});

// We specify where the file should be stored and in what format
const fileStorageEngine = multer.diskStorage({      // constructor requires an object
    destination: (req, file, cb) => {
        cb(null, './img')   // where the file should be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + "_" + Date.now() + ".jpg") // what format
    }
});

const upload = multer({storage: fileStorageEngine});

app.get('/', (req, res) => {
    res.send("Welcome to server");
});

app.post('/', upload.single('img'), (req, res) => {
    console.log(req.body.img)
    res.send('POST request to homepage');   
});

