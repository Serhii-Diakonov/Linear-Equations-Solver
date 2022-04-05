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
    clear();
    refreshValues();
});

for (let i = 1; i < 5; i++)
    for (let j = 1; j < 5; j++)
        document.querySelector(`#a${i}${j}`).addEventListener('change', (event) => {
            clear();
            refreshValues();
        });

var matrix = [];
var m = 0;
var b = [];
var x0 = [];
var x_res=[];
var epsilon = 0.005;            //precise
var after_comma = 0;

const refreshValues = () => {
    document.getElementById("epsilon").innerHTML=`<b>Epsilon: </b>${epsilon}`;
    document.getElementById("x0").innerHTML="<b>Vector: </b>3 * m, m - 6, 15 - m, m + 2";
    m = groupNumber.value;
    x0 = [0.7 * m, 1, 2, 0.5];
    for (let i = 0; i < 4; i++) {
        b[i] = document.querySelector(`#b${i + 1}`).value;
        matrix[i] = [];
        for (let j = 0; j < 4; j++) {
            matrix[i][j] = document.querySelector(`#a${i + 1}${j + 1}`).value;
        }
    }
}
refreshValues();

do {
    after_comma++;
} while (epsilon * (10 ** after_comma) < 1);

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
            det += (-1) ** i * m[0][i] * D3_determ(ar);
        }
        return det;
    } else return undefined;
}


const check_convergence = (ar, diagonal_index) => {
    let sum = 0;
    for (let i = 0; i < ar.length; i++)
        if (i !== diagonal_index) sum += Math.abs(ar[i]);
    return sum < Math.abs(ar[diagonal_index]);
};

const apply_iterations_method=(matrix, x0, b)=>{
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
    document.querySelector("#iterations").innerHTML += x.toString() + "<br>";
    let precise = [];
    for (let i = 0; i < x0.length; i++)
        precise[i] = Math.abs(x0[i] - x[i]);
    return Math.max(precise[0], precise[1], precise[2], precise[3]) >= epsilon ? apply_iterations_method(matrix, x, b) : x;
}

const checkRes = () => {
    let b1 = [];
    for (let i = 0; i < 4; i++) {
        let sum = 0;
        for (let j = 0; j < 4; j++) {
            sum += matrix[i][j] * x_res[j];
        }
        b1[i] = sum;
    }
    return b1;
}

const clear = () => {
    document.getElementById("error").innerHTML="";
    for (let node of document.getElementsByClassName("text"))
        node.innerHTML = "";
}

function calculate() {
    clear();
    if (determ(matrix) > 0)
        console.log(`Determinant A = ${determ(matrix)}`);
    else {
        document.getElementById("error").innerHTML="*Determinant A<=0. Can`t resolve the equation!!!";
        console.error("Determinant A<=0. Can`t resolve the equation!!!");
        process.exit(1);
    }

    for (let i = 0; i < matrix.length; i++)
        if (!check_convergence(matrix[i], i)) {
            document.getElementById("error").innerHTML="*Convergence condition isn`t observed. Can`t resolve the equation!!!";
            console.error("Convergence condition isn`t observed. Can`t resolve the equation!!!");
            process.exit(1);
        }
    x_res = apply_iterations_method(matrix, x0, b);
    document.getElementById("answer").innerHTML = "Answer: " + x_res.toString();
    document.getElementById("checking").innerHTML = `<b>Checking:</b><br>Start values: ${b}<br>Result: ${checkRes()}`;
    console.log(`Answer: ${x_res}`);
    console.log(`\nChecking:\nStart values: ${b}\nResult: ${checkRes()}`);
}
