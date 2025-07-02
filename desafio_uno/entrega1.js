// Función que verifica si un texto contiene algún número
function contieneNumero(texto) {
    return /\d/.test(texto);
}

// Función que valida si un correo contiene "@"
function validarCorreo(correo) {
    return correo.includes("@");
}

// Función que valida que la edad sea un número mayor a 0
function validarEdad(edad) {
    return !isNaN(edad) && parseInt(edad) > 0;
}

// Función principal del simulador
function formulario() {
    // 1. Validar y pedir nombre
    let nombre = prompt("Ingrese su nombre completo:");
    while (contieneNumero(nombre) || nombre.trim() === "") {
        alert("El nombre no debe contener números y no puede estar vacío.");
        nombre = prompt("Ingrese su nombre completo nuevamente:");
    }

    // 2. Validar y pedir correo
    let correo = prompt("Ingrese su correo electrónico:");
    while (!validarCorreo(correo) || correo.trim() === "") {
        alert("Correo inválido. Asegurate de incluir '@' y no dejarlo vacío.");
        correo = prompt("Ingrese su correo electrónico nuevamente:");
    }
    // 3. Validar y pedir edad
    
    let edad = prompt("Ingrese su edad:");
    while (!validarEdad(edad)) {
        alert("Edad inválida. Debe ser un número mayor a 0.");
        edad = prompt("Ingrese su edad nuevamente:");
    }

    // 4. Crear objeto con los datos del usuario
    const usuario = {
        nombre: nombre,
        correo: correo,
        edad: edad,
    };

    // 5. Preguntar si ya está suscripto
    let suscripto = prompt("¿Ya tenés una cuenta? (sí / no)");

    if (suscripto.toLowerCase() === "sí" || suscripto.toLowerCase() === "si") {
        alert("¡Bienvenido/a! 👋");

        let verDatos = prompt("¿Querés ver tus datos? (sí / no)");
        if (verDatos.toLowerCase() === "sí" || verDatos.toLowerCase() === "si") {
            alert("📄 Tus datos son:\nNombre: " + usuario.nombre + "\nCorreo: " + usuario.correo + "\nEdad: " + usuario.edad);
        }

    } else {
        let deseaSuscribirse = prompt("¿Querés suscribirte? (sí / no)");
        if (deseaSuscribirse.toLowerCase() === "sí" || deseaSuscribirse.toLowerCase() === "si") {
            let nuevoUsuario = prompt("Elegí un nombre de usuario:");
            while (nuevoUsuario.trim() === "") {
                alert("❌ El nombre de usuario no puede estar vacío.");
                nuevoUsuario = prompt("Elegí un nombre de usuario:");
            }

            let contraseña = prompt("Elegí una contraseña:");
            while (contraseña.trim() === "") {
                alert("❌ La contraseña no puede estar vacía.");
                contraseña = prompt("Elegí una contraseña:");
            }

            alert("✅ ¡Usuario " + nuevoUsuario + " creado con éxito!");
        }
    }
}

// Ejecutar el simulador
formulario();