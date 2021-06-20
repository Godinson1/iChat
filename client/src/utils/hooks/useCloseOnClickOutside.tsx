import { useEffect } from "react";

export default function useCloseOnClickOutside(
  ref: React.MutableRefObject<null | any>,
  setShowOptions: Function,
  showOptions: boolean
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowOptions(false);
      } else if (showOptions === false) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setShowOptions, showOptions]);

  return;
}
