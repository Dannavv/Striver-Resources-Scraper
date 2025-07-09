# Striver Resources Scraper

A Chrome extension to scrape Striver's SDE Sheet, A2Z Sheet, and CP Sheet problem data from [takeuforward.org](https://takeuforward.org) and export it as structured JSON.

---

## 🚀 Features

- Scrapes problem tables from Striver's **SDE**, **A2Z**, and **CP Sheets**.
- Extracts:
  - Problem titles
  - Links
  - Difficulty
  - Company tags
  - Solution links
- Outputs clean, structured **JSON** for further use or analysis.
- Easy-to-use **popup interface**.

---

## 🔧 Usage

### 1. Install the Extension:

- Open Chrome and go to: `chrome://extensions`
- Enable **Developer Mode**
- Click **Load unpacked**
- Select this extension's folder

### 2. Scrape Data:

- Navigate to the desired Striver Sheet page on [takeuforward.org](https://takeuforward.org)
- Click the extension icon in the toolbar
- Press the **"Scrape"** button

### 3. View Output:

- Open the browser's **Console (F12 > Console tab)**
- The scraped data will be logged in **JSON format**

---

## 📁 Project Structure

```
.
├── popup.js           # Main scraping logic
├── popup.html         # Popup UI
├── manifest.json      # Chrome extension config
├── extracted_data/    # Example output JSON files
└── main.py            # (Optional) post-processing or automation script
```

---

## 🛠 Development

- Modify `popup.js` to update scraping logic
- Update `manifest.json` for permissions or metadata
- Use `main.py` to clean/process/export scraped data

---

## 📄 License

Open to use

---

> **Note**: This project is intended for **educational purposes only**. Please respect the [terms of use](https://takeuforward.org/terms-of-use/) of takeuforward.org.
