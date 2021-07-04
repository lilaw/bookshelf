// model 

export type book = {
  [K in
    | "title"
    | "author"
    | "coverImageUrl"
    | "id"
    | "publisher"
    | "synopsis"]: number;
} & {
  pageCount: number;
};

export type item = {
  book: book;
  bookId: string;
  finishDate: null | number;
  id: string;
  notes: string;
  ownerId: string;
  rating: number;
  startDate: number;
};
