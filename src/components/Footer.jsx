function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>Contáctanos</h3>
        <p>0521 200185</p>
        <p>0983 539464</p>
      </div>
      <div className="footer-section">
        <h3>Dirección</h3>
        <p>Dr. Roberto González e/ Mcal. López</p>
        <p>Coronel Oviedo - Paraguay</p>
      </div>
      <div className="footer-section">
        <h3>Redes Sociales</h3>
        <div className="social-icons">
          <a href="https://www.instagram.com/santaclaraifd" target="_blank" rel="noopener noreferrer">
            <img src="/ig.png" alt="Instagram" className="social-img" />
          </a>
          <a href="https://www.facebook.com/santaclaracoroneloviedo/?locale=es_LA" target="_blank" rel="noopener noreferrer">
            <img src="/fb.png" alt="Facebook" className="social-img" />
          </a>
        </div>
      </div>
      <div class="copyright-text">
  <span>© Copyright IFD | SANTA CLARA 2026. Todos los Derechos Reservados | </span>
  
  <div class="developers-section">
    Desarrollado por
    
    <div class="tooltip-container">
      <span class="initials-box">LS</span>
      <span class="tooltip-text">Luz Maria Segovia Caceres</span>
    </div>

    <div class="tooltip-container">
      <span class="initials-box">AV</span>
      <span class="tooltip-text">Araceli Isabel Vazquez Lopez</span>
    </div>
  </div>
</div>
    </footer>
  )
}
export default Footer;