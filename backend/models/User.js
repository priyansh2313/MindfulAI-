const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, default: 'user', enum: ['user', 'family', 'elder'] },
  familyCircle: { type: String, default: null },
  invitedBy: { type: String, default: null }, // Name of the user who invited this family member
  whoInvited: { type: String, default: null } // Alternative field name for clarity
});

// add test results array here for dynamic chart

const User = mongoose.model("User", UserSchema);

module.exports = User;
