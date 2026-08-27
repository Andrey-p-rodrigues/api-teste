import express from 'express';

const app = express();
app.use(express.json());


let filmes = [
  { id: 1, titulo: 'Corra', genero: 'Terror' },
  { id: 2, titulo: 'Olhos que Condenam  ', genero: 'Drama' },
  { id: 3, titulo: 'Homem Aranha', genero: 'Ação' }
];

let clientes = [
  { id: 1, nome: 'Andrey', email: 'andrey@email.com' }
];


app.get('/filmes', (request, response) => {
  return response.json(filmes);
});


app.get('/filmes/genero', (request, response) => {
  const { nome } = request.query;

  if (!nome) {
    return response.status(400).json({ erro: ' Fale o gênero.' });
  }


  const filmesFiltrados = filmes.filter(f => f.genero.trim().toLowerCase() === nome.trim().toLowerCase());

  return response.json(filmesFiltrados);
});


app.post('/clientes', (request, response) => {
  const { nome, email } = request.body;

  if (!nome || !email) {
    return response.status(400).json({ erro: 'Nome e email obrigatórios.' });
  }


  const emailExiste = clientes.some(c => c.email.toLowerCase() === email.toLowerCase());
  if (emailExiste) {
    return response.status(400).json({ erro: 'Esse email já tá cadastrado' });
  }


  const novoCliente = {
    id: clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1,
    nome,
    email
  };

  clientes.push(novoCliente);

  return response.status(201).json(novoCliente);
});


app.get('/clientes/:id', (request, response) => {
  const { id } = request.params;

  app.get('/clientes', (request, response) => {
    return response.json(clientes);
  });


  const clienteEncontrado = clientes.find(c => c.id == Number(id));


  if (!clienteEncontrado) {
    return response.status(404).json({ erro: 'Cliente não encontrado' });
  }

  return response.json(clienteEncontrado);
});


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
