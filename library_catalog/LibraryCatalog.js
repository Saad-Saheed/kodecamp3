export default function LibraryCatalog() {
    this.books = [];

    this.addBook = function (...book) {
        this.books.unshift(...book);
    }

    this[Symbol.iterator] = function () {
        let i = 0;
        return {
            next: () => {
                if (i < this.books.length) {
                    return { value: this.books[i++], done: false };
                } else {
                    return { done: true };
                }
            }
        };
    }

    this.getBooksByAuthor = function (author) {
        return this.books.filter((book) => {
            // partial search
            if (book)
                return book.author.toString().toLowerCase().includes(author.toString().toLowerCase());
        })
    }
}

LibraryCatalog.prototype = {
    constructor: LibraryCatalog,
    bookIterator: function* () {
        let i = 0;
        while (i < this.books.length) {
            yield this.books[i++];
        }
    }
};
