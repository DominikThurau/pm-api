import axios from "axios";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import { collection } from "../index.js";

//Post data to database
export function registerPOSTEndpoints({ app }) {
  app.post("/projects/create", async (req, res) => {
    try {
      collection.insertOne(req.body);
      res.status(200).send("Data succesfully written to database");
    } catch (error) {
      res.status(500).send("An error happened");
    }
  });
}

//Update data in database
export function registerPUTEndpoints({ app }) {
  app.put("/projects/:projectID/edit", async (req, res) => {
    try {
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
  app.get("/projects", async (req, res) => {
    try {
      //console.log("Endpoint called", req.header("PRIVATE-TOKEN"));
      /*await axios
        .get("https://gitlab.ueberbit.de/api/v4/projects/", {
          headers: {
            "PRIVATE-TOKEN": req.header("PRIVATE-TOKEN"),
          },
        })
        .then((response) => {
          //Cleaning up the Data
          let shortenedData = [];
          response.data.forEach((element) => {
            const {
              id,
              name,
              description,
              name_with_namespace,
              path,
              web_url,
              avatar_url,
            } = element;
            shortenedData.push({
              id,
              name,
              description,
              name_with_namespace,
              path,
              web_url,
              avatar_url,
            });
          });
          res.send(shortenedData);
        });*/
      const projects = await collection.find({}).toArray();
      res.send(projects);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Get a single project
  app.get("/projects/:projectID", async (req, res) => {
    try {
      console.log(
        req.params.projectID,
        mongoose.isValidObjectId(req.params.projectID)
      );
      if (mongoose.isValidObjectId(req.params.projectID)) {
        const project = await Project.findById(req.params.projectID);
        console.log(project);
        if (project) {
          res.send(project);
        } else {
          res.status(404).send("Project not found");
        }
      } else {
        res.status(400).send("Bad request: invalid ID");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Endpoints for PM-Dashboard
  //Get all members of a project
  app.get("/projects/:projectID/members", async (req, res) => {
    try {
      await axios
        .get(
          "https://gitlab.ueberbit.de/api/v4/projects/" +
            req.params.projectID +
            "/members/all",
          {
            headers: {
              "PRIVATE-TOKEN": req.header("PRIVATE-TOKEN"),
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
    } catch (error) {
      //console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Get budget in percent
  app.get("/projects/:projectID/budget", async (req, res) => {
    try {
      console.log("Endpoint called");
      let project;
      console.log(req.params.projectID);
      if (mongoose.isValidObjectId(req.params.projectID)) {
        project = await Project.findById(req.params.projectID);
      }
      if (project) {
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
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Get open tickets
  app.get("/projects/:projectID/tickets", async (req, res) => {
    try {
      console.log("Endpoint called");
      let project;
      console.log(req.params.projectID);
      if (mongoose.isValidObjectId(req.params.projectID)) {
        project = await Project.findById(req.params.projectID);
      } else {
        res.status(400).send("Bad request: invalid ID");
      }
      if (project) {
        await axios
          .get(
            "http://localhost:4000/mocks/cogo/projects/" +
              project.projectID_COGO
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
    } catch (error) {
      //console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
}
