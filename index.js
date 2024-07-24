const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const readDB = () => {
    const data = fs.readFileSync('db.json', 'utf8');
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
};

app.get('/todos',(req,res) => {
    const db = readDB();
    res.json(db.todos);
});

app.post('/todos',(req, res) => {
    const db = readDB();
    const newTodo = {
        id: db.todos.length ? db.todos[db.todos.length - 1].id + 1 : 1,
        title: req.body.title,
        status: false
    };
    db.todos.push(newTodo);
    writeDB(db);
    res.status(201).json(newTodo);
});

app.put('/todos/updateStatus', (req, res) => {
    const db = readDB();
    db.todos = db.todos.map(todo => {
        if(todo.id % 2 === 0 && !todo.status) {
            todo.status = true;
        }
        return todo;
    });
    writeDB(db);
    res.json(db.todos);
});

app.delete('/todos',(req, res) => {
    let db = readDB();
    db.todos = db.todos.filter(todo => !todo.status);
    writeDB(db);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
