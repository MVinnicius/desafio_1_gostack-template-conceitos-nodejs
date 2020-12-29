const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.send(repositories);

});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = {
    id: uuidv4(),
    title:  title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);

  return response.send(repository);

});

function repositoryExist(request, response, next) {
  
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id );

  if (index < 0 ) {
    return response.status(400).json({ error : "Repository not found" });
  }

  return next();
}

app.use("/repositories/:id", repositoryExist);

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex(repo => repo.id === id );

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  return response.json(repositories[index]);

});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id );

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id );

  repositories[index].likes++;

  return response.json(repositories[index]);

});

module.exports = app;
