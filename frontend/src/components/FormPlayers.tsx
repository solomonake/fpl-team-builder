import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';

interface Player {
  firstName: string;
  secondName: string;
  position: string;
  club: string;
  cost: number;
  points: number;
  ownership?: number;
  form?: number;
  playerId?: number;
  photo?: string;
  teamBadge?: string;
}

interface FormPlayersProps {
  onPlayerSelect: (player: Player) => void;
}

const FormPlayers: React.FC<FormPlayersProps> = ({ onPlayerSelect }) => {
  const [formPlayers, setFormPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://fpl-team-builder-api-ot1p.onrender.com/api/form-players')
      .then(response => response.json())
      .then(data => {
        setFormPlayers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching form players:', error);
        setLoading(false);
      });
  }, []);

  const getPositionPlayers = (position: string) => {
    return formPlayers.filter(player => player.position === position);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🔥 Players in Form</h3>
      <p className="text-sm text-gray-600 mb-6">Top performing players this week</p>
      
      <div className="space-y-6">
        {/* Goalkeepers */}
        <div>
          <h4 className="text-lg font-semibold text-yellow-700 mb-3">Goalkeepers</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {getPositionPlayers('GKP').slice(0, 4).map((player, index) => (
              <div key={index} onClick={() => onPlayerSelect(player)}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </div>

        {/* Defenders */}
        <div>
          <h4 className="text-lg font-semibold text-blue-700 mb-3">Defenders</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {getPositionPlayers('DEF').slice(0, 8).map((player, index) => (
              <div key={index} onClick={() => onPlayerSelect(player)}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </div>

        {/* Midfielders */}
        <div>
          <h4 className="text-lg font-semibold text-green-700 mb-3">Midfielders</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {getPositionPlayers('MID').slice(0, 8).map((player, index) => (
              <div key={index} onClick={() => onPlayerSelect(player)}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </div>

        {/* Forwards */}
        <div>
          <h4 className="text-lg font-semibold text-red-700 mb-3">Forwards</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {getPositionPlayers('FWD').slice(0, 4).map((player, index) => (
              <div key={index} onClick={() => onPlayerSelect(player)}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPlayers; 