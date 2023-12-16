document.addEventListener("DOMContentLoaded", function () {
    // Definición de la clase Calculadora
    function Calculadora() {
        // Propiedades de la calculadora
        this.memoria = JSON.parse(localStorage.getItem('calculadora_memoria')) || [];
        this.displayValue = "";

        // Método para actualizar el contenido del display en la interfaz
        this.actualizarDisplay = function () {
            document.getElementById("resultado").innerHTML = this.displayValue;
        }

        // Método para agregar un valor al display
        this.agregarAlDisplay = function (valor) {
            this.displayValue += valor;
            this.actualizarDisplay();
        }

        // Método para borrar el contenido del display
        this.borrarDisplay = function () {
            this.displayValue = "";
            this.actualizarDisplay();
        }

        // Método para borrar el último carácter del display
        this.borrarUltimoCaracter = function () {
            this.displayValue = this.displayValue.slice(0, -1);
            this.actualizarDisplay();
        }

        // Método para limpiar la memoria de resultados
        this.limpiarMemoria = function () {
            this.memoria = [];
            this.mostrarMemoria();
            this.guardarMemoriaEnLocalStorage();
        }

        // Método para limpiar el contenido del display
        this.limpiarDisplay = function () {
            this.displayValue = "";
            this.actualizarDisplay();
        }

        // Método para mostrar resultados en el display y guardar en la memoria
        this.resultados = function (resultado, operacion) {
            let resultadoElement = document.getElementById("resultado");
            resultadoElement.innerHTML = resultado !== undefined ? `Resultado: ${resultado}` : "Error: Debe ingresar una expresión válida";
            this.displayValue = resultado !== undefined ? resultado.toString() : "";
            this.actualizarDisplay();
        }

        // Método para mostrar la memoria en la interfaz
        this.mostrarMemoria = function () {
            let memoriaList = document.getElementById("memoriaList");
            memoriaList.innerHTML = "";

            this.memoria.forEach(function (resultado, index) {
                let li = document.createElement("li");
                li.textContent = `Resultado ${index + 1}: ${resultado}`;
                memoriaList.appendChild(li);
            });
        }

        // Método de validación de expresión (puede ser extendido)
        this.validarExpresion = function () {
            return true;
        }

        // Método principal para ejecutar la calculadora
        this.ejecutarCalculadora = function (operacion) {
            if (operacion === "=") {
                if (this.validarExpresion()) {
                    try {
                        let resultado;
                        // Evaluación de funciones matemáticas si están presentes en la expresión
                        if (this.displayValue.includes("sin") || this.displayValue.includes("cos") || this.displayValue.includes("tan")) {
                            resultado = math.evaluate(this.displayValue);
                        } else {
                            resultado = eval(this.displayValue);
                        }

                        // Almacenar el resultado en la memoria y actualizar la interfaz
                        this.memoria.push(`${this.displayValue} = ${resultado}`);
                        this.resultados(resultado, operacion);
                        this.mostrarMemoria();
                        this.guardarMemoriaEnLocalStorage();
                    } catch (error) {
                        // Manejo de errores durante la evaluación de la expresión
                        this.borrarDisplay();
                        this.resultados(undefined, operacion);
                    }
                } else {
                    // Expresión no válida
                    this.resultados(undefined, operacion);
                }
            } else {
                // Agregar operador al display
                this.agregarAlDisplay(` ${operacion} `);
            }
        }

        // Método para guardar la memoria en el almacenamiento local del navegador
        this.guardarMemoriaEnLocalStorage = function () {
            localStorage.setItem('calculadora_memoria', JSON.stringify(this.memoria));
        }

        // Método para mostrar una trivia en la interfaz
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

            // Agregar evento para mostrar la respuesta al hacer clic en el botón
            document.getElementById("btnMostrarRespuesta").addEventListener("click", () => {
                this.mostrarRespuesta(respuestas);
            });
        };

        // Método para mostrar la respuesta de la trivia
        this.mostrarRespuesta = function (respuestas) {
            const respuestaContainer = document.getElementById("respuesta");
            const respuestaCorrecta = respuestas[respuestas.length - 1];
            respuestaContainer.innerHTML = `Respuesta Correcta: ${respuestaCorrecta}`;
        };

        // Método para obtener una trivia desde una API
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

    // Crear una instancia de la clase Calculadora
    const miCalculadora = new Calculadora();

    // Agregar eventos a los botones de la calculadora
    document.querySelectorAll(".btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const buttonValue = this.textContent;

            // Switch para manejar diferentes acciones según el botón presionado
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

        // Switch para manejar diferentes acciones según la tecla presionada
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

    // Agregar evento para limpiar la memoria al hacer clic en un botón específico
    document.getElementById("btnLimpiarMemoria").addEventListener("click", function () {
        miCalculadora.limpiarMemoria();
        miCalculadora.borrarDisplay();
    });

    // Mostrar la memoria al cargar la página
    miCalculadora.mostrarMemoria();
});