// Component for direct selection comparison (choose one from multiple)
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
  const StarRatingUI = ({ question, ratings, onRate }) => {
    return (
      <div className="rating-container">
        {question.artifacts.map((artifact) => (
          <div key={artifact.id} className="rating-item">
            <div className="artifact-content">
              {renderArtifactContent(artifact)}
            </div>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  className={`star ${ratings[artifact.id] >= star ? 'filled' : ''}`}
                  onClick={() => onRate(artifact.id, star)}
                >
                  {ratings[artifact.id] >= star ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Component for numeric rating (1-10 scale)
  const NumericRatingUI = ({ question, ratings, onRate }) => {
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
  };
  
  // Component for emoji-based rating
  const EmojiRatingUI = ({ question, ratings, onRate }) => {
    const emojis = ['😡', '😕', '😐', '🙂', '😄'];
    const emojiLabels = ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent'];
    
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
            <div className="emoji-rating">
              {emojis.map((emoji, index) => (
                <button 
                  key={index}
                  className={`emoji-button ${ratings[artifact.id] === index ? 'selected' : ''}`}
                  onClick={() => onRate(artifact.id, index)}
                  title={emojiLabels[index]}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {ratings[artifact.id] !== undefined && (
              <div className="emoji-label">
                {emojiLabels[ratings[artifact.id]]}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Component for ranking items
  const RankingUI = ({ question, ranking, onRank }) => {
    // Convert artifacts to a rankable list
    const [rankableItems, setRankableItems] = useState(() => 
      question.artifacts.map(artifact => ({
        ...artifact,
        rank: ranking.indexOf(artifact.id) + 1 || null
      }))
    );
  
    // Update rankings when a rank is selected
    const updateRanking = (artifactId, newRank) => {
      const updatedItems = rankableItems.map(item => {
        if (item.id === artifactId) {
          return { ...item, rank: newRank };
        }
        // If this rank is already taken by another item, reset that item
        if (item.rank === newRank && item.id !== artifactId) {
          return { ...item, rank: null };
        }
        return item;
      });
      
      setRankableItems(updatedItems);
      
      // Extract ordered IDs for the response
      const orderedIds = updatedItems
        .filter(item => item.rank !== null)
        .sort((a, b) => a.rank - b.rank)
        .map(item => item.id);
        
      onRank(orderedIds);
    };
  
    return (
      <div className="ranking-container">
        <p className="ranking-instructions">
          Assign a rank to each item (1 = highest, {question.artifacts.length} = lowest)
        </p>
        {rankableItems.map((item) => (
          <div key={item.id} className="ranking-item">
            <div className="artifact-content">
              {renderArtifactContent(item)}
            </div>
            <div className="artifact-label">
              {item.label || `Option ${question.artifacts.indexOf(item) + 1}`}
            </div>
            <div className="rank-selector">
              <label>Rank:</label>
              <select 
                value={item.rank || ''}
                onChange={(e) => updateRanking(item.id, e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Select rank</option>
                {Array.from({ length: question.artifacts.length }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {item.rank && (
                <div className="rank-badge">
                  #{item.rank}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };


  
// Helper function to render artifact content based on type
const renderArtifactContent = (artifact) => {
    switch (artifact.type) {
      case 'image':
        return <img src={artifact.url} alt={artifact.label} className="artifact-media" />;
      case 'video':
        return (
          <video controls className="artifact-media">
            <source src={artifact.url} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        );
      case 'audio':
        return (
          <audio controls className="artifact-media">
            <source src={artifact.url} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
        );
      case 'text':
        return <div className="artifact-text">{artifact.content || 'Text content'}</div>;
      default:
        return <div className="artifact-placeholder">Content unavailable</div>;
    }
  };