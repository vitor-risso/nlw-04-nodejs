import express from 'express';

const app = express();

app.get('/', (req, res)=> res.status(200).send({message: "HI"}))
app.post('/', ()=> console.log('Dados salvos'))

app.listen(8080, () =>  console.log('Server is running on port 8080'))
