import axios from "axios";

//Read Data from Database
export function registerCreateEndpoints(app) {
  app.get("/readData/collection", async (req, res) => {
    console.log("Endpoint called");
    console.log("Endpoint called without id");
    res.send({ test: "test" });
  });
}

export function registerReadEndpoints({ app, authKey }) {
  //Get all projects
  app.get("/projects", async (req, res) => {
    try {
      console.log("Endpoint called", req.header("PRIVATE-TOKEN"));
      await axios
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
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  //Get a single project
  app.get("/projects/:projectID", async (req, res) => {
    try {
      await axios
        .get(
          "https://gitlab.ueberbit.de/api/v4/projects/" +
            req.params.projectID +
            "/",
          {
            headers: {
              "PRIVATE-TOKEN": req.header("PRIVATE-TOKEN"),
            },
          }
        )
        .then((response) => {
          //Cleaning up the Data
          let shortenedData = {};
          const {
            id,
            name,
            description,
            name_with_namespace,
            path,
            web_url,
            avatar_url,
          } = response.data;

          shortenedData = {
            id,
            name,
            description,
            name_with_namespace,
            path,
            web_url,
            avatar_url,
          };

          res.send(shortenedData);
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

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
}
