export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatCurrency = (amount: number): string => {
 
 const numAmount = Number(amount);
  
 if (isNaN(numAmount)) {
   return "$0";
 }
 
 return `$${numAmount.toLocaleString("es-CO", { 
   minimumFractionDigits: 0,
   maximumFractionDigits: 0,
   useGrouping: true 
 })}`;
};

export const formatDateWithMonthName = (dateString: string): string => {
  const [datePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-');
  
  // Array con los nombres abreviados de los meses en español
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  // El mes en JavaScript es base-0 (0-11), así que restamos 1
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = months[monthIndex];
  
  // Retornar la fecha en el formato deseado
  return `${parseInt(day, 10)}-${monthName}-${year}`;
};