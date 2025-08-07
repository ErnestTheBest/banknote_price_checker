# Banknote Price Checker

This tool checks prices for products on veikals.banknote.lv using custom filters and outputs results to separate files in both JSON and HTML formats.

## Installation

1. **Clone or download this repository.**
2. Open a terminal in the project directory.
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage

To run the script:
```sh
npm start
```

Results will be saved in the `results/` directory, with one file per config entry.

### Output Formats
- **JSON:** Each config entry produces a `*_results.json` file with the raw filtered data.
- **HTML:** Each config entry also produces a `*_results.html` file with a presentable table view of the results. Open these files in your browser for a clean, readable format.

The HTML generation logic is modularized in `htmlGenerator.js`. You can customize the table output by editing this file.

## Configuration: `config.json`

The `config.json` file is an array of filter objects. Each object can have the following fields:

- `title` (string, required): A descriptive name for this filter. Used for naming the result file (in snake_case).
- `filter` (string, required): The filter query string after `/lv/` in the veikals.banknote.lv URL (e.g., `filter-products?...`).
- `max_price` (number, required): Maximum price for results.
- `search_params` (array of strings, required): List of keywords or article numbers to search for in the product title or article.
- `exclude_params` (array of strings, optional): List of keywords to exclude from results (e.g., to skip certain models).
- `city` (string, optional): Only include results from branches in this city (case-insensitive, matches substring).

### Example `config.json`
```json
[
  {
    "title": "MacBook Results",
    "filter": "filter-products?per_page=120&search=MacBook&min_price=0&max_price=9500&sort=1&item_conditions=0,2,1",
    "max_price": 500,
    "search_params": ["a2337", "a2338", "m2", "m1", "m3", "m4"],
    "exclude_params": [],
    "city": "Rīga"
  }
]
```

You can add multiple filter objects to the array for different searches. Each will produce its own result file in the `results/` directory.
