import { useEffect, useState } from 'react';
import RaidScreen from './components/RaidScreen';
import EndScreen from './components/EndScreen';
import LoadingScreen from './components/LoadingScreen';
import CyberFrame from './components/CyberFrame';
import axios from 'axios';
import '../styles/cyberpunk.css';
import { requestStars } from '../stars';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [level, setLevel] = useState(null);
  const [endState, setEndState] = useState(null);
  const [reward, setReward] = useState(0);
  const [username, setUsername] = useState(null);

  const tg = window.Telegram.WebApp;

  useEffect(() => {
    tg.ready();
    const user = tg.initDataUnsafe.user;
    setUsername(user.username);

    requestStars(tg, 1000).then(() => {
      axios.post('http://localhost:8000/start_raid', {
        telegram_id: user.id,
        username: user.username,
      }).then(res => {
        setSessionId(res.data.session_id);
        setLevel(res.data.level);
      });
    }).catch(() => {
      tg.close();
    });
  }, []);

  const handleOptionClick = (optionId) => {
    axios.post('http://localhost:8000/choose_option', {
      session_id: sessionId,
      option_id: optionId
    }).then(res => {
      if (res.data.result === 'fail') {
        setEndState('fail');
      } else {
        setLevel(res.data.next_level);
        setReward(res.data.accumulated_reward);
      }
    });
  };

  const handleEvacuate = () => {
    axios.post('http://localhost:8000/evacuate', {
      session_id: sessionId
    }).then(res => {
      setReward(res.data.reward);
      setEndState('evacuated');
    });
  };

  if (!level && !endState) return <LoadingScreen username={username} />;
  if (endState) return <CyberFrame><EndScreen reward={reward} state={endState} /></CyberFrame>;

  return <CyberFrame><RaidScreen level={level} onSelect={handleOptionClick} onEvacuate={handleEvacuate} /></CyberFrame>;
}

export default App;