const express = require('express');
const server = express();

server.use(express.json());
server.listen(3000);

const projects = [];
var contRequests = 0;

server.use((req, res, next) => {
    next();
    console.log(`Number of requests: ${contRequests++}`);
});

function verifyId (req, res, next) {
    if (projects.findIndex(project => project.id === req.params.id) === -1) {
        return res.status(400).json({error: `There is no project with id ${req.params.id}!`});
    }
    return next();
}

server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    projects.push({"id": id, "title": title, "tasks": []});
    return res.json(projects);
});

server.post('/projects/:id/tasks', verifyId, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const projectIndex = projects.findIndex(project => project.id === id);

    projects[projectIndex].tasks.push({"title": title});
    return res.json(projects[projectIndex]);
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', verifyId, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    const projectIndex = projects.findIndex(project => project.id === id);
    projects[projectIndex].title = title;
    return res.json(projects[projectIndex]);
});

server.delete('/projects/:id', verifyId, (req, res) => {
    const { id } = req.params;
    const projectIndex = projects.findIndex(project => project.id === id);
    projects.splice(projectIndex, 1);
    return res.send();
});

