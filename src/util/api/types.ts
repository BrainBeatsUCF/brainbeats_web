export interface PlaylistDetail {
  playlistId: string,
  playlistName: string,
  playlistImage: string,
  playlistAuthor: string,
  ownerId: string,
  songList: string[],
  isPrivate: boolean,
}

export interface Song {
  songId: string,
  songName: string,
  songAuthor: string,
  duration: number,
  songImage: string,
  userId: string,
  isPrivate: boolean,
}

export interface SideBarProps {
  id: string
}

export interface AudioObject {
  imageUrl: string,
  audioUrl: string
  title: string,
  authorName: string,
  id: string,
}

export interface PlaylistObject {
  id: string,
  imageUrl: string,
  isPrivate: string,
  name: string,
  email: string,
}