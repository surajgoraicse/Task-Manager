import mongoose , {Schema, model} from "mongoose";



const subjectSchema = new Schema({
    name: {
        type: String,
        required: [true , "Subject name is required"],
        
    }
})