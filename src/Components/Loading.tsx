import { dotWave } from "ldrs";

const Loading = () => {
  dotWave.register();
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <l-dot-wave size="47" speed="1" color="black"></l-dot-wave>
    </div>
  );
};

export default Loading;
