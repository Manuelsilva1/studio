
import type { Book, Offer, SaleRecord, Editorial } from '@/types';

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

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
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
    name: 'Free Shipping Over $50',
    description: 'Get free shipping on orders over $50.',
    couponCode: 'FREESHIP50',
    conditions: 'Minimum purchase of $50.',
  },
  {
    id: 'offer3',
    name: '2 Fantasy Books for $25',
    description: 'Buy any two fantasy books for just $25.',
    couponCode: 'FANTASYDUO',
    conditions: 'Applies when two books from "Fantasy" genre are in cart.',
  },
];

// MOCK SALES DATA
let mockSales: SaleRecord[] = [
  {
    id: 'sale_1721316011518', // Example ID
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
    id: 'sale_1721316022123', // Example ID
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
      mockSales.unshift(sale); // Add to the beginning of the array
      resolve();
    }, 100); // Simulate async operation
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
      // Also remove this editorialId from any books
      mockBooks.forEach(book => {
        if (book.editorialId === editorialId) {
          book.editorialId = undefined;
        }
      });
      resolve();
    }, 150);
  });
}
