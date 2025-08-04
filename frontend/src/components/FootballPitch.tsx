import React from 'react';
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
  fixtures?: any[];
  selected_by_percent?: number;
  transfers_in_event?: number;
  transfers_out_event?: number;
  goals_scored?: number;
  assists?: number;
  clean_sheets?: number;
  goals_conceded?: number;
  own_goals?: number;
  penalties_saved?: number;
  penalties_missed?: number;
  yellow_cards?: number;
  red_cards?: number;
  saves?: number;
  bonus?: number;
  bps?: number;
  influence?: number;
  creativity?: number;
  threat?: number;
  ict_index?: number;
}

interface FootballPitchProps {
  team: Player[];
  formation: string;
  onPlayerClick?: (player: Player) => void;
  onPlayerRemove?: (player: Player) => void;
}

const FootballPitch: React.FC<FootballPitchProps> = ({ 
  team, 
  formation, 
  onPlayerClick,
  onPlayerRemove 
}) => {
  // Parse formation (e.g., "4-4-2" -> [4, 4, 2])
  const formationArray = formation.split('-').map(Number);
  
  // Group players by position
  const goalkeepers = team.filter(p => p.position === 'GKP');
  const defenders = team.filter(p => p.position === 'DEF');
  const midfielders = team.filter(p => p.position === 'MID');
  const forwards = team.filter(p => p.position === 'FWD');

  // Get players for each row based on formation
  const getPlayersForRow = (rowIndex: number) => {
    switch (rowIndex) {
      case 0: return goalkeepers.slice(0, 1);
      case 1: return defenders.slice(0, formationArray[0]);
      case 2: return midfielders.slice(0, formationArray[1]);
      case 3: return forwards.slice(0, formationArray[2]);
      default: return [];
    }
  };

  const rows = [
    { name: 'Goalkeepers', count: 1, players: getPlayersForRow(0) },
    { name: 'Defenders', count: formationArray[0], players: getPlayersForRow(1) },
    { name: 'Midfielders', count: formationArray[1], players: getPlayersForRow(2) },
    { name: 'Forwards', count: formationArray[2], players: getPlayersForRow(3) }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Team Formation: {formation}</h3>
      

      
      <div className="relative bg-gradient-to-b from-green-400 to-green-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border-2 sm:border-4 border-white">
        {/* Pitch markings */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-32 h-32 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Center line */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-white transform -translate-x-1/2"></div>
          
          {/* Penalty areas */}
          <div className="absolute top-1/4 left-0 w-1/4 h-1/2 border-2 border-white"></div>
          <div className="absolute top-1/4 right-0 w-1/4 h-1/2 border-2 border-white"></div>
          
          {/* Goal areas */}
          <div className="absolute top-1/3 left-0 w-1/6 h-1/3 border-2 border-white"></div>
          <div className="absolute top-1/3 right-0 w-1/6 h-1/3 border-2 border-white"></div>
        </div>

        {/* Player rows */}
        <div className="relative z-10 space-y-4 sm:space-y-6 lg:space-y-8">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="text-center">
              <div className="mb-2 sm:mb-3">
                <h4 className="text-base sm:text-lg font-bold text-white drop-shadow-lg">
                  {row.name} ({row.players.length}/{row.count})
                </h4>
              </div>
              
              <div className="flex justify-center items-center space-x-2 sm:space-x-4 flex-wrap">
                {row.players.map((player, playerIndex) => (
                  <div key={playerIndex} className="transform hover:scale-105 transition-transform duration-200">
                    <PlayerCard
                      player={player}
                      onRemove={onPlayerRemove ? () => onPlayerRemove(player) : undefined}
                      onClick={onPlayerClick ? () => onPlayerClick(player) : undefined}
                      draggable={false}
                      showDetails={false}
                    />
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: row.count - row.players.length }, (_, index) => (
                  <div key={`empty-${index}`} className="w-20 h-24 sm:w-24 sm:h-32 bg-white bg-opacity-20 rounded-lg border-2 border-dashed border-white border-opacity-50 flex items-center justify-center">
                    <span className="text-white text-opacity-50 font-semibold text-xs sm:text-sm">Empty</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Formation display */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-bold">
            Formation: {formation}
          </div>
        </div>
      </div>

      {/* Team summary */}
      <div className="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 text-center border border-yellow-200">
          <div className="text-xl sm:text-2xl font-bold text-yellow-700">{goalkeepers.length}</div>
          <div className="text-xs sm:text-sm text-yellow-600 font-semibold">Goalkeepers</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center border border-blue-200">
          <div className="text-xl sm:text-2xl font-bold text-blue-700">{defenders.length}</div>
          <div className="text-xs sm:text-sm text-blue-600 font-semibold">Defenders</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center border border-green-200">
          <div className="text-xl sm:text-2xl font-bold text-green-700">{midfielders.length}</div>
          <div className="text-xs sm:text-sm text-green-600 font-semibold">Midfielders</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 sm:p-4 text-center border border-red-200">
          <div className="text-xl sm:text-2xl font-bold text-red-700">{forwards.length}</div>
          <div className="text-xs sm:text-sm text-red-600 font-semibold">Forwards</div>
        </div>
      </div>
    </div>
  );
};

export default FootballPitch; 