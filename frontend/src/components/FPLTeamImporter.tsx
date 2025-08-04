import { useState } from 'react';

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

interface TransferSuggestion {
  playerOut: Player;
  playerIn: Player;
  reason: string;
  expectedPointsGain: number;
  costDifference: number;
}

interface FPLTeamImporterProps {
  onTeamImport: (team: Player[]) => void;
  allPlayers: Player[];
}

const FPLTeamImporter: React.FC<FPLTeamImporterProps> = ({ onTeamImport, allPlayers }) => {
  const [fplTeamId, setFplTeamId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTeam, setCurrentTeam] = useState<Player[]>([]);
  const [transferSuggestions, setTransferSuggestions] = useState<TransferSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleImportTeam = async () => {
    if (!fplTeamId.trim()) {
      alert('Please enter a valid FPL Team ID');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock FPL team import (in real implementation, this would call FPL API)
      const mockTeam = generateMockFPLTeam(fplTeamId);
      setCurrentTeam(mockTeam);
      onTeamImport(mockTeam);
      
      // Generate transfer suggestions
      const suggestions = generateTransferSuggestions(mockTeam, allPlayers);
      setTransferSuggestions(suggestions);
      setShowSuggestions(true);
      
    } catch (error) {
      console.error('Error importing team:', error);
      alert('Failed to import team. Please check your Team ID.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockFPLTeam = (teamId: string): Player[] => {
    // Mock team generation based on team ID
    const mockPlayers = [
      {
        firstName: 'Alisson',
        secondName: 'Becker',
        position: 'GKP',
        club: 'Liverpool',
        cost: 5.5,
        points: 120,
        playerId: 1,
        photo: 'https://resources.premierleague.com/premierleague/photos/players/110x140/p1.png',
        teamBadge: 'https://resources.premierleague.com/premierleague/badges/t14.png'
      },
      {
        firstName: 'Virgil',
        secondName: 'van Dijk',
        position: 'DEF',
        club: 'Liverpool',
        cost: 6.5,
        points: 145,
        playerId: 2,
        photo: 'https://resources.premierleague.com/premierleague/photos/players/110x140/p2.png',
        teamBadge: 'https://resources.premierleague.com/premierleague/badges/t14.png'
      },
      {
        firstName: 'Kevin',
        secondName: 'De Bruyne',
        position: 'MID',
        club: 'Manchester City',
        cost: 10.5,
        points: 180,
        playerId: 3,
        photo: 'https://resources.premierleague.com/premierleague/photos/players/110x140/p3.png',
        teamBadge: 'https://resources.premierleague.com/premierleague/badges/t43.png'
      },
      {
        firstName: 'Erling',
        secondName: 'Haaland',
        position: 'FWD',
        club: 'Manchester City',
        cost: 14.0,
        points: 200,
        playerId: 4,
        photo: 'https://resources.premierleague.com/premierleague/photos/players/110x140/p4.png',
        teamBadge: 'https://resources.premierleague.com/premierleague/badges/t43.png'
      }
    ];

    return mockPlayers;
  };

  const generateTransferSuggestions = (currentTeam: Player[], allPlayers: Player[]): TransferSuggestion[] => {
    const suggestions: TransferSuggestion[] = [];
    
    // Find players with low form or high cost
    const underperformers = currentTeam.filter(player => 
      player.points < 100 || player.cost > 8.0
    );

    // Find better alternatives
    underperformers.forEach(player => {
      const alternatives = allPlayers.filter(p => 
        p.position === player.position && 
        p.points > player.points && 
        p.cost <= player.cost + 2.0 &&
        p.club !== player.club
      );

      if (alternatives.length > 0) {
        const bestAlternative = alternatives.sort((a, b) => b.points - a.points)[0];
        const expectedGain = bestAlternative.points - player.points;
        
        suggestions.push({
          playerOut: player,
          playerIn: bestAlternative,
          reason: `Better form and value for money`,
          expectedPointsGain: expectedGain,
          costDifference: bestAlternative.cost - player.cost
        });
      }
    });

    return suggestions.slice(0, 3); // Return top 3 suggestions
  };

  const applyTransfer = (suggestion: TransferSuggestion) => {
    const updatedTeam = currentTeam.map(player => 
      player.playerId === suggestion.playerOut.playerId ? suggestion.playerIn : player
    );
    
    setCurrentTeam(updatedTeam);
    onTeamImport(updatedTeam);
    
    // Remove the applied suggestion
    setTransferSuggestions(prev => 
      prev.filter(s => s.playerOut.playerId !== suggestion.playerOut.playerId)
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Import FPL Team</h3>
      
      <div className="space-y-4">
        {/* Team ID Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            FPL Team ID
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={fplTeamId}
              onChange={(e) => setFplTeamId(e.target.value)}
              placeholder="Enter your FPL Team ID"
              className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
            />
            <button
              onClick={handleImportTeam}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg"
            >
              {isLoading ? 'Importing...' : 'Import Team'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Find your Team ID in your FPL profile settings
          </p>
        </div>

        {/* Current Team Display */}
        {currentTeam.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Current Team</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentTeam.map((player, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="font-semibold text-sm">{player.firstName} {player.secondName}</div>
                  <div className="text-xs text-gray-600">{player.club}</div>
                  <div className="text-xs font-bold text-green-600">£{player.cost.toFixed(1)}M</div>
                  <div className="text-xs font-bold text-blue-600">{player.points} pts</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transfer Suggestions */}
        {showSuggestions && transferSuggestions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Transfer Suggestions</h4>
            <div className="space-y-3">
              {transferSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-800">Suggestion {index + 1}</span>
                    <button
                      onClick={() => applyTransfer(suggestion)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-semibold"
                    >
                      Apply Transfer
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Player Out */}
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-red-700 mb-2">Transfer Out</div>
                      <div className="text-sm font-bold">{suggestion.playerOut.firstName} {suggestion.playerOut.secondName}</div>
                      <div className="text-xs text-gray-600">{suggestion.playerOut.club}</div>
                      <div className="text-xs font-bold text-red-600">£{suggestion.playerOut.cost.toFixed(1)}M</div>
                      <div className="text-xs font-bold text-red-600">{suggestion.playerOut.points} pts</div>
                    </div>
                    
                    {/* Player In */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-green-700 mb-2">Transfer In</div>
                      <div className="text-sm font-bold">{suggestion.playerIn.firstName} {suggestion.playerIn.secondName}</div>
                      <div className="text-xs text-gray-600">{suggestion.playerIn.club}</div>
                      <div className="text-xs font-bold text-green-600">£{suggestion.playerIn.cost.toFixed(1)}M</div>
                      <div className="text-xs font-bold text-green-600">{suggestion.playerIn.points} pts</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Expected Points Gain:</span>
                      <span className="font-bold text-green-600">+{suggestion.expectedPointsGain}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Cost Difference:</span>
                      <span className={`font-bold ${suggestion.costDifference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {suggestion.costDifference >= 0 ? '+' : ''}£{suggestion.costDifference.toFixed(1)}M
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-semibold">Reason:</span> {suggestion.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Suggestions */}
        {showSuggestions && transferSuggestions.length === 0 && (
          <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-2">🎉 Great Team!</div>
              <div className="text-sm text-gray-600">
                Your current team looks optimal. No transfer suggestions needed.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FPLTeamImporter; 