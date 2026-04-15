const categories = [
  {
    href: '/profesorado',
    img: '/logo-profesorado.png',
    alt: 'Profesorado',
    label: 'PROFESORADO'
  },
  {
    href: '/tecnicatura',
    img: '/logo-tecnicatura.png',
    alt: 'Tecnicatura',
    label: 'TECNICATURA'
  },
  {
    href: '/licenciatura',
    img: '/logo-licenciatura.png',
    alt: 'Licenciatura',
    label: 'LICENCIATURA'
  },
  {
    href: '/maestria',
    img: '/logo-maestria.png',
    alt: 'Maestría',
    label: 'MAESTRÍA'
  }
]

function CategoryCard({ href, img, alt, label }) {
  return (
    <a className="category-link" href={href}>
      <div className="category-item">
        <img src={img} alt={alt} className="circle-img" />
        <p>{label}</p>
      </div>
    </a>
  )
}

function Hero() {
  return (
    <div className="hero-content">
      <div className="hero-left">
        <img src="/santa_clara.jpg" alt="Santa Clara" className="img-portrait" />
        <div className="santa-overlay" />
      </div>

      <div className="hero-center">
        <img src="/birrete.png" alt="Birrete" className="img-birrete" />
        <h1 className="main-title">
          AULA <br /> <span>VIRTUAL</span>
        </h1>

        <div className="categories">
          {categories.map((category) => (
            <CategoryCard key={category.label} {...category} />
          ))}
        </div>

        <button className="welcome-btn" type="button">
          ¡BIENVENIDOS!
        </button>
      </div>

      <div className="hero-right">
        <img src="/logoifd.png" alt="Logo IFD" className="logo-top" />
      </div>
    </div>
  )
}

export default Hero
