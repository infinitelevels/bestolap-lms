import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },

  eventName: {
    type: String,
    required: true
  },

  reference: {
    type: String,
    required: true
  },

  processedAt: {
    type: Date,
    default: Date.now
  }
});

// 🔥 Compound Unique Index (REAL idempotency protection)
webhookEventSchema.index({ eventId: 1 }, { unique: true });

webhookEventSchema.index(
  { eventName: 1, reference: 1 },
  { unique: true }
);

export default mongoose.model("WebhookEvent", webhookEventSchema);
