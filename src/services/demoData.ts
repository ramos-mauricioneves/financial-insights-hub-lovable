import { Account, Category, CreditCard, Transaction } from '@/types/organizze';

// Demo data for testing the interface without API connection
export const demoAccounts: Account[] = [
  {
    id: 1,
    name: "Bradesco Conta Corrente",
    description: "Conta principal para gastos do dia a dia",
    archived: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    default: true,
    type: "checking"
  },
  {
    id: 2,
    name: "Caixa Poupança",
    description: "Reserva de emergência",
    archived: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    default: false,
    type: "savings"
  },
  {
    id: 3,
    name: "Carteira",
    description: null,
    archived: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    default: false,
    type: "other"
  }
];

export const demoCategories: Category[] = [
  { id: 1, name: "Alimentação", color: "#FF6B6B", parent_id: null, is_default: true, type: "expense" },
  { id: 2, name: "Transporte", color: "#4ECDC4", parent_id: null, is_default: true, type: "expense" },
  { id: 3, name: "Lazer", color: "#45B7D1", parent_id: null, is_default: true, type: "expense" },
  { id: 4, name: "Saúde", color: "#96CEB4", parent_id: null, is_default: true, type: "expense" },
  { id: 5, name: "Educação", color: "#FFEAA7", parent_id: null, is_default: true, type: "expense" },
  { id: 6, name: "Casa", color: "#DDA0DD", parent_id: null, is_default: true, type: "expense" },
  { id: 7, name: "Salário", color: "#98D8C8", parent_id: null, is_default: true, type: "revenue" },
  { id: 8, name: "Freelances", color: "#F7DC6F", parent_id: null, is_default: true, type: "revenue" },
  { id: 9, name: "Investimentos", color: "#AED6F1", parent_id: null, is_default: true, type: "revenue" }
];

export const demoCreditCards: CreditCard[] = [
  {
    id: 1,
    name: "Nubank Roxinho",
    description: "Cartão principal para compras online",
    archived: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    default: true,
    limit: 500000, // R$ 5.000,00 em centavos
    closing_day: 15,
    due_day: 10
  },
  {
    id: 2,
    name: "Santander Gold",
    description: "Cartão de crédito com benefícios",
    archived: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    default: false,
    limit: 1000000, // R$ 10.000,00 em centavos
    closing_day: 5,
    due_day: 25
  }
];

export const demoTransactions: Transaction[] = [
  // Despesas
  {
    id: 1,
    description: "Supermercado Extra",
    date: "2024-06-15",
    paid: true,
    amount_cents: -25000, // -R$ 250,00
    total_installments: 1,
    installment: 1,
    recurring: false,
    account_id: 1,
    category_id: 1,
    contact_id: null,
    credit_card_id: null,
    credit_card_invoice_id: null,
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2024-06-15T00:00:00Z",
    attachments_count: 0,
    notes: null,
    tags: ["mercado", "essencial"]
  },
  {
    id: 2,
    description: "Gasolina Shell",
    date: "2024-06-14",
    paid: true,
    amount_cents: -8000, // -R$ 80,00
    total_installments: 1,
    installment: 1,
    recurring: false,
    account_id: null,
    category_id: 2,
    contact_id: null,
    credit_card_id: 1,
    credit_card_invoice_id: null,
    created_at: "2024-06-14T00:00:00Z",
    updated_at: "2024-06-14T00:00:00Z",
    attachments_count: 0,
    notes: null,
    tags: ["combustível"]
  },
  {
    id: 3,
    description: "Netflix",
    date: "2024-06-10",
    paid: true,
    amount_cents: -2990, // -R$ 29,90
    total_installments: 1,
    installment: 1,
    recurring: true,
    account_id: null,
    category_id: 3,
    contact_id: null,
    credit_card_id: 1,
    credit_card_invoice_id: null,
    created_at: "2024-06-10T00:00:00Z",
    updated_at: "2024-06-10T00:00:00Z",
    attachments_count: 0,
    notes: "Assinatura mensal",
    tags: ["streaming", "entretenimento"]
  },
  {
    id: 4,
    description: "Consulta Médica",
    date: "2024-06-08",
    paid: true,
    amount_cents: -15000, // -R$ 150,00
    total_installments: 1,
    installment: 1,
    recurring: false,
    account_id: 1,
    category_id: 4,
    contact_id: null,
    credit_card_id: null,
    credit_card_invoice_id: null,
    created_at: "2024-06-08T00:00:00Z",
    updated_at: "2024-06-08T00:00:00Z",
    attachments_count: 1,
    notes: "Dr. Silva - Clínico Geral",
    tags: ["saúde", "consulta"]
  },
  {
    id: 5,
    description: "Curso Udemy",
    date: "2024-06-05",
    paid: true,
    amount_cents: -19900, // -R$ 199,00
    total_installments: 1,
    installment: 1,
    recurring: false,
    account_id: null,
    category_id: 5,
    contact_id: null,
    credit_card_id: 2,
    credit_card_invoice_id: null,
    created_at: "2024-06-05T00:00:00Z",
    updated_at: "2024-06-05T00:00:00Z",
    attachments_count: 0,
    notes: "Curso de React Avançado",
    tags: ["educação", "programação"]
  },
  
  // Receitas
  {
    id: 6,
    description: "Salário - Empresa XYZ",
    date: "2024-06-01",
    paid: true,
    amount_cents: 450000, // +R$ 4.500,00
    total_installments: 1,
    installment: 1,
    recurring: true,
    account_id: 1,
    category_id: 7,
    contact_id: null,
    credit_card_id: null,
    credit_card_invoice_id: null,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    attachments_count: 0,
    notes: "Salário mensal",
    tags: ["salário", "trabalho"]
  },
  {
    id: 7,
    description: "Freelance - Site WordPress",
    date: "2024-06-12",
    paid: true,
    amount_cents: 80000, // +R$ 800,00
    total_installments: 1,
    installment: 1,
    recurring: false,
    account_id: 1,
    category_id: 8,
    contact_id: null,
    credit_card_id: null,
    credit_card_invoice_id: null,
    created_at: "2024-06-12T00:00:00Z",
    updated_at: "2024-06-12T00:00:00Z",
    attachments_count: 0,
    notes: "Desenvolvimento de site para cliente",
    tags: ["freelance", "desenvolvimento"]
  },
  {
    id: 8,
    description: "Dividendos - ITUB4",
    date: "2024-06-20",
    paid: true,
    amount_cents: 12500, // +R$ 125,00
    total_installments: 1,
    installment: 1,
    recurring: false,
    account_id: 2,
    category_id: 9,
    contact_id: null,
    credit_card_id: null,
    credit_card_invoice_id: null,
    created_at: "2024-06-20T00:00:00Z",
    updated_at: "2024-06-20T00:00:00Z",
    attachments_count: 0,
    notes: "Dividendos do Itaú",
    tags: ["investimento", "dividendos"]
  },

  // Dados do mês anterior para comparação
  {
    id: 9,
    description: "Salário - Empresa XYZ",
    date: "2024-05-01",
    paid: true,
    amount_cents: 450000, // +R$ 4.500,00
    total_installments: 1,
    installment: 1,
    recurring: true,
    account_id: 1,
    category_id: 7,
    contact_id: null,
    credit_card_id: null,
    credit_card_invoice_id: null,
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z",
    attachments_count: 0,
    notes: "Salário mensal",
    tags: ["salário", "trabalho"]
  },
  {
    id: 10,
    description: "Supermercado Extra",
    date: "2024-05-15",
    paid: true,
    amount_cents: -28000, // -R$ 280,00
    total_installments: 1,
    installment: 1,
    recurring: false,
    account_id: 1,
    category_id: 1,
    contact_id: null,
    credit_card_id: null,
    credit_card_invoice_id: null,
    created_at: "2024-05-15T00:00:00Z",
    updated_at: "2024-05-15T00:00:00Z",
    attachments_count: 0,
    notes: null,
    tags: ["mercado", "essencial"]
  }
];

// Mock API class for demo mode
export class DemoOrganizzeAPI {
  async getAccounts(): Promise<Account[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(demoAccounts), 500);
    });
  }

  async getCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(demoCategories), 500);
    });
  }

  async getCreditCards(): Promise<CreditCard[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(demoCreditCards), 500);
    });
  }

  async getTransactions(options: {
    startDate?: string;
    endDate?: string;
    accountId?: number;
    categoryId?: number;
  } = {}): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(demoTransactions), 500);
    });
  }

  async testConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });
  }
}