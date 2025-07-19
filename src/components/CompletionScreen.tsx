import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export const CompletionScreen: React.FC = () => {
  const [gifUrl, setGifUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomGif = async () => {
      try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${import.meta.env.VITE_GIPHY_API_KEY}&tag=politics+funny&rating=r`);
        const data = await response.json();
        
        if (data.data && data.data.images) {
          setGifUrl(data.data.images.original.url);
        }
      } catch (error) {
        console.error('Error fetching GIF:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomGif();
  }, []);
  return (
    <div className="max-w-sm sm:max-w-lg mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
        <div className="bg-green-500/20 border-2 border-green-400 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Check size={32} className="text-green-400 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Thank You!</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6">
          Your responses have been recorded successfully.
        </p>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
          Thank you for participating in our political survey. Your insights help us better understand if you're a libtard commie or a bigotted fascist. Stay tuned for the results!
        </p>
        
        {/* Random Political Meme */}
        <div className="mt-6 sm:mt-8 rounded-lg overflow-hidden">
          {loading ? (
            <div className="w-full h-48 sm:h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : gifUrl ? (
            <img 
              src={gifUrl}
              alt="Random political meme"
              className="w-full h-48 sm:h-64 object-contain rounded-lg bg-gray-900"
            />
          ) : (
            <div className="w-full h-48 sm:h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm sm:text-base">No meme available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};