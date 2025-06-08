const formatList = (data) => {
  console.log("Formatting Vacant Berth Data...");

  const result = {};
  data.forEach((item) => {
    if (!result[item["coachName"]]) {
      result[item["coachName"]] = [];
      result[item["coachName"]].push(item["berthNumber"]);
    } else {
      result[item["coachName"]].push(item["berthNumber"]);
    }
  });

  const sortedCoaches = Object.keys(result).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/));
    const numB = parseInt(b.match(/\d+/));
    return numA - numB;
  });

  const formatted = sortedCoaches
    .map((coach) => {
      const berths = result[coach].join(", ");
      return `${coach} ==> ${berths}`;
    })
    .join("<br><br><br>");
  return formatted;
};

module.exports = { formatList };
