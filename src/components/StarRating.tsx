// src/components/StarRating.tsx

import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  disabled?: boolean; 
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  disabled = false, 
}) => {
  const [hover, setHover] = useState<number | null>(null);

  const handleRatingClick = (newRating: number) => {
    if (disabled) return; 

    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  // Usa o hover APENAS se não estiver disabled. Caso contrário, usa a nota salva.
  const currentRating = disabled ? rating : (hover || rating);

  const baseSize = 20;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        // Verifica se a estrela atual é a que está sendo "hoverada" E SE NÃO ESTÁ DISABLED
        // Se estiver disabled, isHovered será sempre false.
        const isHovered = !disabled && ratingValue === hover;

        return (
          <label 
            key={ratingValue}
            // Define o cursor com base no estado de 'disabled'
            className={disabled ? "cursor-default" : "cursor-pointer"} 
          >
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleRatingClick(ratingValue)}
              className="hidden"
              disabled={disabled}
            />
            <FaStar
              // Somente ativa o setHover se NÃO estiver disabled
              onMouseEnter={() => !disabled && setHover(ratingValue)}
              onMouseLeave={() => !disabled && setHover(null)}
              color={
                ratingValue <= currentRating ? "#ffc107" : "#e4e5e9"
              }
              // Aplica o tamanho maior APENAS se for a estrela hoverada e não estiver disabled.
              size={isHovered ? baseSize * 1.1 : baseSize}
              // REMOVIDO: A prop style que aplicava a opacidade foi removida.
              style={{ transition: 'all 0.1s ease-out' }} 
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;