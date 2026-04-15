# 🎓 Aula Virtual - IFD Santa Clara

## 👥 AUTORES
* **Luz Maria Segovia Cáceres**
* **Araceli Isabel Vazquez López**

---
## DESCRIPCIÓN
Este proyecto es un **Sistema de Administración de Cursos Virtuales (LMS) y Gestión Académica** desarrollado para el Instituto de Formación Docente Santa Clara en Coronel Oviedo. La plataforma permite un control total sobre la comunidad educativa, desde la administración de usuarios hasta el seguimiento pedagógico.

---


## 🏛️ GESTIÓN ADMINISTRATIVA
El sistema cuenta con un módulo de **Super-Administrador** diseñado para centralizar el control de la institución:

* **Control de Usuarios:** Capacidad para crear, editar y gestionar perfiles específicos para **Docentes** y **Alumnos**.
* **Gestión de Matrículas:** Supervisión de las cantidades de alumnos matriculados y docentes activos en la institución.
* **Seguridad Centralizada:** El administrador es el único encargado de dar el alta a nuevos miembros, garantizando la integridad de la base de datos.

---

## 🚀 TECNOLOGÍAS UTILIZADAS

* **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Arquitectura basada en componentes).
* **Estilos:** CSS3 Moderno con diseño institucional.
* **Backend:** PHP (PDO) para una comunicación segura con el servidor.
* **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (Elegido por su robustez en la gestión de grandes volúmenes de usuarios y roles).
* **Servidor Local:** XAMPP (Apache).

---

## 📂 ESTRUCTURA DEL PROYECTO

```text
src/
├── components/
│   ├── Header.jsx       # Navegación y acceso
│   ├── Hero.jsx         # Banner y categorías principales
│   └── Footer.jsx       # Datos institucionales y contacto
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Acceso con validación de roles
│   └── AdminDashboard.jsx # Panel de control para el administrador (En desarrollo)
├── styles/
│   ├── global.css       # Estilos generales
│   └── login.css        # Estilos del módulo de acceso
└── App.jsx              # Gestión de rutas y estados