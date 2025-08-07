import { Player } from '@lottiefiles/react-lottie-player';
import hackingAnim from '../animations/hacking.json';

function LottieHack() {
  return (
    <div className="flex justify-center">
      <Player
        autoplay
        loop
        src={hackingAnim}
        style={{ height: '200px', width: '200px' }}
      />
    </div>
  );
}

export default LottieHack;