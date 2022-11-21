const projects = [];

//Register Endpoints
export function registerGitLabMock(app) {
  app.get("/mocks/gitlab/tickets", (req, res) => {
    res.send(projects);
  });
  //Get a single ticket
  app.get("/mocks/gitlab/tickets/:ticketID", (req, res) => {
    try {
      const ticket = tickets.filter(
        (ticket) => ticket.ticketID === req.params.ticketID
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
