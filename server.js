import express from 'express';

const app = express();
app.use(express.json());

let filmes = [
  { id: 1, titulo: 'Corra', genero: 'Terror' },
  { id: 2, titulo: 'Olhos que Condenam', genero: 'Drama' },
  { id: 3, titulo: 'Homem Aranha', genero: 'Ação' }
];

let clientes = [
  { id: 1, nome: 'Andrey', email: 'andrey@email.com' }
];

let produtos = [
  { id: 1, nome: "Notebook", categoria: "Informática", preco: 3500, estoque: 8 },
  { id: 2, nome: "Mouse", categoria: "Informática", preco: 80, estoque: 25 },
  { id: 3, nome: "Teclado", categoria: "Informática", preco: 150, estoque: 15 },
  { id: 4, nome: "Cadeira Gamer", categoria: "Móveis", preco: 1200, estoque: 5 },
  { id: 5, nome: "Mesa para Escritório", categoria: "Móveis", preco: 750, estoque: 4 }
];

app.get('/filmes', (request, response) => {
  return response.json(filmes);
});

app.get('/filmes/genero', (request, response) => {
  const { nome } = request.query;

  if (!nome) {
    return response.status(400).json({
      erro: 'Informe o gênero.'
    });
  }

  const filmesFiltrados = filmes.filter(
    f => f.genero.trim().toLowerCase() === nome.trim().toLowerCase()
  );

  return response.json(filmesFiltrados);
});


app.get('/clientes', (request, response) => {
  return response.json(clientes);
});

app.get('/clientes/:id', (request, response) => {
  const { id } = request.params;

  const clienteEncontrado = clientes.find(
    c => c.id === Number(id)
  );

  if (!clienteEncontrado) {
    return response.status(404).json({
      erro: 'Cliente não encontrado.'
    });
  }

  return response.json(clienteEncontrado);
});

app.post('/clientes', (request, response) => {
  const { nome, email } = request.body;

  if (!nome || !email) {
    return response.status(400).json({
      erro: 'Nome e email obrigatórios.'
    });
  }

  const emailExiste = clientes.some(
    c => c.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExiste) {
    return response.status(400).json({
      erro: 'Esse email já está cadastrado.'
    });
  }

  const novoCliente = {
    id: clientes.length > 0
      ? clientes[clientes.length - 1].id + 1
      : 1,
    nome,
    email
  };

  clientes.push(novoCliente);

  return response.status(201).json(novoCliente);
});


app.get('/produtos', (request, response) => {
  const { categoria } = request.query;

  if (categoria) {
    const produtosFiltrados = produtos.filter(
      p => p.categoria.trim().toLowerCase() === categoria.trim().toLowerCase()
    );

    return response.json(produtosFiltrados);
  }

  return response.json(produtos);
});


app.get('/produtos/estoque/baixo', (request, response) => {
  const produtosEstoqueBaixo = produtos.filter(
    p => p.estoque <= 5
  );

  return response.json(produtosEstoqueBaixo);
});


app.get('/produtos/:id', (request, response) => {
  const { id } = request.params;

  const produtoEncontrado = produtos.find(
    p => p.id === Number(id)
  );

  if (!produtoEncontrado) {
    return response.status(404).json({
      erro: 'Produto não encontrado.'
    });
  }

  return response.json(produtoEncontrado);
});


app.post('/produtos', (request, response) => {
  const { nome, categoria, preco, estoque } = request.body;

  if (
    !nome ||
    !categoria ||
    preco === undefined ||
    estoque === undefined
  ) {
    return response.status(400).json({
      erro: 'Preencha todos os campos.'
    });
  }

  const produtoExistente = produtos.find(
    p => p.nome.toLowerCase() === nome.toLowerCase()
  );

  if (produtoExistente) {
    return response.status(400).json({
      erro: 'Esse produto já existe.'
    });
  }

  const novoProduto = {
    id: produtos.length > 0
      ? produtos[produtos.length - 1].id + 1
      : 1,
    nome,
    categoria,
    preco,
    estoque
  };

  produtos.push(novoProduto);

  return response.status(201).json(novoProduto);
});


app.put('/produtos/:id', (request, response) => {
  const { id } = request.params;
  const { nome, categoria, preco, estoque } = request.body;

  const produtoEncontrado = produtos.find(
    p => p.id === Number(id)
  );

  if (!produtoEncontrado) {
    return response.status(404).json({
      erro: 'Produto não encontrado.'
    });
  }

  produtoEncontrado.nome = nome;
  produtoEncontrado.categoria = categoria;
  produtoEncontrado.preco = preco;
  produtoEncontrado.estoque = estoque;

  return response.json(produtoEncontrado);
});


app.patch('/produtos/:id', (request, response) => {
  const { id } = request.params;

  const produtoEncontrado = produtos.find(
    p => p.id === Number(id)
  );

  if (!produtoEncontrado) {
    return response.status(404).json({
      erro: 'Produto não encontrado.'
    });
  }

  const { nome, categoria, preco, estoque } = request.body;

  if (nome !== undefined) {
    produtoEncontrado.nome = nome;
  }

  if (categoria !== undefined) {
    produtoEncontrado.categoria = categoria;
  }

  if (preco !== undefined) {
    produtoEncontrado.preco = preco;
  }

  if (estoque !== undefined) {
    produtoEncontrado.estoque = estoque;
  }

  return response.json(produtoEncontrado);
});


app.delete('/produtos/:id', (request, response) => {
  const { id } = request.params;

  const indice = produtos.findIndex(
    p => p.id === Number(id)
  );

  if (indice === -1) {
    return response.status(404).json({
      erro: 'Produto não encontrado.'
    });
  }

  produtos.splice(indice, 1);

  return response.json({
    mensagem: 'Produto excluído com sucesso.'
  });
});


app.post('/produtos/:id/venda', (request, response) => {
  const { id } = request.params;
  const { quantidade } = request.body;

  const produtoEncontrado = produtos.find(
    p => p.id === Number(id)
  );

  if (!produtoEncontrado) {
    return response.status(404).json({
      erro: 'Produto não encontrado.'
    });
  }

  if (quantidade === undefined || quantidade <= 0) {
    return response.status(400).json({
      erro: 'A quantidade deve ser maior que zero.'
    });
  }

  if (quantidade > produtoEncontrado.estoque) {
    return response.status(400).json({
      erro: 'Estoque insuficiente.'
    });
  }

  produtoEncontrado.estoque -= quantidade;

  return response.json(produtoEncontrado);
});




app.listen(3000, () => {
  console.log('Servidor rodando com sucesso na porta 3000');
});
