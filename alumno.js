document.addEventListener('DOMContentLoaded', () => {
    
    // Nodos del DOM
    const txtNombre = document.getElementById('nombre-alumno');
    const lblCarrera = document.getElementById('carrera-click');
    const tarjetasContainer = document.getElementById('tarjetas-container');
    const cajaVacia = document.getElementById('sin-materias');
    
    const ofertaSeccion = document.getElementById('oferta-materias');
    const listaDisponibles = document.getElementById('lista-disponibles');
    const btnCerrarOferta = document.getElementById('cerrar-oferta');
    
    const modalClave = document.getElementById('modal-clave');
    const txtMateriaModal = document.getElementById('materia-titulo');
    const inputClave = document.getElementById('input-clave');
    const btnConfirmar = document.getElementById('btn-matricular');
    const btnCancelar = document.getElementById('btn-cancelar');
    
    const avatarBtn = document.getElementById('avatar-btn');
    const profileDropdown = document.getElementById('profile-dropdown');

    // Recuperar datos de la sesión del alumno logueado
    const alumnoId = localStorage.getItem('usuario_id'); 
    txtNombre.textContent = localStorage.getItem('usuario_nombre') || "Estudiante";
    lblCarrera.textContent = localStorage.getItem('usuario_carrera') || "Seleccionar Carrera";

    // Variables de estado (Se llenan únicamente con la Base de Datos)
    let bancoMaterias = [];            
    let misMateriasMatriculadas = []; 
    let idMateriaTemporal = null;

    // 1. CARGAR DATOS DESDE LA BASE DE DATOS
    async function cargarDatosDesdeBD() {
        try {
            // Consultar todas las materias creadas en el sistema
            const resOferta = await fetch('api/obtener_oferta_academica.php');
            bancoMaterias = await resOferta.json();

            // Consultar las materias donde este alumno específico ya se inscribió
            const resMisMaterias = await fetch(`api/mis_materias.php?alumno_id=${alumnoId}`);
            misMateriasMatriculadas = await resMisMaterias.json();

            actualizarVista();

        } catch (error) {
            console.error("Error de comunicación con el servidor:", error);
            tarjetasContainer.classList.add('hidden');
            cajaVacia.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <p>Error al conectar con el servidor del IFD.</p>`;
            cajaVacia.classList.remove('hidden');
        }
    }

    // 2. EVALUAR INTERFAZ (¿Tiene cursos inscritos o no?)
    function actualizarVista() {
        if (misMateriasMatriculadas.length === 0) {
            cajaVacia.classList.remove('hidden');
            tarjetasContainer.classList.add('hidden');
        } else {
            cajaVacia.classList.add('hidden');
            tarjetasContainer.classList.remove('hidden');
            renderizarTarjetas();
        }
    }

    // 3. RENDERIZAR TARJETA DE LOS CURSOS ACTIVOS
    function renderizarTarjetas() {
        tarjetasContainer.innerHTML = "";
        misMateriasMatriculadas.forEach(m => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <div class="card-banner"></div>
                <div class="card-content">
                    <div>
                        <a href="curso.html?id=${m.id}" class="course-name">${m.titulo}</a>
                        <p class="course-category">${m.descripcion}</p>
                    </div>
                    <div class="card-footer">
                        <span>${m.progreso || 0}% completado</span>
                        <button class="btn-options"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </div>
            `;
            tarjetasContainer.appendChild(card);
        });
    }

    // 4. DESPLEGAR LISTA DE MATERIAS DISPONIBLES AL HACER CLIC EN LA CARRERA
    lblCarrera.addEventListener('click', () => {
        listaDisponibles.innerHTML = "";
        ofertaSeccion.classList.remove('hidden');

        // Filtrar del banco total sólo las materias en las que NO está matriculado
        const pendientes = bancoMaterias.filter(bm => !misMateriasMatriculadas.some(mm => mm.id === bm.id));

        if (pendientes.length === 0) {
            listaDisponibles.innerHTML = "<p style='padding: 15px; color: #666; text-align: center;'>Ya te has inscrito a todas las materias disponibles.</p>";
            return;
        }

        pendientes.forEach(m => {
            const item = document.createElement('div');
            item.className = 'oferta-item';
            item.innerHTML = `
                <div class="oferta-info">
                    <h4>${m.titulo}</h4>
                    <p>${m.descripcion}</p>
                </div>
                <button class="btn-matricular" onclick="abrirModal(${m.id}, '${m.titulo}')">
                    <i class="fas fa-lock-open"></i> Matricularse
                </button>
            `;
            listaDisponibles.appendChild(item);
        });
    });

    // 5. CONTROL DEL MODAL DE ACCESO
    window.abrirModal = (id, nombre) => {
        idMateriaTemporal = id;
        txtMateriaModal.textContent = nombre;
        inputClave.value = "";
        modalClave.classList.remove('hidden');
    };

    // 6. PROCESAR MATRICULACIÓN EN EL SERVIDOR
    btnConfirmar.addEventListener('click', async () => {
        const password = inputClave.value.trim();
        const materiaObjetivo = bancoMaterias.find(bm => bm.id === idMateriaTemporal);

        // Validar contraseña en el cliente contra el registro traído de la BD
        if (password !== materiaObjetivo.clave) {
            alert("Clave incorrecta. Inténtalo de nuevo o consulta con tu docente.");
            return;
        }

        // Si la contraseña coincide, guardamos la relación en MySQL mediante el Backend
        try {
            const respuesta = await fetch('api/matricular_alumno.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alumno_id: alumnoId,
                    materia_id: idMateriaTemporal
                })
            });

            if (respuesta.ok) {
                alert("¡Te has matriculado de manera exitosa!");
                
                // Mover localmente la materia para refrescar la vista sin recargar toda la página
                misMateriasMatriculadas.push(materiaObjetivo);
                
                modalClave.classList.add('hidden');
                ofertaSeccion.classList.add('hidden');
                actualizarVista();
            } else {
                alert("Hubo un problema al registrar la matrícula en el servidor.");
            }

        } catch (error) {
            console.error("Error al enviar la matrícula:", error);
            alert("Error de conexión. No se pudo guardar la matrícula.");
        }
    });

    // Eventos de cierre y UI
    btnCancelar.addEventListener('click', () => modalClave.classList.add('hidden'));
    btnCerrarOferta.addEventListener('click', () => ofertaSeccion.classList.add('hidden'));
    
    avatarBtn.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        profileDropdown.classList.toggle('show'); 
    });
    
    document.addEventListener('click', () => profileDropdown.classList.remove('show'));

    // INICIO AUTOMÁTICO
    cargarDatosDesdeBD();
});