
export interface Editorial {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  price: number;
  stock: number;
  editorialId?: string; // ID de la editorial
  targetAudience?: string;
  themes?: string[];
  content?: string; // For book summary generation, can be a longer description or sample text
  publishedYear?: number;
  isbn?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  couponCode: string;
  conditions: string; // e.g., "min_purchase_50", "category_fiction"
}

// For GenAI flow inputs, ensuring consistency
export type GenAICartItem = {
  name: string;
  price: number;
  quantity: number;
};

export type GenAIAvailableOffer = {
  name: string;
  description: string;
  couponCode: string;
  conditions: string;
};

export interface SaleItem {
  book: Book; // Or just bookId if you prefer to not duplicate all book data
  quantity: number;
  priceAtSale: number; // Price of the book at the time of sale
}

export interface SaleRecord {
  id: string;
  timestamp: string; // ISO string format for dates
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  customerName?: string; // Optional customer name
}

// Moved Dictionary type here
export type Dictionary = {
  siteName: string;
  description: string;
  locale: string;
  header: {
    catalog: string;
    cart: string;
    admin: string;
    toggleTheme: string;
    changeLanguage: string;
  };
  footer: {
    copyright: string;
  };
  splashPage: {
    welcome: string;
    tagline: string;
    enterCatalog: string;
  };
  languages: {
    english: string;
    spanish: string;
  };
  cartPage: {
    emptyCartTitle: string;
    emptyCartMessage: string;
    startShopping: string;
    yourShoppingCart: string;
    itemsSuffix: string;
    clearCart: string;
    orderSummary: string;
    subtotal: string;
    shipping: string;
    free: string;
    total: string;
    proceedToCheckout: string;
  };
  catalogPage: {
    pageTitle: string;
    searchPlaceholder: string;
    noBooksMatch: string;
    previousPage: string;
    nextPage: string;
    pageIndicator: string;
  };
  checkoutForm: {
    secureCheckout: string;
    fillDetails: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    stateLabel: string;
    statePlaceholder: string;
    zipLabel: string;
    zipPlaceholder: string;
    paymentMethodLabel: string;
    paymentMethodPlaceholder: string;
    paymentMethodDescription: string;
    placeOrder: string;
    orderSubmittedTitle: string;
    orderSubmittedDescription: string;
    orderSubmittedConfirmation: string;
    continueShopping: string;
    emptyCartTitle: string;
    emptyCartDescription: string;
    returnToCart: string;
    orderSubmittedToast: string;
    orderSubmittedToastDesc: string;
    checkoutErrorToast: string;
    checkoutErrorToastDesc: string;
  };
  loginPage: {
    title: string;
    description: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginButton: string;
    loggingIn: string;
  };
  adminPanel: {
    sidebar: {
      dashboard: string;
      manageBooks: string;
      manageUsers: string;
      statusSoon: string;
      pointOfSale: string;
      sales: string;
      manageEditorials: string;
    };
    header: {
      titleSuffix: string;
      storefrontLink: string;
    };
    footer: {
      text: string;
    };
    dashboardPage: {
      title: string;
      manageBooksCard: {
        title: string;
        booksCount: string;
        inCatalog: string;
        viewBooksButton: string;
      };
      totalSalesCard: {
        title: string;
        amount: string;
        fromLastMonth: string;
        viewReportButton: string;
      };
      registeredUsersCard: {
        title: string;
        usersCount: string;
        newThisWeek: string;
        manageUsersButton: string;
      };
      quickActionsCard: {
        title: string;
        addNewBookButton: string;
        generateReportButton: string;
        viewLogsButton: string;
      };
    };
    booksPage: {
      title: string;
    };
    editorialsPage: {
      title: string;
      addNewEditorial: string;
      editEditorial: string;
      editorialNameLabel: string;
      editorialNamePlaceholder: string;
      contactPersonLabel: string;
      contactPersonPlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      addressLabel: string;
      addressPlaceholder: string;
      notesLabel: string;
      notesPlaceholder: string;
      deleteConfirmationTitle: string;
      deleteConfirmationMessage: string;
      deleteButton: string;
      cancelButton: string;
      saveButton: string;
      addButton: string;
      noEditorialsFound: string;
      tableHeaderName: string;
      tableHeaderContact: string;
      tableHeaderEmail: string;
      tableHeaderActions: string;
      toastEditorialSaved: string;
      toastEditorialDeleted: string;
      toastError: string;
    };
    posPage: {
      title: string;
      searchBooksPlaceholder: string;
      noResults: string;
      addToOrder: string;
      currentOrderTitle: string;
      emptyOrder: string;
      bookColumn: string;
      priceColumn: string;
      quantityColumn: string;
      totalColumn: string;
      actionsColumn: string;
      orderSummaryTitle: string;
      subtotal: string;
      grandTotal: string;
      paymentMethodTitle: string;
      cash: string;
      card: string;
      customerNameLabel: string;
      customerNamePlaceholder: string;
      completeSaleButton: string;
      processingSale: string;
      saleCompletedToastTitle: string;
      saleCompletedToastDesc: string;
      errorCompletingSale: string;
      ticketDialog: {
        title: string;
        saleId: string;
        date: string;
        customer: string;
        item: string;
        qty: string;
        price: string;
        total: string;
        subtotal: string;
        grandTotal: string;
        paymentMethod: string;
        cash: string;
        card: string;
        notApplicableShort: string;
        printButton: string;
        closeButton: string;
      };
    };
    salesPage: {
      title: string;
      noSalesFound: string;
      tableHeaderSaleId: string;
      tableHeaderDate: string;
      tableHeaderCustomer: string;
      tableHeaderTotalAmount: string;
      tableHeaderPaymentMethod: string;
      tableHeaderActions: string;
      viewTicketButton: string;
      cash: string;
      card: string;
      notApplicable: string;
      filterByYearLabel: string;
      filterByMonthLabel: string;
      filterByPaymentMethodLabel: string;
      allYears: string;
      allMonths: string;
      allPaymentMethods: string;
      resetFiltersButton: string;
      months: {
        january: string; february: string; march: string; april: string;
        may: string; june: string; july: string; august: string;
        september: string; october: string; november: string; december: string;
      };
    };
  };
};
