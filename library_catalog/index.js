import Book from "./Book.js";
import LibraryCatalog from "./LibraryCatalog.js";

const b1 = new Book("The Light", "Actor 1", "Psychology");
const b2 = new Book("Kittab Taoheed", "Muhammad bn Abdulwahab", "Religions, Creed");
const catalog1 = new LibraryCatalog();
catalog1.addBook(b1, b2);

console.log("\nLIBRARY CATALOG BOOK ITERATOR:\n");
const CatalogIterator = catalog1.bookIterator();
console.log(CatalogIterator.next());
console.log(CatalogIterator.next());
console.log(CatalogIterator.next());


console.log("\n\nLIBRARY CATALOG BOOK ITERABLE:\n");
for (const book of catalog1.symbolIterator) {
    console.log(book);
}

console.log("\n\nGET BOOK BY AUTHOR NAME:\n");
console.log(catalog1.getBooksByAuthor("bn"));

