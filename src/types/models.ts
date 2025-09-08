export interface Job {
  _id?: string;
  title: string;
  jobLocation: string;
  myLocation?: string;
  status: string;
  vendor: string;
  client: string;
  endClient: string;
  employerId?: string;
  dateSubmitted?: string;
  jobDescription?: string;
  marketingTeam?: string;
  hourlyRate?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employer {
  _id?: string;
  name: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Call {
  _id?: string;
  consultantId?: string;
  name: string;
  vendor?: string;
  phoneNumber?: string;
  date: string;
  employerId?: string;
  notes?: string;
  marketingTeam?: string;
  createdAt?: string;
  updatedAt?: string;
  jobId?: string
}

export interface User {
  id: string;
  name: string;
  role?: string;
  token: string;
}

export interface AuthUser {
  id: string;
  name: string;
  token: string;
  role?: string;
};