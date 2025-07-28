//datos y carga inicial
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

if (usuarioActual) {
  mostrarPanelCuenta(usuarioActual);
} else {
  mostrarFormularioLogin();
}

//log in y registro
function mostrarFormularioLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <form id="formularioUsuario">
      <h2>Iniciar sesión</h2>
      <label for="usuario">Nombre completo</label>
      <input type="text" id="usuario" placeholder="Tu usuario" required>

      <label for="clave">Contraseña</label>
      <input type="password" id="clave" placeholder="Tu contraseña" required>

      <button type="button" id="login">Ingresar</button>

      <label>No tenés cuenta?</label>
      <button type="button" id="registro">Registrate ➔</button>
    </form>
  `;

  document.getElementById("login").addEventListener("click", () => {
    const nombre = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;
    const usuario = listaUsuarios.find(u => u.nombre === nombre && u.clave === clave);

    if (usuario) {
      usuarioActual = usuario;
      localStorage.setItem("usuarioActual", JSON.stringify(usuario));
      mostrarPanelCuenta(usuario);
    } else {
      Swal.fire("Error", "Usuario o clave incorrecta", "error");
    }
  });

  document.getElementById("registro").addEventListener("click", () => {
    Swal.fire({
      title: "Crear cuenta",
      html:
        '<input id="swal-nombre" class="swal2-input" placeholder="Usuario">' +
        '<input id="swal-clave" class="swal2-input" placeholder="Contraseña" type="password">',
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre").value;
        const clave = document.getElementById("swal-clave").value;
        if (!nombre || !clave) return Swal.showValidationMessage("Completá ambos campos");
        return { nombre, clave };
      }
    }).then(result => {
      if (result.isConfirmed) {
        const nuevoUsuario = {
          nombre: result.value.nombre,
          clave: result.value.clave,
          saldo: 0,
          movimientos: []
        };
        listaUsuarios.push(nuevoUsuario);
        guardarUsuarios(listaUsuarios);
        Swal.fire("Registro exitoso", "Iniciá sesión con tu nueva cuenta", "success");
      }
    });
  });
}

//panel de cuenta
function mostrarPanelCuenta(usuario) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h2>Bienvenido, ${usuario.nombre}</h2>
    <p><strong>Saldo actual:</strong> $${usuario.saldo.toFixed(2)}</p>
    <div id="acciones">
      <button id="btnIngresar">Ingresar dinero</button>
      <button id="btnRetirar">Retirar dinero</button>
      <button id="btnCerrarSesion">Cerrar sesión</button>
    </div>
    <h3>Movimientos recientes</h3>
    <ul id="listaMovimientos"></ul>
  `;

  mostrarMovimientos(usuario);

  document.getElementById("btnIngresar").addEventListener("click", () => ingresarDinero(usuario));
  document.getElementById("btnRetirar").addEventListener("click", () => retirarDinero(usuario));
  document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion);
}

function mostrarMovimientos(usuario) {
  const lista = document.getElementById("listaMovimientos");
  lista.innerHTML = "";

  if (!usuario.movimientos || usuario.movimientos.length === 0) {
    lista.innerHTML = "<li>No hay movimientos registrados.</li>";
    return;
  }

  usuario.movimientos.forEach(mov => {
    const item = document.createElement("li");
    item.textContent = `${formatearFecha(mov.fecha)} - ${mov.tipo}: $${mov.monto.toFixed(2)}`;
    item.style.color = mov.tipo === "Ingreso" ? "green" : "red";
    lista.appendChild(item);
  });
}

//operaciones bancarias
function ingresarDinero(usuario) {
  Swal.fire({
    title: "Ingresar dinero",
    input: "number",
    inputLabel: "Monto",
    inputAttributes: { min: 1 },
    showCancelButton: true,
    confirmButtonText: "Confirmar"
  }).then(result => {
    if (result.isConfirmed) {
      const monto = parseFloat(result.value);
      if (monto > 0) {
        usuario.saldo += monto;
        usuario.movimientos.push({ tipo: "Ingreso", monto, fecha: new Date().toISOString() });
        guardarUsuarios(listaUsuarios);
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
        mostrarPanelCuenta(usuario);
        Toastify({ text: "Ingreso registrado", duration: 3000, gravity: "top", position: "right" }).showToast();
      }
    }
  });
}

function retirarDinero(usuario) {
  Swal.fire({
    title: "Retirar dinero",
    input: "number",
    inputLabel: "Monto",
    inputAttributes: { min: 1 },
    showCancelButton: true,
    confirmButtonText: "Confirmar"
  }).then(result => {
    if (result.isConfirmed) {
      const monto = parseFloat(result.value);
      if (monto > 0 && monto <= usuario.saldo) {
        usuario.saldo -= monto;
        usuario.movimientos.push({ tipo: "Egreso", monto, fecha: new Date().toISOString() });
        guardarUsuarios(listaUsuarios);
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
        mostrarPanelCuenta(usuario);
        Toastify({ text: "Retiro registrado", duration: 3000, gravity: "top", position: "right" }).showToast();
      } else {
        Swal.fire("Error", "Saldo insuficiente", "error");
      }
    }
  });
}

//utilitarias
function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  usuarioActual = null;
  mostrarFormularioLogin();
  Toastify({ text: "Sesión cerrada", duration: 3000, gravity: "top", position: "right" }).showToast();
} 