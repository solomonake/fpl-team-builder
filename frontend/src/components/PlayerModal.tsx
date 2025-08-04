import React, { useEffect, useState } from 'react';

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

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ player, isOpen, onClose }) => {
  const [detailedPlayer, setDetailedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player && player.playerId) {
      setLoading(true);
      fetch(`http://127.0.0.1:5001/api/player/${player.playerId}`)
        .then(response => response.json())
        .then(data => {
          setDetailedPlayer(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching player details:', error);
          setDetailedPlayer(player);
          setLoading(false);
        });
    } else {
      setDetailedPlayer(player);
    }
  }, [player]);

  if (!isOpen || !detailedPlayer) return null;

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-green-400';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-orange-500';
      case 5: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTransferTrend = (transfersIn: number, transfersOut: number) => {
    const net = transfersIn - transfersOut;
    if (net > 1000) return { text: '🔥 Hot', color: 'text-red-600' };
    if (net > 500) return { text: '📈 Rising', color: 'text-orange-600' };
    if (net < -1000) return { text: '📉 Falling', color: 'text-blue-600' };
    if (net < -500) return { text: '⬇️ Declining', color: 'text-gray-600' };
    return { text: '➡️ Stable', color: 'text-green-600' };
  };

  const transferTrend = getTransferTrend(
    detailedPlayer.transfers_in_event || 0,
    detailedPlayer.transfers_out_event || 0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Player Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading player details...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Player Header */}
            <div className="flex items-center space-x-4 mb-6">
              {/* Player Photo */}
              {detailedPlayer.photo && (
                <div className="relative">
                  <img
                    src={detailedPlayer.photo}
                    alt={`${detailedPlayer.firstName} ${detailedPlayer.secondName}`}
                    className="w-24 h-32 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // Show a placeholder when photo fails to load
                      const placeholder = document.createElement('div');
                      placeholder.className = 'w-24 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-sm';
                      placeholder.innerHTML = `${detailedPlayer.firstName.charAt(0)}${detailedPlayer.secondName.charAt(0)}`;
                      target.parentNode?.appendChild(placeholder);
                    }}
                  />
                </div>
              )}
              
              {/* Player Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {detailedPlayer.firstName} {detailedPlayer.secondName}
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  {detailedPlayer.teamBadge && (
                    <img
                      src={detailedPlayer.teamBadge}
                      alt={`${detailedPlayer.club} badge`}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="text-gray-600 font-medium">{detailedPlayer.club}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                    detailedPlayer.position === 'GKP' ? 'bg-yellow-500' :
                    detailedPlayer.position === 'DEF' ? 'bg-blue-500' :
                    detailedPlayer.position === 'MID' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {detailedPlayer.position}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">Cost:</span> £{detailedPlayer.cost.toFixed(1)}M | 
                  <span className="font-semibold ml-2">Points:</span> {detailedPlayer.points}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{detailedPlayer.points}</div>
                <div className="text-xs text-gray-600">Total Points</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">£{detailedPlayer.cost.toFixed(1)}M</div>
                <div className="text-xs text-gray-600">Cost</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{detailedPlayer.ownership?.toFixed(1)}%</div>
                <div className="text-xs text-gray-600">Ownership</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">{detailedPlayer.form}</div>
                <div className="text-xs text-gray-600">Form</div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Performance Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-600">Goals</div>
                  <div className="text-lg font-bold text-gray-800">{detailedPlayer.goals_scored || 0}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-600">Assists</div>
                  <div className="text-lg font-bold text-gray-800">{detailedPlayer.assists || 0}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-600">Clean Sheets</div>
                  <div className="text-lg font-bold text-gray-800">{detailedPlayer.clean_sheets || 0}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-600">Bonus Points</div>
                  <div className="text-lg font-bold text-gray-800">{detailedPlayer.bonus || 0}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-600">Saves</div>
                  <div className="text-lg font-bold text-gray-800">{detailedPlayer.saves || 0}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-600">ICT Index</div>
                  <div className="text-lg font-bold text-gray-800">{detailedPlayer.ict_index || 0}</div>
                </div>
              </div>
            </div>

            {/* Transfer Trends */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Transfer Trends</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transfer Trend:</span>
                  <span className={`font-semibold ${transferTrend.color}`}>{transferTrend.text}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <div className="text-sm text-gray-600">Transfers In</div>
                    <div className="text-lg font-bold text-green-600">+{detailedPlayer.transfers_in_event || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Transfers Out</div>
                    <div className="text-lg font-bold text-red-600">-{Math.abs(detailedPlayer.transfers_out_event || 0)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Fixtures */}
            {detailedPlayer.fixtures && detailedPlayer.fixtures.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Fixtures</h4>
                <div className="space-y-2">
                  {detailedPlayer.fixtures.slice(0, 5).map((fixture, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">GW{fixture.week}</span>
                        <span className="text-sm text-gray-600">
                          {fixture.home_away === 'H' ? 'vs' : '@'} {fixture.opponent}
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(fixture.difficulty)}`}>
                        {fixture.difficulty === 1 ? 'Very Easy' :
                         fixture.difficulty === 2 ? 'Easy' :
                         fixture.difficulty === 3 ? 'Medium' :
                         fixture.difficulty === 4 ? 'Hard' : 'Very Hard'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Recommendation</h4>
              <p className="text-sm text-gray-700">
                {detailedPlayer.points > 150 ? '🔥 Strong performer - Consider for your team' :
                 detailedPlayer.points > 100 ? '📈 Good value - Worth considering' :
                 detailedPlayer.points > 50 ? '⚖️ Average performer - Monitor form' :
                 '⚠️ Low performer - Consider alternatives'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerModal; 