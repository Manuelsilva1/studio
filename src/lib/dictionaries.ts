
import 'server-only'; // Ensures this runs only on the server

// Define a type for the dictionary structure for better type safety
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
      pointOfSale: string;
      sales: string;
      statusSoon: string;
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
      orderSummaryTitle: string; // This was missing from type, but present in JSONs
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
      errorCompletingSale: string; // This was missing from type, but present in JSONs
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
    };
  };
};

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default as Dictionary),
  es: () => import('@/dictionaries/es.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  if (locale === 'es') {
    return dictionaries.es();
  }
  // Default to English if locale is not 'es' or if it's undefined/invalid
  return dictionaries.en();
};
