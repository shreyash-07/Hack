import {Router} from "express";
import {User} from "../models/user.js";
import multer from "multer"
import {PdfDetails} from "../models/pdfDetails.js"


const router= Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
  
  const upload = multer({ storage: storage })



router.get("/signin", (req,res)=>{
    return res.render("signin");
})


//required password encryption,mongoDB connected
router.get("/signup", (req,res)=>{
    return res.render("signup");
})

router.get("/upload", (req,res)=>{
    return res.render("upload");
})



router.post("/signin",async (req,res)=>{
    const {email,password} = req.body;
    const token =await User.matchPasswordAndGenerateToken(email,password);

    console.log("Token ",token);
    return res.redirect("/");
})


router.post("/signup", async (req,res)=>{
    const {fullName,email,password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect("/");
})

router.post("/upload",upload.single("Pdf"), async (req,res)=>{
    console.log(req.file);
    const title=req.body.title;
    const fileName= req.file.filename;

    await PdfDetails.create({title:title, pdf:fileName});
    return res.redirect("/");
    })



export default router;