import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="backdrop-blur-sm left-0 top-0 h-full w-full absolute flex items-center justify-center z-50 cursor-not-allowed">
      <FontAwesomeIcon icon={faSpinner} className="text-4xl text-gray-400 animate-spin" />
    </div>
  );
};

export default LoadingOverlay;
