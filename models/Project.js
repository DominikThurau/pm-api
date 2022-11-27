import mongoose from "mongoose";
const Schema = mongoose.Schema;
const projectSchema = new Schema({
  projectID_GitLab: { type: Number, required: true },
  projectID_COGO: { type: Number, required: true },
  projectID_DIAS: { type: Number, required: true },
  title: { type: String, required: true },
  client: String,
  description: String,
  links: [{ linkTitle: String, linkURL: String }],
  startDate: Date,
  releaseDate: Date,
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
