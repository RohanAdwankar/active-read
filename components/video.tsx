import React, { useState } from 'react';

// Define the type for the props
interface VideoPlayerProps {
  showVideo: boolean;
  toggleVideo: () => void;  // toggleVideo is a function that returns nothing
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ showVideo, toggleVideo }) => {
  // List of all video file paths
  const videoFiles = [
    '/videos/Snaptik.app_7344378689997606176.mp4',
    '/videos/Snaptik.app_7429790134733638944.mp4',
    '/videos/Snaptik.app_7470995966930210081.mp4',
    '/videos/Snaptik.app_7476200752214445344.mp4',
    '/videos/Snaptik.app_7405306228034866464.mp4',
    '/videos/Snaptik.app_7385259884704582945.mp4',
    '/videos/Snaptik.app_6956579273134050565.mp4',
    '/videos/Snaptik.app_6941757529101700358.mp4',
    '/videos/Snaptik.app_7476564407271705887.mp4',
    '/videos/Snaptik.app_7475187692179868959.mp4',
    '/videos/Snaptik.app_7473645213232205087.mp4',
    '/videos/Snaptik.app_7376035875978857760.mp4',
    '/videos/Snaptik.app_7256306326052162858.mp4',
    '/videos/Snaptik.app_7432376419998584097.mp4',
    '/videos/Snaptik.app_7261288061789621546.mp4',
    '/videos/Snaptik.app_7283898920722369825.mp4',
    '/videos/Snaptik.app_7131946147945418027.mp4',
    '/videos/Snaptik.app_7377430487498820897.mp4',
    '/videos/Snaptik.app_7320412622178880800.mp4',
    '/videos/Snaptik.app_7474390985477229870.mp4'
  ];

  // Random video logic
  const getRandomVideo = () => {
    return videoFiles[Math.floor(Math.random() * videoFiles.length)];
  };

  const [randomVideo, setRandomVideo] = useState(getRandomVideo());

  // This will change the video each time it's called
  const handleToggleVideo = () => {
    setRandomVideo(getRandomVideo());  // Pick a new random video each time
    toggleVideo();  // Call the toggle function to show/hide the video
  };

  // Ensure that the component always returns a JSX element (even if the video is hidden)
  return (
    <>
      {showVideo && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="p-4 bg-white rounded-xl shadow-lg max-w-lg w-full h-[80vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Video</h2>
            <div className="relative flex-1 pb-[56.25%] overflow-hidden mb-4">
              {randomVideo && (
                <video
                  src={randomVideo} // Path to the randomly selected video
                  autoPlay
                  loop
                  muted
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
            <button
              onClick={handleToggleVideo} // Change video when clicked
              className="self-center mt-4 text-red-500 hover:underline"
            >
              Close Video
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
