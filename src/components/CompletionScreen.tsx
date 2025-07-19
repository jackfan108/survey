import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export const CompletionScreen: React.FC = () => {
  const [gifUrl, setGifUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomGif = async () => {
      try {
        const response = await fetch('https://api.giphy.com/v1/gifs/random?api_key=lxGVMqO5EnOA35hVswGDWSb1Nq78hZdo&tag=politics+funny&rating=r');
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
    <div className="max-w-lg mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <div className="bg-green-500/20 border-2 border-green-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Check size={48} className="text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
        <p className="text-xl text-gray-300 mb-6">
          Your responses have been recorded successfully.
        </p>
        <p className="text-gray-200">
          Thank you for participating in our political survey. Your insights help us better understand if you're a libtard commie or a bigotted fascist. Stay tuned for the results!
        </p>
        
        {/* Random Political Meme */}
        <div className="mt-8 rounded-lg overflow-hidden">
          {loading ? (
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : gifUrl ? (
            <img 
              src={gifUrl}
              alt="Random political meme"
              className="w-full h-64 object-contain rounded-lg bg-gray-900"
            />
          ) : (
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">No meme available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};