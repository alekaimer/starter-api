"use strict";

const mongoose = require("mongoose");
const Order = mongoose.model("Order");

exports.get = async (data) => {
  const response = await Order.find({}, "number status customer items")
    .populate("customer", "name")
    .populate("items.product", "title price");
  return response;
};

exports.create = async (data) => {
  var order = new Order(data);
  await order.save();
};
