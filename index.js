const express = require('express');
const cors = require('cors'); 

const uuid = require('uuid');

const port = 3000;

const app = express();
app.use(express.json());


app.use(cors());

const orders = [];

const checkUserId = (request, response, next) => {
    const { id } = request.params;
    const index = orders.findIndex(order => order.id === id);
    if (index < 0) {
        return response.status(404).json({ error: "Pedido não cadastrado" });
    }
    request.ordersIndex = index;
    request.orderId = id;
    next();
}

const requestType = (request, response, next) => {
    console.log(Method: ${request.method}, URL: http://localhost:3000${request.url});
    next();
}

app.post('/order', requestType, (request, response) => {
    const { order, clientName, price, status } = request.body;
    const user = { id: uuid.v4(), order, clientName, price, status: "Em preparação" };
    orders.push(user);
    return response.status(201).json(user);
})

app.get('/order', requestType, (request, response) => {
    return response.json({ orders });
})

app.put('/order/:id', checkUserId, requestType, (request, response) => {
    const { order, clientName, price, status } = request.body;
    const index = request.ordersIndex;
    const id = request.order;
    const updateRequest = { id, clientName, price, status };
    orders[index] = updateRequest;
    return response.json(updateRequest);
})

app.delete('/order/:id', checkUserId, requestType, (request, response) => {
    const index = request.ordersIndex;
    orders.splice(index, 1);
    return response.status(204).json();
})

app.get('/order/:id', requestType, (request, response) => {
    const id = request.params.id;
    const currentOrder = orders.find(order => order.id === id);
    if (!currentOrder) {
        return response.status(404).json({ error: "Pedido não cadastrado" });
    }
    return response.json({ currentOrder });
})

app.patch('/order/:id', requestType, (request, response) => {
    const { id } = request.params;
    const { status } = request.body;
    const currentOrderIndex = orders.findIndex(order => order.id === id);
    if (currentOrderIndex === -1) {
        return response.status(404).json({ error: "Pedido não cadastrado" });
    }
    orders[currentOrderIndex].status = status || 'Pedido pronto';
    return response.json({ message: 'Status do pedido alterado', order: orders[currentOrderIndex] });
})

app.listen(port, () => {
    console.log(🚀 Servidor iniciado na porta ${port});
})