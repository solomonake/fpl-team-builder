import React from "react";
import { Player } from "../types";

interface TeamSummaryProps {
  team: Player[];
}

const TeamSummary: React.FC<TeamSummaryProps> = ({ team }) => {
  const totalPrice = team.reduce((sum, p) => sum + p.price, 0);
  const totalPoints = team.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="bg-white p-4 shadow-md rounded mt-4">
      <h2 className="text-xl font-bold mb-2">Your Team</h2>
      <ul>
        {team.map((player) => (
          <li key={player.id}>
            {player.name} - {player.position} - £{player.price}M
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
