document.addEventListener('DOMContentLoaded', () => {

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
    // SELECCIÓN Y PREVISUALIZACIÓN DE FOTO DE ALUMNO
    // ==========================================
    const contenedorAvatar = document.querySelector('.avatar-zona');
    const inputArchivoFoto = document.getElementById('input-archivo-foto');
    const imgPerfilVista = document.getElementById('perfil-foto-vista');

    contenedorAvatar.addEventListener('click', () => {
        inputArchivoFoto.click();
    });

    inputArchivoFoto.addEventListener('change', () => {
        const archivo = inputArchivoFoto.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function(e) {
                imgPerfilVista.src = e.target.result;
            }
            lector.readAsDataURL(archivo);
        }
    });

    // ==========================================
    // CARGA Y ACTUALIZACIÓN DE DATOS CON EL SERVIDOR
    // ==========================================
    const formPerfil = document.getElementById('form-perfil-alumno');
    const txtNombre = document.getElementById('txt-nombre-alumno');
    const infoCarrera = document.getElementById('info-carrera');
    const infoCedula = document.getElementById('info-cedula');
    const infoCurso = document.getElementById('info-curso');
    const inputCorreo = document.getElementById('input-correo');
    const inputTelefono = document.getElementById('input-telefono');
    const inputPassActual = document.getElementById('input-password-actual');
    const inputPassNueva = document.getElementById('input-password-nueva');
    const msgEstado = document.getElementById('msg-estado-perfil');

    // Cambiar por tu ruta real de API del módulo de Alumnos
    const API_PERFIL = 'api/perfil_alumno.php';

    cargarDatosPerfilAlumno();

    function cargarDatosPerfilAlumno() {
        fetch(`${API_PERFIL}?accion=getPerfil`)
            .then(res => res.json())
            .then(alumno => {
                txtNombre.textContent = alumno.nombre_apellido;
                infoCarrera.value = alumno.carrera_nombre;
                infoCedula.value = alumno.cedula;
                infoCurso.value = alumno.curso_seccion || 'No asignado';
                inputCorreo.value = alumno.correo;
                inputTelefono.value = alumno.telefono;
                if (alumno.foto_url) {
                    imgPerfilVista.src = alumno.foto_url;
                }
            })
            .catch(err => {
                console.error("Error cargando perfil del alumno:", err);
                txtNombre.textContent = "Error de carga";
            });
    }

    formPerfil.addEventListener('submit', (e) => {
        e.preventDefault();
        msgEstado.className = "mensaje-alerta hidden";

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
            body: formData
        })
        .then(res => res.json())
        .then(respuesta => {
            if (respuesta.status === 'success') {
                msgEstado.textContent = "¡Tus datos y foto se actualizaron con éxito!";
                msgEstado.className = "mensaje-alerta exito";
                inputPassActual.value = "";
                inputPassNueva.value = "";
            } else {
                msgEstado.textContent = respuesta.message || "Error al procesar la actualización.";
                msgEstado.className = "mensaje-alerta error";
            }
        })
        .catch(err => {
            console.error(err);
            msgEstado.textContent = "Error al conectar con la base de datos.";
            msgEstado.className = "mensaje-alerta error";
        });
    });
});