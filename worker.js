self.onmessage = async function(e) {
    const { data1, data2, column1, column2, batchSize } = e.data;

    // Extract values from specified columns
    const values1 = extractColumnValues(data1, column1);
    const values2 = extractColumnValues(data2, column2);

    // Process to find matching values
    const matchingValues = await findMatchingValues(values1, values2, batchSize);

    self.postMessage([...matchingValues]);
};

// Function to extract column values
function extractColumnValues(data, column) {
    // Handling cases where column may be out of bounds
    return data.slice(1)
        .map(row => (row[column] !== undefined ? String(row[column]) : '')) // Ensure the value is a string
        .filter(value => value.trim() !== ''); // Filter out empty strings
}

// Function to find matching values in batches
async function findMatchingValues(values1, values2, batchSize) {
    const matchingValues = new Set();
    const valueSet2 = new Set(values2); // Convert to Set for faster lookups
    let start = 0;

    while (start < values1.length) {
        const batch = values1.slice(start, start + batchSize);
        batch.forEach(value1 => {
            if (valueSet2.has(value1)) {
                matchingValues.add(value1);
            }
        });
        start += batchSize;
        await new Promise(resolve => setTimeout(resolve, 0)); // Yield control to UI thread
    }

    return matchingValues;
}
