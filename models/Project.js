import mongoose from "mongoose";
const Schema = mongoose.Schema;
const projectSchema = new Schema({
  title: { type: Number, required: true }, // String is shorthand for {type: String}
  description: String,
  links: [Object],
  cache: Object,

});

const Project = mongoose.model("Project", projectSchema);
export default Project;
