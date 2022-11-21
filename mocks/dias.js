const jobs = [
  {
    jobID: "123",
    projectID: "951",
    title: "Test Job",
    usedBudgetInHours: 10.0,
    budgetInHours: 14.0,
    entries: [
      {
        from: " 2021-03-01 08:00:00",
        till: "2021-03-01 12:00:00",
        hoursWorked: "4",
        activity: null,
        ticketSystem: "COGO",
        ticketID: 244346,
        description: "Umsetzung des neuen Features",
        employee: "Dominik Thurau",
      },
      {
        from: " 2021-03-02 08:00:00",
        till: "2021-03-02 12:00:00",
        hoursWorked: "4",
        activity: 0,
        ticketSystem: "COGO",
        ticketID: 244346,
        description: "Umsetzung des neuen Features",
        employee: "Dominik Thurau",
      },
      {
        from: " 2021-03-03 08:00:00",
        till: "2021-03-03 12:00:00",
        hoursWorked: "4",
        activity: 0,
        ticketSystem: "COGO",
        ticketID: 244346,
        description: "Umsetzung des neuen Features",
        employee: "Dominik Thurau",
      },
    ],
  },
  {
    jobID: "123",
    projectID: "951",
    title: "Test Job",
    usedBudgetInHours: 12.0,
    budgetInHours: 16.0,
    entries: [
      {
        from: " 2021-03-01 08:00:00",
        till: "2021-03-01 12:00:00",
        hoursWorked: "4",
        activity: 0,
        ticketSystem: "COGO",
        ticketID: 244346,
        description: "Umsetzung des neuen Features",
        employee: "Dominik Thurau",
      },
      {
        from: " 2021-03-02 08:00:00",
        till: "2021-03-02 12:00:00",
        hoursWorked: "4",
        activity: 0,
        ticketSystem: "COGO",
        ticketID: 244346,
        description: "Umsetzung des neuen Features",
        employee: "Dominik Thurau",
      },
      {
        from: " 2021-03-03 08:00:00",
        till: "2021-03-03 12:00:00",
        hoursWorked: "4",
        activity: 0,
        ticketSystem: "COGO",
        ticketID: 244346,
        description: "Umsetzung des neuen Features",
        employee: "Dominik Thurau",
      },
    ],
  },
];

//Register Endpoints
export function registerDiasMock(app) {
  //Get all jobs
  app.get("/mocks/dias/jobs", (req, res) => {
    res.send(jobs);
  });
  //Get a single job
  app.get("/mocks/dias/jobs/:jobID", (req, res) => {
    try {
      const job = jobs.filter((job) => job.jobID === req.params.jobID)[0];
      if (job) {
        res.send(job);
      } else {
        res.status(404).send("Job not found");
      }
      res.send(job);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  //Get all jobs for a project
  app.get("/mocks/dias/projects/:projectID/jobs", (req, res) => {
    try {
      const projectJobs = jobs.filter(
        (job) => job.projectID === req.params.projectID
      );
      if (projectJobs.length > 0) {
        res.send(projectJobs);
      } else {
        res.status(404).send("Project not found");
      }
      //res.send(projectJobs);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}
