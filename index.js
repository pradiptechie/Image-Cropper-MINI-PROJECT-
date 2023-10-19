const express = require('express');
const sharp = require('sharp');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "hbs");

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req,res)=>{
  res.render("imgcropper")
})

app.post("/", upload.single('image'), (req,res)=>{
  const left = Number(req.body.left);
  const top = Number(req.body.top);
  const width = Number(req.body.width);
  const height = Number(req.body.height);
  // console.log(left);
  // console.log(top);
  // console.log(height);
  // console.log(width);

  const imageBuffer =  req.file.buffer;

  // Process and crop the image using Sharp
  sharp(imageBuffer)
    .extract({ left, top, width, height })
    .png()
    .toBuffer()
    .then((output) => {
      const imageBase64 = output.toString('base64');
      const dataUrl = `data:image/png;base64,${imageBase64}`;
      res.send(dataUrl);
    })
    .catch((err)=>{
      res.status(500).send('Image Processing error');
    })
    // .toFile('out.jpg', (err,data)=>{
    //   if(err){
    //         console.log(err)
    //     }else{
    //           console.log("Resized succesfully");
    //       }
    //   })
})


app.listen((port), ()=>{
  console.log(`Server is runnig on ${port}`);
  });