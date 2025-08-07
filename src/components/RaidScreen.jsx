import OptionCard from './OptionCard';

function RaidScreen({ level, onSelect, onEvacuate }) {
  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl mb-4">🛡️ Уровень {level.stage}</h1>
      <div className="grid grid-cols-1 gap-4">
        {level.options.map((opt) => (
          <OptionCard key={opt.id} option={opt} onClick={() => onSelect(opt.id)} />
        ))}
      </div>
      <button onClick={onEvacuate} className="mt-6 bg-red-600 text-white px-4 py-2 rounded-xl">
        🚪 Эвакуироваться
      </button>
    </div>
  );
}

export default RaidScreen;
