export const formatDate = (contentValue) => {
  // removing some extra garbage from different date string formats
  contentValue = contentValue.replace("+0000", "")

  // grabbing date substring portion from contentValue
  let openParenthesesIndex = contentValue.indexOf("(");
  let closeParenthesesIndex = contentValue.indexOf(")");
  let dateString = contentValue.substring(
    openParenthesesIndex + 1,
    closeParenthesesIndex
  );

  // removing the day from the date
  let tempArr = new Date(dateString * 1).toDateString().split(" ");
  tempArr.shift();

  return tempArr.join(" ");
};
