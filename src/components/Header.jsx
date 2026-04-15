function Header({ onLogin }) {
  return (
    <header className="header">
      <div className="header-title">INSTITUTO DE FORMACIÓN DOCENTE - SANTA CLARA</div>
      <button type="button" className="login-btn" onClick={onLogin}>
        INICIAR SESIÓN
      </button>
    </header>
  )
}

export default Header
