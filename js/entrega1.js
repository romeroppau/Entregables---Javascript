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
