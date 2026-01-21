export const calculateDueDate = (days: number) => {
  const currentDate = new Date();
  const dueDate = new Date(currentDate);

  dueDate.setDate(currentDate.getDate() + days);

  const year = dueDate.getFullYear();
  const month = String(dueDate.getMonth() + 1).padStart(2, "0");
  const day = String(dueDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

