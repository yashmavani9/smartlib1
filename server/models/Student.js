import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  roll_no: { type: String, required: true, unique: true },
  name: String,
  registered: { type: Boolean, default: true },
});

export default mongoose.model("Student", studentSchema);
