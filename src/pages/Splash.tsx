import { useNavigate } from "react-router-dom";
import Screen from "../components/Screen";
import Button from "../components/Button";

function Splash() {
  const navigate = useNavigate();

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <p className="text-cyan-400 text-sm tracking-[0.3em] mb-4">
          DIGITAL TRUST RESPONSE CENTER
        </p>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">디지털 신뢰 대응 센터</h1>
        <p className="text-slate-400 mb-10">Interactive Cybercrime Response Simulation</p>
        <Button onClick={() => navigate("/dashboard")} className="px-8">
          시작하기
        </Button>
      </div>
    </Screen>
  );
}

export default Splash;