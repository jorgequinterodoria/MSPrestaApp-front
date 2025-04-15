import { useState } from 'react';

interface Column<T> {
  header: string;
  accessor: (item: T) => string | number;
}

interface PaginatedTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function PaginatedTable<T>({ data, columns }: PaginatedTableProps<T>) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === "all" ? Infinity : parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const paginateData = (data: T[]) => {
    if (rowsPerPage === Infinity) return data;
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  const totalPages = rowsPerPage === Infinity ? 1 : Math.ceil(data.length / rowsPerPage);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="hidden md:table-header-group">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginateData(data).map((item, rowIndex) => (
            <tr key={rowIndex} className="block md:table-row mb-2 md:mb-0">
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className="block md:table-cell px-3 py-1 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700"
                  data-label={column.header}
                >
                  <span className="md:hidden font-medium text-gray-500">{column.header}: </span>
                  {column.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 space-y-2 md:space-y-0">
        <div className="w-full md:w-auto">
          <label htmlFor="rowsPerPage" className="mr-2 text-sm text-gray-700">
            Filas por página:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage === Infinity ? "all" : rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="w-full md:w-auto border border-gray-300 rounded-md p-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value="all">Todas</option>
          </select>
        </div>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-2 py-1 mx-1 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}