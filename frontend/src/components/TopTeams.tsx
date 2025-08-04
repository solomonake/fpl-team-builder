import React, { useEffect, useState } from 'react';

interface TopTeamPlayer {
  name: string;
  position: string;
  club: string;
  cost: number;
}

interface TopTeam {
  name: string;
  description: string;
  players: TopTeamPlayer[];
}

interface TopTeamsProps {
  onTeamSelect: (team: TopTeam) => void;
}

const TopTeams: React.FC<TopTeamsProps> = ({ onTeamSelect }) => {
  const [topTeams, setTopTeams] = useState<TopTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5001/api/top-teams')
      .then(response => response.json())
      .then(data => {
        setTopTeams(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching top teams:', error);
        setLoading(false);
      });
  }, []);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GKP': return 'bg-yellow-100 text-yellow-800';
      case 'DEF': return 'bg-blue-100 text-blue-800';
      case 'MID': return 'bg-green-100 text-green-800';
      case 'FWD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading top teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🏆 Top Ranking Teams</h3>
      <p className="text-sm text-gray-600 mb-6">Popular FPL strategies from the community</p>
      
      <div className="space-y-6">
        {topTeams.map((team, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onTeamSelect(team)}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{team.name}</h4>
                <p className="text-sm text-gray-600">{team.description}</p>
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Use Team
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {team.players.map((player, playerIndex) => (
                <div key={playerIndex} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">{player.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPositionColor(player.position)}`}>
                      {player.position}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{player.club}</span>
                    <span className="font-medium">£{player.cost}M</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Cost: £{team.players.reduce((sum, p) => sum + p.cost, 0).toFixed(1)}M</span>
                <span>{team.players.length} players</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTeams; 