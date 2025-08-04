import React, { useState, useEffect } from 'react';
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
}

interface PlayerSearchProps {
  onPlayerSelect: (player: Player) => void;
  allPlayers: Player[];
  selectedPlayers: Player[];
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ 
  onPlayerSelect, 
  allPlayers, 
  selectedPlayers 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [clubFilter, setClubFilter] = useState('All');
  const [sortBy, setSortBy] = useState('points');

  const positions = ['All', 'GKP', 'DEF', 'MID', 'FWD'];
  const clubs = ['All', ...new Set(allPlayers.map(p => p.club))];

  const filteredPlayers = allPlayers
    .filter(player => {
      const nameMatch = `${player.firstName} ${player.secondName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const positionMatch = positionFilter === 'All' || player.position === positionFilter;
      const clubMatch = clubFilter === 'All' || player.club === clubFilter;
      const notSelected = !selectedPlayers.some(sp => 
        sp.firstName === player.firstName && sp.secondName === player.secondName
      );
      
      return nameMatch && positionMatch && clubMatch && notSelected;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.points - a.points;
        case 'cost':
          return a.cost - b.cost;
        case 'name':
          return `${a.firstName} ${a.secondName}`.localeCompare(`${b.firstName} ${b.secondName}`);
        default:
          return 0;
      }
    })
    .slice(0, 20); // Limit to top 20 results

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Player Search</h3>
      
      {/* Search and filters */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        
        <div className="flex space-x-2">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          
          <select
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            {clubs.map(club => (
              <option key={club} value={club}>{club}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="points">Sort by Points</option>
            <option value="cost">Sort by Cost</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Player grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {filteredPlayers.map((player, index) => (
          <div key={index} onClick={() => onPlayerSelect(player)}>
            <PlayerCard player={player} />
          </div>
        ))}
      </div>
      
      {filteredPlayers.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No players found matching your criteria
        </div>
      )}
    </div>
  );
};

export default PlayerSearch; 