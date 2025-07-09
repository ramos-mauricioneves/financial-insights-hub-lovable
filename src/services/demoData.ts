
import { 
  Account, 
  Category, 
  CreditCard, 
  Transaction, 
  CreditCardInvoice, 
  OrganizzeCredentials 
} from '@/types/organizze';

export class DemoOrganizzeAPI {
  private credentials: OrganizzeCredentials = { email: 'demo', token: 'demo' };

  // Demo accounts with realistic balances
  private demoAccounts: Account[] = [
    {
      id: 1,
      name: 'Conta Corrente Banco do Brasil',
      description: 'Conta principal para movimentações do dia a dia',
      archived: false,
      created_at: '2023-01-15T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      default: true,
      type: 'checking',
      balance_cents: 1250000 // R$ 12.500,00
    },
    {
      id: 2,
      name: 'Poupança Caixa',
      description: 'Reserva de emergência',
      archived: false,
      created_at: '2023-02-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      default: false,
      type: 'savings',
      balance_cents: 5000000 // R$ 50.000,00
    },
    {
      id: 3,
      name: 'Conta Corrente Nubank',
      description: 'Conta digital para investimentos',
      archived: false,
      created_at: '2023-03-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      default: false,
      type: 'checking',
      balance_cents: 780000 // R$ 7.800,00
    },
    {
      id: 4,
      name: 'Conta Antiga Bradesco',
      description: 'Conta que foi encerrada',
      archived: true,
      created_at: '2022-01-01T10:00:00Z',
      updated_at: '2024-06-15T10:00:00Z',
      default: false,
      type: 'checking',
      balance_cents: 0
    }
  ];

  // Demo credit cards with current balances
  private demoCreditCards: CreditCard[] = [
    {
      id: 1,
      name: 'Cartão Nubank',
      description: 'Cartão sem anuidade',
      archived: false,
      created_at: '2023-01-15T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      default: true,
      limit: 500000, // R$ 5.000,00
      closing_day: 15,
      due_day: 10,
      current_balance_cents: 125000 // R$ 1.250,00
    },
    {
      id: 2,
      name: 'Cartão Itaú',
      description: 'Cartão premium com benefícios',
      archived: false,
      created_at: '2023-02-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      default: false,
      limit: 1000000, // R$ 10.000,00
      closing_day: 5,
      due_day: 25,
      current_balance_cents: 340000 // R$ 3.400,00
    },
    {
      id: 3,
      name: 'Cartão Antigo Bradesco',
      description: 'Cartão cancelado',
      archived: true,
      created_at: '2022-01-01T10:00:00Z',
      updated_at: '2024-05-20T10:00:00Z',
      default: false,
      limit: 200000,
      closing_day: 20,
      due_day: 15,
      current_balance_cents: 0
    }
  ];

  // Demo categories with subcategories
  private demoCategories: Category[] = [
    // Main categories
    {
      id: 1,
      name: 'Alimentação',
      color: '#FF6B6B',
      parent_id: null,
      is_default: true,
      type: 'expense'
    },
    {
      id: 2,
      name: 'Transporte',
      color: '#4ECDC4',
      parent_id: null,
      is_default: true,
      type: 'expense'
    },
    {
      id: 3,
      name: 'Moradia',
      color: '#45B7D1',
      parent_id: null,
      is_default: true,
      type: 'expense'
    },
    {
      id: 4,
      name: 'Salário',
      color: '#96CEB4',
      parent_id: null,
      is_default: true,
      type: 'revenue'
    },
    {
      id: 5,
      name: 'Investimentos',
      color: '#FECA57',
      parent_id: null,
      is_default: true,
      type: 'revenue'
    },
    // Subcategories
    {
      id: 6,
      name: 'Supermercado',
      color: '#FF6B6B',
      parent_id: 1,
      is_default: false,
      type: 'expense'
    },
    {
      id: 7,
      name: 'Restaurante',
      color: '#FF6B6B',
      parent_id: 1,
      is_default: false,
      type: 'expense'
    },
    {
      id: 8,
      name: 'Combustível',
      color: '#4ECDC4',
      parent_id: 2,
      is_default: false,
      type: 'expense'
    },
    {
      id: 9,
      name: 'Uber/Taxi',
      color: '#4ECDC4',
      parent_id: 2,
      is_default: false,
      type: 'expense'
    },
    {
      id: 10,
      name: 'Aluguel',
      color: '#45B7D1',
      parent_id: 3,
      is_default: false,
      type: 'expense'
    }
  ];

  // Demo transactions for current month
  private demoTransactions: Transaction[] = [
    // December 2024 transactions
    {
      id: 1,
      description: 'Salário - Empresa XYZ',
      date: '2024-12-01',
      paid: true,
      amount_cents: 650000, // R$ 6.500,00
      total_installments: 1,
      installment: 1,
      recurring: true,
      account_id: 1,
      category_id: 4,
      contact_id: null,
      credit_card_id: null,
      credit_card_invoice_id: null,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      attachments_count: 0,
      notes: null,
      tags: ['trabalho', 'salário']
    },
    {
      id: 2,
      description: 'Supermercado Extra',
      date: '2024-12-03',
      paid: true,
      amount_cents: -45000, // -R$ 450,00
      total_installments: 1,
      installment: 1,
      recurring: false,
      account_id: null,
      category_id: 6,
      contact_id: null,
      credit_card_id: 1,
      credit_card_invoice_id: 1,
      created_at: '2024-12-03T10:00:00Z',
      updated_at: '2024-12-03T10:00:00Z',
      attachments_count: 1,
      notes: 'Compras do mês',
      tags: ['alimentação', 'casa']
    },
    {
      id: 3,
      description: 'Posto Shell - Combustível',
      date: '2024-12-05',
      paid: true,
      amount_cents: -8500, // -R$ 85,00
      total_installments: 1,
      installment: 1,
      recurring: false,
      account_id: 1,
      category_id: 8,
      contact_id: null,
      credit_card_id: null,
      credit_card_invoice_id: null,
      created_at: '2024-12-05T10:00:00Z',
      updated_at: '2024-12-05T10:00:00Z',
      attachments_count: 0,
      notes: null,
      tags: ['combustível', 'carro']
    },
    {
      id: 4,
      description: 'Aluguel Apartamento',
      date: '2024-12-10',
      paid: true,
      amount_cents: -180000, // -R$ 1.800,00
      total_installments: 1,
      installment: 1,
      recurring: true,
      account_id: 1,
      category_id: 10,
      contact_id: null,
      credit_card_id: null,
      credit_card_invoice_id: null,
      created_at: '2024-12-10T10:00:00Z',
      updated_at: '2024-12-10T10:00:00Z',
      attachments_count: 0,
      notes: 'Aluguel mensal',
      tags: ['moradia', 'fixo']
    },
    {
      id: 5,
      description: 'Restaurante Italiano',
      date: '2024-12-15',
      paid: true,
      amount_cents: -12000, // -R$ 120,00
      total_installments: 1,
      installment: 1,
      recurring: false,
      account_id: null,
      category_id: 7,
      contact_id: null,
      credit_card_id: 2,
      credit_card_invoice_id: 2,
      created_at: '2024-12-15T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      attachments_count: 0,
      notes: 'Jantar especial',
      tags: ['restaurante', 'lazer']
    },
    {
      id: 6,
      description: 'Dividendos Ações',
      date: '2024-12-20',
      paid: true,
      amount_cents: 25000, // R$ 250,00
      total_installments: 1,
      installment: 1,
      recurring: false,
      account_id: 2,
      category_id: 5,
      contact_id: null,
      credit_card_id: null,
      credit_card_invoice_id: null,
      created_at: '2024-12-20T10:00:00Z',
      updated_at: '2024-12-20T10:00:00Z',
      attachments_count: 0,
      notes: 'Dividendos trimestrais',
      tags: ['investimento', 'dividendos']
    }
  ];

  async getAccounts(): Promise<Account[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.demoAccounts;
  }

  async getAccount(accountId: number): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const account = this.demoAccounts.find(a => a.id === accountId);
    if (!account) throw new Error('Account not found');
    return account;
  }

  async createAccount(account: Partial<Account>): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAccount: Account = {
      id: Math.max(...this.demoAccounts.map(a => a.id)) + 1,
      name: account.name || 'Nova Conta',
      description: account.description || null,
      archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      default: false,
      type: account.type || 'checking',
      balance_cents: 0
    };
    this.demoAccounts.push(newAccount);
    return newAccount;
  }

  async getCategories(): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.demoCategories;
  }

  async getCategory(categoryId: number): Promise<Category> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const category = this.demoCategories.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async getCreditCards(): Promise<CreditCard[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.demoCreditCards;
  }

  async getCreditCard(cardId: number): Promise<CreditCard> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const card = this.demoCreditCards.find(c => c.id === cardId);
    if (!card) throw new Error('Credit card not found');
    return card;
  }

  async getCreditCardInvoices(cardId: number, startDate?: string, endDate?: string): Promise<CreditCardInvoice[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Demo invoices
    const invoices: CreditCardInvoice[] = [
      {
        id: 1,
        date: '2024-12-15',
        starting_date: '2024-11-16',
        closing_date: '2024-12-15',
        amount_cents: 125000,
        payment_amount_cents: 0,
        balance_cents: 125000,
        previous_balance_cents: 0,
        credit_card_id: cardId
      }
    ];
    
    return invoices.filter(invoice => invoice.credit_card_id === cardId);
  }

  async getTransactions(options: {
    startDate?: string;
    endDate?: string;
    accountId?: number;
    categoryId?: number;
  } = {}): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filteredTransactions = [...this.demoTransactions];
    
    if (options.startDate) {
      filteredTransactions = filteredTransactions.filter(t => t.date >= options.startDate!);
    }
    
    if (options.endDate) {
      filteredTransactions = filteredTransactions.filter(t => t.date <= options.endDate!);
    }
    
    if (options.accountId) {
      filteredTransactions = filteredTransactions.filter(t => t.account_id === options.accountId);
    }
    
    if (options.categoryId) {
      filteredTransactions = filteredTransactions.filter(t => t.category_id === options.categoryId);
    }
    
    return filteredTransactions;
  }

  async getTransaction(transactionId: number): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const transaction = this.demoTransactions.find(t => t.id === transactionId);
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }

  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTransaction: Transaction = {
      id: Math.max(...this.demoTransactions.map(t => t.id)) + 1,
      description: transaction.description || 'Nova Transação',
      date: transaction.date || new Date().toISOString().split('T')[0],
      paid: transaction.paid || false,
      amount_cents: transaction.amount_cents || 0,
      total_installments: transaction.total_installments || 1,
      installment: transaction.installment || 1,
      recurring: transaction.recurring || false,
      account_id: transaction.account_id || null,
      category_id: transaction.category_id || 1,
      contact_id: transaction.contact_id || null,
      credit_card_id: transaction.credit_card_id || null,
      credit_card_invoice_id: transaction.credit_card_invoice_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      attachments_count: 0,
      notes: transaction.notes || null,
      tags: transaction.tags || []
    };
    this.demoTransactions.push(newTransaction);
    return newTransaction;
  }

  async testConnection(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
}
