import axios from "axios";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import { collection } from "../index.js";

//Post data to database
export function registerPOSTEndpoints({ app }) {
  app.post("/api/projects/create", async (req, res) => {
    try {
      const project = new Project(req.body);
      project.save();
      res.status(200).send("Data succesfully written to database");
    } catch (error) {
      res.status(500).send("An error happened");
    }
  });
}

//Update data in database
export function registerPUTEndpoints({ app }) {
  app.put("/api/projects/:projectID/edit", async (req, res) => {
    try {
      console.log(req.body);
      //Check if id is valid
      if (mongoose.isValidObjectId(req.params.projectID)) {
        //Check if project exists
        const project = await Project.findById(req.params.projectID);
        if (project) {
          //Update project
          await Project.findByIdAndUpdate(req.params.projectID, req.body);
          res.status(200).send("Project updated");
        } else {
          res.status(404).send("Project not found");
        }
      } else {
        res.status(400).send("No valid id");
      }
    } catch (error) {
      res.status(500).send("An error happened");
    }
  });
}

export function registerGETEndpoints({ app }) {
  //Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      console.log("Loading projects from database");
      const projects = await Project.find({});
      res.send(projects);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Get a single project
  app.get("/api/projects/:projectID", async (req, res) => {
    try {
      //Check if id is valid
      if (mongoose.isValidObjectId(req.params.projectID)) {
        //Check if project exists
        const project = await Project.findById(req.params.projectID);
        if (project) {
          res.send(project);
          console.log("Loading project from database");
        } else {
          res.status(404).send("Project not found");
        }
      } else {
        res.status(400).send("No valid id");
      }
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  });

  //Endpoints for PM-Dashboard
  //Get all members of a project
  app.get("/api/projects/:projectID/members", async (req, res) => {
    try {
      //Check if id is valid
      if (mongoose.isValidObjectId(req.params.projectID)) {
        //check authorization
        //Check if project exists
        let personalAccessToken = req.header("PRIVATE-TOKEN");
        console.log(personalAccessToken);
        const project = await Project.findById(req.params.projectID);
        if (project) {
          console.log("Loading members from database");
          await axios
            .get(
              "http://localhost:4000/api/mocks/gitlab/projects/" +
                project.projectID_GitLab +
                "/members",
              {
                headers: {
                  "PRIVATE-TOKEN": personalAccessToken,
                },
              }
            )
            .then((response) => {
              //Cleaning up the Data
              let shortenedData = [];
              response.data.forEach((element) => {
                const { id, name, username, avatar_url } = element;
                shortenedData.push({ id, name, username, avatar_url });
              });
              res.send(shortenedData);
            });
        } else {
          res.status(404).send("Project not found");
        }
      }
    } catch (error) {
      //console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Get budget in percent
  app.get("/api/projects/:projectID/budget", async (req, res) => {
    try {
      //Check if id is valid
      if (mongoose.isValidObjectId(req.params.projectID)) {
        //Check if project exists
        const project = await Project.findById(req.params.projectID);
        if (project) {
          console.log("Loading budget from database");
          await axios
            .get(
              "http://localhost:4000/mocks/dias/projects/" +
                project.projectID_DIAS +
                "/jobs"
            )
            .then((response) => {
              //Cleaning up the Data
              let usedJobBudgetInHours = 0;
              let jobBudgetInHours = 0;
              let percentageUsed;
              response.data.forEach((job) => {
                usedJobBudgetInHours += job.usedBudgetInHours;
                jobBudgetInHours += job.budgetInHours;
              });
              percentageUsed = (usedJobBudgetInHours / jobBudgetInHours) * 100;

              res.send({
                usedJobBudgetInHours,
                jobBudgetInHours,
                percentageUsed,
              });
            });
        } else {
          res.status(404).send("Project not found");
        }
      } else {
        res.status(400).send("No valid id");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Get time in percent
  app.get("/api/projects/:projectID/time", async (req, res) => {
    try {
      //Check if id is valid
      if (mongoose.isValidObjectId(req.params.projectID)) {
        //Check if project exists
        const project = await Project.findById(req.params.projectID);
        if (project) {
          //Cleaning up the Data
          let startDate = new Date(project.startDate);
          let currentDate = new Date();
          let releaseDate = new Date(project.releaseDate);
          let daysUsed = Math.round(
            (currentDate.getTime() - startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          let daysTotal = Math.round(
            (releaseDate.getTime() - startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          let daysLeft = daysTotal - daysUsed;
          let percentageUsed = (daysUsed / daysTotal) * 100;

          res.send({
            daysTotal,
            daysUsed,
            daysLeft,
            percentageUsed,
          });
        } else {
          res.status(404).send("Project not found");
        }
      } else {
        res.status(400).send("No valid ID");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Get open tickets
  app.get("/api/projects/:projectID/tickets", async (req, res) => {
    try {
      //Check if id is valid
      if (mongoose.isValidObjectId(req.params.projectID)) {
        //Check if project exists
        const project = await Project.findById(req.params.projectID);
        if (project) {
          console.log("Loading tickets from database");
          await axios
            .get(
              "http://localhost:4000/api/mocks/cogo/projects/" +
                project.projectID_COGO +
                "/tickets"
            )
            .then((tickets) => {
              //Cleaning up the Data
              console.log(tickets.data);
              let openTickets = [];
              tickets.data.forEach((ticket) => {
                if (ticket.status === "open") {
                  openTickets.push(ticket);
                }
              });
              res.send(openTickets);
            });
        } else {
          res.status(404).send("Project not found");
        }
      } else {
        res.status(400).send("No valid ID");
      }
    } catch (error) {
      //console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
}

export function registerDELETEEndpoints({ app }) {
  //Delete a project
  app.delete("/api/projects/:projectID", async (req, res) => {
    try {
      console.log("Delete Project");
      //Check if id is valid
      if (mongoose.isValidObjectId(req.params.projectID)) {
        //Check if project exists
        const project = await Project.findById(req.params.projectID);
        if (project) {
          //Delete project from database
          await Project.findByIdAndDelete(req.params.projectID);
          res.send("Project deleted");
        } else {
          res.status(404).send("Project not found");
        }
      } else {
        res.status(400).send("No valid id");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
}
