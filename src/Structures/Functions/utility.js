class utils {
  constructor() {}
  ms(ms) {
    const s = 1000;
    const m = s * 60;
    const h = m * 60;
    const d = h * 24;

    const msAbs = Math.abs(ms);
    if (msAbs >= d) return Math.round(ms / d) + "d";
    if (msAbs >= h) return Math.round(ms / h) + "h";
    if (msAbs >= m) return Math.round(ms / m) + "m";
    if (msAbs >= s) return Math.round(ms / s) + "s";
    return ms + "ms";
  }
  randomHex() {
    return Math.floor(Math.random() * (0xffffff + 1));
  }
  convertBytes(x) {
    const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let l = 0;
    let n = parseInt(x, 10) || 0;
    while (n >= 1024 && l++) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  }
  convertSecToTime(time) {
    return Date.now() - time * 1000;
  }
  topCommonElementsInArray(nums, maxResults) {
    const hash = {};

    for (const num of nums) {
      if (!hash[num]) hash[num] = 0;
      hash[num]++;
    }

    const hashToArray = Object.entries(hash);
    const sortedArray = hashToArray.sort((a, b) => b[1] - a[1]);

    return sortedArray.slice(0, maxResults);
  }
  progressBar(value, maxValue, size) {
    let fillStart = "<a:fillStart:948718567250079755>";
    let fillBar = "<a:fillBar:948718618890350652>";
    let fillEnd = "<a:fillEnd:948718645578727504>";
    let emptyStart = "<:emptyStart:948718678441070632>";
    let emptyBar = "<:emptyBar:948718703221043230>";
    let emptyEnd = "<:emptyEnd:948718730291073084>";
    let barArray = [];

    let fill = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
    let empty = size - fill > 0 ? size - fill : 0;

    for (let i = 1; i <= fill; i++) barArray.push(fillBar);
    for (let i = 1; i <= empty; i++) barArray.push(emptyBar);
  }

  hunt(data) {
    const maximum = data.Backpack.Craftable.Scope > 0 ? 75 : 100;
    const randomChance = Math.floor(Math.random() * maximum) + 1;

    const prizes = [
      { min: 1, max: 2, color: 0xffff00, tier: "LEGENDARY", prize: "Badge" },
      { min: 2, max: 10, color: 0x9b00ff, tier: "EPIC", prize: "Bird" },
      { min: 10, max: 30, color: 0x02ff00, tier: "RARE", prize: "Dragon" },
      { min: 30, max: 60, color: 0xff9e67, tier: "UNCOMMON", prize: "Wolf" },
      { min: 60, max: 100, color: 0xffffff, tier: "COMMON", prize: "Chicken" },
    ];
    let prize;
    let tier;
    let color;

    for (let i = 0; i < prizes.length; i++) {
      if (randomChance >= prizes[i].min && randomChance <= prizes[i].max) {
        prize = prizes[i].prize;
        tier = prizes[i].tier;
        color = prizes[i].color;
      }
    }

    return { prize, tier, color };
  }
  fish(data) {
    const randomChance = Math.floor(Math.random() * 100) + 1;
    const maxChanceOfTreasure =
      data.Backpack.Craftable.WaterPurifier > 0 ? 5 : 2;

    const prizes = [
      {
        min: 1,
        max: maxChanceOfTreasure,
        color: 0xffff00,
        tier: "LEGENDARY",
        prize: "Treasure",
      },
      {
        min: maxChanceOfTreasure,
        max: 10,
        color: 0x9b00ff,
        tier: "EPIC",
        prize: "Whale",
      },
      { min: 10, max: 30, color: 0x02ff00, tier: "RARE", prize: "Exotic Fish" },
      { min: 30, max: 60, color: 0xff9e67, tier: "UNCOMMON", prize: "Fish" },
      { min: 60, max: 80, color: 0xffffff, tier: "COMMON", prize: "Sand" },
      { min: 80, max: 100, color: 0x202020, tier: "Loser", prize: "Garbage" },
    ];
    let prize;
    let tier;
    let color;

    for (let i = 0; i < prizes.length; i++) {
      if (randomChance >= prizes[i].min && randomChance <= prizes[i].max) {
        prize = prizes[i].prize;
        tier = prizes[i].tier;
        color = prizes[i].color;
      }
    }

    return { prize, tier, color };
  }

  filterTheItems(data) {
    const res = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === 0) continue;
      else res[key] = value;
    }

    return res;
  }

  formatEmoji(emoji) {
    return !emoji.id || emoji.available
      ? emoji.toString() // bot has access or unicode emoji
      : `[:${emoji.name}:](${emoji.url})`; // bot cannot use the emoji
  }
}
module.exports = utils;
