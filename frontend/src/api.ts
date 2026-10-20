import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" }
});

export type IncidentStatus = "Pending" | "Under Review" | "Resolved";
export type IncidentType = "Phishing" | "Online Scam" | "Account Hacking" | "Identity Theft" | "Cyberbullying" | "Malware" | "UPI / Payment Scam" | "Other";
export interface Incident {
  _id: string;
  name: string;
  email: string;
  type: IncidentType;
  description: string;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
}
