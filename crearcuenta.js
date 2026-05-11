document.addEventListener('DOMContentLoaded', () => {
    const btnEstudiante = document.getElementById('sel-estudiante');
    const btnDocente = document.getElementById('sel-docente');
    const secEstudiante = document.getElementById('sec-estudiante');
    const secDocente = document.getElementById('sec-docente');
    const inputCarrera = document.getElementById('input-carrera');
    const submitBtn = document.getElementById('submit-text');
    const listaMaterias = document.getElementById('lista-materias');

    // 1. FUNCIÓN PARA CARGAR MATERIAS DESDE EL BACKEND (BD)
    const cargarMateriasDesdeBD = async () => {
        try {
            // Aquí pones la ruta a tu archivo PHP o endpoint de API
            const respuesta = await fetch('tus_scripts/obtener_materias.php');
            const materias = await respuesta.json(); // La BD debe devolver un JSON

            // Limpiamos el contenedor
            listaMaterias.innerHTML = "";

            // Dibujamos las materias reales
            materias.forEach(m => {
                const div = document.createElement('div');
                div.className = 'materia-item';
                div.innerHTML = `
                    <label>
                        <input type="checkbox" name="materias[]" value="${m.id}"> ${m.nombre}
                    </label>
                `;
                listaMaterias.appendChild(div);
            });
        } catch (error) {
            console.error("Error al conectar con la base de datos:", error);
            listaMaterias.innerHTML = "<p>Error al cargar materias.</p>";
        }
    };

    // Llamamos a la función para que busque en la BD apenas abra la página
    cargarMateriasDesdeBD();

    // 2. LÓGICA DE INTERCAMBIO (ESTUDIANTE / DOCENTE)
    const actualizarInterfaz = (esDocente) => {
        if (esDocente) {
            btnDocente.classList.add('active');
            btnEstudiante.classList.remove('active');
            secDocente.classList.remove('hidden'); 
            secEstudiante.classList.add('hidden'); 
            inputCarrera.required = false;
            submitBtn.textContent = "Crear mi cuenta";
        } else {
            btnEstudiante.classList.add('active');
            btnDocente.classList.remove('active');
            secEstudiante.classList.remove('hidden'); 
            secDocente.classList.add('hidden');    
            inputCarrera.required = true;
            submitBtn.textContent = "Crear cuenta";
        }
    };

    btnEstudiante.addEventListener('click', () => actualizarInterfaz(false));
    btnDocente.addEventListener('click', () => actualizarInterfaz(true));

    // 3. VER/OCULTAR CONTRASEÑA
    const togglePass = document.getElementById('toggle-pass');
    const passField = document.getElementById('pass-field');
    togglePass.addEventListener('click', () => {
        const isPass = passField.type === 'password';
        passField.type = isPass ? 'text' : 'password';
        togglePass.classList.toggle('fa-eye');
        togglePass.classList.toggle('fa-eye-slash');
    });
});