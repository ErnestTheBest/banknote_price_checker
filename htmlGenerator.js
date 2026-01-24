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

function generateIndexPage(config) {
  // Helper function to convert title to snake_case file name (same logic as index.js)
  function toSnakeCase(str) {
    return str
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '_')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase()
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  // Generate report links from config
  const reportLinks = config.map(entry => {
    const baseName = toSnakeCase(entry.title.replace(/results?/i, ''));
    const htmlFileName = `results/${baseName}_results.html`;
    return {
      title: entry.title,
      url: htmlFileName
    };
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Banknote Price Checker - Reports</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 2em; 
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }
    h1 { 
      color: #333; 
      border-bottom: 2px solid #0074d9;
      padding-bottom: 0.5em;
    }
    .description {
      color: #666;
      margin-bottom: 2em;
      line-height: 1.6;
    }
    .reports-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5em;
      margin-top: 2em;
    }
    .report-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 1.5em;
      background: #fafafa;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .report-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background: #fff;
    }
    .report-card h2 {
      margin-top: 0;
      color: #0074d9;
      font-size: 1.3em;
    }
    .report-card a {
      display: inline-block;
      margin-top: 1em;
      color: #0074d9;
      text-decoration: none;
      font-weight: bold;
      padding: 0.5em 1em;
      border: 1px solid #0074d9;
      border-radius: 4px;
      transition: background-color 0.2s, color 0.2s;
    }
    .report-card a:hover {
      background-color: #0074d9;
      color: white;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <h1>Banknote Price Checker</h1>
  <div class="description">
    <p>This tool checks prices for products on veikals.banknote.lv using custom filters and outputs results in both JSON and HTML formats.</p>
    <p>Select a report below to view the detailed results:</p>
  </div>
  <div class="reports-container">
    ${reportLinks.map(report => `
      <div class="report-card">
        <h2>${report.title}</h2>
        <a href="${report.url}">View Report →</a>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
}

module.exports = { generateHtmlTable, generateIndexPage };
