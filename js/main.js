function Calculadora() {
    this.elegirOperacion = "";
    this.memoria = [];

    this.obtenerOperacion = function() {
        do {
            this.elegirOperacion = prompt("Ingrese alguna de las siguientes opciones (+, -, *, o /) para realizar una operación matemática:");
        } while (this.elegirOperacion !== "+" && this.elegirOperacion !== "-" && this.elegirOperacion !== "*" && this.elegirOperacion !== "/");
    }

    this.numeros = function() {
        this.num1 = parseFloat(prompt("Ingrese el primer número:"));
        this.num2 = parseFloat(prompt("Ingrese el segundo número:"));        
    }

    this.resultados = function() {
        let resultado;

        switch(this.elegirOperacion) {
            case "+":
                resultado = this.num1 + this.num2;
                alert("El resultado de la suma es: " + resultado);
                break;
                
            case "-":
                resultado = this.num1 - this.num2;
                alert("El resultado de la resta es: " + resultado);
                break;

            case "*":
                resultado = this.num1 * this.num2;
                alert("El resultado de la multiplicación es: " + resultado);
                break;

            case "/":
                resultado = this.num1 / this.num2;
                alert("El resultado de la división es: " + resultado);
                break;
        }

        this.memoria.push(resultado);
        console.log(this.memoria);
    }

    this.mostrarResultados = function() {
        let elegirResultado = prompt("¿Qué resultado quiere ver? Escriba un numero o la palabra (todos) para que se muestren todos los resultados. Ej: 1 (muestra el primer resultado)");

        if (elegirResultado.toLowerCase() === "todos") {
            this.memoria.forEach(function(resultado, index) {
                alert(`Resultado ${index + 1}: ${resultado}`);
            });
        } else {
            let index = parseInt(elegirResultado);
            if (!isNaN(index) && index >= 1 && index <= this.memoria.length) {
                alert(`El resultado de la cuenta seleccionada es: ${this.memoria[index - 1]}`);
            } else {
                alert("Opción no válida");
            }
        }
    }

    this.filtrar = function() {
        let tipoFiltro = prompt("¿Qué tipo de filtro quiere utilizar? Escriba 'menor' o 'mayor':");
        let filtro = parseFloat(prompt(`Ingrese el valor para el filtro ${tipoFiltro}:`));

        let resultadosFiltrados;

        if (tipoFiltro === "menor") {
            resultadosFiltrados = this.memoria.filter(function(resultado) {
                return resultado < filtro;
            });
        } else if (tipoFiltro === "mayor") {
            resultadosFiltrados = this.memoria.filter(function(resultado) {
                return resultado > filtro;
            });
        } else {
            alert("Tipo de filtro no válido. Por favor, ingrese 'menor' o 'mayor'.");
            return;
        }

        if (resultadosFiltrados.length > 0) {
            alert(`Resultados ${tipoFiltro}es a ${filtro}: ${resultadosFiltrados}`);
        } else {
            alert(`No hay resultados ${tipoFiltro}es a ${filtro}`);
        }
    }

    this.otrasOperaciones = function() {
        let otraOperacion = prompt("1) Desea realizar otra operación matemática? Escriba si o no.\n2) Si desea ver los resultados de las operaciones realizadas escriba resultados.\n3) Si desea filtrar resultados escriba la palabra filtrar");
        let textoMinusculas = otraOperacion.toLowerCase();
    
        if (textoMinusculas == "si") {
            this.ejecutarCalculadora();
        } else if (textoMinusculas == "no") {
            alert("Gracias por usar la calculadora");
        } else if (textoMinusculas == "resultados") {
            this.mostrarResultados();
            this.otrasOperaciones();
        } else if (textoMinusculas == "filtrar") {
            this.filtrar();
            this.otrasOperaciones();
        } else {
            do {
                otraOperacion = prompt("1) Desea realizar otra operación matemática? Escriba si o no.\n2) Si desea ver los resultados de las operaciones realizadas escriba resultados.\n3) Si desea filtrar resultados escriba la palabra filtrar");
            } while (otraOperacion !== "si" && otraOperacion !== "no");
            this.otrasOperaciones();
        }
    }
    
    this.ejecutarCalculadora = function() {
        this.obtenerOperacion();
        this.numeros();
        this.resultados();
        this.otrasOperaciones();
    }
}

const miCalculadora = new Calculadora();
miCalculadora.ejecutarCalculadora();