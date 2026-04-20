import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

function Home({ onLogin }) {
  return (
    <div className="app-shell">
      <Header onLogin={onLogin} />
      <Hero />
      <Footer />
    </div>
  )
}

export default Home