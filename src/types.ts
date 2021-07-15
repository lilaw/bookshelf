// model

export type book = {
  title: string;
  author: string;
  coverImageUrl: string;
  publisher: string;
  synopsis: string;
  id: string;
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

export type form = {
  [K in "username" | "password"]: string;
};

export type HttpError =
  | { type: "BadStatus"; status: number; message: string }
  | {
      type: "BadBody";
      message: string;
    };

export type errorInfo = {
  status: number;
  message: string;
};

export type user = {
  [k in "id" | "token" | "username"]: string;
};
