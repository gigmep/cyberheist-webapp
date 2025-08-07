import { useEffect, useState } from 'react';
import RaidScreen from './RaidScreen';
import EndScreen from './EndScreen';
import LoadingScreen from './LoadingScreen';
import CyberFrame from './CyberFrame';
import axios from 'axios';
import '../styles/cyberpunk.css';
import { requestStars } from '../stars';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [level, setLevel] = useState(null);
  const [endState, setEndState] = useState(null); // 'fail' | 'evacuated' | null
  const [reward, setReward] = useState(0);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    const start = async () => {
      try {
        if (tg?.ready) tg.ready();
        const user = tg?.initDataUnsafe?.user;
        if (user?.username) setUsername(user.username);

        if (tg?.openInvoice) await requestStars(tg, 1000); // 10 ₽ пример

        const res = await axios.post(`${API_BASE}/start_raid`, {
          telegram_id: user?.id || Math.floor(Math.random() * 10_000_000),
          username: user?.username || 'guest',
        });

        setSessionId(res.data.session_id);
        setLevel(res.data.level);
      } catch (e) {
        console.error('bootstrap', e);
        try { window.Telegram?.WebApp?.close(); } catch (_) {}
      }
    };

    start();
  }, []);

  const handleOptionClick = async (optionId) => {
    if (!sessionId) return;
    try {
      const res = await axios.post(`${API_BASE}/choose_option`, {
        session_id: sessionId,
        option_id: optionId,
      });

      if (res.data.result === 'fail') {
        setEndState('fail');
        return;
      }
      setLevel(res.data.next_level);
      setReward(res.data.accumulated_reward ?? 0);
    } catch (e) {
      console.error('choose_option', e);
    }
  };

  const handleEvacuate = async () => {
    if (!sessionId) return;
    try {
      const res = await axios.post(`${API_BASE}/evacuate`, {
        session_id: sessionId,
      });
      setReward(res.data.reward ?? 0);
      setEndState('evacuated');
    } catch (e) {
      console.error('evacuate', e);
    }
  };

  if (!level && !endState) return <LoadingScreen username={username} />;

  return (
    <CyberFrame>
      {endState ? (
        <EndScreen reward={reward} state={endState} />
      ) : (
        <RaidScreen level={level} onSelect={handleOptionClick} onEvacuate={handleEvacuate} />
      )}
    </CyberFrame>
  );
}

export default App;
