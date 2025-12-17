import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  chart?: any;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  metrics?: ExtractedMetrics;
}

export interface ExtractedMetrics {
  servicesCost?: number;
  partsUsed?: number;
  laborHours?: number;
  customerRating?: number;
}

export interface Report {
  id: string;
  type: 'service' | 'maintenance' | 'diagnostic';
  title: string;
  createdAt: Date;
  content: string;
  status: 'draft' | 'generating' | 'complete';
}

export interface ComplianceResult {
  score: number;
  issues: ComplianceIssue[];
}

export interface ComplianceIssue {
  severity: 'critical' | 'warning' | 'info';
  type: string;
  description: string;
  suggestion: string;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'advisor';
  status: 'active' | 'inactive';
  lastActive: Date;
}

// Service Center Data
export const serviceData = {
  name: 'AutoCare Pro Service Center',
  location: 'Dallas, TX',
  servicesCompleted: 12500,
  month: 'December 2024',
  revenue: 485000,
  revenueGrowth: 18,
  avgTicket: 287,
  customerSatisfaction: 4.8,
  ratings: {
    quality: 92,
    timeliness: 88,
    communication: 95,
    overall: 92,
  },
  returnRate: 2.1,
  technicianCount: 8,
  baysAvailable: 12,
};

// Context
interface AppContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Welcome to AutoCare Pro AI Assistant! I'm here to help you with vehicle diagnostics, service recommendations, maintenance schedules, and customer queries. How can I assist you today?",
    timestamp: new Date(),
  },
];

const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Service_History_Report_Dec2024.pdf',
    type: 'application/pdf',
    size: 2450000,
    uploadedAt: new Date('2024-12-15'),
    metrics: { servicesCost: 485000, partsUsed: 3420, laborHours: 1680 },
  },
  {
    id: '2',
    name: 'Vehicle_Diagnostic_Codes.pdf',
    type: 'application/pdf',
    size: 3200000,
    uploadedAt: new Date('2024-12-01'),
    metrics: { customerRating: 4.8 },
  },
  {
    id: '3',
    name: 'Maintenance_Schedule_Guide.pdf',
    type: 'application/pdf',
    size: 5100000,
    uploadedAt: new Date('2024-12-10'),
  },
];

const sampleUsers: User[] = [
  { id: '1', name: 'Mike Johnson', email: 'mike.j@autocarepro.com', role: 'admin', status: 'active', lastActive: new Date() },
  { id: '2', name: 'Sarah Chen', email: 'sarah.c@autocarepro.com', role: 'technician', status: 'active', lastActive: new Date() },
  { id: '3', name: 'James Rodriguez', email: 'james.r@autocarepro.com', role: 'technician', status: 'active', lastActive: new Date(Date.now() - 86400000) },
  { id: '4', name: 'Emily Davis', email: 'emily.d@autocarepro.com', role: 'advisor', status: 'inactive', lastActive: new Date(Date.now() - 604800000) },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        messages,
        setMessages,
        documents,
        setDocuments,
        reports,
        setReports,
        users,
        setUsers,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
