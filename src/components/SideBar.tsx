import React, { useState, useEffect, useRef } from 'react';
import BrainBeatsAudioPlayer from '@brainbeatsucf/brainbeats-audio-player';
import '@brainbeatsucf/brainbeats-audio-player/src/style.css';
import { Link } from 'react-router-dom';
import { useStyles } from './SideBarUseStyles';
import BeatButtonImage from '../images/beatButton.png';
import ShareButtonImage from '../images/shareButton.png';
import SampleButtonImage from '../images/sampleButton.png';
import LogOutImage from '../images/LogoutImage.png'
import CreatePlaylistPopup from './CreatePlaylistPopup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { MusicContext } from '../util/contexts/music';
import { SideBarProps, AudioObject, PlaylistObject } from '../util/api/types';

// Todo: Add icon when audio is successfully/finished added to playlist
//      handle playlist area responsiveness when it comes to less than 959

const SideBar: React.FC<SideBarProps> = ({...props}) => {
  const classes = useStyles(useStyles);
  const [audioArray, setAudioArray] = useState([] as AudioObject[]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [playListPopup, setPlaylistPopup] = useState(false);
  const history = useHistory();
  const [playlists, setPlaylists] = useState([] as PlaylistObject[]);
  const musicProvider = React.useContext(MusicContext);

  let userEmail = localStorage.getItem('userEmail');
  const url = "https://brain-beats-server-docker.azurewebsites.net/";

  // Audio Package
  const setPlayingIndexAudioPackage = (playingIndexAudioPackage: number) => {
    setPlayingIndex(playingIndexAudioPackage);
  };

  const logout = () => {
    // call log out api

      // remove local storage
      localStorage.removeItem('userEmail');

      // push to login
      history.push('login');
  }

  const openCreatePlaylistPopup = () => {
    setPlaylistPopup(true);
  }

  const closeCreatePlaylistPopup = () => {
    setPlaylistPopup(false);
  }

  const showPlaylistArea = () => {
    setShowPlaylists(true);
  }

  const addToPlaylist = (audioId: string, playlistId: string) => {
    console.log("add audioId: " + playingIndex + "to playlistId: " + playlistId);
    console.log("current audio id playing: " + playingIndex);
  }

  const handleClick = (e: any) => {
    if (wrapperRef !== null) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        // inside click
        return;
      }
    }

    // Do not close playlists area if playlist create panel is up
    if (playListPopup) {
      return;
    }
      
    // outside click 
    setShowPlaylists(false);
  };

  // Todo: handle this
  const loadPlaylist = async () => {
    let playlistArrayData = [] as PlaylistObject[];

    // Todo: un-comment when cors is fixed
    // const playlistResponse = await axios.post(url + 'api/user/get_owned_playlists', {
    //   email: localStorage.getItem('userEmail')
    // });    

    // playlistResponse.data.forEach((item: any) => {
    //   console.log(item.id);
    //   console.log(item);
    //   const newPlaylist = 
    //   {
    //     "imageUrl": item.properties['image'][0]['value'],
    //     "isPrivate": item.properties['isPrivate'][0]['value'],
    //     "name": item.properties['name'][0]['value'],
    //     "email": localStorage.getItem('userEmail')!,
    //     "id": item.id
    //   };
      
    //   playlistArrayData.push(newPlaylist);
    // });

    // testing, remove when cors resolve
    playlistArrayData.push({
      "imageUrl": "",
      "isPrivate": "false",
      "name": "playlist 1",
      "email": "testing",
      "id": "1"
    });

    playlistArrayData.push({
      "imageUrl": "",
      "isPrivate": "false",
      "name": "playlist 2",
      "email": "testing",
      "id": "2"
    });

    playlistArrayData.push({
      "imageUrl": "",
      "isPrivate": "false",
      "name": "playlist 3",
      "email": "testing",
      "id": "3"
    });

    setPlaylists(playlistArrayData);
  }

  const loadData = async () => {
    if (props.id === '0') {
      return;
    }

    let audioArrayData = [] as AudioObject[];

    // reset the data
    setAudioArray([]);

    // Play Playlist Part
    if (musicProvider.getAudioPlayingType() === 'playlist') {
      // Todo: undo when cors is resolve
      // const playlistResponse = await axios.post(url + 'api/playlist/read_playlist_beats', {
      //   playlistId: props.id
      // });    
  
      // playlistResponse.data.forEach((item: any) => {
      //   const newAudio = 
      //   {
      //     "imageUrl": item.properties['image'][0]['value'],
      //     "audioUrl": item.properties['audio'][0]['value'],
      //     "title": item.properties['name'][0]['value'],
      //     "authorName": "Hung Nguyen"
      //   };
        
      // remove when corse is solved
      //   audioArrayData.push(newAudio);
      // });

      audioArrayData.push({
        "imageUrl": "",
        "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "title": "Beat 1",
        "authorName": "Hung Nguyen"
      });
      audioArrayData.push({
        "imageUrl": "",
        "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "title": "Beat 2",
        "authorName": "Hung Nguyen"
      });
      audioArrayData.push({
        "imageUrl": "",
        "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        "title": "Beat 3",
        "authorName": "Hung Nguyen"
      });
    } else if (musicProvider.getAudioPlayingType() === 'beat') {
      const beatResponse = await axios.post(url + 'api/beat/read_beat', {
        beatId: props.id
      });
  
      beatResponse.data.forEach((item: any) => {
        const newAudio = 
        {
          "imageUrl": item.properties['image'][0]['value'],
          "audioUrl": item.properties['audio'][0]['value'],
          "title": item.properties['name'][0]['value'],
          "authorName": "Hung Nguyen"
        };
        audioArrayData.push(newAudio);
      });      
    } else if (musicProvider.getAudioPlayingType() === 'sample') {
      const sampleResponse = await axios.post(url + 'api/sample/read_sample', {
        sampleId: props.id
      });

      sampleResponse.data.forEach((item: any) => {
        const newAudio = 
        {
          // Todo: ask justin to add imageUrl to sample: item.properties['image'][0]['value'],
          "imageUrl": '',
          "audioUrl": item.properties['audio'][0]['value'],
          "title": item.properties['name'][0]['value'],
          "authorName": "Hung Nguyen"
        };
        audioArrayData.push(newAudio);
      })
    }

    setAudioArray(audioArrayData);
  }

  useEffect(() => {
    const getPlaylist = async () => {
      await loadPlaylist();
    };
    getPlaylist();
  }, [props.id]);

  useEffect(() => {
    const getData = async () => {
      await loadData();
    };
    getData();
  }, [props.id]);

  // playListPopUp 
  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [playListPopup]);

  let audioContent, userStat, isShowAddToPlaylist;  

  userStat = (
    <>
      <div className={classes.statElement}>
        <img className={classes.statPicture} alt='Beat Icon' src={BeatButtonImage}></img>
        <div className={classes.statValues}>
          <h4>Beats</h4>
          <h4>23</h4>
        </div>
      </div>
      <div className={classes.statElement}>
        <img className={classes.statPicture} alt='Sample Icon' src={SampleButtonImage}></img>
        <div className={classes.statValues}>
          <h4>Samples</h4>
          <h4>15</h4>
        </div>
      </div>
      <div className={classes.statElement}>
        <img className={classes.statPicture} alt='Share Icon' src={ShareButtonImage}></img>
        <div className={classes.statValues}>
          <h4>Shares</h4>
          <h4>135</h4>
        </div>
      </div>
    </>
  )

  if (musicProvider.getAudioPlayingType() === 'playlist' || musicProvider.getAudioPlayingType() === 'beat' )
    isShowAddToPlaylist = true;
  else
    isShowAddToPlaylist = false;
  
  if (audioArray.length > 0) {
    audioContent = (
      <>
        {isShowAddToPlaylist ? <button className={classes.addPlaylistButton} onClick={showPlaylistArea}>Add to my playlists</button> : ""}

        {/* Todo: How to figure out the audioId for next audio in a playlist */}
        {/* Maybe go back to brain beats audio package to export another function to get the current audioId */}
        {/* <BrainBeatsAudioPlayer audioObjectArray={audioArray}/> */}
        <BrainBeatsAudioPlayer audioObjectArray={audioArray} setPlayingIndexAudioPackage={setPlayingIndexAudioPackage}/>
      </>
    );
  } else {
    audioContent = <></>;
  }
  
  return (
    <div className={classes.sideBarContainer}>
      <div className={classes.userInfo}>
        <div style={{textAlign: 'right'}}>
          <img onClick={() => {
            // handle log out logic
            logout();
          }} alt='Logout' src={LogOutImage}></img>
        </div>
        <div className={classes.userPictureContainer}>
          <Link to='user/profile'><img className={classes.userPicture} src="https://qph.fs.quoracdn.net/main-qimg-70d48d9e6d598aa364c13ef739b489d4" alt=""></img></Link>
        </div>
        
        <div className={classes.userStatContainer}>
          {userStat}
        </div>

        <div className={classes.playlists} ref={wrapperRef} style={{display: showPlaylists ? 'flex' : 'none'}}>
          <button onClick={openCreatePlaylistPopup}>Create a playlist</button>
          {playlists.map((playlist, key) => {
            return (
              // need to change props.id to getCurrentAudioPlaying from audio package
              <div className={classes.playlistTitle} key={key} onClick={() => {addToPlaylist(props.id, playlist.id)}}>
                {key + 1}. {playlist.name}
              </div>
            )
          })}
        </div>
        {playListPopup ? <CreatePlaylistPopup closeCreatePlaylistPopup={closeCreatePlaylistPopup}/> : ""}
      </div>

      <div>
        {audioContent}
      </div>
      
    </div>
  );
}

export default SideBar;