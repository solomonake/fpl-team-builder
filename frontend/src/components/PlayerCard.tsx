import React from 'react';

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

interface PlayerCardProps {
  player: Player;
  onRemove?: () => void;
  draggable?: boolean;
  onClick?: () => void;
  selected?: boolean;
  showDetails?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  onRemove, 
  draggable = false, 
  onClick,
  selected = false,
  showDetails = false
}) => {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GKP': return 'bg-yellow-500';
      case 'DEF': return 'bg-blue-500';
      case 'MID': return 'bg-green-500';
      case 'FWD': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  


  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-md border-2 p-2 sm:p-3 cursor-pointer
        transition-all duration-200 hover:shadow-lg hover:scale-105
        ${selected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
      onClick={onClick}
      draggable={draggable}
    >
      {/* Team Badge */}
      {player.teamBadge && (
        <div className="absolute top-1 right-1 w-8 h-8">
          <img 
            src={player.teamBadge} 
            alt={`${player.club} badge`}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to colored badge if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Position indicator */}
      <div className={`absolute top-1 left-1 w-6 h-6 rounded-full ${getPositionColor(player.position)} flex items-center justify-center text-xs font-bold text-white shadow-md`}>
        {player.position}
      </div>

      {/* Player Photo */}
      {player.photo && (
        <div className="text-center mt-8 mb-2 relative">
          <img 
            src={player.photo} 
            alt={`${player.firstName} ${player.secondName}`}
            className="w-16 h-20 mx-auto object-cover rounded-md shadow-sm"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Show a placeholder when photo fails to load
              const placeholder = document.createElement('div');
              placeholder.className = 'w-16 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-md shadow-sm flex items-center justify-center text-white font-bold text-xs';
              placeholder.innerHTML = `${player.firstName.charAt(0)}${player.secondName.charAt(0)}`;
              target.parentNode?.appendChild(placeholder);
            }}
          />
        </div>
      )}

      {/* Player name */}
      <div className="text-center mt-2 mb-3">
        <div className="font-bold text-sm text-gray-800 leading-tight">
          {player.firstName} {player.secondName}
        </div>
        <div className="text-xs text-gray-600 font-medium">{player.club}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="text-center bg-gray-50 rounded-md p-2">
          <div className="font-bold text-green-600">£{player.cost.toFixed(1)}M</div>
          <div className="text-gray-500 text-xs">Cost</div>
        </div>
        <div className="text-center bg-gray-50 rounded-md p-2">
          <div className="font-bold text-blue-600">{player.points}</div>
          <div className="text-gray-500 text-xs">Points</div>
        </div>
      </div>

      {/* Enhanced Stats (if showDetails is true) */}
      {showDetails && (
        <div className="mt-3 space-y-1 text-xs">
          {player.form && (
            <div className="text-center">
              <span className="font-semibold">Form:</span> {player.form}
            </div>
          )}
          {player.ownership && (
            <div className="text-center">
              <span className="font-semibold">Owned:</span> {player.ownership.toFixed(1)}%
            </div>
          )}
          {player.goals_scored !== undefined && (
            <div className="text-center">
              <span className="font-semibold">Goals:</span> {player.goals_scored}
            </div>
          )}
          {player.assists !== undefined && (
            <div className="text-center">
              <span className="font-semibold">Assists:</span> {player.assists}
            </div>
          )}
        </div>
      )}

      {/* Ownership and form if available */}
      {player.ownership && !showDetails && (
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500 bg-blue-50 rounded-md p-1">
            {player.ownership.toFixed(1)}% owned
          </div>
        </div>
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors shadow-lg"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default PlayerCard;