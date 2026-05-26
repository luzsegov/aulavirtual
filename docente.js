document.addEventListener('DOMContentLoaded', () => {

    const avatarBtn = document.getElementById('avatar-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    const txtMateriaDocente = document.getElementById('nombre-materia-docente');
    
    const btnNuevaTarea = document.getElementById('btn-nueva-tarea');
    const contenedorModal = document.getElementById('modal-tarea');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCancelarTarea = document.getElementById('btn-cancelar-tarea');
    const formTarea = document.getElementById('form-tarea');
    const listaTareasContenedor = document.getElementById('lista-tareas-docente');

    const docenteId = localStorage.getItem('usuario_id');
    const materiaId = localStorage.getItem('materia_activa_id'); 

    let listadoTareas = [];

    async function cargarDatosDocente() {
        if (!materiaId) {
            txtMateriaDocente.textContent = "Ninguna materia seleccionada";
            return;
        }

        try {
            
            const respuesta = await fetch(`api/obtener_panel_docente.php?materia_id=${materiaId}&docente_id=${docenteId}`);
            const datos = await respuesta.json();
            
            txtMateriaDocente.textContent = datos.materia_nombre || "Asignatura sin nombre";
            listadoTareas = datos.tareas || [];

            renderizarTareasDocente();

        } catch (error) {
            console.error("Error al conectar con la base de datos del IFD:", error);
            txtMateriaDocente.textContent = "Error de conexión con el servidor";
            listaTareasContenedor.innerHTML = `<p style="color:white; text-align:center; grid-column: 1/-1;">No se pudieron cargar los datos de la clase de forma correcta.</p>`;
        }
    }

    function renderizarTareasDocente() {
        listaTareasContenedor.innerHTML = "";

        if (listadoTareas.length === 0) {
            listaTareasContenedor.innerHTML = `<p style="color:white; text-align:center; grid-column: 1/-1;">No has creado ninguna tarea para esta asignatura todavía.</p>`;
            return;
        }

        listadoTareas.forEach(t => {
            const card = document.createElement('div');
            card.className = 'tarjeta-tarea';
        
            const iconVisibilidad = t.visibilidad === 'visible' ? 'fa-eye' : 'fa-eye-slash';
            const claseVisibilidad = t.visibilidad === 'visible' ? 'visible' : 'oculto';
            const textoEstadoVisibilidad = t.visibilidad === 'visible' ? 'Visible para alumnos' : 'Oculto para alumnos';

            
            const formatosLista = Array.isArray(t.formatos) ? t.formatos : t.formatos.split(',');

            card.innerHTML = `
                <div>
                    <div class="tarea-header-card">
                        <h4>${t.titulo}</h4>
                        <button type="button" class="btn-visibilidad-toggle ${claseVisibilidad}" onclick="alternarVisibilidad(${t.id}, '${t.visibilidad}')" title="${textoEstadoVisibilidad}">
                            <i class="fas ${iconVisibilidad}"></i>
                        </button>
                    </div>
                    <p class="tarea-tiempos">
                        <i class="fas fa-calendar-alt"></i> Vence: ${t.fecha} a las ${t.hora} hs.
                    </p>
                    <p class="formatos-badge-lista">
                        <strong>Formatos admitidos:</strong> ${formatosLista.join(', ')}
                    </p>
                </div>

                <div>
                    <div class="tarea-estados-row">
                        <div class="estado-box">
                            <span>${t.entregados || 0}</span> Entregas
                        </div>
                        <div class="estado-box">
                            <span>${t.calificados || 0}</span> Calificadas
                        </div>
                    </div>
                </div>
            `;
            listaTareasContenedor.appendChild(card);
        });
    }

    window.alternarVisibilidad = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'visible' ? 'oculto' : 'visible';
        
        try {
            const respuesta = await fetch('api/actualizar_visibilidad_tarea.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tarea_id: id,
                    visibilidad: nuevoEstado
                })
            });

            if (respuesta.ok) {
                
                listadoTareas = listadoTareas.map(t => t.id === id ? { ...t, visibilidad: nuevoEstado } : t);
                renderizarTareasDocente();
            } else {
                alert("No se pudo cambiar el estado de visibilidad en el servidor.");
            }

        } catch (error) {
            console.error("Error de comunicación en visibilidad:", error);
            alert("Error de red al intentar cambiar la visibilidad.");
        }
    };

    btnNuevaTarea.addEventListener('click', () => {
        formTarea.reset();
        contenedorModal.classList.remove('hidden');
    });

    const cerrarModal = () => contenedorModal.classList.add('hidden');
    btnCerrarModal.addEventListener('click', cerrarModal);
    btnCancelarTarea.addEventListener('click', cerrarModal);

    formTarea.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titulo = document.getElementById('tarea-titulo').value.trim();
        const descripcion = document.getElementById('tarea-desc').value.trim();
        const fecha = document.getElementById('tarea-fecha').value;
        const hora = document.getElementById('tarea-hora').value;
        const visibilidad = document.getElementById('tarea-visibilidad').value;

        // Formatos de archivos seleccionados
        const checkboxes = document.querySelectorAll('.formatos-checkbox-grid input:checked');
        const formatosSeleccionados = Array.from(checkboxes).map(cb => cb.value);

        if (formatosSeleccionados.length === 0) {
            alert("Debes seleccionar al menos un formato de archivo permitido para los alumnos.");
            return;
        }

        const payloadTarea = {
            materia_id: materiaId,
            docente_id: docenteId,
            titulo: titulo,
            descripcion: descripcion,
            fecha: fecha,
            hora: hora,
            formatos: formatosSeleccionados, 
            visibilidad: visibilidad
        };

        try {
            const respuesta = await fetch('api/guardar_nueva_tarea.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadTarea)
            });

            if (respuesta.ok) {
                alert("¡Tarea guardada y programada de forma exitosa!");
                cerrarModal();
                
                cargarDatosDocente(); 
            } else {
                alert("Hubo un problema al procesar y almacenar el trabajo práctico.");
            }

        } catch (error) {
            console.error("Error al registrar tarea en el backend:", error);
            alert("Error de conexión. No se pudo guardar la tarea.");
        }
    });

 
    avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => profileDropdown.classList.remove('show'));

  
    cargarDatosDocente();

    // Control del menú desplegable "Academia"
const btnAcademia = document.getElementById('btn-academia');
const menuAcademia = document.getElementById('menu-academia');

if (btnAcademia && menuAcademia) {
    btnAcademia.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el evento cierre el menú inmediatamente
        menuAcademia.classList.toggle('show-menu');
        
        // Rotar la flechita del botón para dar efecto visual
        const flecha = btnAcademia.querySelector('.icon-flecha');
        if (menuAcademia.classList.contains('show-menu')) {
            flecha.style.transform = 'rotate(180deg)';
        } else {
            flecha.style.transform = 'rotate(0deg)';
        }
    });
}

// Cierre global de menús al hacer clic fuera de ellos
document.addEventListener('click', () => {
    if (menuAcademia) {
        menuAcademia.classList.remove('show-menu');
        const flecha = btnAcademia.querySelector('.icon-flecha');
        if(flecha) flecha.style.transform = 'rotate(0deg)';
    }
});
});