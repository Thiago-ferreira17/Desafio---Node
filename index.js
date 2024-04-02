const express = require('express');
const cors = require('cors'); 
const uuid = require('uuid');

const port = 3001;

const app = express();
app.use(express.json());
app.use(cors());

const orders = [];

const checkOrderId = (request, response, next) => {
    const { id } = request.params;
    const index = orders.findIndex(order => order.id === id);
    if (index < 0) {
        return response.status(404).json({ error: "Pedido não cadastrado" });
    }
    request.orderIndex = index;
    next();
}

const requestType = (request, response, next) => {
    console.log(`Method: ${request.method}, URL: http://localhost:3001${request.url}`);
    next();
}

app.post('/order', requestType, (request, response) => {
    const { order, clientName, price, status } = request.body;
    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" };
    orders.push(newOrder);
    return response.status(201).json(newOrder);
})

app.get('/order', requestType, (request, response) => {
    return response.json(orders);
})

app.put('/order/:id', checkOrderId, requestType, (request, response) => {
    const { order, clientName, price, status } = request.body;
    const index = request.orderIndex;
    const updatedOrder = { ...orders[index], order, clientName, price, status };
    orders[index] = updatedOrder;
    return response.json(updatedOrder);
})

app.delete('/order/:id', checkOrderId, requestType, (request, response) => {
    const index = request.orderIndex;
    orders.splice(index, 1);
    return response.status(204).json();
})

app.get('/order/:id', requestType, (request, response) => {
    const id = request.params.id;
    const currentOrder = orders.find(order => order.id === id);
    if (!currentOrder) {
        return response.status(404).json({ error: "Pedido não cadastrado" });
    }
    return response.json(currentOrder);
})

app.patch('/order/:id', requestType, (request, response) => {
    const { id } = request.params;
    const { status } = request.body;
    const index = orders.findIndex(order => order.id === id);
    if (index === -1) {
        return response.status(404).json({ error: "Pedido não cadastrado" });
    }
    orders[index].status = status || 'Pedido pronto';
    return response.json({ message: 'Status do pedido alterado', order: orders[index] });
})

app.listen(port, () => {
    console.log(`🚀 Servidor iniciado na porta ${port}`);
})