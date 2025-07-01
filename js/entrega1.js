// Función que verifica si un texto contiene algún número
/*function contieneNumero(texto) {
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
formulario();*/

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formularioUsuario");
  const salida = document.getElementById("salida");
  const suscriptoSelect = document.getElementById("suscripto");
  const registroNuevo = document.getElementById("registroNuevo");

  // Mostrar u ocultar campos según opción de suscripción
  suscriptoSelect.addEventListener("change", () => {
    registroNuevo.style.display = suscriptoSelect.value === "no" ? "block" : "none";
  });

  // Función constructora
  function Usuario(nombre, correo, edad, usuario = "", contraseña = "") {
    this.nombre = nombre;
    this.correo = correo;
    this.edad = parseInt(edad);
    this.usuario = usuario;
    this.contraseña = contraseña;
  }

  // Validaciones
  const contieneNumero = texto => /\d/.test(texto);
  const validarCorreo = correo => correo.includes("@");
  const validarEdad = edad => !isNaN(edad) && parseInt(edad) > 0;

  // Recuperar array de usuarios o inicializar
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    salida.innerHTML = "";

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const edad = document.getElementById("edad").value.trim();
    const suscripto = document.getElementById("suscripto").value;

    if (nombre === "" || contieneNumero(nombre)) {
      return mostrarMensaje("❌ El nombre no puede estar vacío ni contener números.");
    }
    if (!validarCorreo(correo)) {
      return mostrarMensaje("❌ Correo inválido.");
    }
    if (!validarEdad(edad)) {
      return mostrarMensaje("❌ Edad inválida.");
    }

    if (suscripto === "si") {
      const usuarioExistente = usuarios.find(u => u.correo === correo);
      if (usuarioExistente) {
        mostrarMensaje("👋 Bienvenido/a de nuevo. Tus datos:");
        mostrarUsuario(usuarioExistente);
      } else {
        mostrarMensaje("⚠️ Usuario no registrado aún.");
      }
    } else {
      const user = document.getElementById("usuario").value.trim();
      const pass = document.getElementById("contraseña").value.trim();
      if (user === "" || pass === "") {
        return mostrarMensaje("❌ Usuario y contraseña requeridos.");
      }

      const nuevoUsuario = new Usuario(nombre, correo, edad, user, pass);
      usuarios.push(nuevoUsuario);

      try {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        mostrarMensaje("⏳ Registrando usuario...");
        setTimeout(() => {
          mostrarMensaje(`✅ ¡Usuario ${nuevoUsuario.usuario} creado con éxito!`);
          mostrarUsuario(nuevoUsuario);
        }, 1500);
      } catch (error) {
        console.error("Error al guardar en localStorage:", error);
        mostrarMensaje("⚠️ No se pudo guardar el usuario.");
      }
    }
  });

  function mostrarMensaje(mensaje) {
    salida.innerHTML = `<p>${mensaje}</p>`;
  }

  function mostrarUsuario(usuario) {
    salida.innerHTML += `<div>`;
    Object.entries(usuario).forEach(([clave, valor]) => {
      salida.innerHTML += `<p><strong>${clave}:</strong> ${valor}</p>`;
    });
    salida.innerHTML += `</div>`;
  }
});
