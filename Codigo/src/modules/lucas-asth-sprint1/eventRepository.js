const STORAGE_KEY = "doacao:eventos";

export function createEventRepository(storage, initialEvents = []) {
  const read = () => {
    try {
      const raw = storage?.getItem(STORAGE_KEY);
      if (!raw) return [...initialEvents];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...initialEvents];
    } catch {
      return [...initialEvents];
    }
  };

  const write = (events) => {
    storage?.setItem(STORAGE_KEY, JSON.stringify(events));
    return events;
  };

  return {
    list: read,
    save(event) {
      const events = read();
      const index = events.findIndex((item) => item.id === event.id);
      if (index >= 0) events[index] = event;
      else events.push(event);
      write(events);
      return event;
    },
    update(id, changes) {
      const events = read();
      const index = events.findIndex((item) => item.id === id);
      if (index < 0) return null;
      events[index] = { ...events[index], ...changes, id };
      write(events);
      return events[index];
    },
    remove(id) {
      return write(read().filter((item) => item.id !== id));
    }
  };
}
