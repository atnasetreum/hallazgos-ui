export type SortOrder = "asc" | "desc";

interface TriStateSortResult<T extends string> {
  nextOrder: SortOrder;
  nextOrderBy: T | null;
}

export const resolveTriStateSort = <T extends string>(
  order: SortOrder,
  orderBy: T | null,
  property: T,
): TriStateSortResult<T> => {
  if (orderBy !== property) {
    return {
      nextOrder: "asc",
      nextOrderBy: property,
    };
  }

  if (order === "asc") {
    return {
      nextOrder: "desc",
      nextOrderBy: property,
    };
  }

  return {
    nextOrder: "asc",
    nextOrderBy: null,
  };
};
