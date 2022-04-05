var groupNumber = document.querySelector('#number');
groupNumber.addEventListener('change', (event) => {
    let number = groupNumber.value;
    for (let i = 1; i < 5; i++) {
        let res = 0;
        switch (i) {
            case 1: {
                res = parseInt(number) * 3;
                break;
            }
            case 2: {
                res = parseInt(number) - 6;
                break;
            }
            case 3: {
                res = 15 - parseInt(number);
                break;
            }
            case 4: {
                res = parseInt(number) + 2;
                break;
            }
        }
        document.querySelector(`#b${i}`).value = res;
    }
});

var matrix = [];
var m=groupNumber.value;
var b=[];
for (let i = 0; i < 4; i++) {
    b[i]=document.querySelector(`#b${i}`).value;
    matrix[i] = [];
    for (let j = 0; j < 4; j++) {
        matrix[i][j]=document.querySelector(`#a${i+1}${j+1}`).value;
    }
}

// var matrix = [[5, 1, -1, 1],
//     [1, -4, 1, -1],
//     [-1, 1, 4, 1],
//     [1, 2, 1, -5]];             //matrix
var epsilon = 0.005;            //precise
// var m = 2;                      //my number in the students list
var x0 = [0.7 * m, 1, 2, 0.5];
// var b = [3 * m, m - 6, 15 - m, m + 2];
var after_comma = 0;
do {
    after_comma++;
} while (epsilon * Math.pow(10, after_comma) < 1);

function D3_determ(m) {
    if (m.length === 3 && m[0].length === 3)
        return m[0][0] * m[1][1] * m[2][2] + m[1][0] * m[2][1] * m[0][2] + m[2][0] * m[0][1] * m[1][2] -
            m[2][0] * m[1][1] * m[0][2] - m[0][0] * m[1][2] * m[2][1] - m[0][1] * m[1][0] * m[2][2];
    else return undefined;
}

const determ = (m) => {
    let det = 0;
    if (m.length === 4 && m[0].length === 4) {
        for (let i = 0; i < 4; i++) {
            let ar = [];
            for (let j = 0; j < 3; j++) {
                ar[j] = [...m[j + 1]];                      //cloning using spread-operator
                ar[j].splice(i, 1);
            }
            det += Math.pow(-1, i) * m[0][i] * D3_determ(ar);
        }
        return det;
    } else return undefined;
}

if (determ(matrix) > 0) console.log(`Determinant A = ${determ(matrix)}`);
else {
    console.error("Determinant A<=0. Can`t resolve the equation!!!");
    process.exit(1);
}

const check_convergence = (ar, diagonal_index) => {
    let sum = 0;
    for (let i = 0; i < ar.length; i++)
        if (i !== diagonal_index) sum += Math.abs(ar[i]);
    return sum < Math.abs(ar[diagonal_index]);
};

for (let i = 0; i < matrix.length; i++)
    if (!check_convergence(matrix[i], i)) {
        console.error("Convergence condition isn`t observed. Can`t resolve the equation!!!");
        process.exit(1);
    }

const apply_iterations_method = (matrix, x0, b) => {
    let x = [];
    for (let i = 0; i < matrix.length; i++) {
        let sum1 = 0, sum2 = 0;
        for (let j = 0; j < i; j++)
            sum1 += matrix[i][j] * x0[j];
        for (let j = i + 1; j < matrix.length; j++)
            sum2 += matrix[i][j] * x0[j];
        x.push(((b[i] - sum1 - sum2) / matrix[i][i]).toFixed(after_comma));
    }
    console.log(x);
    let precise = [];
    for (let i = 0; i < x0.length; i++)
        precise[i] = Math.abs(x0[i] - x[i]);
    return Math.max(precise[0], precise[1], precise[2], precise[3]) >= epsilon ? apply_iterations_method(matrix, x, b) : x;
}

x0 = apply_iterations_method(matrix, x0, b);
console.log(`x1=${x0[0]},  x2=${x0[1]},  x3=${x0[2]},  x4=${x0[3]}\n`);

var b1 = [];
for (let i = 0; i < 4; i++) {
    let sum = 0;
    for (let j = 0; j < 4; j++) {
        sum += matrix[i][j] * x0[j];
    }
    b1[i] = sum;
}
console.log(`\nChecking:\nStart values:${b}\nResult:${b1}`);

function calculate () {
    document.querySelector('#answer').textContent = apply_iterations_method(matrix, x0, b).toString();
}