// src/components/App.jsx
import { useEffect, useState } from 'react';
import RaidScreen from './RaidScreen';
import EndScreen from './EndScreen';
import LoadingScreen from './LoadingScreen';
import CyberFrame from './CyberFrame';
import axios from 'axios';

// стили и утилиты идут на уровень выше, т.к. мы находимся в src/components/
import '../styles/cyberpunk.css';
import { requestStars } from '../stars';

// Базовый адрес API: подхватываем с Vercel (Settings → Environment Variables)
// Если переменная не задана, можно временно указать локальный адрес или оставить пустым
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [level, setLevel] = useState(null);
  const [endState, setEndState] = useState(null); // 'fail' | 'evacuated' | null
  const [reward, setReward] = useState(0);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Telegram WebApp может быть недоступен при открытии в обычном браузере
    const tg = window.Telegram?.WebApp;

    const bootstrap = async () => {
      try {
        if (tg?.ready) tg.ready();
        const user = tg?.initDataUnsafe?.user;

        if (user?.username) setUsername(user.username);

        // Если есть Telegram Stars — запросим оплату перед стартом
        // Если tg отсутствует (открыто в браузере) — пропускаем оплату.
        if (tg?.openInvoice) {
          await requestStars(tg, 1000); // 1000 копеек = 10 ₽ (пример)
        }

        // Стартуем рейд
        const startRes = await axios.post(`${API_BASE}/start_raid`, {
          telegram_id: user?.id || Math.floor(Math.random() * 10_000_000), // фолбэк для браузера
          username: user?.username || 'guest',
        });

        setSessionId(startRes.data.session_id);
        setLevel(startRes.data.level);
      } catch (err) {
        // Пользователь отменил платёж или API недоступен
        console.error('Bootstrap error:', err);
        // Если открыто в Telegram — закрываем WebApp при отмене
        try {
          window.Telegram?.WebApp?.close();
        } catch (_) {}
      }
    };

    bootstrap();
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

      // успех — следующий уровень + накопленная награда
      setLevel(res.data.next_level);
      setReward(res.data.accumulated_reward ?? 0);
    } catch (err) {
      console.error('choose_option error:', err);
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
    } catch (err) {
      console.error('evacuate error:', err);
    }
  };

  // Экраны
  if (!level && !endState) return <LoadingScreen username={username} />;
  if (endState) {
    return (
      <CyberFrame>
        <EndScreen reward={reward} state={endState} />
      </CyberFrame>
    );
  }

  return (
    <CyberFrame>
      <RaidScreen
        level={level}
        onSelect={handleOptionClick}
        onEvacuate={handleEvacuate}
      />
    </CyberFrame>
  );
}

export default App;
