const formatList = (data) => {
  console.log("Formatting Vacant Berth Data...");

  const result = {};
  data.forEach((item) => {
    if (
      (item["from"] === "MMCT" && item["to"] !== "BVI") ||
      item["from"] === "BVI"
    ) {
      if (!result[item["coachName"]]) {
        result[item["coachName"]] = [];
        result[item["coachName"]].push(item["berthNumber"]);
      } else {
        result[item["coachName"]].push(item["berthNumber"]);
      }
    }
  });

  const processedData = Object.fromEntries(
    Object.entries(result).map(([key, values]) => {
      // Remove duplicates by creating a Set, then sort
      const uniqueSorted = [...new Set(values)].sort((a, b) => a - b);
      return [key, uniqueSorted];
    })
  );

  const sortedCoaches = [...new Set(Object.keys(processedData))].sort(
    (a, b) => {
      const numA = parseInt(a.match(/\d+/))?.[0] || 0;
      const numB = parseInt(b.match(/\d+/))?.[0] || 0;
      return numA - numB;
    }
  );

  const formatted = sortedCoaches
    .map((coach) => {
      const berths = processedData[coach].join(", ");
      return `${coach} ==> ${berths}`;
    })
    .join("<br><br><br>");
  return formatted;
};

module.exports = { formatList };
