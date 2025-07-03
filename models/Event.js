const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  poster: {
    type: String, // URL de la imagen del evento (Cloudinary o local)
    default: ""
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true }); // crea createdAt y updatedAt automáticamente

module.exports = mongoose.model("Event", EventSchema);
