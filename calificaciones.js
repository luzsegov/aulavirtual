document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const selectCarrera = document.getElementById('select-carrera');
    const selectCursoAnio = document.getElementById('select-curso-anio');
    const selectPeriodo = document.getElementById('select-periodo');
    const btnBuscar = document.getElementById('btn-buscar');
    const formBuscar = document.getElementById('form-buscar-cursos');
    
    const seccionMaterias = document.getElementById('seccion-materias');
    const selectMateria = document.getElementById('select-materia');
    const btnCargarPlanilla = document.getElementById('btn-cargar-planilla');

    // URL base de tu API o controladores backend (cambiar por tus rutas reales)
    const API_URL = 'api/endpoints_docente.php';

    // 1. CARGA INICIAL: Traer las carreras del docente logueado al abrir la página
    cargarCarreras();

    function cargarCarreras() {
        fetch(`${API_URL}?accion=getCarreras`)
            .then(res => res.json())
            .then(carreras => {
                selectCarrera.innerHTML = '<option value="">-- Seleccione la Carrera --</option>';
                carreras.forEach(carrera => {
                    selectCarrera.innerHTML += `<option value="${carrera.id}">${carrera.nombre}</option>`;
                });
            })
            .catch(err => console.error("Error cargando carreras:", err));
    }

    // 2. EVENTO CASCADA: Al cambiar carrera, buscar sus Cursos/Años correspondientes en la BD
    selectCarrera.addEventListener('change', () => {
        const carreraId = selectCarrera.value;
        
        if (!carreraId) {
            selectCursoAnio.innerHTML = '<option value="">-- Seleccione primero una carrera --</option>';
            selectCursoAnio.disabled = true;
            btnBuscar.disabled = true;
            return;
        }

        // Petición al backend enviando la carrera seleccionada
        fetch(`${API_URL}?accion=getCursos&carrera_id=${carreraId}`)
            .then(res => res.json())
            .then(cursos => {
                selectCursoAnio.innerHTML = '<option value="">-- Seleccione el Curso/Año --</option>';
                cursos.forEach(curso => {
                    selectCursoAnio.innerHTML += `<option value="${curso.id}">${curso.nombre_año}</option>`;
                });
                selectCursoAnio.disabled = false;
                btnBuscar.disabled = false;
            })
            .catch(err => console.error("Error cargando cursos:", err));
    });

    // 3. ACCIÓN BUSCAR: Al procesar el formulario, traer las materias de ese Curso/Año específico
    formBuscar.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const carreraId = selectCarrera.value;
        const cursoId = selectCursoAnio.value;
        const periodo = selectPeriodo.value;

        fetch(`${API_URL}?accion=getMaterias&carrera_id=${carreraId}&curso_id=${cursoId}&periodo=${periodo}`)
            .then(res => res.json())
            .then(materias => {
                selectMateria.innerHTML = '<option value="">-- Seleccione la Materia --</option>';
                materias.forEach(materia => {
                    selectMateria.innerHTML += `<option value="${materia.id}">${materia.nombre_materia}</option>`;
                });
                
                // Mostramos el segundo bloque de filtros (Materias y Exámenes)
                seccionMaterias.classList.remove('hidden');
                seccionMaterias.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(err => console.error("Error cargando materias:", err));
    });

    // 4. CARGAR PLANILLA: Evento final para traer la lista de alumnos inscritos en esa materia seleccionada
    btnCargarPlanilla.addEventListener('click', () => {
        const materiaId = selectMateria.value;
        const tipoExamen = document.getElementById('select-examen').value;

        if (!materiaId || !tipoExamen) {
            alert("Por favor seleccione la Materia y el Tipo de Examen");
            return;
        }

        // Aquí disparas tu función existente que dibuja la tabla de calificaciones con los alumnos reales de la BD
        if (typeof cargarListaAlumnosPlanilla === "function") {
            cargarListaAlumnosPlanilla(materiaId, tipoExamen);
        }
    });
});