
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Download, LockKeyhole, Menu, MonitorSmartphone, Search, ShieldCheck, ShoppingBag, X } from "lucide-react";
import "../styles/storefront.css";
import { RatingStars, ReviewSamples } from "../components/ShopReviews";

const checkout = "https://pay.cakto.com.br/33yrtif_1239499";
const mockup = "https://i.ibb.co/608YRrHf/Mockup-Digital-Playboy-em-V-rios-Dispositivos.webp";
const covers = [
  "https://i.ibb.co/s9ch9fvS/OIP.webp",
  "https://i.ibb.co/SwyjTpzy/junho28.webp",
  "https://i.ibb.co/5Xj4r3vD/img-660x1200uu2017-09-28-15-53-00-325584.webp",
  "https://i.ibb.co/Dgb89pwT/a.webp",
  "https://i.ibb.co/j9CwczC8/71b.webp",
  "https://i.ibb.co/LzRTFvkL/046.webp",
  "https://i.ibb.co/qMMRk7KQ/3-VQXWGKBVZOJRIS3-YYFCUFI3-OA.webp",
  "https://i.ibb.co/mVk3qy4p/setembro69.webp",
  "https://i.ibb.co/wZyhrWkk/playboy-brazil-vintage-adult-magazine-dec-1-1993.webp",
  "https://i.ibb.co/hFfN8sGH/playboy-sincera.webp",
  "https://i.ibb.co/4gS3SmLZ/play9.webp",
  "https://i.ibb.co/BVN7ncD5/outubro27.webp",
];
const productImages = [mockup, ...covers.slice(0, 3)];
const faq = [
  ["Che cosa include la collezione Playboy?", "Ricevi una raccolta digitale di oltre 500 numeri in formato PDF, da leggere su smartphone, tablet o computer."],
  ["Posso leggerla su smartphone e tablet?", "Sì. I file PDF sono compatibili con i comuni lettori PDF per Android, iPhone, iPad e computer."],
  ["Come riceverò i file?", "Dopo la conferma del pagamento riceverai le istruzioni di accesso alla raccolta digitale dal fornitore del checkout."],
  ["Posso leggere anche offline?", "Sì. Una volta scaricati, i PDF si possono leggere anche senza connessione. Contenuti riservati a maggiorenni (18+)."],
  ["Si paga una sola volta?", "Sì. Il prezzo della raccolta è 27 €, con un solo pagamento, senza canone mensile."],
];
const specs = [
  ["01", "500+ numeri", "Oltre 500 numeri in PDF in una sola raccolta digitale."],
  ["02", "Cultura e interviste", "Interviste, reportage, grafica editoriale, fotografia, costume e stile."],
  ["03", "Alta risoluzione", "File PDF leggibili su smartphone, tablet e computer."],
  ["04", "Accesso senza scadenza", "Scarica i file e consultali anche senza connessione."],
];
const steps = [
  ["01 / SCEGLI", "Scegli la collezione", "La collezione digitale a 27 €. Scegli il metodo di pagamento disponibile al checkout.", ShoppingBag],
  ["02 / RICEVI", "Accesso dopo il pagamento", "Dopo la conferma del pagamento ricevi le istruzioni per accedere al prodotto digitale.", LockKeyhole],
  ["03 / ESPLORA", "Leggi quando vuoi", "Scarica i PDF su smartphone, tablet o computer e leggili anche offline.", MonitorSmartphone],
] as const;

export const Route = createFileRoute("/prodotto")({
  head: () => ({
    meta: [
      { title: "Archivio Riviste | Collezione digitale" },
      { name: "description", content: "Collezione digitale di oltre 500 numeri in PDF. Prezzo unico di 27 €, lettura offline e contenuto riservato ai maggiorenni." },
      { property: "og:title", content: "Archivio Riviste | Collezione digitale" },
      { property: "og:description", content: "Un'icona editoriale, tutta da riscoprire. 500+ numeri digitali." },
      { property: "og:type", content: "website" },
    ]
  }),
  component: Storefront
});

function Buy({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <a className={`btn red ${className}`} href={checkout} target="_blank" rel="noopener noreferrer">{children}<ArrowRight size={17}/></a>;
}
function Storefront() {
  const [cart, setCart] = useState(false);
  const [selectedHero, setSelectedHero] = useState(0);
  const [hasItem, setHasItem] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setHasItem(sessionStorage.getItem("ecommerce-cart") === "1"); } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem("ecommerce-cart", hasItem ? "1" : "0"); } catch {}
  }, [hasItem]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setCart(false); setMenuOpen(false); setSearchOpen(false); } };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  function addCart() { setHasItem(true); setCart(true); }
  function moveGallery(direction: number) { galleryRef.current?.scrollBy({ left: direction * 450, behavior: "smooth" }); }
  function goToAnchor(id: string) { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }
  const selectedCovers = covers.filter((_,i) => !query.trim() || `copertina ${i+1} playboy archivio riviste collezione`.includes(query.trim().toLowerCase()));
  return <div className="shop" id="top">
    <div className="ribbon"><span>COLLEZIONE DIGITALE</span><i>•</i><span>ACCESSO DOPO IL PAGAMENTO</span><i>•</i><span>ESCLUSIVO PER MAGGIORENNI 18+</span></div>
    <header className="head">
      <div className="wrap nav">
        <button type="button" className="icononly menu" aria-label="Apri menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={22}/></button>
        <a href="/" className="brand" aria-label="Archivio Shop, pagina iniziale"><img className="brand-image" src="/archivio-shop-logo.svg" alt="Archivio Shop Digitale"/></a>
        <nav aria-label="Navigazione" className={`navlinks ${menuOpen ? "open" : ""}`}>
          <a href="/" onClick={() => setMenuOpen(false)}>Pagina iniziale</a>
          <a href="/prodotto" onClick={() => setMenuOpen(false)}>La collezione</a>
          <a href="#anteprime" onClick={() => setMenuOpen(false)}>Copertine</a>
          <a href="#come-funziona" onClick={() => setMenuOpen(false)}>Come funziona</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        </nav>
        <div className="navright">
          <button type="button" className="icononly" aria-label="Cerca" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><Search size={20}/></button>
          <button type="button" className="bag" aria-label="Apri carrello" onClick={() => setCart(true)}><ShoppingBag size={18}/><span className="bagname">Carrello</span><strong>{hasItem ? 1 : 0}</strong></button>
        </div>
      </div>
      {searchOpen && <form className="wrap searchbox" onSubmit={(e) => {e.preventDefault();goToAnchor("anteprime");}}><Search size={18}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Cerca copertine, collezione..." aria-label="Cerca"/><button type="submit">Cerca</button></form>}
    </header>
    <main>
      <section className="wrap hero product-hero anchor" id="collezione">
        <nav className="product-breadcrumb" aria-label="Percorso di navigazione">
          <a href="/">Pagina iniziale</a><ChevronRight size={14}/><span>Collezioni digitali</span><ChevronRight size={14}/><strong>Playboy 500+ PDF</strong>
        </nav>
        <div className="product-gallery" aria-label="Immagini del prodotto">
          <div className="product-gallery-stage">
            <span className="product-gallery-label">COLLEZIONE DIGITALE</span>
            <img src={productImages[selectedHero]} alt={selectedHero === 0 ? "Collezione digitale Playboy su più dispositivi" : "Anteprima di copertina inclusa nella collezione"} fetchPriority={selectedHero === 0 ? "high" : "auto"}/>
          </div>
          <div className="product-thumbnails">
            {productImages.map((src,i) => <button key={src} type="button" className={`product-thumbnail ${selectedHero === i ? "is-selected" : ""}`} aria-label={`Visualizza immagine ${i + 1} della collezione`} aria-pressed={selectedHero === i} onClick={()=>setSelectedHero(i)}><img src={src} alt="" loading={i === 0 ? "eager" : "lazy"}/></button>)}
          </div>
          <span className="gallery-undertext">Foto e copertine illustrative della collezione.</span>
        </div>
        <div className="product-overview">
          <span className="product-collection">ARCHIVIO RIVISTE <span>·</span> 500+ NUMERI IN PDF</span>
          <h1>Collezione Digitale Playboy – oltre 500 numeri in PDF</h1>
          <div className="product-rating-line">
            <RatingStars/><span className="rating-disclaimer">Stelle illustrative · non è una valutazione verificata</span>
          </div>
          <p className="product-long-description">Il mondo di Playboy in una collezione digitale: interviste, cultura, costume e il design di una rivista che ha segnato intere generazioni.</p>
          <div className="product-spec-list">
            <span><Check size={17}/> Oltre 500 numeri in formato PDF</span>
            <span><Check size={17}/> Su smartphone, tablet e computer</span>
            <span><Check size={17}/> Download e lettura offline</span>
            <span><Check size={17}/> Un unico pagamento, senza abbonamento</span>
          </div>
          <div className="product-tech"><div><strong>Formato</strong><span>Digitale (PDF)</span></div><div><strong>Accesso</strong><span>Dopo il pagamento</span></div><div><strong>Età</strong><span>Riservato ai maggiorenni (18+)</span></div></div>
          <a className="product-preview-link" href="#anteprime">Visualizza le copertine <ArrowRight size={17}/></a>
        </div>
        <aside className="product-purchase-panel" aria-label="Acquisto della collezione digitale">
          <span className="purchase-panel-eyebrow">PRODOTTO DIGITALE</span>
          <div className="purchase-panel-price">27 <small>€</small></div>
          <p className="purchase-panel-info">Prezzo unico · Nessun abbonamento</p>
          <div className="purchase-panel-divider"></div>
          <div className="purchase-panel-benefit"><Download size={20}/><div><strong>Download digitale</strong><span>Istruzioni di accesso dopo il pagamento</span></div></div>
          <div className="purchase-panel-benefit"><ShieldCheck size={20}/><div><strong>Garanzia 7 giorni</strong><span>Secondo le condizioni applicabili</span></div></div>
          <div className="purchase-panel-actions"><Buy>Acquista ora</Buy><button type="button" className="btn purchase-add-cart" onClick={addCart}><ShoppingBag size={17}/> Aggiungi al carrello</button></div>
          <div className="purchase-panel-safe"><LockKeyhole size={14}/> Reindirizzamento al checkout sicuro</div>
        </aside>
      </section>
      <div className="truststrip"><div className="wrap trustinner">
        {[[BookOpen,"Oltre 500 numeri","In un'unica raccolta"],[MonitorSmartphone,"Su tutti i dispositivi","Smartphone, tablet e PC"],[Download,"Download in PDF","Leggi anche offline"],[ShieldCheck,"Garanzia 7 giorni","Soddisfatti o rimborsati"]].map(([Icon,label,note]) => {const P = Icon as typeof BookOpen;return <div className="trustitem" key={label as string}><P size={25}/><div><strong>{label as string}</strong><span>{note as string}</span></div></div>})}
      </div></div>
      <section className="wrap gallery anchor" id="anteprime">
        <div className="sectiontitle"><div><span className="eyebrow">SCOPRI L'ARCHIVIO</span><h2>Una collezione da esplorare.</h2><p>Dalle copertine iconiche alle grandi interviste. Ogni numero racconta il suo tempo.</p></div><div className="controls"><button aria-label="Copertine precedenti" className="ctrl" onClick={() => moveGallery(-1)}><ChevronLeft size={22}/></button><button aria-label="Copertine successive" className="ctrl" onClick={() => moveGallery(1)}><ChevronRight size={22}/></button></div></div>
        <div className="coverlist" ref={galleryRef} aria-label="Anteprime delle copertine">{selectedCovers.map((src, i) => <article className="cover" key={src}><img src={src} loading="lazy" alt={`Anteprima copertina ${i+1} della collezione`}/><h3>Copertina {i+1}</h3><p>Inclusa nella collezione</p></article>)}</div>
        {selectedCovers.length === 0 && <p>Nessuna copertina trovata. Prova un altro termine.</p>}
        <div className="note"><span>Queste copertine sono anteprime: non sono prodotti acquistabili singolarmente.</span><a href="#offerta">Scopri la collezione completa →</a></div>
      </section>
      <section className="wrap editorial">
        <div className="editorialpic"><img src={covers[10]} loading="lazy" alt="Esempio del design editoriale della collezione"/><span>OLTRE UNA RIVISTA</span></div>
        <div><span className="eyebrow">UN PATRIMONIO EDITORIALE</span><h2>Più di una rivista.<br/><em>Un'epoca.</em></h2><p>La copertina in edicola. Un'intervista di cui tutti parlavano. Giornalismo, fotografia, cultura e costume racchiusi in un'unica rivista.</p><p><strong>Ogni numero racconta la propria epoca.</strong> Pagine che custodiscono idee, stili e conversazioni di generazioni diverse.</p><p>Rivivi questo universo con i tuoi tempi, nella comodità di una collezione digitale riservata ai maggiorenni.</p><a className="quick" href="#offerta">Esplora l'offerta <ArrowRight size={16}/></a></div>
      </section>
      <section className="detailsbg"><div className="wrap"><span className="eyebrow">TUTTO IN UN'UNICA RACCOLTA</span><div className="sectiontop"><h2>Cosa trovi nella collezione.</h2><p>Una selezione completa da leggere, consultare e conservare sui tuoi dispositivi.</p></div><div className="detailsgrid">{specs.map(([n,title,text]) => <div className="detail" key={n}><small>{n}</small><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
      <section className="wrap steps anchor" id="come-funziona"><div className="stephead"><span className="eyebrow">SEMPLICE, DALL'ACQUISTO ALLA LETTURA</span><h2>Come funziona?</h2></div><div className="stepgrid">{steps.map(([code,title,info,Icon])=><article className="step" key={code}><small>{code}</small><Icon size={31}/><h3>{title}</h3><p>{info}</p></article>)}</div></section>
      <section className="offer anchor" id="offerta"><div className="wrap offergrid"><div><span className="eyebrow">UN'OFFERTA DEDICATA AGLI APPASSIONATI</span><h2>La tua collezione digitale <em>ti aspetta.</em></h2><p>Oltre 500 numeri sempre a portata di mano. Paghi una sola volta e leggi quando vuoi.</p><div className="offerlist">{["500+ numeri in PDF","Download dopo l'acquisto","Lettura offline","Nessun abbonamento"].map(t=><span key={t}><Check size={17}/>{t}</span>)}</div></div><div className="itemcard"><div className="cardtop"><span>COLLEZIONE COMPLETA</span><span>PRODOTTO DIGITALE</span></div><img src={mockup} loading="lazy" alt="Collezione digitale completa"/><h3>Collezione digitale Playboy</h3><p>Oltre 500 numeri in formato PDF</p><div className="priceline"><strong>27 €</strong><small>PREZZO UNICO<br/>SENZA ABBONAMENTO</small></div><Buy>Acquista la collezione</Buy><button className="btn" type="button" onClick={addCart}>Aggiungi al carrello</button><p className="legalnote">Pagamento online · Garanzia 7 giorni</p></div></div></section>
      <section className="wrap guarantee"><ShieldCheck size={58}/><div><span className="eyebrow">ACQUISTA IN TRANQUILLITÀ</span><h2>Garanzia soddisfatti o rimborsati di 7 giorni.</h2><p>Se non sei soddisfatto dell'acquisto, puoi richiedere il rimborso entro 7 giorni secondo le condizioni applicabili. La garanzia commerciale non limita i diritti previsti dalla legge.</p></div></section>
      <ReviewSamples/>
      <section className="wrap faq anchor" id="faq"><div className="faqintro"><span className="eyebrow">HAI DOMANDE?</span><h2>Tutto quello che vuoi sapere.</h2><p>Le informazioni principali prima di acquistare la tua collezione digitale.</p></div><div>{faq.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="closing"><p>LA COLLEZIONE COMPLETA È QUI</p><h2>500+ numeri. Un solo archivio.</h2><span>Un'intera storia editoriale da sfogliare, quando vuoi.</span><div><Buy className="light">Acquista ora a 27 €</Buy></div></section>
    </main>
    <footer className="foot"><div className="wrap"><div className="footgrid"><div><a className="brand" href="/" aria-label="Archivio Shop, pagina iniziale"><img className="brand-image" src="/archivio-shop-logo.svg" alt="Archivio Shop Digitale"/></a><p>Archivio digitale dedicato a cultura, interviste, fotografia e storia editoriale. Contenuti riservati ai maggiorenni.</p></div><div><h3>ESPLORA</h3><a href="/">Pagina iniziale</a><a href="/prodotto">La collezione</a><a href="#anteprime">Le copertine</a><a href="#come-funziona">Come funziona</a></div><div><h3>INFORMAZIONI</h3><a href="#faq">Domande frequenti</a><p>Privacy, termini e assistenza: da configurare prima della pubblicazione.</p></div></div><div className="footbottom"><span>© {new Date().getFullYear()} Archivio Riviste · Prodotto digitale 18+</span><span>Sito indipendente. Nessuna affiliazione ufficiale dichiarata con il marchio Playboy.</span></div></div></footer>
    {cart && <><div className="shade" onClick={() => setCart(false)}></div><aside className="drawer" role="dialog" aria-modal="true" aria-label="Il tuo carrello"><div className="drawhead"><div><small>IL TUO ACQUISTO</small><h2>Il tuo carrello</h2></div><button className="icononly" onClick={() => setCart(false)} aria-label="Chiudi carrello"><X/></button></div>{hasItem?<><div className="cartproduct"><img src={mockup} alt="Collezione digitale"/><div><strong>Collezione digitale Playboy</strong><p>500+ numeri · PDF</p><strong>27 €</strong></div></div><button className="linkbutton" onClick={() => setHasItem(false)}>Rimuovi articolo</button><div className="drawbottom"><div className="carttotal"><span>Totale</span><strong>27 €</strong></div><Buy>Procedi al pagamento</Buy><p>Verrai reindirizzato al checkout del fornitore.</p></div></>:<div style={{textAlign:"center",marginTop:85}}><ShoppingBag size={50}/><h3>Il carrello è vuoto.</h3><p>Scopri la collezione digitale e aggiungila qui.</p><button className="btn red" onClick={() => {setCart(false);goToAnchor("collezione")}}>Esplora la collezione</button></div>}</aside></>}
    <div className="mobcheck"><div><small>COLLEZIONE COMPLETA</small><strong>27 €</strong></div><Buy>Acquista ora</Buy></div>
  </div>;
}
