import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { BackendContext } from '../util/api';
import { PlaylistDetail, Song } from '../util/api/types';
import Box from '@material-ui/core/Box';
import MusicContext from '../util/contexts/music/MusicContext';
import axios from 'axios';

interface BeatProps {
  setAudioGlobal: any,
}

interface AudioObject {
  name: string
  // instrumentList: string[],
  id: string,
  imageUrl: string,
}

const useStyles = makeStyles(() => ({
  componentContainer: {
    color: 'white',
  },
  header: {
    alignItems: 'left',
    paddingLeft: '20px',
    margin: 0,
  },
  scroll: {
    overflow: 'auto',
    whiteSpace: 'nowrap',
  },
  card: {
    borderRadius: '10px',
    display: 'inline-block',
    textAlign: 'center',
    margin: '20px',
    position: 'relative',
    cursor: 'pointer'
  },
  background: {
    backgroundRepeat: 'no-repeat',
    width: '200px',
    height: '150px',
    opacity: 0.4,
  },
  cardContent: {
    width: '100%',
    height: '100%',
  },
  songType: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    width: '100%',
    position: 'absolute',
    left: 0,
    top: '50%',
    fontSize: '13px'
  },
  beatContainer: {
    position: 'absolute',
    margin: 0,
    padding: 0,
    bottom: 0
  },
  sampleInstrument: {
    borderRadius: '5px',
    padding: '2px',
    backgroundColor: 'grey',
    margin: '5px',
    opacity: 0.7,
    fontSize: '10px'
  },
}));

const Beat: React.FC<BeatProps> = ({...props}) => {
  const api = React.useContext(BackendContext);
  const musicProvider = React.useContext(MusicContext);

  const classes = useStyles();
  const [songs, setSongs] = useState([] as Song[]);
  const [loading, setLoading] = useState(true);

  const [beats, setBeats] = useState([] as AudioObject[]);
  const beatArray = [] as AudioObject[];
  let userEmail = localStorage.getItem('userEmail');
  const url = "https://brain-beats-server-docker.azurewebsites.net/";

  // testing purpose
  let id = '12';
  let playlistId = '1';

  useEffect(() => {
    if (loading) {
      api.demoGetPlaylist(playlistId).then(async (res: PlaylistDetail) => {

        let songsList = [] as Song[];
        res.songList.forEach(async (songId) => {
          await api.demoGetSong(songId).then((song) => {
            songsList.push(song);
          });
        });

        setSongs(songsList);
      })
      .then(() => {
        setLoading(false);
      })
      .catch(err => console.log(err));
    }
  }, []);

  const loadData = async () => {
    // console.log(`userEmail : ${userEmail}`);
    // console.log('testing');
    let beatResponse = await axios.post(url + 'api/user/get_owned_beats', {
        email: userEmail
    });

    console.log(beatResponse.data);
    // let userResponse = await axios.post(url + 'api/user/read_user', {
    //   email: userEmail
    // });

    // console.log(userResponse);

    beatResponse.data.forEach((item: any) => {
      console.log(item);

      // const instrumentListArray = [] as String[];

      // item.properties['instrumentList']

      const newBeat = 
      {
        "id": item.id,
        "imageUrl": item.properties['image'][0]['value'],
        "name": item.properties['name'][0]['value'],
        // "instrumentList": instrumentListArray
      };
      
      beatArray.push(newBeat);
    });
    setBeats(beatArray);
  }

  useEffect(() => {
    const getData = async () => {
      await loadData();
    };
    getData();
  }, []);

  const playBeat = (id:string) => {
    props.setAudioGlobal(id);
    musicProvider.setId(id);
    console.log(musicProvider.getCurrentId());

    console.log(beats);
  };

  if (loading) return (<div>loading...</div>);

  return (
    <div className={classes.componentContainer}>
      <div className={classes.header}>
        <div>
          <span style={{marginRight: 10}}>My Beats</span>
          <input type="text" placeholder="Search.."></input>
        </div>
        <hr></hr>
      </div>
      <div className={classes.scroll}>
        {beats.map((beat, key) => {
          return (
            // Todo: change playbeat(id) to playbeat(song.id)
            <div className={classes.card} key={key} onClick={() => playBeat(beat.id)}>
              <img alt='Song' className={classes.background} src={beat.imageUrl}></img>
              <div className={classes.cardContent}>
                <div className={classes.songType}>
                  {/* Vibing, Not a Phone in Sight */}
                  {beat.name}
                </div>
                <Box className={classes.beatContainer}
                  display="flex"
                  flexWrap="wrap"
                  alignContent="flex-start"
                  p={1}
                  m={1}
                >
                  {/* {instrumentList} */}
                  <Box className={classes.sampleInstrument} p={1}>
                    Clap
                  </Box>
                  <Box className={classes.sampleInstrument} p={1}>
                    Saxophone
                  </Box>
                  <Box className={classes.sampleInstrument} p={1}>
                    Heavy Gutar
                  </Box>
                  <Box className={classes.sampleInstrument} p={1}>
                    Drums
                  </Box>
                  <Box className={classes.sampleInstrument} p={1}>
                    Snare
                  </Box>
                </Box>
                  </div>
              </div>
          )
        })}
      </div>
    </div>
  )
};

export default Beat;
