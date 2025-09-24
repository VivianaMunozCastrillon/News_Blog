import CtaBanner from "../components/CtaBanner";
import FactCard from "../components/FactCard";

export default function NewsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Banner de llamada a la acción */}
      <CtaBanner />

      {/* Dato curioso */}
      <FactCard />

      {/* Aquí irían otros componentes de noticias, cards, etc. */}
    </div>
  );
}
