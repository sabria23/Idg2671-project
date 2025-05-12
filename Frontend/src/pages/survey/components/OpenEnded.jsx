const OpenEnded = ({ question, onAnswer }) => {
  return (
    <textarea
      placeholder="Your response..."
      onChange={(e) => onAnswer(e.target.value)}
      rows={5}
      style={{ width: '100%' }}
    />
  );
};

export default OpenEnded;