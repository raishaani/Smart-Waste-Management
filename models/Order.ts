import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  clientName: String,
  phone: String,
  location: String,
  lat: Number,
  lng: Number,
  status: String,
  driverName: String,
  vehicleNumber: String,
  executionDate: String,
  approved: {
  type: Boolean,
  default: false,
  },
  amount: Number,
  wasteWeight: Number,
  pickupDate: String,
  deadline: String,
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);