// Component for direct selection comparison (choose one from multiple)
export const renderArtifactContent = (artifact) => {
  switch (artifact.type) {
    case 'image':
      return <img src={artifact.url} alt={artifact.label} className="artifact-media" />;
    case 'video':
      return (
        <video controls className="artifact-media">
          <source src={artifact.url} type="video/mp4" />
        </video>
      );
    case 'audio':
      return (
        <audio controls className="artifact-media">
          <source src={artifact.url} type="audio/mpeg" />
        </audio>
      );
    case 'text':
      return <div className="artifact-text">{artifact.content}</div>;
    default:
      return <div className="artifact-placeholder">Unknown content</div>;
  }
};

export const DirectSelectionUI = ({ question, onSelect }) => (
  <div className="artifacts-grid">
    {question.artifacts.map((artifact) => (
      <div key={artifact.id} onClick={() => onSelect(artifact.id)} className="artifact-item">
        {renderArtifactContent(artifact)}
        <p>{artifact.label}</p>
      </div>
    ))}
  </div>
);
  
  // Component for star rating comparison
  export const StarRatingUI = ({ question, onRate }) => (
    <div className="rating-container">
      {question.artifacts.map((artifact) => (
        <div key={artifact.id} className="rating-item">
          {renderArtifactContent(artifact)}
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => onRate({ [artifact.id]: star })}>
              {star}⭐
            </button>
          ))}
        </div>
      ))}
    </div>
  );
  
  // Component for numeric rating (1-10 scale)
  export const NumericRatingUI = ({ question, onRate }) => (
    <div className="rating-container">
      {question.artifacts.map((artifact) => (
        <div key={artifact.id} className="rating-item">
          {renderArtifactContent(artifact)}
          <div className="numeric-rating">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={artifact.rating || 5}
              onChange={(e) => onRate({ [artifact.id]: parseInt(e.target.value) })}
            />
            <div className="numeric-scale">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <span key={num}>{num}</span>
              ))}
            </div>
            <div className="selected-rating">
              Rating: {artifact.rating || '-'} / 10
            </div>
          </div>
        </div>
      ))}
    </div>
  );
/*  const NumericRatingUI = ({ question, ratings, onRate }) => {
    return (
      <div className="rating-container">
        {question.artifacts.map((artifact) => (
          <div key={artifact.id} className="rating-item">
            <div className="artifact-content">
              {renderArtifactContent(artifact)}
            </div>
            <div className="artifact-label">
              {artifact.label || `Option ${question.artifacts.indexOf(artifact) + 1}`}
            </div>
            <div className="numeric-rating">
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={ratings[artifact.id] || 5}
                onChange={(e) => onRate(artifact.id, parseInt(e.target.value))}
              />
              <div className="numeric-scale">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <span key={num}>{num}</span>
                ))}
              </div>
              <div className="selected-rating">
                Rating: {ratings[artifact.id] || '-'}/10
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };*/
  
  // Component for emoji-based rating
  export const EmojiRatingUI = ({ question, onRate }) => {
    const emojis = ['😡', '😕', '😐', '🙂', '😄'];
    return (
      <div className="rating-container">
        {question.artifacts.map((artifact) => (
          <div key={artifact.id} className="rating-item">
            {renderArtifactContent(artifact)}
            {emojis.map((emoji, idx) => (
              <button key={idx} onClick={() => onRate({ [artifact.id]: idx })}>{emoji}</button>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  // Component for ranking items
  export const RankingUI = ({ question, onRank }) => {
    const handleRankChange = (artifactId, rank) => {
      const updated = [...question.artifacts]
        .map((art) => ({
          ...art,
          rank: art.id === artifactId ? rank : art.rank
        }))
        .sort((a, b) => a.rank - b.rank);
  
      onRank(updated.map(a => a.id));
    };
  
    return (
      <div className="ranking-container">
        {question.artifacts.map((artifact) => (
          <div key={artifact.id} className="ranking-item">
            {renderArtifactContent(artifact)}
            <select onChange={(e) => handleRankChange(artifact.id, parseInt(e.target.value))}>
              <option value="">Select rank</option>
              {[...Array(question.artifacts.length)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };
