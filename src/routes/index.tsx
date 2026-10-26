import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, Check, Download, Menu, MonitorSmartphone, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { ReviewSamples } from "../components/ShopReviews";
import "../styles/storefront.css";

const checkout = "https://pay.cakto.com.br/33yrtif_1239499";
const mockup = "https://i.ibb.co/608YRrHf/Mockup-Digital-Playboy-em-V-rios-Dispositivos.webp";
const images = [
  "https://i.ibb.co/s9ch9fvS/OIP.webp",
  "https://i.ibb.co/SwyjTpzy/junho28.webp",
  "https://i.ibb.co/5Xj4r3vD/img-660x1200uu2017-09-28-15-53-00-325584.webp",
  "https://i.ibb.co/Dgb89pwT/a.webp",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Archivio Shop Digitale | Pagina iniziale" },
      { name: "description", content: "Archivio Shop Digitale: scopri la collezione digitale di oltre 500 numeri in PDF, acquistabile con un pagamento unico di 27 €." },
      { property: "og:title", content: "Archivio Shop Digitale" },
      { property: "og:description", content: "Il tuo e-commerce di archivi digitali. Scopri la collezione e le anteprime." },
      { property: "og:type", content: "website" },
    ]
  }),
  component: Homepage
});

function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="shop home-shop">
    <div className="ribbon"><span>ARCHIVIO SHOP DIGITALE</span><i>•</i><span>UN SOLO PAGAMENTO</span><i>•</i><span>CONTENUTI 18+</span></div>
    <header className="head">
      <div className="wrap nav">
        <button className="icononly menu" type="button" aria-label="Apri menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen?<X size={23}/>:<Menu size={23}/>}</button>
        <a className="brand" href="/" aria-label="Archivio Shop, pagina iniziale"><img className="brand-image" src="/archivio-shop-logo.svg" alt="Archivio Shop Digitale" /></a>
        <nav aria-label="Navigazione" className={`navlinks ${menuOpen ? "open" : ""}`}>
          <a href="/" aria-current="page" onClick={() => setMenuOpen(false)}>Pagina iniziale</a>
          <a href="/prodotto" onClick={() => setMenuOpen(false)}>La collezione</a>
          <a href="#vetrina" onClick={() => setMenuOpen(false)}>Vetrina</a>
          <a href="#opinioni" onClick={() => setMenuOpen(false)}>Recensioni</a>
        </nav>
        <div className="navright"><a className="bag" href="/prodotto" aria-label="Vai alla pagina prodotto e al carrello"><ShoppingBag size={18}/><span className="bagname">Acquista</span><ArrowRight size={16}/></a></div>
      </div>
    </header>
    <main>
      <section className="wrap home-hero">
        <div className="home-hero-copy">
          <div className="home-pill">BENVENUTO IN ARCHIVIO SHOP</div>
          <h1>Il tuo archivio digitale. <em>Tutto da scoprire.</em></h1>
          <p>Riscopri una collezione editoriale da conservare e sfogliare sul dispositivo che preferisci. Un negozio semplice, una raccolta completa, un solo pagamento.</p>
          <div className="home-hero-actions">
            <a href="/prodotto" className="btn red">Scopri la collezione <ArrowRight size={18}/></a>
            <a href="#vetrina" className="btn">Esplora la vetrina <ArrowRight size={18}/></a>
          </div>
          <div className="home-hero-meta"><span><Check size={17}/> Oltre 500 numeri</span><span><Check size={17}/> Formato PDF</span><span><Check size={17}/> Nessun abbonamento</span></div>
        </div>
        <div className="home-hero-art">
          <span className="home-visual-tag">COLLEZIONE IN EVIDENZA</span>
          <img src={mockup} alt="Archivio digitale su più dispositivi"/>
          <div className="home-visual-price"><span>COLLEZIONE COMPLETA</span><strong>27 €</strong></div>
        </div>
      </section>
      <section className="home-features">
        <div className="wrap home-feature-grid">
          <div><Download size={28}/><strong>Prodotto digitale</strong><span>Istruzioni di accesso dopo l'acquisto</span></div>
          <div><MonitorSmartphone size={28}/><strong>Su più dispositivi</strong><span>Smartphone, tablet e computer</span></div>
          <div><BookOpen size={28}/><strong>500+ numeri</strong><span>Una sola raccolta digitale</span></div>
          <div><ShieldCheck size={28}/><strong>Garanzia 7 giorni</strong><span>Secondo le condizioni applicabili</span></div>
        </div>
      </section>
      <section id="vetrina" className="wrap home-products">
        <div className="home-section-intro"><span className="eyebrow">PRODOTTI IN EVIDENZA</span><h2>La vetrina dello shop.</h2><p>Un prodotto completo, con anteprime delle riviste incluse nella raccolta.</p></div>
        <div className="home-catalog-grid">
          <article className="home-featured-product">
            <a href="/prodotto" className="home-product-image"><span className="home-card-chip">PRODOTTO DIGITALE</span><img src={mockup} loading="lazy" alt="Collezione digitale Playboy, oltre 500 numeri"/></a>
            <div className="home-card-body"><small>ARCHIVIO RIVISTE · COLLEZIONE COMPLETA</small><h3>Collezione Digitale Playboy – 500+ numeri PDF</h3>
            <div className="home-card-stars"><span>Recensioni dei clienti disponibili dopo la verifica degli ordini</span></div>
            <p>Oltre 500 numeri digitali, da esplorare su smartphone, tablet e computer.</p>
            <div className="home-card-buy"><strong>27 €</strong><a href="/prodotto" className="btn red">Vedi il prodotto <ArrowRight size={17}/></a></div></div>
          </article>
          <div className="home-side-grid">
            {images.slice(0,2).map((image,i)=><a key={image} className="home-preview-tile" href="/prodotto#anteprime"><img src={image} loading="lazy" alt={`Anteprima copertina ${i+1} inclusa nella collezione`}/><div><span>ANTEPRIMA INCLUSA</span><strong>Copertina {i+1}</strong><small>Non venduta separatamente</small></div></a>)}
          </div>
        </div>
      </section>
      <section className="home-banner"><div className="wrap home-banner-inner"><div><span className="eyebrow">COLLEZIONE DIGITALE</span><h2>La storia di una rivista, in un unico archivio.</h2><p>Scopri pagine e copertine che hanno attraversato le generazioni. Contenuti destinati esclusivamente a maggiorenni.</p><a href="/prodotto" className="btn">Scopri tutti i dettagli <ArrowRight size={17}/></a></div><img src={images[3]} loading="lazy" alt="Anteprima editoriale della raccolta"/></div></section>
      <ReviewSamples/>
      <section className="home-closing"><div className="wrap"><span>ARCHIVIO SHOP DIGITALE</span><h2>Pronto a scoprire la collezione?</h2><p>500+ numeri · formato PDF · 27 € in un unico pagamento.</p><a className="btn red" href={checkout} target="_blank" rel="noopener noreferrer">Acquista a 27 € <ArrowRight size={18}/></a></div></section>
    </main>
    <footer className="foot"><div className="wrap"><div className="footgrid"><div><a className="brand" href="/"><img className="brand-image" src="/archivio-shop-logo.svg" alt="Archivio Shop Digitale"/></a><p>Negozio indipendente di archivi editoriali digitali. Contenuti riservati ai maggiorenni.</p></div><div><h3>NAVIGAZIONE</h3><a href="/">Pagina iniziale</a><a href="/prodotto">Pagina prodotto</a><a href="#vetrina">Vetrina</a></div><div><h3>INFORMAZIONI</h3><a href="#opinioni">Recensioni dimostrative</a><p>Privacy, termini, assistenza e diritti di distribuzione da verificare prima della vendita.</p></div></div><div className="footbottom"><span>© {new Date().getFullYear()} Archivio Shop Digitale · 18+</span><span>Sito indipendente, senza affiliazione ufficiale dichiarata con Playboy.</span></div></div></footer>
  </div>;
}
