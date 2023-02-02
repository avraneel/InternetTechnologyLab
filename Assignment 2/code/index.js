const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')
const zip = require('express-zip')
const archiver = require('archiver')
const admzip = require('adm-zip');
const ejs = require('ejs')

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/img',express.static('img'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/upload.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'))
})

app.get('/download.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'download.html'))
})

app.get('/view.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'view.html'))
});

// We specify where the file should be stored and in what format
const fileStorageEngine = multer.diskStorage({      // constructor requires an object
    destination: (req, file, cb) => {
        //console.log(txt)
        cb(null, './'+file.fieldname)   // where the file should be stored
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name + ".jpg") // what format
    }
});

const upload = multer({storage: fileStorageEngine});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

// Handling upload
app.post('/upload', upload.single('img'), (req, res) => {
    const txt = req.body.text;
    fs.writeFile('./text/'+req.body.name+'.txt', txt, err => {
        if(!err) {
            console.log('written')
        }
    })
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/view', upload.none(), (req, res) => {
    const text = fs.readFileSync(path.join(__dirname, '/text/' + req.query.name + '.txt'))
    const imglink = '/img/' + req.query.name + '.jpg'
    console.log(imglink);
    console.log(req);
    res.render('gallery', { name: req.query.name, text: text, imglink: imglink})
});

app.get('/download', upload.none(), (req,res) => {
    //res.download(path.join(__dirname, '/text/jon.txt'))
    const zip = new admzip();
    zip.addLocalFile(path.join(__dirname, '/img/', req.query.name + '.jpg')) 
    zip.addLocalFile(path.join(__dirname, '/text/', req.query.name + '.txt')) 
    zip.writeZip(__dirname + '/' + req.query.name + '.zip');
    res.download(__dirname + '/'+req.query.name +'.zip')
});
