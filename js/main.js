document.addEventListener("DOMContentLoaded", function() {
    function Calculadora() {
        this.memoria = JSON.parse(localStorage.getItem('calculadora_memoria')) || [];

        this.obtenerNumeros = function() {
            this.num1 = parseFloat(document.getElementById("num1").value);
            this.num2 = parseFloat(document.getElementById("num2").value);
        }

        this.resultados = function(resultado, operacion) {
            let resultadoElement = document.getElementById("resultado");
            resultadoElement.textContent = resultado !== undefined ? `Resultado de ${this.num1} ${operacion} ${this.num2}: ${resultado}` : "Error: Debe ingresar un número en ambos campos";
        }

        this.mostrarMemoria = function() {
            let memoriaList = document.getElementById("memoriaList");
            memoriaList.innerHTML = "";

            this.memoria.forEach(function(resultado, index) {
                let li = document.createElement("li");
                li.textContent = `Resultado ${index + 1}: ${resultado}`;
                memoriaList.appendChild(li);
            });
        }

        this.limpiarCampos = function() {
            document.getElementById("num1").value = "";
            document.getElementById("num2").value = "";
        }

        this.limpiarMemoria = function() {
            this.memoria = [];
            this.mostrarMemoria();
            this.guardarMemoriaEnLocalStorage();
        }

        this.validarCampos = function() {
            return !isNaN(this.num1) && !isNaN(this.num2);
        }

        this.realizarOperacion = function(operacion) {
            this.obtenerNumeros();

            if (!this.validarCampos()) {
                this.resultados();
                return;
            }

            let resultado;
            switch(operacion) {
                case "+":
                    resultado = this.num1 + this.num2;
                    break;
                case "-":
                    resultado = this.num1 - this.num2;
                    break;
                case "*":
                    resultado = this.num1 * this.num2;
                    break;
                case "/":
                    resultado = this.num1 / this.num2;
                    break;
            }

            this.memoria.push(`${this.num1} ${operacion} ${this.num2} = ${resultado}`);
            this.resultados(resultado, operacion);
            this.mostrarMemoria();
            this.limpiarCampos();
            this.guardarMemoriaEnLocalStorage();
        }

        this.guardarMemoriaEnLocalStorage = function() {
            localStorage.setItem('calculadora_memoria', JSON.stringify(this.memoria));
        }

        this.ejecutarCalculadora = function(operacion) {
            this.realizarOperacion(operacion);
        }
    }

    const miCalculadora = new Calculadora();

    document.getElementById("btnSumar").addEventListener("click", function() {
        miCalculadora.ejecutarCalculadora("+");
    });

    document.getElementById("btnRestar").addEventListener("click", function() {
        miCalculadora.ejecutarCalculadora("-");
    });

    document.getElementById("btnMultiplicar").addEventListener("click", function() {
        miCalculadora.ejecutarCalculadora("*");
    });

    document.getElementById("btnDividir").addEventListener("click", function() {
        miCalculadora.ejecutarCalculadora("/");
    });

    document.getElementById("btnLimpiarMemoria").addEventListener("click", function() {
        miCalculadora.limpiarMemoria();
    });

    document.addEventListener("keydown", function(event) {
        switch(event.key) {
            case "+":
                miCalculadora.ejecutarCalculadora("+");
                break;
            case "-":
                miCalculadora.ejecutarCalculadora("-");
                break;
            case "*":
                miCalculadora.ejecutarCalculadora("*");
                break;
            case "/":
                miCalculadora.ejecutarCalculadora("/");
                break;
            case "Backspace":
                miCalculadora.limpiarMemoria();
                break;
        }
    });

    miCalculadora.mostrarMemoria();
});