export type UserRole = "student" | "club_admin" | "admin";

export type Department =
  | "CSE"
  | "EEE"
  | "Mechanical"
  | "Civil"
  | "Textile"
  | "Pharmacy"
  | "Public Health"
  | "DSH"
  | "BBA"
  | "English"
  | "Law"
  | "Agriculture";

export const DEPARTMENTS: { code: Department; name: string }[] = [
  { code: "CSE", name: "Computer Science & Engineering" },
  { code: "EEE", name: "Electrical & Electronic Engineering" },
  { code: "Mechanical", name: "Mechanical Engineering" },
  { code: "Civil", name: "Civil Engineering" },
  { code: "Textile", name: "Textile Engineering" },
  { code: "Pharmacy", name: "Pharmacy" },
  { code: "Public Health", name: "Public Health" },
  { code: "DSH", name: "Department of Science & Humanities" },
  { code: "BBA", name: "Business Administration" },
  { code: "English", name: "English Language & Literature" },
  { code: "Law", name: "Law & Human Rights" },
  { code: "Agriculture", name: "Agriculture" },
];

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  department: Department;
  batch: string;
  studentId?: string;
  role: UserRole;
  preferredLanguage: "en" | "bn";
  savedBusRoute?: string;
  createdAt: string; // ISO string
  updatedAt?: string;
  managedClubId?: string; // for club_admin
}
