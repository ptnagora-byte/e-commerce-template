import { Star } from "lucide-react";

const reviewSamples = [
  { title: "La raccolta in un solo posto", quote: "Un archivio di riviste da esplorare con calma, organizzato per essere consultato anche da computer e tablet." },
  { title: "Acquisto semplice", quote: "Mi piace l’idea di pagare una sola volta e poter tornare a leggere quando voglio." },
  { title: "Un formato comodo", quote: "Il PDF è pratico da consultare, soprattutto per chi vuole conservare una collezione digitale." },
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
  return (
    <section className="shop-reviews wrap" id="opinioni" aria-labelledby="review-demo-heading">
      <div className="shop-reviews-heading">
        <div>
          <span className="eyebrow">ISPIRAZIONI PER LA TUA VETRINA</span>
          <h2 id="review-demo-heading">Come appariranno le recensioni.</h2>
          <p className="review-notice"><strong>Esempi dimostrativi.</strong> Questi testi sono inventati per mostrare il layout e non provengono da clienti reali. Le stelle non rappresentano un voto effettivo.</p>
        </div>
      </div>
      <div className="review-demo-grid">
        {reviewSamples.map((review, index) => (
          <article className="review-demo-card" key={review.title}>
            <div className="review-demo-top"><RatingStars/><span>ESEMPIO {String(index + 1).padStart(2, "0")}</span></div>
            <h3>{review.title}</h3>
            <p>“{review.quote}”</p>
            <small>Testo illustrativo · non è la testimonianza di un acquirente</small>
          </article>
        ))}
      </div>
    </section>
  );
}
