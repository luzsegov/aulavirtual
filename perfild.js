document.addEventListener('DOMContentLoaded', () => {
    // Controladores de Menús Desplegables (Navbar)
    const avatarBtn = document.getElementById('avatar-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const btnAcademia = document.getElementById('btn-academia');
    const menuAcademia = document.getElementById('menu-academia');

    avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
        menuAcademia.classList.remove('show-menu');
    });

    btnAcademia.addEventListener('click', (e) => {
        e.stopPropagation();
        menuAcademia.classList.toggle('show-menu');
        profileDropdown.classList.remove('show');
    });

    document.addEventListener('click', () => {
        profileDropdown.classList.remove('show');
        menuAcademia.classList.remove('show-menu');
    });

    // ==========================================
    // INTERACCIÓN DE LOS OJITOS (REVELAR CONTRASEÑA)
    // ==========================================
    const ojosContrasena = document.querySelectorAll('.toggle-password');

    ojosContrasena.forEach(ojo => {
        ojo.addEventListener('click', () => {
            const idInputDestino = ojo.getAttribute('data-target');
            const inputContrasena = document.getElementById(idInputDestino);

            if (inputContrasena.type === "password") {
                inputContrasena.type = "text";
                ojo.classList.remove('fa-eye');
                ojo.classList.add('fa-eye-slash');
            } else {
                inputContrasena.type = "password";
                ojo.classList.remove('fa-eye-slash');
                ojo.classList.add('fa-eye');
            }
        });
    });

    // ==========================================
    // SELECCIÓN Y PREVISUALIZACIÓN DE LA FOTO
    // ==========================================
    const contenedorAvatar = document.querySelector('.avatar-zona');
    const inputArchivoFoto = document.getElementById('input-archivo-foto');
    const imgPerfilVista = document.getElementById('perfil-foto-vista');

    // Al hacer clic en la foto, se dispara el selector de archivos oculto
    contenedorAvatar.addEventListener('click', () => {
        inputArchivoFoto.click();
    });

    // Leer el archivo y mostrar previsualización antes de subirlo
    inputArchivoFoto.addEventListener('change', () => {
        const archivo = inputArchivoFoto.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function(e) {
                imgPerfilVista.src = e.target.result; // Cambia la imagen en pantalla al instante
            }
            lector.readAsDataURL(archivo);
        }
    });

    // ==========================================
    // CARGA Y ENVÍO DE DATOS AL BACKEND
    // ==========================================
    const formPerfil = document.getElementById('form-perfil-docente');
    const txtNombre = document.getElementById('txt-nombre-docente');
    const infoCedula = document.getElementById('info-cedula');
    const infoRegistro = document.getElementById('info-registro');
    const inputCorreo = document.getElementById('input-correo');
    const inputTelefono = document.getElementById('input-telefono');
    const inputPassActual = document.getElementById('input-password-actual');
    const inputPassNueva = document.getElementById('input-password-nueva');
    const msgEstado = document.getElementById('msg-estado-perfil');

    const API_PERFIL = 'api/perfil_docente.php';

    cargarDatosPerfil();

    function cargarDatosPerfil() {
        fetch(`${API_PERFIL}?accion=getPerfil`)
            .then(res => res.json())
            .then(docente => {
                txtNombre.textContent = docente.nombre_apellido;
                infoCedula.value = docente.cedula;
                infoRegistro.value = docente.registro_mec || 'No cargado';
                inputCorreo.value = docente.correo;
                inputTelefono.value = docente.telefono;
                if (docente.foto_url) {
                    imgPerfilVista.src = docente.foto_url;
                }
            })
            .catch(err => {
                console.error("Error cargando perfil:", err);
                txtNombre.textContent = "Error al cargar datos";
            });
    }

    formPerfil.addEventListener('submit', (e) => {
        e.preventDefault();
        msgEstado.className = "mensaje-alerta hidden";

        // Usamos FormData porque vamos a enviar un archivo binario (la foto)
        const formData = new FormData();
        formData.append('correo', inputCorreo.value);
        formData.append('telefono', inputTelefono.value);
        formData.append('passActual', inputPassActual.value);
        formData.append('passNueva', inputPassNueva.value);
        
        if (inputArchivoFoto.files[0]) {
            formData.append('foto_perfil', inputArchivoFoto.files[0]);
        }

        fetch(`${API_PERFIL}?accion=updatePerfil`, {
            method: 'POST',
            body: formData // Enviado de forma nativa codificada multipart/form-data
        })
        .then(res => res.json())
        .then(respuesta => {
            if (respuesta.status === 'success') {
                msgEstado.textContent = "¡Perfil y foto guardados con éxito!";
                msgEstado.className = "mensaje-alerta exito";
                inputPassActual.value = "";
                inputPassNueva.value = "";
            } else {
                msgEstado.textContent = respuesta.message || "Error al actualizar.";
                msgEstado.className = "mensaje-alerta error";
            }
        })
        .catch(err => {
            console.error(err);
            msgEstado.textContent = "Error de conexión con el servidor.";
            msgEstado.className = "mensaje-alerta error";
        });
    });
});