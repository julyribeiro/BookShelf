import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
}

export default function StarRating({ rating }: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
    </div>
  );
}