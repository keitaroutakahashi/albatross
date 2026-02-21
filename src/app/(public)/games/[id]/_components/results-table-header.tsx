type Props = {
  inningCount: number;
};

export const ResultsTableHeader = ({ inningCount }: Props) => {
  return (
    <thead>
      <tr className="bg-gray-800 text-white">
        <th className="text-xs @content:text-sm min-w-10 max-w-10 p-2 @content:w-10 text-center whitespace-nowrap sticky left-0 bg-gray-800 z-10">
          打順
        </th>
        <th className="text-xs @content:text-sm p-2 min-w-10 max-w-10 @content:w-10 text-left whitespace-nowrap sticky left-10 bg-gray-800 z-10">
          守備
        </th>
        <th className="text-xs @content:text-sm p-2 @content:w-20 text-left whitespace-nowrap sticky left-20 bg-gray-800 z-10">
          選手名
        </th>
        <th className="p-2 text-xs @content:text-sm @content:w-10 text-center whitespace-nowrap">
          打
        </th>
        <th className="p-2 text-xs @content:text-sm @content:w-10 text-center whitespace-nowrap">
          安
        </th>
        <th className="p-2 text-xs @content:text-sm @content:w-10 text-center whitespace-nowrap">
          点
        </th>
        <th className="p-2 text-xs @content:text-sm @content:w-10 text-center whitespace-nowrap">
          本
        </th>
        <th className="p-2 text-xs @content:text-sm @content:w-10 text-center whitespace-nowrap">
          盗
        </th>
        {Array.from({ length: inningCount }, (_, i) => (
          <th
            key={`inning-header-${i + 1}`}
            className="p-2 text-xs @content:text-sm w-14 @content:w-auto text-center whitespace-nowrap bg-gray-700"
          >
            {i + 1}
          </th>
        ))}
      </tr>
    </thead>
  );
};
