import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  type: {
    type: String,
    required: true,
    enum: ["Phishing", "Online Scam", "Account Hacking", "Identity Theft", "Cyberbullying", "Malware", "UPI / Payment Scam", "Other"]
  },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ["Pending", "Under Review", "Resolved"], default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Incident", incidentSchema);
