import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Screen from "../components/Screen";
import Button from "../components/Button";
import { startNewGame, loadProgress } from "../storage/storage";

function Login() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  function handleEnter() {
    const name = nickname.trim() || "게스트";
    // 기존 기록 없을 때만 새로 시작 (있으면 이어하기)
    if (!loadProgress()) {
      startNewGame(name);
    }
    navigate("/dashboard");
  }

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-slate-100 mb-8">분석관 등록</h1>

        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
          className="w-full px-4 py-3 mb-4 rounded-lg bg-slate-800 border border-slate-700
                     text-slate-100 placeholder-slate-500
                     focus:outline-none focus:border-cyan-500 transition"
        />

        <Button onClick={handleEnter} className="w-full">
          입장
        </Button>

        <p className="text-slate-500 text-sm mt-4">
          닉네임 없이 입장하면 '게스트'로 시작합니다.
        </p>
      </div>
    </Screen>
  );
}

export default Login;