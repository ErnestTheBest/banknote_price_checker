const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { generateHtmlTable } = require('./htmlGenerator');

const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const BASE_URL = 'https://veikals.banknote.lv/lv/';

async function fetchAndFilter({ filter, max_price, search_params, exclude_params = [], city }) {
  const url = BASE_URL + filter;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BanknotePriceChecker/1.0)'
      }
    });
    const data = response.data.data || [];
    // Filter by max_price, search_params, exclude_params, and city
    const filtered = data.filter(item => {
      const price = parseFloat(item.actual_price || item.price || 0);
      const matchesPrice = price <= max_price;
      const matchesSearch = search_params.some(param =>
        (item.article && item.article.toString().includes(param)) ||
        (item.title && item.title.toLowerCase().includes(param.toLowerCase()))
      );
      const matchesExclude = exclude_params.some(param =>
        (item.article && item.article.toString().toLowerCase().includes(param.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(param.toLowerCase()))
      );
      const matchesCity = city ? (
        item.branche && item.branche.city && item.branche.city.toLowerCase().includes(city.toLowerCase())
      ) : true;
      return matchesPrice && matchesSearch && !matchesExclude && matchesCity;
    });
    return filtered;
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
    return [];
  }
}

const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

function toSnakeCase(str) {
  // Remove non-alphanumeric, replace spaces with _, lowercase, and ensure single _
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

(async () => {
  for (const entry of config) {
    const baseName = toSnakeCase(entry.title.replace(/results?/i, ''));
    const fileName = baseName + '_results.json';
    const htmlFileName = baseName + '_results.html';
    const results = await fetchAndFilter(entry);
    fs.writeFileSync(
      path.join(resultsDir, fileName),
      JSON.stringify(results, null, 2),
      'utf-8'
    );
    fs.writeFileSync(
      path.join(resultsDir, htmlFileName),
      generateHtmlTable(entry.title, results),
      'utf-8'
    );
    console.log(`Results for '${entry.title}' saved to results/${fileName} and results/${htmlFileName}`);
  }
})();
