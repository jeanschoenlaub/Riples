import React from 'react';

interface StyledTableProps {
  headers: string[];
  columnWidths?: string[]; // Optional widths for columns
  children: React.ReactNode;
}

export const StyledTable: React.FC<StyledTableProps> = ({ headers, columnWidths, children }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500" style={{ tableLayout: 'fixed' }}>
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 border-r py-3 ${index !== 1 ? 'text-center' : ''} ${index !== 0 && index !== headers.length - 1 ? 'hidden md:table-cell' : ''}`}
                style={{ width: columnWidths?.[index] ?? 'auto' }} // Use provided width or default to 'auto'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
