function calculadora() {
    let elegirOperacion;

    do {
        elegirOperacion = prompt("Ingrese alguna de las siguientes opciones (+, -, *, o /) para realizar una operación matemática:");
    } while (elegirOperacion !== "+" && elegirOperacion !== "-" && elegirOperacion !== "*" && elegirOperacion !== "/");

    let num1 = parseFloat(prompt("Ingrese el primer número:"));
    let num2 = parseFloat(prompt("Ingrese el segundo número:"));

    let resultado;

    if (elegirOperacion == "+") {
        resultado = num1 + num2;
        alert("El resultado de la suma es: " + resultado);
    } else if (elegirOperacion == "-") {
        resultado = num1 - num2;
        alert("El resultado de la resta es: " + resultado);
    } else if (elegirOperacion == "*") {
        resultado = num1 * num2;
        alert("El resultado de la multiplicación es: " + resultado);
    } else if (elegirOperacion == "/") {
        resultado = num1 / num2;
        alert("El resultado de la división es: " + resultado);
    }

    let otraOperacion = prompt("Desea realizar otra operación matemática? Escriba si o no");

    if(otraOperacion == "si") {
        calculadora();
    }
    else if(otraOperacion == "no") {
        alert("Gracias por usar la calculadora");
    } else {
        do {
            otraOperacion = prompt("Desea realizar otra operación matemática? Escriba si o no");
        } while(otraOperacion !== "si" && otraOperacion !== "no")
    }
}

calculadora();