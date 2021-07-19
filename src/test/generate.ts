import faker from "faker";
import { book, item } from "@/types";
import type { book as Book, user } from "@/types";

type serverUser = {
  id: string;
  username: string;
  password: string;
};

export function buildUser(): serverUser {
  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
}

export function buildBook(override?: { [p in keyof book]?: book[p] }): book {
  return {
    title: faker.lorem.word(),
    author: faker.name.findName(),
    publisher: faker.company.companyName(),
    synopsis: faker.lorem.paragraph(2),
    id: faker.datatype.uuid(),
    pageCount: faker.datatype.number(300),
    coverImageUrl: faker.image.dataUri(),
    ...override,
  };
}

export function buildListItem(
  override?: { [p in keyof item]?: item[p] },
  user?: user
): item {
  const bookId =
    override && override.book ? override.book.id : faker.datatype.uuid();
  const ownerId = user && user.id ? user.id : faker.datatype.uuid();
  return {
    book: buildBook({ id: bookId }),
    bookId: bookId,
    finishDate: null,
    id: faker.datatype.uuid(),
    notes: faker.lorem.sentence(),
    rating: faker.datatype.number(5),
    startDate: Date.now(),
    ownerId: ownerId,
    ...override,
  };
}
