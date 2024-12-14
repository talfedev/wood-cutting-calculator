/*
function optimalCuts(stock, requiredPieces, bladeThickness = 3) {
    const { sizes, quantities } = stock;

    // Expand stock into individual pieces
    const originalStock = [];
    sizes.forEach(size => {
        for (let i = 0; i < quantities[size]; i++) {
            originalStock.push(size);
        }
    });

    requiredPieces.sort((a, b) => b - a); // Sort pieces for more efficient backtracking

    const memo = new Map();

    function helper(required, remainingStockPieces) {
        // Base case: if no pieces are left to cut, calculate remaining stock and cut map
        if (required.length === 0) {
            const remainingStock = {};
            const cutMap = {};
            let totalMaterialLeft = 0;

            remainingStockPieces.forEach(({ original, left, cuts }, index) => {
                const key = `${original}${index > 0 ? " #"+index : ""}`;
                remainingStock[key] = left;
                cutMap[key] = cuts;
                totalMaterialLeft += left;
            });

            return [{
                totalMaterialLeft,
                remainingStock,
                cutMap
            }];
        }

        const memoKey = JSON.stringify({ required, remainingStockPieces });
        if (memo.has(memoKey)) return memo.get(memoKey);

        const [currentPiece, ...remainingPieces] = required;
        let paths = [];

        // Try cutting the current piece from each stock piece
        for (let i = 0; i < remainingStockPieces.length; i++) {
            const stockPiece = remainingStockPieces[i];
            if (stockPiece.left >= currentPiece) {
                // Make a copy of the stock state to modify
                const updatedStockPieces = remainingStockPieces.map(({ original, left, cuts }) => ({
                    original,
                    left,
                    cuts: [...cuts],
                }));

                const currentStock = updatedStockPieces[i];
                currentStock.left -= currentPiece + bladeThickness;
                currentStock.cuts.push(currentPiece);

                if (currentStock.left < 0) {
                    currentStock.left = 0; // Blade cut may leave unusable material
                }

                // Recurse with updated stock and remaining pieces
                const subPaths = helper(remainingPieces, updatedStockPieces);
                paths = paths.concat(subPaths);
            }
        }

        memo.set(memoKey, paths);
        return paths;
    }

    // Initialize stock pieces with their original sizes
    const initialStockPieces = originalStock.map(size => ({
        original: size,
        left: size,
        cuts: [],
    }));

    return helper(requiredPieces, initialStockPieces);
}
*/

function optimalCuts(stock, requiredPieces, bladeThickness = 3) {
    // Step 1: Prepare Inputs
    const { expandedStock, requiredPiecesSorted } = prepareInputs(stock, requiredPieces);

    // Step 2: Start Recursive Backtracking
    const solutions = backtrack(requiredPiecesSorted, expandedStock, bladeThickness);

    // Step 3: Normalize and Deduplicate Results
    return deduplicateResults(solutions);
}

// --- Utility and Helper Functions ---

// 1. Prepare Inputs
function prepareInputs(stock, requiredPieces) {
    const { sizes, quantities } = stock;

    // Expand stock into individual pieces
    const expandedStock = [];
    sizes.forEach(size => {
        for (let i = 0; i < quantities[size]; i++) {
            expandedStock.push({ original: size, left: size, cuts: [] });
        }
    });

    // Sort required pieces in descending order
    const requiredPiecesSorted = [...requiredPieces].sort((a, b) => b - a);

    return { expandedStock, requiredPiecesSorted };
}

// 2. Apply a Cut
function applyCut(stockPiece, pieceSize, bladeThickness) {
    const newStockPiece = {
        original: stockPiece.original,
        left: stockPiece.left - (pieceSize + bladeThickness),
        cuts: [...stockPiece.cuts, pieceSize],
    };
    if (newStockPiece.left < 0) newStockPiece.left = 0; // Prevent negative leftovers
    return newStockPiece;
}

// 3. Normalize Cuts on a Single Stock Piece
function normalizeCuts(stockPieces) {
    return stockPieces.map(piece => ({
        ...piece,
        cuts: piece.cuts.sort((a, b) => a - b), // Ensure cuts are in sorted order
    }));
}

// 4. Normalize and Group Stock Pieces
function normalizeStock(stockPieces) {
    const grouped = {};
    stockPieces.forEach(({ original, left, cuts }) => {
        const key = `${original}:${left}:${cuts.sort((a, b) => a - b).join(',')}`;
        grouped[key] = { original, left, cuts };
    });
    return Object.values(grouped);
}

// 5. Deduplicate Results
function deduplicateResults(results) {
    const uniqueResults = new Map();
    results.forEach(({ totalMaterialLeft, remainingStock, cutMap }) => {
        const normalizedStock = normalizeStock(remainingStock);
        const key = JSON.stringify({ totalMaterialLeft, normalizedStock });
        uniqueResults.set(key, { totalMaterialLeft, remainingStock, cutMap });
    });
    return Array.from(uniqueResults.values());
}

// 6. Recursive Backtracking
function backtrack(requiredPieces, stockPieces, bladeThickness, memo = new Map()) {
    // Base case: no more pieces required
    if (requiredPieces.length === 0) {
        const remainingStock = normalizeCuts(stockPieces);
        const totalMaterialLeft = remainingStock.reduce((sum, piece) => sum + piece.left, 0);
        const cutMap = remainingStock.reduce((map, piece, index) => {
            const key = `${piece.original}${index > 0 ? " #" + index : ""}`;
            map[key] = piece.cuts;
            return map;
        }, {});

        return [{ totalMaterialLeft, remainingStock, cutMap }];
    }

    const memoKey = JSON.stringify({ requiredPieces, stockPieces });
    if (memo.has(memoKey)) return memo.get(memoKey);

    const [currentPiece, ...remainingPieces] = requiredPieces;
    let solutions = [];

    stockPieces.forEach((stockPiece, index) => {
        if (stockPiece.left >= currentPiece) {
            // Apply cut
            const newStockPiece = applyCut(stockPiece, currentPiece, bladeThickness);

            // Replace current stock piece in the list
            const newStockPieces = stockPieces.map((piece, i) => (i === index ? newStockPiece : piece));

            // Recurse
            const subSolutions = backtrack(remainingPieces, newStockPieces, bladeThickness, memo);
            solutions = solutions.concat(subSolutions);
        }
    });

    memo.set(memoKey, solutions);
    return solutions;
}

// --- Example Usage ---
// const stock = {
//     sizes: [1000, 2000, 3500],
//     quantities: { 1000: 1, 2000: 1, 3500: 2 },
// };
// const requiredPieces = [325, 502, 1100, 450];
// const bladeThickness = 3;

// console.log(optimalCuts(stock, requiredPieces, bladeThickness));

export { optimalCuts };
