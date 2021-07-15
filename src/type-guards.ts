/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */

import { errorInfo, item, book, user } from "./types";

export const isUserData = isUserLike;

export function isErrorInfoData(rawData: any): rawData is errorInfo {
  return (
    isObject(rawData) &&
    typeof rawData.status === "number" &&
    typeof rawData.message === "string"
  );
}

export function isBookData(rawData: any): rawData is { book: book } {
  return isObject(rawData) && isBookLike(rawData.book);
}

export function isListItemsData(
  rawData: any
): rawData is { listItems: item[] } {
  return (
    isObject(rawData) &&
    Array.isArray(rawData.listItems) &&
    isListItemsLike(rawData.listItems)
  );
}

export function isItemData(rawData: any): rawData is { listItem: item } {
  return isObject(rawData) && isItemLike(rawData.listItem);
}

export function isBootstrapData(
  rawData: any
): rawData is { user: user; listItems: item[] } {
  return (
    isObject(rawData) &&
    isUserLike(rawData.user) &&
    isListItemsLike(rawData.listItems)
  );
}

export function isBooksData(rawData: any): rawData is { books: book[] } {
  return isObject(rawData) && isBooksLike(rawData.books);
}

export function isUserLike(candidate: any): candidate is user {
  return (
    isObject(candidate) &&
    typeof candidate.id === "string" &&
    typeof candidate.username === "string" &&
    typeof candidate.token === "string"
  );
}

export function isBookLike(candidate: any): candidate is book {
  if (candidate !== null && typeof candidate === "object") {
    return [
      "title",
      "author",
      "coverImageUrl",
      "id",
      "publisher",
      "synopsis",
      "pageCount",
    ].every((key) => candidate[key] !== undefined);
  }
  return false;
}

export function isItemLike(candidate: any): candidate is item {
  if (candidate !== null && typeof candidate === "object") {
    return (
      isBookLike(candidate.book) &&
      typeof candidate.bookId === "string" &&
      (candidate.finishDate === null ||
        typeof candidate.finishDate === "number") &&
      typeof candidate.id === "string" &&
      typeof candidate.notes === "string" &&
      typeof candidate.ownerId === "string" &&
      typeof candidate.rating === "number" &&
      typeof candidate.startDate === "number"
    );
  }
  return false;
}

export function isListItemsLike(candidate: any): candidate is item[] {
  return isTypedArray<item>(candidate, isItemLike);
}
function isBooksLike(candidate: any): candidate is book[] {
  return isTypedArray<book>(candidate, isBookLike);
}

export function isTypedArray<T>(
  arr: unknown,
  check: (x: any) => x is T
): arr is T[] {
  if (!Array.isArray(arr)) return false;
  if (arr.some((item) => !check(item))) return false;
  return true;
}

function isObject(candidate: any): candidate is Record<string, unknown> {
  if (candidate !== null && typeof candidate === "object") return true;
  return false;
}
