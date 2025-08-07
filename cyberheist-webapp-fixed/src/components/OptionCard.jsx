function OptionCard({ option, onClick }) {
  return (
    <div onClick={onClick} className="border border-gray-500 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer">
      <h2 className="text-xl">🔍 {option.label}</h2>
      <p>💥 Риск: {Math.round(option.risk * 100)}%</p>
      <p>💰 Награда: {option.reward} Stars</p>
    </div>
  );
}

export default OptionCard;