document.addEventListener("DOMContentLoaded", function () {
    function Calculadora() {
        this.memoria = JSON.parse(localStorage.getItem('calculadora_memoria')) || [];
        this.displayValue = "";

        this.actualizarDisplay = function () {
            document.getElementById("resultado").textContent = this.displayValue;
        }

        this.agregarAlDisplay = function (valor) {
            this.displayValue += valor;
            this.actualizarDisplay();
        }

        this.borrarDisplay = function () {
            this.displayValue = "";
            this.actualizarDisplay();
        }

        this.borrarUltimoCaracter = function () {
            this.displayValue = this.displayValue.slice(0, -1);
            this.actualizarDisplay();
        }

        this.limpiarMemoria = function () {
            this.memoria = [];
            this.mostrarMemoria();
            this.guardarMemoriaEnLocalStorage();
        }

        this.limpiarDisplay = function () {
            this.displayValue = "";
            this.actualizarDisplay();
        }

        this.resultados = function (resultado, operacion) {
            let resultadoElement = document.getElementById("resultado");
            resultadoElement.textContent = resultado !== undefined ? `Resultado: ${resultado}` : "Error: Debe ingresar una expresión válida";
            this.displayValue = resultado !== undefined ? resultado.toString() : ""; // Actualizar el valor del display
            this.actualizarDisplay();
        }

        this.mostrarMemoria = function () {
            let memoriaList = document.getElementById("memoriaList");
            memoriaList.innerHTML = "";

            this.memoria.forEach(function (resultado, index) {
                let li = document.createElement("li");
                li.textContent = `Resultado ${index + 1}: ${resultado}`;
                memoriaList.appendChild(li);
            });
        }

        this.validarExpresion = function () {
            // Puedes agregar tu lógica de validación aquí si es necesario
            return true;
        }

        this.ejecutarCalculadora = function (operacion) {
            if (operacion === "=") {
                if (this.validarExpresion()) {
                    try {
                        let resultado;
                        if (this.displayValue.includes("sin") || this.displayValue.includes("cos") || this.displayValue.includes("tan")) {
                            // Si se detecta alguna de las funciones trigonométricas, evaluar con math.js
                            resultado = math.evaluate(this.displayValue);
                        } else {
                            // De lo contrario, utilizar eval para otras operaciones
                            resultado = eval(this.displayValue);
                        }

                        this.memoria.push(`${this.displayValue} = ${resultado}`);
                        this.resultados(resultado, operacion); // Utilizar la función resultados actualizada
                        this.mostrarMemoria();
                        this.guardarMemoriaEnLocalStorage();
                    } catch (error) {
                        this.borrarDisplay();
                        this.resultados(undefined, operacion);
                    }
                } else {
                    this.resultados(undefined, operacion);
                }
            } else {
                this.agregarAlDisplay(` ${operacion} `);
            }
        }

        this.guardarMemoriaEnLocalStorage = function () {
            localStorage.setItem('calculadora_memoria', JSON.stringify(this.memoria));
        }
    }

    const miCalculadora = new Calculadora();

    document.addEventListener("keydown", function (event) {
        const keyPressed = event.key;
    
        switch (keyPressed) {
            case "=":
            case "Enter":  // Agregamos "Enter" como un caso adicional
                miCalculadora.ejecutarCalculadora("=");
                break;
            case "Backspace":
                miCalculadora.borrarUltimoCaracter();
                break;
            case "c":
            case "C":
                miCalculadora.limpiarDisplay();
                break;
            case "+":
            case "-":
            case "*":
            case "/":
                miCalculadora.agregarAlDisplay(` ${keyPressed} `);
                break;
            case ".":
                miCalculadora.agregarAlDisplay(keyPressed);
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                miCalculadora.agregarAlDisplay(keyPressed);
                break;
            case "(":
            case ")":
                miCalculadora.agregarAlDisplay(keyPressed);
                break;
        }
    });

    document.querySelectorAll(".btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const buttonValue = this.textContent;

            switch (buttonValue) {
                case "=":
                    miCalculadora.ejecutarCalculadora("=");
                    break;
                case "Backspace":
                    miCalculadora.borrarUltimoCaracter();
                    break;
                case "C":
                    miCalculadora.limpiarDisplay();
                    break;
                case "sin":
                case "cos":
                case "tan":
                    miCalculadora.agregarAlDisplay(`${buttonValue}(`);
                    break;
                case "(":
                case ")":
                    miCalculadora.agregarAlDisplay(buttonValue);
                    break;
                case "Número Trivial Aleatorio":
                    getTrivia(); // Llamamos a la función para obtener un número trivial aleatorio
                    break;
                default:
                    miCalculadora.agregarAlDisplay(buttonValue);
                    break;
            }
        });
    });

    document.getElementById("btnLimpiarMemoria").addEventListener("click", function () {
        miCalculadora.limpiarMemoria();
        miCalculadora.borrarDisplay();
    });

    // Nueva función para obtener un número trivial aleatorio
    function getTrivia() {
        // Limpiamos el resultado actual
        document.getElementById("resultado").textContent = "";
    
        // URL de la API Numbers para obtener un número trivial aleatorio con HTTPS
        const apiUrl = "https://cors-anywhere.herokuapp.com/http://numbersapi.com/random/trivia";
    
        // Realizamos la solicitud usando Fetch
        fetch(apiUrl)
            .then(response => {
                // Verificamos si la solicitud fue exitosa (código de respuesta 200)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Parseamos la respuesta como JSON
                return response.json();
            })
            .then(data => {
                // Mostramos el resultado en el elemento con id "resultado"
                document.getElementById("resultado").textContent = data.text;
            })
            .catch(error => {
                console.error("Error fetching trivia:", error);
                document.getElementById("resultado").textContent = "Error al obtener el número trivial.";
            });
    }    

    miCalculadora.mostrarMemoria();
});