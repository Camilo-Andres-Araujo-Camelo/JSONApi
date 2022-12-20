const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { json } = require('express');

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./files/toDo.json');

app.get('/tasks', async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf8');
    res.send(jsonFile);
})

app.post('/tasks', async (req, res) => {
    const toDo = req.body;
    const toDosArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const lastIndex = toDosArray.length - 1;
    const newId = toDosArray[lastIndex].id + 1;
    toDosArray.push({...toDo, id: newId});
    toDosArray[lastIndex].id + 1;
    await fs.writeFile(jsonPath, JSON.stringify(toDosArray));
    console.log(toDosArray)
    res.end()
})


app.put('/tasks', async (req, res) => {
    const toDosArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const { id, status } = req.body;
    const toDoIndex = toDosArray.findIndex(toDo => toDo.id === id);
    if(toDoIndex >= 0){
        toDosArray[toDoIndex].status = status;
    }
    await fs.writeFile(jsonPath, JSON.stringify(toDosArray));
    res.send(`ToDo con id:${id} actualizado`)   
})

app.delete('/tasks', async (req, res) => {
    const toDosArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const { id } = req.body;
    const toDoIndex = toDosArray.findIndex(toDo => toDo.id === id);
    toDosArray.splice(toDoIndex, 1)
    await fs.writeFile(jsonPath, JSON.stringify(toDosArray));
    res.send(`ToDo con id:${id} eliminado`)   
})

const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})