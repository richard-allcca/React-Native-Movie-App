const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type MovieImageSize = 'w300' | 'w500' | 'w780' | 'original';

export const movieImageUri = (
  path: string | null | undefined,
  size: MovieImageSize,
): string | null => {
  if (!path) {
    return null;
  }

  return `${IMAGE_BASE_URL}/${size}${path}`;
};
