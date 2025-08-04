import React, { useEffect, useState, type ChangeEvent } from 'react';
import './App.css';
import PlayerCard from './components/PlayerCard';
import FootballPitch from './components/FootballPitch';
import PlayerSearch from './components/PlayerSearch';
import PlayerModal from './components/PlayerModal';
import FPLTeamImporter from './components/FPLTeamImporter';
import FormPlayers from './components/FormPlayers';
import TopTeams from './components/TopTeams';

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
  reasoning?: string;
}

const App: React.FC = () => {
  console.log('🎨 NEW FPL TEAM BUILDER LOADED! 🎨'); // Debug log
  
  const [team, setTeam] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [budget, setBudget] = useState<number>(100);
  const [inputBudget, setInputBudget] = useState<string>('100');
  const [formation, setFormation] = useState<string>('4-4-2');
  const [showPlayerSearch, setShowPlayerSearch] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [regenerate, setRegenerate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false);
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);
  const [teamStrategy, setTeamStrategy] = useState<string>('balanced');
  const [smartTeamData, setSmartTeamData] = useState<any>(null);
  const [showFPLImporter, setShowFPLImporter] = useState<boolean>(false);
  const [showFormPlayers, setShowFormPlayers] = useState<boolean>(false);
  const [showTopTeams, setShowTopTeams] = useState<boolean>(false);

  // Fetch all players for search
  useEffect(() => {
    fetch('http://127.0.0.1:5001/api/all-players')
      .then((response) => response.json())
      .then((data: any[]) => {
        const formattedData = data.map((player: any) => ({
          ...player,
          player: `${player.firstName} ${player.secondName}`,
        }));
        setAllPlayers(formattedData as Player[]);
      })
      .catch((error) => console.error('Error fetching all players:', error));
  }, []);

  // Fetch team
  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:5001/api/best-team?budget=${budget}`)
      .then((response) => response.json())
      .then((data: any[]) => {
        const formattedData = data.map((player: any) => ({
          ...player,
          player: `${player.firstName} ${player.secondName}`,
        }));
        setTeam(formattedData as Player[]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching team:', error);
        setLoading(false);
      });
  }, [budget, regenerate]);

  const formations = ['4-4-2', '4-3-3', '3-5-2', '5-3-2', '4-5-1'];
  const strategies = [
    { value: 'balanced', label: 'Balanced', description: 'Mix of attack and defense' },
    { value: 'attacking', label: 'Attacking', description: 'Focus on goals and assists' },
    { value: 'defensive', label: 'Defensive', description: 'Focus on clean sheets and saves' }
  ];

  const totalCost = team.reduce((sum, player) => sum + player.cost, 0);
  const totalPoints = team.reduce((sum, player) => sum + player.points, 0);
  const budgetRemaining = budget - totalCost;

  const getPositionCounts = () => {
    return {
      GKP: team.filter(p => p.position === 'GKP').length,
      DEF: team.filter(p => p.position === 'DEF').length,
      MID: team.filter(p => p.position === 'MID').length,
      FWD: team.filter(p => p.position === 'FWD').length,
    };
  };

  const positionCounts = getPositionCounts();

  const handlePlayerSelect = (player: Player) => {
    // Check if we can add this player (budget, position limits, etc.)
    const newCost = totalCost + player.cost;
    const newPositionCount = positionCounts[player.position as keyof typeof positionCounts] + 1;
    
    if (newCost > budget) {
      alert('Not enough budget!');
      return;
    }
    
    if (newPositionCount > 5) {
      alert('Too many players in this position!');
      return;
    }
    
    setTeam([...team, player]);
    // Don't close the search - let user add multiple players
    // setShowPlayerSearch(false);
  };

  const handlePlayerRemove = (playerToRemove: Player) => {
    setTeam(team.filter(player => 
      !(player.firstName === playerToRemove.firstName && 
        player.secondName === playerToRemove.secondName)
    ));
  };

  const handlePlayerClick = (player: Player) => {
    setModalPlayer(player);
    setShowPlayerModal(true);
  };

  const handleSmartTeamGeneration = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:5001/api/smart-team?budget=${budget}&strategy=${teamStrategy}`)
      .then((response) => response.json())
      .then((data: any) => {
        setTeam(data.team);
        setSmartTeamData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error generating smart team:', error);
        setLoading(false);
      });
  };

  const handleFPLTeamImport = (importedTeam: Player[]) => {
    setTeam(importedTeam);
    setShowFPLImporter(false);
  };

  const handleTopTeamSelect = (topTeam: any) => {
    // Convert top team format to our player format
    const convertedPlayers: Player[] = topTeam.players.map((player: any) => ({
      firstName: player.name.split(' ')[0],
      secondName: player.name.split(' ').slice(1).join(' '),
      position: player.position,
      club: player.club,
      cost: player.cost,
      points: 0, // Mock points
      playerId: Math.random(), // Mock ID
    }));
    setTeam(convertedPlayers);
    setShowTopTeams(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">FPL Team Builder</h1>
            <p className="text-lg sm:text-xl opacity-90 font-light">Build your perfect Fantasy Premier League team</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Budget Control */}
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget (£M)
            </label>
              <div className="flex items-center space-x-2">
            <input
              type="number"
              value={inputBudget}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputBudget(e.target.value)
              }
                  className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              min="80"
              max="120"
              step="0.1"
            />
          <button
            onClick={() => setBudget(parseFloat(inputBudget) || 100)}
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  Set
          </button>
        </div>
            </div>

            {/* Formation Control */}
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Formation
            </label>
            <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                {formations.map(f => (
                  <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

            {/* Strategy Control */}
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Strategy
            </label>
            <select
                value={teamStrategy}
                onChange={(e) => setTeamStrategy(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                {strategies.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setRegenerate(prev => prev + 1)}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold text-sm"
              >
                {loading ? 'Generating...' : 'Generate Team'}
              </button>
              <button
                onClick={handleSmartTeamGeneration}
                disabled={loading}
                className="flex-1 bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors font-semibold text-sm"
              >
                {loading ? 'AI Thinking...' : 'Smart Team'}
              </button>
              <button
                onClick={() => setShowPlayerSearch(!showPlayerSearch)}
                className="flex-1 bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
              >
                Add Player
              </button>
            </div>
          </div>

          {/* Additional Action Buttons */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => setShowFPLImporter(!showFPLImporter)}
              className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm"
            >
              {showFPLImporter ? 'Hide FPL Import' : 'Import FPL Team'}
            </button>
            <button
              onClick={() => setShowFormPlayers(!showFormPlayers)}
              className="bg-yellow-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm"
            >
              {showFormPlayers ? 'Hide Form Players' : '🔥 Form Players'}
            </button>
            <button
              onClick={() => setShowTopTeams(!showTopTeams)}
              className="bg-emerald-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm"
            >
              {showTopTeams ? 'Hide Top Teams' : '🏆 Top Teams'}
            </button>
            <button
              onClick={() => setTeam([])}
              className="bg-gray-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
            >
              Clear Team
            </button>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 sm:mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm font-semibold text-gray-700 mb-3">Team Stats</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white rounded p-2 shadow-sm">
                  <span className="font-bold text-green-600">Cost:</span> £{totalCost.toFixed(1)}M
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <span className="font-bold text-blue-600">Points:</span> {totalPoints}
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <span className="font-bold text-purple-600">Remaining:</span> £{budgetRemaining.toFixed(1)}M
                </div>
                <div className="bg-white rounded p-2 shadow-sm">
                  <span className="font-bold text-gray-600">Players:</span> {team.length}/15
                </div>
              </div>
            </div>

            {/* Smart Team Info */}
            {smartTeamData && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-sm font-semibold text-gray-700 mb-3">AI Analysis</div>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded p-2 shadow-sm">
                    <span className="font-bold text-orange-600">Strategy:</span> {smartTeamData.strategy}
                  </div>
                  <div className="bg-white rounded p-2 shadow-sm">
                    <span className="font-bold text-green-600">Expected Points:</span> {smartTeamData.expectedPoints}
                  </div>
                  <div className="bg-white rounded p-2 shadow-sm">
                    <span className="font-bold text-blue-600">Total Cost:</span> £{smartTeamData.totalCost.toFixed(1)}M
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Budget Progress Bar */}
          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
              <span>Budget Used</span>
              <span>£{totalCost.toFixed(1)}M / £{budget}M</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  totalCost > budget ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((totalCost / budget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* FPL Team Importer */}
        {showFPLImporter && (
          <div className="mb-6 sm:mb-8">
            <FPLTeamImporter
              onTeamImport={handleFPLTeamImport}
              allPlayers={allPlayers}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Football Pitch */}
          <div className="lg:col-span-2">
            <FootballPitch
              team={team}
              formation={formation}
              onPlayerClick={handlePlayerClick}
              onPlayerRemove={handlePlayerRemove}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Player Search */}
            {showPlayerSearch && (
              <PlayerSearch
                onPlayerSelect={handlePlayerSelect}
                allPlayers={allPlayers}
                selectedPlayers={team}
              />
            )}

            {/* Position Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Squad Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="flex items-center font-semibold text-sm sm:text-base">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full mr-2 sm:mr-3"></span>
                    Goalkeepers
                  </span>
                  <span className="font-bold text-yellow-700 text-sm sm:text-base">{positionCounts.GKP}/2</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="flex items-center font-semibold text-sm sm:text-base">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                    Defenders
                  </span>
                  <span className="font-bold text-blue-700 text-sm sm:text-base">{positionCounts.DEF}/5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="flex items-center font-semibold text-sm sm:text-base">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
                    Midfielders
                  </span>
                  <span className="font-bold text-green-700 text-sm sm:text-base">{positionCounts.MID}/5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="flex items-center font-semibold text-sm sm:text-base">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full mr-2 sm:mr-3"></span>
                    Forwards
                  </span>
                  <span className="font-bold text-red-700 text-sm sm:text-base">{positionCounts.FWD}/3</span>
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            {smartTeamData && smartTeamData.reasoning && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">AI Reasoning</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {smartTeamData.reasoning.map((reason: string, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <span className="font-semibold text-purple-600">Player {index + 1}:</span> {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Players Section */}
        {showFormPlayers && (
          <div className="mb-6 sm:mb-8">
            <FormPlayers onPlayerSelect={handlePlayerSelect} />
          </div>
        )}

        {/* Top Teams Section */}
        {showTopTeams && (
          <div className="mb-6 sm:mb-8">
            <TopTeams onTeamSelect={handleTopTeamSelect} />
          </div>
        )}

        {/* Team Table */}
        {team.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Full Squad</h3>
            <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-2 sm:p-4 text-left border-b border-blue-500 text-sm sm:text-base">Player</th>
                    <th className="p-2 sm:p-4 text-left border-b border-blue-500 text-sm sm:text-base">Position</th>
                    <th className="p-2 sm:p-4 text-left border-b border-blue-500 text-sm sm:text-base">Club</th>
                    <th className="p-2 sm:p-4 text-left border-b border-blue-500 text-sm sm:text-base">Cost (£M)</th>
                    <th className="p-2 sm:p-4 text-left border-b border-blue-500 text-sm sm:text-base">Points</th>
                    <th className="p-2 sm:p-4 text-left border-b border-blue-500 text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
                  {team.map((player, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-2 sm:p-4 font-semibold cursor-pointer text-sm sm:text-base" onClick={() => handlePlayerClick(player)}>
                        {player.firstName} {player.secondName}
                      </td>
                      <td className="p-2 sm:p-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white ${
                          player.position === 'GKP' ? 'bg-yellow-500' :
                          player.position === 'DEF' ? 'bg-blue-500' :
                          player.position === 'MID' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {player.position}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 font-medium text-sm sm:text-base">{player.club}</td>
                      <td className="p-2 sm:p-4 font-bold text-green-600 text-sm sm:text-base">£{player.cost.toFixed(1)}M</td>
                      <td className="p-2 sm:p-4 font-bold text-blue-600 text-sm sm:text-base">{player.points}</td>
                      <td className="p-2 sm:p-4">
                        <button
                          onClick={() => handlePlayerRemove(player)}
                          className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-semibold transition-colors"
                        >
                          Remove
                        </button>
                      </td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
        </div>
        )}
      </div>

      {/* Player Modal */}
      <PlayerModal
        player={modalPlayer}
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
      />
    </div>
  );
};

export default App;