import LottieHack from './LottieHack';

function LoadingScreen({ username }) {
  return (
    <div className="loader text-center text-green-400 p-8">
      <LottieHack />
      <h1 className="text-2xl mt-4">🔍 Подключение к серверам...</h1>
      {username && <p className="text-lg mt-2">Привет, {username}</p>}
    </div>
  );
}

export default LoadingScreen;