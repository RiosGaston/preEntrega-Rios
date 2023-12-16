document.addEventListener("DOMContentLoaded", function () {
    function Calculadora() {
        this.memoria = JSON.parse(localStorage.getItem('calculadora_memoria')) || [];
        this.displayValue = "";

        this.actualizarDisplay = function () {
            document.getElementById("resultado").innerHTML = this.displayValue;
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
            resultadoElement.innerHTML = resultado !== undefined ? `Resultado: ${resultado}` : "Error: Debe ingresar una expresión válida";
            this.displayValue = resultado !== undefined ? resultado.toString() : "";
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
            return true;
        }

        this.ejecutarCalculadora = function (operacion) {
            if (operacion === "=") {
                if (this.validarExpresion()) {
                    try {
                        let resultado;
                        if (this.displayValue.includes("sin") || this.displayValue.includes("cos") || this.displayValue.includes("tan")) {
                            resultado = math.evaluate(this.displayValue);
                        } else {
                            resultado = eval(this.displayValue);
                        }

                        this.memoria.push(`${this.displayValue} = ${resultado}`);
                        this.resultados(resultado, operacion);
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

        this.mostrarTrivia = function (pregunta, respuestas) {
            const triviaContainer = document.getElementById("trivia");
            const respuestaContainer = document.getElementById("respuesta");
            
            respuestaContainer.innerHTML = "";

            triviaContainer.innerHTML = `
                <p>Pregunta: ${pregunta}</p>
                <ul>
                    ${respuestas.map((respuesta, index) => `<li key=${index}>${respuesta}</li>`).join("")}
                </ul>
                <button class="btn" id="btnMostrarRespuesta">Mostrar Respuesta</button>
            `;
            
            document.getElementById("btnMostrarRespuesta").addEventListener("click", () => {
                this.mostrarRespuesta(respuestas);
            });
        };

        this.mostrarRespuesta = function (respuestas) {
            const respuestaContainer = document.getElementById("respuesta");
            const respuestaCorrecta = respuestas[respuestas.length - 1];
            respuestaContainer.innerHTML = `Respuesta Correcta: ${respuestaCorrecta}`;
        };

        this.obtenerTrivia = function () {
            const apiUrl = "https://opentdb.com/api.php?amount=10&category=19";

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const pregunta = data.results[0].question;
                    const respuestas = [...data.results[0].incorrect_answers, data.results[0].correct_answer];
                    this.mostrarTrivia(pregunta, respuestas);
                })
                .catch(error => {
                    console.error("Error fetching trivia:", error);
                    document.getElementById("trivia").textContent = "Error al obtener la trivia.";
                });
        };
    }

    const miCalculadora = new Calculadora();

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
                case "Obtener Curiosidades":
                    miCalculadora.obtenerTrivia();
                    break;
                default:
                    miCalculadora.agregarAlDisplay(buttonValue);
                    break;
            }
        });
    });

    // Agregar event listener para eventos de teclado
    document.addEventListener("keydown", function (event) {
        const key = event.key;

        switch (key) {
            case "Enter":
                miCalculadora.ejecutarCalculadora("=");
                break;
            case "Backspace":
                miCalculadora.borrarUltimoCaracter();
                break;
            case "Escape":
                miCalculadora.limpiarDisplay();
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
            case ".":
            case "+":
            case "-":
            case "*":
            case "/":
            case "(":
            case ")":
                miCalculadora.agregarAlDisplay(key);
                break;
            default:
                break;
        }
    });

    document.getElementById("btnLimpiarMemoria").addEventListener("click", function () {
        miCalculadora.limpiarMemoria();
        miCalculadora.borrarDisplay();
    });

    miCalculadora.mostrarMemoria();
});