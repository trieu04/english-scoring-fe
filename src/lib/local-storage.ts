export class LocalStorage<T> {
  constructor(private key: string, private defaultValue: T | null = null) { }
  get(): T | null {
    const stored = localStorage.getItem(this.key);
    if (stored !== null) {
      try {
        return JSON.parse(stored) as T;
      }
      catch {
        console.warn(`Invalid JSON in localStorage for key "${this.key}"`);
        localStorage.removeItem(this.key);
      }
    }

    return this.defaultValue;
  }

  set(value: T): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  remove(): void {
    localStorage.removeItem(this.key);
  }
}

export class LocalStorageWithMemory<T> {
  private memory: T | null = null;

  constructor(private key: string, private defaultValue: T | null = null) { }

  get(): T | null {
    if (this.memory !== null)
      return this.memory;

    const stored = localStorage.getItem(this.key);
    if (stored !== null) {
      try {
        this.memory = JSON.parse(stored) as T;
        return this.memory;
      }
      catch {
        console.warn(`Invalid JSON in localStorage for key "${this.key}"`);
        localStorage.removeItem(this.key);
      }
    }

    this.memory = this.defaultValue;
    return this.memory;
  }

  set(value: T): void {
    this.memory = value;
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  remove(): void {
    this.memory = null;
    localStorage.removeItem(this.key);
  }
}
