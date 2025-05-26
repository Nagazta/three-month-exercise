const display = document.getElementById('result');

let num1 = '', num2 = '', operator = '', isSecond = false;

function updateDisplay(val) {
    display.value += val;
}

function handleNumber(val) {
    updateDisplay(val);
    if (isSecond) {
        num2 += val;
    } else {
        num1 += val;
    }
}

function handleOperator(op) {
    if (num1 === '') return;
    operator = op;
    isSecond = true;
    updateDisplay(op);
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
    num1 = result.toString();
    num2 = '';
    operator = '';
    isSecond = false;
}


document.getElementById('clear').addEventListener('click', () => {
    display.value = '';
    num1 = num2 = operator = '';
    isSecond = false;
});

document.getElementById('equals').addEventListener('click', calculate);

document.getElementById('one').addEventListener('click', () => handleNumber('1'));
document.getElementById('two').addEventListener('click', () => handleNumber('2'));
document.getElementById('three').addEventListener('click', () => handleNumber('3'));
document.getElementById('four').addEventListener('click', () => handleNumber('4'));
document.getElementById('five').addEventListener('click', () => handleNumber('5'));
document.getElementById('six').addEventListener('click', () => handleNumber('6'));
document.getElementById('seven').addEventListener('click', () => handleNumber('7'));
document.getElementById('eight').addEventListener('click', () => handleNumber('8'));
document.getElementById('nine').addEventListener('click', () => handleNumber('9'));
document.getElementById('zero').addEventListener('click', () => handleNumber('0'));
document.querySelector('.decimal').addEventListener('click', () => handleNumber('.'));

document.getElementById('add').addEventListener('click', () => handleOperator('+'));
document.getElementById('subtract').addEventListener('click', () => handleOperator('-'));
document.getElementById('multiply').addEventListener('click', () => handleOperator('*'));
document.getElementById('divide').addEventListener('click', () => handleOperator('/'));
