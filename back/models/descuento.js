"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DescuentoSchema = Schema({
  titulo: { type: String, require: true },
  banner: { type: String, require: true },
  descuento: { type: Number, require: true },
  fecha_inicio: { type: String, require: true },
  fecha_fin: { type: String, require: true },

  createdAt: { type: Date, default: Date.now, require: true },
});

module.exports = mongoose.model("descuento", DescuentoSchema);
