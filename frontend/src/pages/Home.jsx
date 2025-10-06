import CardDeck from "../components/CardDeck";
import HeatmapCard from "../components/cards/HeatmapCard";
import RouteCard from "../components/cards/RouteCard";
import SummaryCard from "../components/cards/SummaryCard";

export default function Home() {
  return (
    <div className="space-y-6">
      <CardDeck>
        <HeatmapCard />
        <RouteCard />
        <SummaryCard />
      </CardDeck>

      <p className="text-app-muted text-sm">
        左右にスワイプしてカードを切り替えられます。
      </p>
    </div>
  );
}
