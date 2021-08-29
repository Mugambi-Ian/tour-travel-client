export default class MyDictionary {
  #keys = [];
  #data = [];

  constructor(data) {
    data = data || {};
    this.#keys = data.keys || [];
    this.#data = data.data || [];
  }

  set(key, value) {
    if (!this.#keys.includes(key)) {
      this.#keys.push(key);
      this.#data.push(value);
      return true;
    } else {
      const i = this.#keys.indexOf(key);
      this.#data[i] = value;
      return true;
    }
  }

  get(key) {
    if (this.#keys.includes(key)) {
      const i = this.#keys.indexOf(key);
      return this.#data[i];
    }
    return null;
  }

  delete(key) {
    if (this.#keys.includes(key)) {
      const i = this.#keys.indexOf(key);
      this.#data.splice(i, 1);
      this.#keys.splice(i, 1);
    }
  }
  listKeys() {
    return this.#keys;
  }
  getVaules() {
    return this.#data;
  }
  containsKey(key) {
    return this.#keys.includes(key);
  }

  isEmpty() {
    return this.#keys.length === 0;
  }

  length() {
    return this.#keys.length;
  }
  getData() {
    return {
      keys: this.#keys,
      data: this.#data,
    };
  }
}
