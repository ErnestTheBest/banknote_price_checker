function generateHtmlTable(title, results) {
  const columns = [
    { key: 'number', label: '#' },
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price' },
    { key: 'actual_price', label: 'Actual Price' },
    { key: 'article', label: 'Article' },
    { key: 'warranty_term', label: 'Warranty' },
    { key: 'url', label: 'URL' },
    { key: 'branch', label: 'Branch' }
  ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { 
      background: #f4f4f4; 
      cursor: pointer; 
      user-select: none;
      position: relative;
    }
    th:hover { background: #e8e8e8; }
    th.sortable::after {
      content: ' ↕';
      color: #999;
      font-size: 0.8em;
    }
    th.sort-asc::after {
      content: ' ↑';
      color: #0074d9;
      font-size: 0.8em;
    }
    th.sort-desc::after {
      content: ' ↓';
      color: #0074d9;
      font-size: 0.8em;
    }
    tr:nth-child(even) { background: #fafafa; }
    a { color: #0074d9; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead>
      <tr>
        ${columns.map(col => `<th>${col.label}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${results.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.title || ''}</td>
          <td>${item.price || ''}</td>
          <td>${item.actual_price || ''}</td>
          <td>${item.article || ''}</td>
          <td>${item.warranty_term || ''}</td>
          <td>${item.url ? `<a href="${item.url}" target="_blank">link</a>` : ''}</td>
          <td>${item.branche && item.branche.final_title ? item.branche.final_title : ''}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const table = document.querySelector('table');
      const headers = table.querySelectorAll('th');
      let currentSort = { column: null, direction: 'asc' };

      // Add sortable class to all headers
      headers.forEach(header => {
        header.classList.add('sortable');
      });

      // Add click event listeners to headers
      headers.forEach((header, index) => {
        header.addEventListener('click', () => {
          sortTable(index);
        });
      });

      function sortTable(columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Remove previous sort classes
        headers.forEach(header => {
          header.classList.remove('sort-asc', 'sort-desc');
          header.classList.add('sortable');
        });

        // Determine sort direction
        let direction = 'asc';
        if (currentSort.column === columnIndex && currentSort.direction === 'asc') {
          direction = 'desc';
        }

        // Update current sort state
        currentSort = { column: columnIndex, direction: direction };

        // Add sort indicator to current header
        headers[columnIndex].classList.remove('sortable');
        headers[columnIndex].classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');

        // Sort rows
        rows.sort((a, b) => {
          const aValue = getCellValue(a, columnIndex);
          const bValue = getCellValue(b, columnIndex);
          
          let comparison = 0;
          
          // Handle numeric values
          if (!isNaN(aValue) && !isNaN(bValue)) {
            comparison = parseFloat(aValue) - parseFloat(bValue);
          } else {
            // Handle text values
            comparison = aValue.toString().localeCompare(bValue.toString());
          }
          
          return direction === 'asc' ? comparison : -comparison;
        });

        // Reorder rows in the table
        rows.forEach(row => tbody.appendChild(row));
      }

      function getCellValue(row, columnIndex) {
        const cell = row.cells[columnIndex];
        // For numbering column, return the numeric value
        if (columnIndex === 0) { // Number column
          return parseInt(cell.textContent) || 0;
        }
        // For URL column, get the href value
        if (columnIndex === 6) { // URL column (updated index)
          const link = cell.querySelector('a');
          return link ? link.href : cell.textContent;
        }
        return cell.textContent.trim();
      }
    });
  </script>
</body>
</html>`;
}

module.exports = { generateHtmlTable };
