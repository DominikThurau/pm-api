const tickets = [
  {
    ticketID: "244346",
    projectID: "951",
    title: "Test Ticket",
    description: "This is a test ticket",
    status: "open",
    progress: 0,
    type: "bug",
    category: "frontend",
    priority: "normal",
    type: "bug",
    assignee: "Dominik Thurau",
    spectators: ["Dominik Thurau", "Max Mustermann"],
    visibility: "clients and team",
    creator: "Testi McTest",
    created: "2021-03-01",
    updated: "2021-03-01",
    comments: [
      {
        author: "Max Mustermann",
        id: 1,
        message:
          "Guten Tag, ich habe eine Anfrage bezüglich eines neuen Features. Wir hätten gerne, dass [...]",
      },
      {
        author: "Dominik Thurau",
        id: 2,
        message:
          "Guten Tag herr Mustermann, wir werden uns umgehend mit ihrer Anfrage beschäftigen und uns bei ihnen melden.",
      },
      {
        author: "Max Mustermann",
        id: 3,
        message:
          "Vielen Dank herr Thurau, ich freue mich auf eine baldige Rückmeldung.",
      },
    ],
  },
];

//Register Endpoints
export function registerCogoMock(app) {
  //Get all tickets
  app.get("/api/mocks/cogo/tickets", (req, res) => {
    res.send(tickets);
  });
  //Get ticket by ID
  app.get("/api/mocks/cogo/projects/:projectID/tickets", (req, res) => {
    try {
      console.log(req.params.projectID);
      const projectTickets = tickets.filter(
        (ticket) => ticket.projectID == req.params.projectID
      );
      //console.log(projectTickets);
      if (projectTickets.length > 0) {
        res.send(projectTickets);
      } else {
        res.status(404).send("Project not found");
      }
      //res.send(projectJobs);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //Get a single ticket
  app.get("/api/mocks/cogo/tickets/:ticketID", (req, res) => {
    try {
      const ticket = tickets.filter(
        (ticket) => ticket.ticketID == req.params.ticketID
      )[0];
      if (ticket) {
        res.send(ticket);
      } else {
        res.status(404).send("ticket not found");
      }
      res.send(ticket);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}
