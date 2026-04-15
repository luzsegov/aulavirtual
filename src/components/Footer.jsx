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
          <a href="https://www.instagram.com/santaclaraifd">
            <img src="/ig.png" alt="Instagram" className="social-img" />
          </a>
          <a href="https://www.facebook.com/santaclaracoroneloviedo/?locale=es_LA">
            <img src="/fb.png" alt="Facebook" className="social-img" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
