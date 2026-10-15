type Props = {
  innings: { id: number; inningNumber: number }[];
  showForfeitedRuns: boolean;
};

const SCORE_DETAILS = ["R", "H", "E", "献"];

export const ScoreBoardHeader = ({ innings, showForfeitedRuns }: Props) => {
  const scoreDetails = showForfeitedRuns
    ? SCORE_DETAILS
    : SCORE_DETAILS.filter((detail) => detail !== "献");

  return (
    <thead>
      <tr className="bg-primary text-white">
        <th />
        {innings.map((inning) => (
          <th key={inning.id} className="py-1 text-center font-bold text-xs">
            {inning.inningNumber}
          </th>
        ))}
        {scoreDetails.map((detail) => (
          <th
            key={detail}
            className="text-center text-xs font-bold bg-gray-500"
          >
            {detail}
          </th>
        ))}
      </tr>
    </thead>
  );
};
