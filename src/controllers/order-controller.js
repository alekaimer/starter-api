"use strict";

const repository = require("../repositories/order-repository");
const guid = require("guid");
const authService = require("../services/auth-service");

exports.get = async (req, res, next) => {
  try {
    const data = await repository.get();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ message: "Falha ao carregar pedidos", data: error });
  }
};

exports.post = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  const decodedToken = await authService.decodeToken(token);
  const data = {
    customer: decodedToken.id,
    number: guid.raw().substring(0, 6),
    items: req.body.items,
  };

  try {
    await repository.create(data);
    res.status(201).send({ message: "Pedido cadastrado com sucesso!" });
  } catch (error) {
    res.status(400).send({ message: "Falha ao cadastrar pedido", data: error });
  }
};
