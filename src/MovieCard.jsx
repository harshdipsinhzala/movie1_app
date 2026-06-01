import React, { useState } from "react";

const MovieCard = ({ movie: { imdbID, Year, Poster, Title, Type } }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const hasPoster = Poster && Poster !== "N/A" && !imageFailed;

  return (
    <div className="movie" key={imdbID}>
      <div>
        <p>{Year}</p>
      </div>

      <div>
        {hasPoster ? (
          <img
            src={Poster}
            alt={Title}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="poster-fallback" role="img" aria-label={`${Title} poster not available`}>
            <span>Poster unavailable</span>
            <strong>{Title}</strong>
          </div>
        )}
      </div>

      <div>
        <span>{Type}</span>
        <h3>{Title}</h3>
      </div>
    </div>
  );
}

export default MovieCard;
