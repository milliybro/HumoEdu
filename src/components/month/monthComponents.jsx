import React from 'react';

const MonthComponent = ({ monthly }) => {
  // Function to convert numeric month to month name
  const getMonthName = (month) => {
    const months = ["Yanvar", "Febral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
    return months[month - 1]; // Adjust for zero-based index
  }

  // Check if monthly value is within range
  let monthOutput;
  if (monthly >= 1 && monthly <= 12) {
    monthOutput = "Fan / " + getMonthName(monthly) + " oy uchun";
  } else {
    monthOutput = "Noma'lum";
  }

  return (
    <div style={{fontWeight: "700"}}>
      {monthOutput}
    </div>
  );
}

export default MonthComponent;
