export const longDate = (date: string) => {
   const givenTime = new Date(date);
   const dateConverted = givenTime.toLocaleDateString("en-US", {
     year: "numeric",
     month: "long",
     day: "numeric",
   });
   return dateConverted;
 };