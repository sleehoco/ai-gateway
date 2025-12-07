import React, { useState, useEffect } from 'react';
import { MessageSquare, Settings, Activity } from 'lucide-react';

function App() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch models from our backend
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load models", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <h1 className="text-xl font-bold text-cyan-400 mb-8">AI Gateway</h1>
        <nav className="space-y-2">
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-700 bg-gray-700 text-white">
            <MessageSquare size={20} />
            <span>Chat</span>
          </button>
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-700 text-gray-400">
            <Activity size={20} />
            <span>Analytics</span>
          </button>
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-700 text-gray-400">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6">
          <span className="text-gray-400">Status: </span>
          <span className="ml-2 text-green-400">● Online</span>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-6">Available Models</h2>
            
            {loading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 bg-gray-700 rounded w-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models.map((model: any) => (
                  <div key={model.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors cursor-pointer">
                    <div className="font-mono text-cyan-400">{model.id}</div>
                    <div className="text-sm text-gray-500 mt-1">Ready for inference</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
