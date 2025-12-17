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
  revenue?: number;
  earnings?: number;
  growth?: number;
  esgScore?: number;
}

export interface Report {
  id: string;
  type: 'quarterly' | 'esg' | 'investor-update';
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
  role: 'admin' | 'analyst' | 'viewer';
  status: 'active' | 'inactive';
  lastActive: Date;
}

// Company Data
export const companyData = {
  name: 'TechCorp Solutions Inc.',
  ticker: 'TECH',
  marketCap: 45000000000,
  quarter: 'Q3 2024',
  revenue: 2400000000,
  revenueGrowth: 12,
  grossMargin: 28,
  eps: 3.45,
  esg: {
    environmental: 85,
    social: 78,
    governance: 92,
    overall: 85,
  },
  dividendYield: 1.8,
  peRatio: 28.5,
  employees: 12500,
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
    content: "Welcome to TechCorp IR Assistant! I'm here to help you with investor relations queries. Ask me about financials, ESG metrics, or company performance.",
    timestamp: new Date(),
  },
];

const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Q3_2024_Earnings_Report.pdf',
    type: 'application/pdf',
    size: 2450000,
    uploadedAt: new Date('2024-10-15'),
    metrics: { revenue: 2400000000, earnings: 672000000, growth: 12 },
  },
  {
    id: '2',
    name: 'ESG_Annual_Report_2024.pdf',
    type: 'application/pdf',
    size: 3200000,
    uploadedAt: new Date('2024-09-01'),
    metrics: { esgScore: 85 },
  },
  {
    id: '3',
    name: 'Investor_Presentation_Q3.pdf',
    type: 'application/pdf',
    size: 5100000,
    uploadedAt: new Date('2024-10-20'),
  },
];

const sampleUsers: User[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@techcorp.com', role: 'admin', status: 'active', lastActive: new Date() },
  { id: '2', name: 'Michael Chen', email: 'michael.c@techcorp.com', role: 'analyst', status: 'active', lastActive: new Date() },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@techcorp.com', role: 'analyst', status: 'active', lastActive: new Date(Date.now() - 86400000) },
  { id: '4', name: 'David Kim', email: 'david.k@techcorp.com', role: 'viewer', status: 'inactive', lastActive: new Date(Date.now() - 604800000) },
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
