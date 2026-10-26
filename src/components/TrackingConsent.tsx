import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  attachCheckoutTracking,
  initializeMarketingTracking,
  readMarketingConsent,
  saveMarketingConsent,
  trackCurrentPage
} from "../lib/tracking";

type Consent = "accepted" | "rejected" | null;

export function TrackingConsent() {
  const location = useLocation();
  const [choice, setChoice] = useState<Consent>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setChoice(readMarketingConsent());
    setLoaded(true);
    attachCheckoutTracking();
  }, []);

  useEffect(() => {
    if (choice !== "accepted") return;
    initializeMarketingTracking();
    trackCurrentPage(location.pathname);
  }, [choice,location.pathname]);

  const choose=(allow:boolean)=>{
    saveMarketingConsent(allow);
    setChoice(allow ? "accepted" : "rejected");
  };
  const changePreferences=()=>{
    // Reload removes previously loaded trackers from the page.
    try { window.localStorage.removeItem("archivio-marketing-consent-v1"); } catch {}
    window.location.reload();
  };

  return <>
    {loaded && choice === null && (
      <section className="tracking-consent-banner" role="region" aria-label="Preferenze cookie">
        <div>
          <strong>Preferenze cookie e tracciamento</strong>
          <p>Con il tuo consenso, Archivio Shop utilizza il Pixel Meta e Utmify per misurare visite, interazioni e campagne pubblicitarie. Puoi rifiutare senza impedire la navigazione o l'acquisto.</p>
        </div>
        <div className="tracking-consent-actions">
          <button type="button" className="tracking-refuse" onClick={()=>choose(false)}>Rifiuta</button>
          <button type="button" className="tracking-accept" onClick={()=>choose(true)}>Accetta</button>
        </div>
      </section>
    )}
    {loaded && choice !== null && (
      <button className="tracking-settings-button" type="button" onClick={changePreferences} aria-label="Modifica preferenze cookie">Preferenze cookie</button>
    )}
  </>;
}
