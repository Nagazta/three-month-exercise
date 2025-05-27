const display = document.getElementById('result');
const equationDisplay = document.getElementById('equationDisplay');

let num1 = '';
let num2 = '';
let operator = '';
let isSecond = false;
let lastResult = '';

function updateDisplay(val) {
    display.value = val;
    equationDisplay.textContent = `${num1} ${operator} ${num2}`;
}

function handleNumber(val) {
    if (val === '.' && (isSecond ? num2.includes('.') : num1.includes('.'))) return;

    if (isSecond) {
        num2 += val;
    } else {
        num1 += val;
    }

    updateDisplay(isSecond ? num2 : num1);
}

function handleOperator(op) {
    clearOperatorHighlight();
    if (num1 === '' && lastResult !== '') {
        num1 = lastResult;
    }

    if (operator && num2) {
        calculate();
        num1 = display.value;
        num2 = '';
    }

    operator = op;
    isSecond = true;
    document.getElementById(getOperatorId(op)).classList.add('active-operator');
    updateDisplay(num2);
}

function calculate() {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if (isNaN(a) || isNaN(b)) {
        display.value = 'Syntax Error';
        return;
    }

    let result;
    switch (operator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/':
            if (b === 0) {
                display.value = 'Syntax Error';
                return;
            }
            result = a / b;
            break;
        default:
            display.value = 'Syntax Error';
            return;
    }

    display.value = result;
    equationDisplay.textContent = `${num1} ${operator} ${num2} =`;
    lastResult = result.toString();
    num1 = lastResult;
    num2 = '';
    operator = '';
    isSecond = false;
    clearOperatorHighlight();
}

function clearOperatorHighlight() {
    ['add', 'subtract', 'multiply', 'divide'].forEach(id => {
        document.getElementById(id).classList.remove('active-operator');
    });
}

document.getElementById('clear').addEventListener('click', () => {
    display.value = '';
    equationDisplay.textContent = '';
    num1 = num2 = operator = '';
    isSecond = false;
    clearOperatorHighlight();
});

document.getElementById('backspace').addEventListener('click', () => {
    if (isSecond && num2 !== '') {
        num2 = num2.slice(0, -1);
        updateDisplay(num2);
    } else if (!isSecond && num1 !== '') {
        num1 = num1.slice(0, -1);
        updateDisplay(num1);
    }
});

document.getElementById('equals').addEventListener('click', calculate);

const numberMap = {
    one: '1', two: '2', three: '3',
    four: '4', five: '5', six: '6',
    seven: '7', eight: '8', nine: '9', zero: '0'
};

Object.entries(numberMap).forEach(([id, val]) => {
    document.getElementById(id).addEventListener('click', () => handleNumber(val));
});

document.getElementById('decimal').addEventListener('click', () => handleNumber('.'));

document.getElementById('add').addEventListener('click', () => handleOperator('+'));
document.getElementById('subtract').addEventListener('click', () => handleOperator('-'));
document.getElementById('multiply').addEventListener('click', () => handleOperator('*'));
document.getElementById('divide').addEventListener('click', () => handleOperator('/'));

function getOperatorId(op) {
    return {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide'
    }[op];
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (!isNaN(key)) handleNumber(key);
    if (key === '.') handleNumber('.');
    if (['+', '-', '*', '/'].includes(key)) handleOperator(key);
    if (key === 'Enter' || key === '=') calculate();
    if (key === 'Backspace') {
        document.getElementById('backspace').click();
    }
    if (key.toLowerCase() === 'c') {
        document.getElementById('clear').click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('themeToggle');

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});

