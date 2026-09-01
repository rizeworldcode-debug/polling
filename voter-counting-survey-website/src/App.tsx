import { LockKeyhole, ShieldCheck } from "lucide-react";
import { SurveyFlow } from "@/components/survey-flow";

export default function App() {
  return (
    <main className="site-shell">
      <div className="background-scene" aria-hidden="true" />
      <div className="background-overlay" aria-hidden="true" />
      <div className="background-pattern" aria-hidden="true" />

      <div className="survey-area" id="survey">
        <SurveyFlow />
      </div>

    </main>
  );
}
