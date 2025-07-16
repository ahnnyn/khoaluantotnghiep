import mongoose from "mongoose";

const workScheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    slots: [
      {
        timeSlotId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TimeSlot",
          required: true,
        },
        status: {
          type: String,
          enum: ["available", "booked", "unavailable"],
          default: "available",
        },
        examinationType: {
          type: String,
          enum: ["ONLINE", "OFFLINE"],
          required: true,
        },
        examinationIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalExamination",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    collection: "work_schedules",
  }
);

const WorkSchedule = mongoose.model("WorkSchedule", workScheduleSchema);
export default WorkSchedule;
