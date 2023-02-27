"use strict";

const mongoose = require("mongoose");
const Product = mongoose.model("Product");

exports.get = async () => {
  const response = await Product.find(
    {
      active: true,
    },
    "title price slug"
  );
  return response;
};

exports.getBySlug = async (slug) => {
  const response = await Product.findOne(
    {
      active: true,
      slug: slug,
    },
    "title price slug description tags"
  );
  return response;
};

exports.getById = async (id) => {
  const response = await Product.findById({
    _id: id,
  });
  return response;
};

exports.getByTag = async (tag) => {
  const response = await Product.find(
    {
      tags: tag,
      active: true,
    },
    "title description price slug tags"
  );
  return response;
};

exports.create = async (data) => {
  var product = new Product(data);
  const response = await product.save();
  return response;
};

exports.update = async (id, data) => {
  const response = await Product.findByIdAndUpdate(id, {
    $set: {
      title: data.title,
      description: data.description,
      price: data.price,
      slug: data.slug,
    },
  });
  return response;
};

exports.delete = async (id) => {
  const response = await Product.findOneAndRemove({
    _id: id,
  });
  return response;
};
