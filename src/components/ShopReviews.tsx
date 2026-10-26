import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Mail, MapPin, Send, Star } from "lucide-react";
import {
  trackReviewSectionView,
  trackReviewFormStart,
  trackReviewEmailIntent,
  trackReviewCopyIntent
} from "../lib/tracking";

const REVIEW_INBOX = "ptnagora@gmail.com";

type VerifiedReview = {
  name: string;
  region: string;
  title: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  orderVerified: true;
};

// Only publish reviews after verifying a real order, customer permission,
// and the customer's actual words. Currently no verified submissions exist.
const verifiedReviews: VerifiedReview[] = [];

const italianRegions = [
  "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
  "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche",
  "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana",
  "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto",
];

export function RatingStars() {
  return (
    <span className="shop-stars" role="img" aria-label="Cinque stelle decorative, non basate su recensioni verificate">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={18} fill="currentColor" strokeWidth={1.6} />
      ))}
    </span>
  );
}

export function ReviewSamples() {
  const sectionRef = useRef<HTMLElement>(null);
  const formStarted = useRef(false);
  const sectionTracked = useRef(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [prepared, setPrepared] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    const reportIfVisible = () => {
      if (!visible || sectionTracked.current) return;
      if (trackReviewSectionView()) sectionTracked.current = true;
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some(entry => entry.isIntersecting);
      reportIfVisible();
    }, { threshold: 0.35 });
    observer.observe(section);
    window.addEventListener("archivio:marketing-tracking-ready", reportIfVisible);
    return () => {
      observer.disconnect();
      window.removeEventListener("archivio:marketing-tracking-ready", reportIfVisible);
    };
  }, []);

  const trackFormFirstInteraction = () => {
    if (!formStarted.current && trackReviewFormStart()) formStarted.current = true;
  };

  const reviewBody = [
    "Nuova recensione per Archivio Shop Digitale",
    "",
    "Nome: " + name.trim(),
    "Regione: " + region,
    "Riferimento ordine privato (solo per verifica): " + orderReference.trim(),
    ...(city.trim() ? ["Città: " + city.trim()] : []),
    "Valutazione dichiarata: " + rating + "/5",
    "Acquisto dichiarato: " + (confirmed ? "Sì" : "No"),
    "",
    "Testo:",
    message.trim(),
    "",
    "Il cliente autorizza il contatto per la verifica e la pubblicazione di nome abbreviato, regione e commento: " + (consent ? "Sì" : "No"),
    "",
    "Questa recensione non è verificata automaticamente. Il gestore deve controllarla prima della pubblicazione.",
  ].join("\n");

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !region || message.trim().length < 20 || !orderReference.trim() || rating < 1 || !confirmed || !consent) return;
    const subject = "Recensione cliente Archivio Shop - " + name.trim();
    trackReviewEmailIntent();
    setPrepared(true);
    window.location.href = "mailto:" + REVIEW_INBOX + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(reviewBody);
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(reviewBody);
      trackReviewCopyIntent();
      setPrepared(true);
    } catch {
      setPrepared(false);
    }
  }

  return (
    <section ref={sectionRef} className="shop-reviews wrap" id="opinioni" aria-labelledby="review-demo-heading">
      <div className="shop-reviews-heading">
        <span className="eyebrow">LE OPINIONI DEI CLIENTI</span>
        <h2 id="review-demo-heading">Esperienze di acquisto verificate.</h2>
        <p className="review-notice">Pubblichiamo solo recensioni di clienti il cui ordine è stato confermato, con il loro consenso. Accesso ricevuto, consegna digitale e consigli ad altri acquirenti sono aspetti che ogni cliente può raccontare con parole proprie.</p>
      </div>
      {verifiedReviews.length > 0 ? (
        <div className="review-demo-grid">
          {verifiedReviews.filter(review => review.orderVerified === true).map((review) => (
            <article className="review-demo-card" key={review.name + review.region + review.title}>
              <div className="review-demo-top">
                <span className="shop-stars" role="img" aria-label={review.rating + " stelle su 5"}>
                  {Array.from({length:5},(_,i)=><Star key={i} size={18} fill={i < review.rating ? "currentColor" : "none"}/>)}
                </span>
                <span className="verified-review-label"><CheckCircle2 size={15}/> ACQUISTO VERIFICATO</span>
              </div>
              <h3>{review.title}</h3>
              <p className="review-demo-quote">“{review.quote}”</p>
              <div className="review-author"><span className="review-avatar" aria-hidden="true">{review.name.charAt(0)}</span><div><strong>{review.name}</strong><span><MapPin size={13}/>{review.region}</span></div></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="review-empty">
          <CheckCircle2 size={27}/>
          <div><strong>Le prime recensioni verificate arriveranno qui.</strong><p>Hai già acquistato e ricevuto l'accesso? Lascia il tuo commento qui sotto e racconta se è andato tutto bene e se consiglieresti la collezione.</p></div>
          <a className="btn review-empty-action" href="#lascia-recensione">Lascia una recensione</a>
        </div>
      )}

      <div className="review-submit-area" id="lascia-recensione">
        <div className="review-submit-intro">
          <span className="eyebrow">HAI GIÀ ACQUISTATO?</span>
          <h2>Hai ricevuto tutto correttamente?</h2>
          <p>Hai già acquistato? Racconta se hai ricevuto l’accesso senza problemi, com’è stata la tua esperienza e se consiglieresti la collezione ad altre persone. Scrivi solo ciò che è successo davvero.</p>
          <div className="review-submit-promise"><Mail size={21}/><span>Il tuo commento viene inviato via email per essere letto e verificato prima di un'eventuale pubblicazione.</span></div>
          <p className="review-submit-disclosure">Il sito non memorizza automaticamente le recensioni. Dopo aver compilato il modulo, si aprirà il tuo programma di posta: conferma l'invio del messaggio. Non pubblichiamo recensioni senza verifica.</p>
        </div>
        <form className="shop-review-form" onSubmit={submitReview} onFocusCapture={trackFormFirstInteraction}>
          <h3>Lascia la tua recensione</h3>
          <p>Solo per chi ha realmente acquistato la collezione.</p>
          <div className="review-form-grid">
            <label>Il tuo nome <input required autoComplete="name" maxLength={60} value={name} onChange={event=>setName(event.target.value)} placeholder="Es. Marco Rossi" /></label>
            <label>La tua regione
              <select required value={region} onChange={event=>setRegion(event.target.value)}>
                <option value="">Seleziona la regione</option>
                {italianRegions.map(item=><option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <label>La tua città (facoltativa)<input maxLength={60} value={city} onChange={event=>setCity(event.target.value)} placeholder="Es. Milano" /></label>
          <label>Numero o riferimento ordine (per la verifica, non verrà pubblicato)
            <input required maxLength={100} value={orderReference} onChange={event=>setOrderReference(event.target.value)} placeholder="Es. riferimento del pagamento Cakto"/>
          </label>
          <fieldset className="review-rating-field">
            <legend>La tua valutazione</legend>
            <div className="review-rating-select" aria-label="Seleziona da una a cinque stelle">
              {[1,2,3,4,5].map(value=><button key={value} type="button" onClick={()=>setRating(value)} aria-label={value + (value===1?" stella":" stelle")} aria-pressed={rating===value} className={value<=rating?"active":""}><Star size={28} fill={value<=rating?"currentColor":"none"} strokeWidth={1.8}/></button>)}
              <span>{rating ? rating + " / 5" : "Scegli le stelle"}</span>
            </div>
          </fieldset>
          <label>Il tuo commento
            <textarea required minLength={20} maxLength={900} rows={5} value={message} onChange={event=>setMessage(event.target.value)} placeholder="Hai ricevuto l’accesso correttamente? Cosa ti è piaciuto? Consiglieresti la collezione? Racconta solo la tua esperienza reale." />
          </label>
          <label className="review-check"><input required type="checkbox" checked={confirmed} onChange={event=>setConfirmed(event.target.checked)}/><span>Confermo di aver acquistato questo prodotto e che la recensione descrive la mia esperienza reale.</span></label>
          <label className="review-check"><input required type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)}/><span>Autorizzo a essere contattato per verificare la recensione e, se approvata, a pubblicare il nome abbreviato, la regione e il commento.</span></label>
          <div className="review-form-buttons">
            <button className="btn red" type="submit"><Send size={17}/> Prepara email con la recensione</button>
            <button className="btn" type="button" onClick={copyReview} disabled={!name.trim()||!region||!orderReference.trim()||rating<1||message.trim().length<20||!confirmed||!consent}>Copia la recensione</button>
          </div>
          {prepared&&<p className="review-form-feedback" role="status">Testo pronto. Controlla il tuo programma di posta e premi “Invia”: il commento non è stato trasmesso automaticamente.</p>}
          <small>Le valutazioni inviate non vengono pubblicate in automatico. Nessun dato viene salvato su questo sito con questo modulo.</small>
        </form>
      </div>
    </section>
  );
}
