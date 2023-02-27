"use strict";

const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/customer-repository");
const md5 = require("md5");
const emailService = require("../services/email-service");
const passwordCrypter = require("../utils/passwordCrypter");
const authService = require("../services/auth-service");

async function generateToken(customer) {
  return await authService.generateToken({
    id: customer._id,
    email: customer.email,
    name: customer.name,
    roles: customer.roles,
  });
}

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(
    req.body.name,
    3,
    "O nome deve conter pelo menos 3 caracteres"
  );
  contract.isEmail(req.body.email, "E-mail inválido");
  contract.hasMinLen(
    req.body.password,
    6,
    "A senha deve conter pelo menos 6 caracteres"
  );

  // Se os dados forem inválidos
  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }

  const data = {
    name: req.body.name,
    email: req.body.email,
    password: passwordCrypter(req.body.password),
    roles: ["user"],
  };

  try {
    await repository.create(data);

    emailService.send(
      data.email,
      "Bem vindo à loja!",
      global.EMAIL_TEMPLATE.replace("{0}", data.name)
    );

    res.status(201).send({ message: "Cliente cadastrado com sucesso!" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Falha ao cadastrar cliente", data: error });
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    
    const customer = await repository.authenticate({
      email: req.body.email,
      password: passwordCrypter(req.body.password),
    });
    
    if (!customer) {
      res.status(404).send({
        message: "Usuário ou senha inválidos",
      });
      
      return;
    }

    const token = await generateToken(customer)

    res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name,
        roles: customer.roles,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Falha ao autenticar o cliente", data: error });
  }

};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);
    
    const customer = await repository.getById(data.id);
    
    if (!customer) {
      res.status(404).send({
        message: "Cliente não encontrado",
      });
      
      return;
    }

    const dataToken = await generateToken(customer);

    res.status(201).send({
      token: dataToken,
      data: {
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Falha ao autenticar o cliente", data: error });
  }

};
