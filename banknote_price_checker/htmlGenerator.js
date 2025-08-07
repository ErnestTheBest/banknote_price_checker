function generateHtmlTable(title, results) {
  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price' },
    { key: 'actual_price', label: 'Actual Price' },
    { key: 'article', label: 'Article' },
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
    th { background: #f4f4f4; }
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
      ${results.map(item => `
        <tr>
          <td>${item.title || ''}</td>
          <td>${item.price || ''}</td>
          <td>${item.actual_price || ''}</td>
          <td>${item.article || ''}</td>
          <td>${item.url ? `<a href="${item.url}" target="_blank">link</a>` : ''}</td>
          <td>${item.branche && item.branche.final_title ? item.branche.final_title : ''}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;
}

module.exports = { generateHtmlTable };
