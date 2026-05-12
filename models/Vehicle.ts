import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  vehicleNumber: String,
  capacity: Number,
  driverName: String,
  ownerName: String,

  status: {
    type: String,
    default: "Available",
  },
});

export default mongoose.models.Vehicle ||
  mongoose.model("Vehicle", VehicleSchema);