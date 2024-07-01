import mongoose,{Schema} from 'mongoose';


const pdfSchema= new mongoose.Schema({
    pdf:String,
    title:String
},{timestamps:true},{collection:"PdfDetailsCollection"})

export const PdfDetails = mongoose.model("PdfDetails",pdfSchema);