interface TagAnalysis {
  tag_id: number;
  tag_name: string;
  question_count: number;
  question_ids: number[];
  weighted_average: number;
}

interface TagAnalysisProps {
  tagAnalysis: TagAnalysis[];
}

export const TagAnalysis: React.FC<TagAnalysisProps> = ({ tagAnalysis }) => {
  if (tagAnalysis.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-white font-semibold text-2xl mb-4 text-center">
        Analysis by Topic
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tagAnalysis.map((tag) => (
          <div key={tag.tag_id} className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            <h3 className="text-white font-semibold text-lg mb-3 text-center">
              {tag.tag_name}
            </h3>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white mb-2">
                {tag.weighted_average.toFixed(1)}/9
              </div>
              <div className="bg-white/20 rounded-full h-3 mb-3 mx-auto">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${(tag.weighted_average / 9) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-white/80 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Questions:</span>
                <span className="font-medium">{tag.question_count}</span>
              </div>
              <div className="text-white/60 text-xs">
                <span>Question IDs: {tag.question_ids.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};