import { useState, type FormEvent } from "react";
import { Mail, MapPin, Send, Star } from "lucide-react";

const REVIEW_INBOX = "ptnagora@gmail.com";

// Esempi di impaginazione: nomi, località, valutazioni e testi sono fittizi.
// Non pubblicare mai gli esempi come testimonianze di acquirenti verificati.
const reviewSamples = [
  {
    name: "Marco R.",
    region: "Lombardia",
    title: "Finalmente tutto in un posto",
    quote: "Cercavo da tempo un modo pratico per sfogliare queste riviste senza occupare spazio in casa. La cosa che apprezzo di più è poter leggere con calma dal tablet.",
  },
  {
    name: "Giulia M.",
    region: "Toscana",
    title: "Bella idea per chi ama le riviste",
    quote: "Sono appassionata di riviste d’epoca e mi piace ritrovare le vecchie copertine. Sul telefono è comodo fermarmi su una pagina e tornarci più tardi.",
  },
  {
    name: "Lorenzo F.",
    region: "Lazio",
    title: "Comodo da consultare",
    quote: "Mi ha convinto soprattutto il formato digitale. Preferisco avere i numeri sul computer e poter passare da una rivista all’altra senza cercarle in giro.",
  },
];

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
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const reviewBody = [
    "Nuova recensione per Archivio Shop Digitale",
    "",
    "Nome: " + name.trim(),
    "Regione: " + region,
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
    if (!name.trim() || !region || !message.trim() || !confirmed || !consent) return;
    const subject = "Recensione cliente Archivio Shop - " + name.trim();
    setPrepared(true);
    window.location.href = "mailto:" + REVIEW_INBOX + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(reviewBody);
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(reviewBody);
      setPrepared(true);
    } catch {
      setPrepared(false);
    }
  }

  return (
    <section className="shop-reviews wrap" id="opinioni" aria-labelledby="review-demo-heading">
      <div className="shop-reviews-heading">
        <span className="eyebrow">OPINIONI SULLA COLLEZIONE</span>
        <h2 id="review-demo-heading">Le recensioni hanno la loro voce.</h2>
        <p className="review-notice"><strong>Anteprima dimostrativa:</strong> i tre commenti qui sotto sono esempi di stile con nomi e regioni inventati. Non sono testimonianze di acquisti reali e le cinque stelle sono illustrative.</p>
      </div>
      <div className="review-demo-grid">
        {reviewSamples.map((review, index) => (
          <article className="review-demo-card" key={review.name}>
            <div className="review-demo-top">
              <RatingStars />
              <span className="review-demo-label">ESEMPIO · NON VERIFICATO</span>
            </div>
            <h3>{review.title}</h3>
            <p className="review-demo-quote">“{review.quote}”</p>
            <div className="review-author">
              <span className="review-avatar" aria-hidden="true">{review.name.charAt(0)}</span>
              <div>
                <strong>{review.name}</strong>
                <span><MapPin size={13}/>{review.region}</span>
              </div>
            </div>
            <small className="review-demo-foot">Esempio fittizio {index + 1} · Non è una recensione di un acquirente.</small>
          </article>
        ))}
      </div>

      <div className="review-submit-area" id="lascia-recensione">
        <div className="review-submit-intro">
          <span className="eyebrow">HAI GIÀ ACQUISTATO?</span>
          <h2>Raccontaci la tua esperienza.</h2>
          <p>Hai acquistato la collezione? Lascia una recensione autentica: raccontaci come ti sei trovato e cosa ti è piaciuto, oppure cosa possiamo migliorare.</p>
          <div className="review-submit-promise"><Mail size={21}/><span>Il tuo commento viene inviato via email per essere letto e verificato prima di un'eventuale pubblicazione.</span></div>
          <p className="review-submit-disclosure">Il sito non memorizza automaticamente le recensioni. Dopo aver compilato il modulo, si aprirà il tuo programma di posta: conferma l'invio del messaggio. Non pubblichiamo recensioni senza verifica.</p>
        </div>
        <form className="shop-review-form" onSubmit={submitReview}>
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
          <fieldset className="review-rating-field">
            <legend>La tua valutazione</legend>
            <div className="review-rating-select" aria-label="Seleziona da una a cinque stelle">
              {[1,2,3,4,5].map(value=><button key={value} type="button" onClick={()=>setRating(value)} aria-label={value + (value===1?" stella":" stelle")} aria-pressed={rating===value} className={value<=rating?"active":""}><Star size={28} fill={value<=rating?"currentColor":"none"} strokeWidth={1.8}/></button>)}
              <span>{rating} / 5</span>
            </div>
          </fieldset>
          <label>Il tuo commento
            <textarea required minLength={20} maxLength={900} rows={5} value={message} onChange={event=>setMessage(event.target.value)} placeholder="Racconta la tua esperienza reale con la collezione..." />
          </label>
          <label className="review-check"><input required type="checkbox" checked={confirmed} onChange={event=>setConfirmed(event.target.checked)}/><span>Confermo di aver acquistato questo prodotto e che la recensione descrive la mia esperienza reale.</span></label>
          <label className="review-check"><input required type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)}/><span>Autorizzo a essere contattato per verificare la recensione e, se approvata, a pubblicare il nome abbreviato, la regione e il commento.</span></label>
          <div className="review-form-buttons">
            <button className="btn red" type="submit"><Send size={17}/> Prepara email con la recensione</button>
            <button className="btn" type="button" onClick={copyReview} disabled={!name.trim()||!region||message.trim().length<20||!confirmed||!consent}>Copia la recensione</button>
          </div>
          {prepared&&<p className="review-form-feedback" role="status">Testo pronto. Controlla il tuo programma di posta e premi “Invia”: il commento non è stato trasmesso automaticamente.</p>}
          <small>Le valutazioni inviate non vengono pubblicate in automatico. Nessun dato viene salvato su questo sito con questo modulo.</small>
        </form>
      </div>
    </section>
  );
}
