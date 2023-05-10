const { Schema, model } = require("mongoose");


const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: String, required: true},
  text: { type: String, required: true}
});

module.exports = model("Message", MessageSchema);