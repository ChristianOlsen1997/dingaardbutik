"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { isOrganic } from "../../shared/production";
const Context = createContext<{ organic: boolean; setOrganic: (value: boolean) => void } | null>(null);
export function ProductionFilterProvider({ children }: { children: ReactNode }) {
  const [organic, setOrganic] = useState(false);
  return <Context.Provider value={{ organic, setOrganic }}>{children}</Context.Provider>;
}
export function useProductionFilters() {
  const state = useContext(Context);
  if (!state) throw new Error("ProductionFilterProvider is required");
  return { ...state, active: state.organic, accepts: (farm: { id: string }) => (!state.organic || isOrganic(farm)) };
}
export function ProductionFilters({ onChange }: { onChange?: () => void }) {
  const { organic, setOrganic } = useProductionFilters();
  return <fieldset className="production-filters"><legend>Filtre</legend>
    <label><span>Økologisk</span><input role="switch" aria-label="Økologisk" type="checkbox" checked={organic} onChange={event => { setOrganic(event.target.checked); onChange?.(); }} /><span className="filter-switch" aria-hidden="true" /></label>
  </fieldset>;
}
export function ProductionBadges({ farm }: { farm: { id: string } }) {
  return <>{isOrganic(farm) && <span className="production-badge" aria-label="Økologisk">ØKO</span>}</>;
}
