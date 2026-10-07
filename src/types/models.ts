import { Department, UserRole } from "./user";
export type { Department, UserRole };

export type RecordSource = "official" | "demo";

// 1. Club
export interface Club {
  id: string;
  name: string;
  code: string; // e.g. "CUCPC", "CURC", "CUDS"
  description: string;
  description_bn?: string;
  category: "technology" | "cultural" | "sports" | "academic" | "social";
  leadName: string;
  contactEmail: string;
  socialLinks?: {
    facebook?: string;
    website?: string;
  };
  memberCount: number;
  logoUrl?: string;
  coverUrl?: string;
  source: RecordSource;
}

// 2. Event
export type EventType = "workshop" | "contest" | "seminar" | "cultural" | "sports" | "general";
export type EventStatus = "upcoming" | "today" | "closed" | "full" | "past";

export interface CampusEvent {
  id: string;
  title: string;
  title_bn?: string;
  description: string;
  description_bn?: string;
  clubId: string;
  clubName: string;
  type: EventType;
  startAt: string; // ISO 8601 string (Dhaka Time formatted)
  endAt: string;
  location: string;
  capacity: number;
  registeredCount: number;
  registrationOpen: boolean;
  registrationDeadline: string;
  coverUrl?: string;
  createdBy: string;
  source: RecordSource;
  createdAt: string;
}

// 3. Registration & QR Ticket
export type RegistrationStatus = "registered" | "waitlisted" | "cancelled";

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userDept: Department;
  userBatch: string;
  status: RegistrationStatus;
  qrToken: string;
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
}

// 4. Bus Route & Trips
export interface BusRoute {
  id: string;
  routeNumber: string; // "R1", "R2", etc.
  name: string;
  name_bn?: string;
  origin: string;
  destination: string;
  via: string;
  stops: string[];
  stops_bn?: string[];
  description?: string;
  source: RecordSource;
}

export interface BusTrip {
  id: string;
  routeId: string;
  routeNumber: string;
  departureTime: string; // "07:00", "13:30" (24h Dhaka time)
  direction: "to_campus" | "from_campus";
  daysOfWeek: number[]; // [0,1,2,3,4] (Sunday to Thursday)
  notes?: string;
  source: RecordSource;
}

// 5. Helpdesk FAQs
export type FAQCategory =
  | "Admission"
  | "Registration and Courses"
  | "Exams"
  | "Fees and Waivers"
  | "Transport"
  | "Campus Facilities"
  | "Contacts"
  | "Rules and Discipline";

export interface FAQ {
  id: string;
  category: FAQCategory;
  question_en: string;
  question_bn: string;
  answer_en: string;
  answer_bn: string;
  sourceUrl?: string;
  source: RecordSource;
}

// 6. Academic Resources
export type ResourceType = "notes" | "question_paper" | "lab_manual" | "notice" | "other";
export type ResourceStatus = "pending" | "approved" | "rejected";

export interface AcademicResource {
  id: string;
  title: string;
  description?: string;
  courseCode: string; // e.g. "CSE 2101"
  courseTitle: string;
  department: Department;
  semester: string; // "1st", "2nd", etc.
  type: ResourceType;
  file: {
    url: string;
    publicId?: string;
    name: string;
    size: number;
    mimeType: string;
  };
  uploaderId: string;
  uploaderName: string;
  status: ResourceStatus;
  rejectionReason?: string;
  verified: boolean;
  upvotes: number;
  keywords: string[];
  summary?: {
    en: string;
    bn: string;
  };
  createdAt: string;
  source: RecordSource;
}

// 7. Lost and Found & Claims
export type LostFoundKind = "lost" | "found";
export type LostFoundStatus = "open" | "claimed" | "returned";

export interface LostFoundItem {
  id: string;
  kind: LostFoundKind;
  title: string;
  description: string;
  category: "ID Card / Documents" | "Electronics" | "Keys" | "Bag / Wallet" | "Clothing" | "Other";
  location: string;
  date: string; // "YYYY-MM-DD"
  photoUrl?: string;
  status: LostFoundStatus;
  verificationQuestion?: string;
  createdBy: string;
  createdByName: string;
  contactPhone?: string;
  createdAt: string;
  source: RecordSource;
}

export interface LostFoundClaim {
  id: string;
  itemId: string;
  itemTitle: string;
  claimantId: string;
  claimantName: string;
  claimantDept: string;
  claimantBatch: string;
  claimantContact: string;
  answer: string;
  status: "pending" | "approved" | "rejected";
  posterId: string;
  createdAt: string;
}

// 8. Complaints Box
export type ComplaintStatus = "received" | "in_review" | "resolved";

export interface ComplaintTimelineItem {
  status: ComplaintStatus;
  note: string;
  timestamp: string;
  isPublic: boolean;
}

export interface Complaint {
  id: string;
  trackingId: string; // format "CU-2026-XXXXXX"
  category: "Academic" | "Transport" | "Campus Facilities" | "Administration" | "Cafeteria" | "Other";
  subject: string;
  description: string;
  anonymous: boolean;
  userId: string | null;
  userName?: string;
  attachmentUrl?: string;
  status: ComplaintStatus;
  timeline: ComplaintTimelineItem[];
  createdAt: string;
}

// 9. Class Updates & Notices
export type UpdateKind = "class_cancelled" | "class_rescheduled" | "exam" | "general";

export interface ClassUpdate {
  id: string;
  title: string;
  title_bn?: string;
  body: string;
  body_bn?: string;
  kind: UpdateKind;
  department: Department | "All";
  batch?: string; // e.g. "50th" or "All"
  courseCode?: string;
  effectiveAt: string; // ISO date
  authorId: string;
  authorName: string;
  createdAt: string;
  source: RecordSource;
}

// 10. Forms & Groups Directory
export type DirectoryKind = "google_form" | "facebook_group" | "messenger_group" | "official_link";

export interface DirectoryEntry {
  id: string;
  title: string;
  title_bn?: string;
  kind: DirectoryKind;
  url: string;
  ownerClub?: string;
  description: string;
  deadline?: string;
  isOpen: boolean;
  source: RecordSource;
}
