import { useEffect, useState } from 'react';

type ToastItem = { id: number; message: string };

let nextId = 0;
const listeners = new Set<(items: ToastItem[]) => void>();
let items: ToastItem[] = [];

function notify() {
  listeners.forEach((listener) => listener([...items]));
}

export function toast(message: string) {
  const item = { id: ++nextId, message };
  items = [...items, item];
  notify();
  setTimeout(() => {
    items = items.filter((t) => t.id !== item.id);
    notify();
  }, 3500);
}

export function Toaster() {
  const [visible, setVisible] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = setVisible;
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!visible.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {visible.map((item) => (
        <div
          key={item.id}
          className="rounded-xl bg-foreground text-background px-4 py-3 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2"
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
