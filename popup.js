document.getElementById("scrape").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function () {
            // Helper: Find the closest previous sibling or ancestor with the day label class
            function findDayLabel(table) {
                // Try previous siblings first
                let el = table.previousElementSibling;
                while (el) {
                    const dayEl = el.querySelector?.('.text-xs.lg\\:text-lg');
                    if (dayEl) return dayEl.textContent.trim();
                    el = el.previousElementSibling;
                }
                // If not found, try ancestors
                el = table.parentElement;
                while (el) {
                    const dayEl = el.querySelector?.('.text-xs.lg\\:text-lg');
                    if (dayEl) return dayEl.textContent.trim();
                    el = el.parentElement;
                }
                return null;
            }

            function scrapeStriverSDESheet() {
                // This script scrapes the Striver's SDE Sheet from takeuforward.org
                const tables = Array.from(document.querySelectorAll('table')).filter(table =>
                    table.classList.contains('table-auto') &&
                    table.classList.contains('w-full') &&
                    table.classList.contains('font-dmSans') &&
                    table.classList.contains('divide-y') &&
                    table.classList.contains('divide-gray-200') &&
                    table.classList.contains('dark:divide-[#363636]') &&
                    table.classList.contains('rounded-xl')
                );

                const result = tables.map((table) => {
                    // Find the day label for this table
                    const day = findDayLabel(table);

                    // Extract headers
                    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());

                    // Extract all rows except the header
                    const rows = Array.from(table.querySelectorAll('tr')).slice(1);

                    // Extract cells from each row as an object with header as key
                    const rowData = rows.map(row => {
                        const cells = Array.from(row.querySelectorAll('td, th'));
                        const obj = {};
                        cells.forEach((cell, i) => {
                            const key = headers[i] || `col${i + 1}`;
                            obj[key] = cell.textContent.trim();
                            const link = cell.querySelector('a')?.href;
                            if (link) obj[`${key}_link`] = link;
                        });
                        return obj;
                    });

                    return {
                        day: day || null,
                        problems: rowData
                    };
                });

                // Output as pretty JSON
                console.log(JSON.stringify(result, null, 2));
                return result;
            }

            function findDayAndLecLabels(table) {
                let el = table.previousElementSibling;
                let step = null, lec = null;

                while (el) {
                    const labelEl = el.querySelector?.('.text-xs.lg\\:text-lg');
                    if (labelEl) {
                        const text = labelEl.textContent.trim();
                        if (!step && text.includes('Step')) step = text;
                        if (!lec && text.includes('Lec')) lec = text;
                        if (step && lec) break; // Stop if both found
                    }
                    el = el.previousElementSibling;
                }

                // If not found, try walking up the DOM tree
                if (!step || !lec) {
                    el = table.parentElement;
                    while (el) {
                        const labelEl = el.querySelector?.('.text-xs.lg\\:text-lg');
                        if (labelEl) {
                            const text = labelEl.textContent.trim();
                            if (!step && text.includes('Step')) step = text;
                            if (!lec && text.includes('Lec')) lec = text;
                            if (step && lec) break;
                        }
                        el = el.parentElement;
                    }
                }

                return { step, lec };
            }
            function scrapeStriverA2ZSheet() {
                const tables = Array.from(document.querySelectorAll('table')).filter(table =>
                    table.classList.contains('table-auto') &&
                    table.classList.contains('w-full') &&
                    table.classList.contains('font-dmSans') &&
                    table.classList.contains('divide-y') &&
                    table.classList.contains('divide-gray-200') &&
                    table.classList.contains('dark:divide-[#363636]') &&
                    table.classList.contains('rounded-xl')
                );

                const groupedResult = {};

                tables.forEach((table) => {
                    const { step, lec } = findDayAndLecLabels(table);
                    const stepKey = step || 'Unknown Step';
                    const lecKey = lec || 'Unknown Lec';

                    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
                    const rows = Array.from(table.querySelectorAll('tr')).slice(1);

                    const rowData = rows.map(row => {
                        const cells = Array.from(row.querySelectorAll('td, th'));
                        const obj = {};
                        cells.forEach((cell, i) => {
                            const key = headers[i] || `col${i + 1}`;
                            obj[key] = cell.textContent.trim();
                            const link = cell.querySelector('a')?.href;
                            if (link) obj[`${key}_link`] = link;
                        });
                        return obj;
                    });

                    if (!groupedResult[stepKey]) groupedResult[stepKey] = {};
                    if (!groupedResult[stepKey][lecKey]) groupedResult[stepKey][lecKey] = [];

                    groupedResult[stepKey][lecKey].push(...rowData);
                });

                console.log(JSON.stringify(groupedResult, null, 2));
                return groupedResult;
            }

            function scrapeStriverCPSheet() {
                const result = [];

                document.querySelectorAll(".accordion-container .text-xs.lg\\:text-lg").forEach(dayDiv => {
                    const dayTitle = dayDiv.textContent.trim();
                    const table = dayDiv.closest("div").nextElementSibling?.querySelector("table");
                    const dayData = [];

                    if (table) {
                        const rows = table.querySelectorAll("tbody tr");
                        rows.forEach(row => {
                            const cells = row.querySelectorAll("td");
                            if (cells.length > 0) {
                                dayData.push({
                                    title: cells[0].textContent.trim(),
                                    link: cells[0].querySelector("a")?.href || null,
                                    difficulty: cells[1]?.textContent.trim() || null,
                                    company_tags: cells[2]?.textContent.trim() || null,
                                    solution: cells[3]?.querySelector("a")?.href || null
                                });
                            }
                        });
                    }

                    result.push({ day: dayTitle, problems: dayData });
                });

                return result;
            }


            // scrapeStriverSDESheet();

            // scrapeStriverA2ZSheet();


            // const data = scrapeStriverSdeSheet();
            // console.log(JSON.stringify(data, null, 2));
        }
    });
});

// scrapeStriverSDESheet(); 
// can be used to scrape the Striver's SDE Sheet, Striver's 79 Sheet and  Striver's 75 Sheet


