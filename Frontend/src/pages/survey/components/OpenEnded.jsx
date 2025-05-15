const OpenEnded = ({ externalValue, onExternalChange }) => {
  return (
    <textarea
      placeholder="Your response..."
      value={externalValue || ''}                   // controlled input
      onChange={e => onExternalChange(e.target.value)} 
      rows={5}
      style={{ width: '100%' }}
    />
  );
};

export default OpenEnded;
