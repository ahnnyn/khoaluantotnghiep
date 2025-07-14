// models/PriceList.ts
import mongoose from "mongoose";

const priceListSchema = new mongoose.Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    examinationType: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // If not specified, price applies to department
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "priceLists",
  }
);

const PriceList = mongoose.model("PriceList", priceListSchema);
export default PriceList;
