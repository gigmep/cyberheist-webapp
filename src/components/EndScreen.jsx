function EndScreen({ reward, state }) {
  const msg = state === 'evacuated' ? '✅ Ты эвакуировался с наградой!' : '❌ Тебя поймали!';
  return (
    <div className="text-white p-4 text-center">
      <h1 className="text-2xl mb-4">{msg}</h1>
      <p className="text-xl">💰 Получено: {reward} Stars</p>
    </div>
  );
}

export default EndScreen;
