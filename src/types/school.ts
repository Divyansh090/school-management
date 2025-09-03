export interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  image?: string;
  email_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSchoolData {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image?: File;
}