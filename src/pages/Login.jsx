import '../styles/login.css'

function Login({ onBack }) {
  return (
    <div className="login-page">
      <button type="button" className="back-button" onClick={onBack}>
        ← Volver a inicio
      </button>
      <div className="login-container">
        <div className="login-visual">
          <div className="overlay-gradient" />
          <img src="/logoifd.png" alt="Logo IFD Santa Clara" className="bg-logo" />
        </div>

        <div className="login-form-section">
          <div className="form-content">
            <h1 className="brand-title">IFD</h1>
            <h2 className="sub-brand">SANTA CLARA</h2>

            <p className="register-link">
              ¿Aún no tienes una cuenta? <a href="#">Regístrate</a>
            </p>

            <form className="login-form" onSubmit={(event) => event.preventDefault()}>
              <div className="input-group">
                <label htmlFor="usuario">Usuario</label>
                <input type="text" id="usuario" name="usuario" required />
              </div>

              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" required />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" name="remember" /> Mantener la sesión abierta
                </label>
                <a href="#" className="forgot-password">
                  ¿Has olvidado tu contraseña?
                </a>
              </div>

              <button type="submit" className="btn-login">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
