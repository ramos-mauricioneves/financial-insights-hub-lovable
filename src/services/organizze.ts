import { OrganizzeCredentials, User, Account, Category, CreditCard, Transaction, CreditCardInvoice } from '@/types/organizze';

const API_BASE_URL = 'https://api.organizze.com.br/rest/v2';

class OrganizzeAPI {
  private credentials: OrganizzeCredentials;

  constructor(credentials: OrganizzeCredentials) {
    this.credentials = credentials;
  }

  private getAuthHeaders() {
    const auth = btoa(`${this.credentials.email}:${this.credentials.token}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Organizze Insight Hub (contact@example.com)',
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    return response.json();
  }

  // User methods
  async getUser(userId: number): Promise<User> {
    return this.makeRequest<User>(`/users/${userId}`);
  }

  // Account methods
  async getAccounts(): Promise<Account[]> {
    return this.makeRequest<Account[]>('/accounts');
  }

  async getAccount(accountId: number): Promise<Account> {
    return this.makeRequest<Account>(`/accounts/${accountId}`);
  }

  async createAccount(account: Partial<Account>): Promise<Account> {
    return this.makeRequest<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return this.makeRequest<Category[]>('/categories');
  }

  async getCategory(categoryId: number): Promise<Category> {
    return this.makeRequest<Category>(`/categories/${categoryId}`);
  }

  // Credit Card methods
  async getCreditCards(): Promise<CreditCard[]> {
    return this.makeRequest<CreditCard[]>('/credit_cards');
  }

  async getCreditCard(cardId: number): Promise<CreditCard> {
    return this.makeRequest<CreditCard>(`/credit_cards/${cardId}`);
  }

  async getCreditCardInvoices(cardId: number, startDate?: string, endDate?: string): Promise<CreditCardInvoice[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest<CreditCardInvoice[]>(`/credit_cards/${cardId}/invoices${query}`);
  }

  // Transaction methods (movimentações)
  async getTransactions(options: {
    startDate?: string;
    endDate?: string;
    accountId?: number;
    categoryId?: number;
  } = {}): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (options.startDate) params.append('start_date', options.startDate);
    if (options.endDate) params.append('end_date', options.endDate);
    if (options.accountId) params.append('account_id', options.accountId.toString());
    if (options.categoryId) params.append('category_id', options.categoryId.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest<Transaction[]>(`/transactions${query}`);
  }

  async getTransaction(transactionId: number): Promise<Transaction> {
    return this.makeRequest<Transaction>(`/transactions/${transactionId}`);
  }

  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    return this.makeRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.getAccounts();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export default OrganizzeAPI;