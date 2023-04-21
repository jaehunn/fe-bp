import { useOverlay } from "~/components/Overlay";

const OverlayTest = () => {
  const { open, close, exit } = useOverlay();
  const { open: open2 } = useOverlay();

  const handleClickButtonOpen = () => {
    open(() => <div>testing</div>);
    // open2(() => <div>testing2</div>);
  };

  const handleClickButtonClose = () => {
    close();
  };

  const handleClickButtonExit = () => {
    exit();
  };

  return (
    <div>
      <button onClick={handleClickButtonOpen}>open</button>
      <button onClick={handleClickButtonClose}>close</button>
      <button onClick={handleClickButtonExit}>exit</button>
    </div>
  );
};

export default OverlayTest;
