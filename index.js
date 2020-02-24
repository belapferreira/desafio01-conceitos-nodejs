const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

// Middleware contagem de requisições

function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

// Middleware verificação da existência do projeto

function checkProjectExists(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({ error: "Project id is required" });
  }

  return next();
};

// Criação de projeto

server.post('/projects', (req, res) =>{
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

// Lista todos os projetos

server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Edição de projeto

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id == id);

  project.title = title

  return res.json(project);
});

// Exclusão de projeto

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(proj => proj.id == id);
  
  projects.splice(projectIndex, 1);
  
  return res.send();
});

// Criação de tarefa no projeto

server.post('/projects/:id', checkProjectExists, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
