class Timestamp {
  constructor(timestamp) {
    this.timestamp = timestamp;
    if (this.timestamp < 0)
      throw new Error("The timestamp must be a positive number.");
  }

  getRelativeTime() {
    return `<t:${Math.floor(this.timestamp / 1000)}:R>`;
  }

  getShortDateTime() {
    return `<t:${Math.floor(this.timestamp / 1000)}:f>`;
  }

  getLongDateTime() {
    return `<t:${Math.floor(this.timestamp / 1000)}:F>`;
  }

  getShortDate() {
    return `<t:${Math.floor(this.timestamp / 1000)}:d>`;
  }

  getLongDate() {
    return `<t:${Math.floor(this.timestamp / 1000)}:D>`;
  }

  getShortTime() {
    return `<t:${Math.floor(this.timestamp / 1000)}:t>`;
  }

  getLongTime() {
    return `<t:${Math.floor(this.timestamp / 1000)}:T>`;
  }
}
