export const convertDate = (date) =>
  new Date(date).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
  });
