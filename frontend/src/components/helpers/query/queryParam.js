// Constructs a query param string ex. '?search=someObject&filter=someOtherObject'
export const constructQueryParam = (path) => {
  let queryParamString = "?";
  if (
    typeof path != "undefined" &&
    path.hasOwnProperty("goTo") &&
    typeof path.goTo != "undefined" &&
    path.goTo.hasOwnProperty("queryParams") &&
    typeof path.goTo.queryParams != "undefined"
  ) {
    for (const paramName in path.goTo.queryParams) {
      queryParamString = queryParamString.concat(
        paramName,
        "=",
        path.goTo.queryParams[paramName],
        "&"
      );
    }
  } else {
    queryParamString = "";
  }
  queryParamString = queryParamString.slice(0, -1);
  return queryParamString;
};
