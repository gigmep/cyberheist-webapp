function CyberFrame({ children }) {
  return (
    <div className="cyber-border min-h-screen bg-black text-white font-mono p-4">
      <div className="neon-text text-center text-3xl mb-4">⚡ CyberHeist 2099 ⚡</div>
      {children}
    </div>
  );
}

export default CyberFrame;
