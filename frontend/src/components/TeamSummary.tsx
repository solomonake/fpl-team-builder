import React from "react";

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

interface TeamSummaryProps {
  team: Player[];
}

const TeamSummary: React.FC<TeamSummaryProps> = ({ team }) => {
  const totalPrice = team.reduce((sum, p) => sum + p.cost, 0);
  const totalPoints = team.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="bg-white p-4 shadow-md rounded mt-4">
      <h2 className="text-xl font-bold mb-2">Your Team</h2>
      <ul>
        {team.map((player, index) => (
          <li key={index}>
            {player.firstName} {player.secondName} - {player.position} - £{player.cost}M
          </li>
        ))}
      </ul>
      <div className="mt-2 text-sm text-gray-700">
        <p><strong>Total Price:</strong> £{totalPrice}M</p>
        <p><strong>Total Points:</strong> {totalPoints}</p>
      </div>
    </div>
  );
};

export default TeamSummary;
