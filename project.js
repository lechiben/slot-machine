// Slot Machine Game Steps:
// 1. Deposit money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if user won
// 6. Give user their winnings
// 7. Ask if user wants to play again

// Importing required library at the top of the program
const prompt = require("prompt-sync")();

// Declaring global constants
const ROWS = 3;
const COLS = 3;

// Symbols and their counts in the reels
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

// Symbol values for calculating winnings
const SYMBOL_VALUE = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

// Function to deposit money
function deposit() {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit, try again.");
        } else {
            return numberDepositAmount;
        }
    }
}

// Function to determine the number of lines to bet on
function getNumberOfLine() {
    while (true) {
        const lines = prompt("Enter number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
}

// Function to collect the bet amount per line
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
        } else {
            return numberBet;
        }
    }
}

// Function to spin the slot machine reels
function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); // Remove used symbol
        }
    }
    return reels;
}

// Function to transpose reels for easier display and winning checks
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

// Function to print rows of symbols
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i !== row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

// Function to calculate winnings based on matched symbols
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = symbols.every(symbol => symbol === symbols[0]);
        if (allSame) {
            winnings += bet * SYMBOL_VALUE[symbols[0]];
        }
    }
    return winnings;
}

// Main game function
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLine();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        
        console.log("You won, $" + winnings);
        
        if (balance <= 0) {
            console.log("You ran out of money");
            break;
        }
        
        const playAgain = prompt("Do you want to play again (y/n)? ");
        if (playAgain.toLowerCase() !== "y") break;
    }
};

game();