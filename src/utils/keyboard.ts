import { type MutableRefObject, useEffect } from "react";

export function useKeyboard({
  keysDown,
}: {
  keysDown: MutableRefObject<Set<string>>;
}) {
  useEffect(() => {
    function addKey(event: KeyboardEvent) {
      keysDown.current.add(event.key);
    }
    function deleteKey(event: KeyboardEvent) {
      keysDown.current.delete(event.key);
    }

    document.addEventListener("keydown", addKey);
    document.addEventListener("keyup", deleteKey);

    return () => {
      document.removeEventListener("keydown", addKey);
      document.removeEventListener("keyup", deleteKey);
    };
  }, []);
}
