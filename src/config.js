require('dotenv').config({  
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env.production"
})

global.SALT_KEY = process.env.SALT_KEY;
global.EMAIL_TEMPLATE = "Olá, <strong>{0}</strong>, seja bem vindo à loja!";

module.exports = {
  connectionString: process.env.DB_CONNECTION_STRING,
  sendgridKey: process.env.SENDGRID_KEY,
  containerConnectionString: process.env.CONTAINER_CONNECTION_STRING //TODO: colocar a chave do azure
};
