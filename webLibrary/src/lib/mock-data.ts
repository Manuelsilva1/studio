
import type { Book, Offer, SaleRecord, Editorial, Category } from '@/types';

export const mockEditorials: Editorial[] = [
  {
    id: 'editorial_1',
    name: 'Penguin Random House',
    contactPerson: 'Jane Doe',
    email: 'jane.doe@penguinrandomhouse.com',
    phone: '555-1234',
    address: '123 Publishing Lane, New York, NY',
    notes: 'Primary supplier for bestsellers.',
  },
  {
    id: 'editorial_2',
    name: 'HarperCollins',
    contactPerson: 'John Smith',
    email: 'john.smith@harpercollins.com',
    phone: '555-5678',
    address: '456 Book St, London, UK',
    notes: 'Good for classic literature.',
  },
  {
    id: 'editorial_3',
    name: 'Planeta',
    contactPerson: 'Maria Garcia',
    email: 'maria.garcia@planeta.es',
    phone: '555-9012',
    address: 'Av. Diagonal 662-664, Barcelona, Spain',
    notes: 'Strong in Spanish language titles.',
  },
];

export const mockCategoriesData: Category[] = [
  { id: 'cat_1', name: 'Fiction', description: 'Imaginative narrative, typically in prose form.' },
  { id: 'cat_2', name: 'Science Fiction', description: 'Fiction based on imagined future scientific or technological advances.' },
  { id: 'cat_3', name: 'Fantasy', description: 'Fiction with strange or other worldly settings or characters.' },
  { id: 'cat_4', name: 'Mystery', description: 'Fiction dealing with the solution of a crime or the unraveling of secrets.' },
  { id: 'cat_5', name: 'History', description: 'Non-fiction accounts of past events.' },
  { id: 'cat_6', name: 'Biography', description: 'An account of someone\'s life written by someone else.' },
  { id: 'cat_7', name: 'Children\'s', description: 'Books written for children.' },
];
let currentCategories: Category[] = [...mockCategoriesData];


const today = new Date();
const threeDaysAgo = new Date(new Date().setDate(today.getDate() - 3)).toISOString();
const tenDaysAgo = new Date(new Date().setDate(today.getDate() - 10)).toISOString();
const twentyDaysAgo = new Date(new Date().setDate(today.getDate() - 20)).toISOString();
const fortyDaysAgo = new Date(new Date().setDate(today.getDate() - 40)).toISOString();
const sixtyDaysAgo = new Date(new Date().setDate(today.getDate() - 60)).toISOString();


export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic', // This will eventually be replaced by categoryId
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    coverImage: 'https://placehold.co/300x450/1B5E20/E8F5E9.png?text=The+Great+Gatsby',
    price: 12.99,
    stock: 10,
    editorialId: 'editorial_1',
    targetAudience: 'Adults',
    themes: ['Wealth', 'Love', 'American Dream'],
    content: 'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since. "Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven’t had the advantages that you’ve had."',
    publishedYear: 1925,
    isbn: '978-0743273565',
    dateAdded: threeDaysAgo, 
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction', 
    description: 'A novel about the serious issues of rape and racial inequality.',
    coverImage: 'https://placehold.co/300x450/1B5E20/E8F5E9.png?text=To+Kill+a+Mockingbird',
    price: 10.50,
    stock: 15,
    editorialId: 'editorial_2',
    targetAudience: 'Young Adults',
    themes: ['Justice', 'Race', 'Childhood'],
    content: 'When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem’s fears of never being able to play football were assuaged, he was seldom self-conscious about his injury.',
    publishedYear: 1960,
    isbn: '978-0061120084',
    dateAdded: tenDaysAgo, 
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian', 
    description: 'A dystopian social science fiction novel and cautionary tale.',
    coverImage: 'https://placehold.co/300x450/1B5E20/E8F5E9.png?text=1984',
    price: 9.99,
    stock: 20,
    editorialId: 'editorial_1',
    targetAudience: 'Adults',
    themes: ['Totalitarianism', 'Surveillance', 'Truth'],
    content: 'It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.',
    publishedYear: 1949,
    isbn: '978-0451524935',
    dateAdded: twentyDaysAgo, 
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance', 
    description: 'A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.',
    coverImage: 'https://placehold.co/300x450/1B5E20/E8F5E9.png?text=Pride+and+Prejudice',
    price: 8.75,
    stock: 12,
    editorialId: 'editorial_2',
    targetAudience: 'Adults',
    themes: ['Love', 'Class', 'Society'],
    content: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.',
    publishedYear: 1813,
    isbn: '978-0141439518',
    dateAdded: fortyDaysAgo, 
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy', 
    description: 'A fantasy novel about the quest of home-loving Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.',
    coverImage: 'https://placehold.co/300x450/1B5E20/E8F5E9.png?text=The+Hobbit',
    price: 14.00,
    stock: 18,
    editorialId: 'editorial_3',
    targetAudience: 'All Ages',
    themes: ['Adventure', 'Good vs Evil', 'Friendship'],
    content: 'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.',
    publishedYear: 1937,
    isbn: '978-0547928227',
    dateAdded: sixtyDaysAgo, 
  },
  {
    id: '6',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian', 
    description: 'A dystopian novel which explores a futuristic society driven by technology and conformity.',
    coverImage: 'https://placehold.co/300x450/1B5E20/E8F5E9.png?text=Brave+New+World',
    price: 11.25,
    stock: 8,
    editorialId: 'editorial_1',
    targetAudience: 'Adults',
    themes: ['Technology', 'Conformity', 'Utopia'],
    content: 'A squat grey building of only thirty-four stories. Over the main entrance the words, CENTRAL LONDON HATCHERY AND CONDITIONING CENTRE, and, in a shield, the World State\'s motto: COMMUNITY, IDENTITY, STABILITY.',
    publishedYear: 1932,
    isbn: '978-0060850524',
    dateAdded: new Date(new Date().setDate(today.getDate() - 1)).toISOString(), 
  },
  {
    id: '7',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction', 
    description: 'A novel about a few days in the life of a troubled teenage boy, Holden Caulfield.',
    coverImage: 'https://placehold.co/300x450/1B5E20/E8F5E9.png?text=Catcher+in+the+Rye',
    price: 9.50,
    stock: 22,
    editorialId: 'editorial_2',
    targetAudience: 'Young Adults',
    themes: ['Alienation', 'Adolescence', 'Identity'],
    content: 'If you really want to hear about it, the first thing you\'ll probably want to know is where I was born, and what my lousy childhood was like, and how my parents were occupied and all before they had me, and all that David Copperfield kind of crap, but I don\'t feel like going into it, if you want to know the truth.',
    publishedYear: 1951,
    isbn: '978-0316769488',
    dateAdded: new Date(new Date().setDate(today.getDate() - 5)).toISOString(), 
  },
];

export const mockOffers: Offer[] = [
  {
    id: 'offer1',
    name: '10% Off Classics',
    description: 'Get 10% off on all classic books.',
    couponCode: 'CLASSIC10',
    conditions: 'Applies to books in the "Classic" genre.',
  },
  {
    id: 'offer2',
    name: 'Free Shipping Over UYU 1500',
    description: 'Get free shipping on orders over UYU 1500.',
    couponCode: 'FREESHIP1500',
    conditions: 'Minimum purchase of UYU 1500.',
  },
  {
    id: 'offer3',
    name: '2 Fantasy Books for UYU 800',
    description: 'Buy any two fantasy books for just UYU 800.',
    couponCode: 'FANTASYDUO',
    conditions: 'Applies when two books from "Fantasy" genre are in cart.',
  },
];

// MOCK SALES DATA
let mockSales: SaleRecord[] = [
  {
    id: 'sale_1721316011518', 
    timestamp: new Date('2024-07-18T10:00:00Z').toISOString(),
    items: [
      { book: mockBooks[0], quantity: 1, priceAtSale: mockBooks[0].price },
      { book: mockBooks[1], quantity: 1, priceAtSale: mockBooks[1].price }
    ],
    totalAmount: mockBooks[0].price + mockBooks[1].price,
    paymentMethod: 'card',
    customerName: 'Alice Wonderland'
  },
  {
    id: 'sale_1721316022123', 
    timestamp: new Date('2024-07-18T11:30:00Z').toISOString(),
    items: [
      { book: mockBooks[2], quantity: 2, priceAtSale: mockBooks[2].price }
    ],
    totalAmount: mockBooks[2].price * 2,
    paymentMethod: 'cash',
    customerName: 'Bob The Builder'
  }
];

export async function addSaleRecord(sale: SaleRecord): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      mockSales.unshift(sale); 
      resolve();
    }, 100); 
  });
}

export async function getSaleRecords(): Promise<SaleRecord[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...mockSales].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, 100);
  });
}


export const getBookById = (id: string): Book | undefined => mockBooks.find(book => book.id === id);

export const getBooks = (): Book[] => mockBooks;

export const getGenres = (): string[] => Array.from(new Set(mockBooks.map(book => book.genre)));
export const getAuthors = (): string[] => Array.from(new Set(mockBooks.map(book => book.author)));

// Editorial Mock CRUD
let currentEditorials: Editorial[] = [...mockEditorials];

export async function getEditorials(): Promise<Editorial[]> {
  return new Promise(resolve => setTimeout(() => resolve([...currentEditorials]), 100));
}

export async function getEditorialById(id: string): Promise<Editorial | undefined> {
  return new Promise(resolve => setTimeout(() => resolve(currentEditorials.find(e => e.id === id)), 50));
}

export async function saveEditorial(editorialData: Editorial): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = currentEditorials.findIndex(e => e.id === editorialData.id);
      if (index !== -1) {
        currentEditorials[index] = editorialData;
      } else {
        currentEditorials.unshift({ ...editorialData, id: `editorial_${Date.now()}` });
      }
      resolve();
    }, 150);
  });
}

export async function deleteEditorial(editorialId: string): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      currentEditorials = currentEditorials.filter(e => e.id !== editorialId);
      mockBooks.forEach(book => {
        if (book.editorialId === editorialId) {
          book.editorialId = undefined;
        }
      });
      resolve();
    }, 150);
  });
}

// Category Mock CRUD
export async function getCategories(): Promise<Category[]> {
  return new Promise(resolve => setTimeout(() => resolve([...currentCategories].sort((a,b) => a.name.localeCompare(b.name))), 100));
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return new Promise(resolve => setTimeout(() => resolve(currentCategories.find(c => c.id === id)), 50));
}

export async function saveCategory(categoryData: Category): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingCategoryByName = currentCategories.find(
        c => c.name.toLowerCase() === categoryData.name.toLowerCase() && c.id !== categoryData.id
      );
      if (existingCategoryByName) {
        reject(new Error("DUPLICATE_CATEGORY_NAME")); // Specific error for duplicate name
        return;
      }

      const index = currentCategories.findIndex(c => c.id === categoryData.id);
      if (index !== -1) {
        currentCategories[index] = categoryData; // Update
      } else {
        currentCategories.unshift({ ...categoryData, id: `cat_${Date.now()}` }); // Add new
      }
      resolve();
    }, 150);
  });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      currentCategories = currentCategories.filter(c => c.id !== categoryId);
      // Future: Update books that might have this categoryId
      // mockBooks.forEach(book => {
      //   if (book.categoryId === categoryId) {
      //     book.categoryId = undefined;
      //   }
      // });
      resolve();
    }, 150);
  });
}
