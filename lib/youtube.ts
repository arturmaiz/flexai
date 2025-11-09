export const getVideoIdFromUrl = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  const searchMatch = url.match(/search_query=([^&]+)/);
  if (searchMatch) {
    return null;
  }

  return null;
};

export const getYouTubeThumbnail = (
  videoUrl: string,
  exerciseName: string
): string => {
  const videoId = getVideoIdFromUrl(videoUrl);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  const searchQuery = videoUrl.match(/search_query=([^&]+)/);
  if (searchQuery) {
    const query = decodeURIComponent(searchQuery[1].replace(/\+/g, " "));
    return `https://via.placeholder.com/640x360/E60023/FFFFFF?text=${encodeURIComponent(
      query
    )}`;
  }
  return `https://via.placeholder.com/640x360/FF0000/FFFFFF?text=Watch+${encodeURIComponent(
    exerciseName
  )}+Tutorial`;
};
