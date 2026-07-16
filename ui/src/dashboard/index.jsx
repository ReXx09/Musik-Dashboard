import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useDataProvider, useTranslate, Loading } from 'react-admin'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'
import {
  FaMusic,
  FaCompactDisc,
  FaMicrophoneAlt,
  FaPlay,
  FaStar,
  FaClock,
} from 'react-icons/fa'
import subsonic from '../subsonic'
import config from '../config'
import { useImageUrl } from '../common'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    maxWidth: 1600,
    margin: '0 auto',
  },

  // Header
  header: {
    marginBottom: theme.spacing(5),
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    marginTop: theme.spacing(0.5),
  },

  // Now Playing
  nowPlayingCard: {
    borderRadius: 20,
    background: 'linear-gradient(135deg, #7C5CFC 0%, #5A3FD6 100%)',
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(4),
    color: '#fff',
    boxShadow: '0 8px 32px rgba(124,92,252,0.3)',
  },
  nowPlayingCover: {
    width: 100,
    height: 100,
    borderRadius: 12,
    objectFit: 'cover',
    flexShrink: 0,
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  nowPlayingInfo: {
    flex: 1,
    minWidth: 0,
  },
  nowPlayingTitle: {
    fontWeight: 700,
    fontSize: '1.2rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  nowPlayingArtist: {
    fontSize: '0.9rem',
    opacity: 0.85,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  nowPlayingLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    opacity: 0.8,
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  // Stat Cards
  statsGrid: {
    marginBottom: theme.spacing(5),
  },
  statCard: {
    borderRadius: 20,
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: theme.shadows[12],
    },
  },
  statContent: {
    padding: theme.spacing(3.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2.5),
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    flexShrink: 0,
  },
  statIconAlbums: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  statIconArtists: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#fff',
  },
  statIconSongs: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#fff',
  },
  statIconAvg: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: '#fff',
  },
  statNumber: {
    fontSize: '2.2rem',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    fontWeight: 600,
    marginTop: 2,
  },

  // Section Headers
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2.5),
    marginTop: theme.spacing(4),
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    letterSpacing: '-0.01em',
  },
  sectionLink: {
    fontSize: '0.85rem',
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  // Album Cards
  albumGrid: {
    marginBottom: theme.spacing(2),
  },
  albumCard: {
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    backgroundColor: theme.palette.type === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.02)',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: theme.shadows[10],
      '& $albumPlayOverlay': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  albumCover: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    backgroundColor: theme.palette.action.hover,
  },
  albumCoverImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  albumPlayOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    opacity: 0,
    transform: 'translateY(10px)',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
  },
  albumPlayButton: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'scale(1.1)',
    },
    width: 48,
    height: 48,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  albumPlayIcon: {
    fontSize: 20,
    marginLeft: 2,
  },
  albumInfo: {
    padding: theme.spacing(2),
  },
  albumName: {
    fontWeight: 700,
    fontSize: '0.95rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  albumArtist: {
    fontSize: '0.82rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8, 4),
    color: theme.palette.text.secondary,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing(2),
    opacity: 0.3,
  },
  emptyText: {
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  emptySubtext: {
    fontSize: '0.9rem',
    opacity: 0.7,
  },
}))

const Dashboard = () => {
  const classes = useStyles()
  const translate = useTranslate()
  const dataProvider = useDataProvider()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const playerState = useSelector((state) => state.player)
  const currentTrack = playerState?.current

  const [stats, setStats] = useState(null)
  const [recentAlbums, setRecentAlbums] = useState([])
  const [topRatedAlbums, setTopRatedAlbums] = useState([])
  const [hasData, setHasData] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        let totalAlbums = 0
        let totalArtists = 0
        let totalSongs = 0

        try {
          const insights = await dataProvider.getList('insights', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
          })
          insights?.data?.forEach((item) => {
            if (item.id === 'totalAlbums') totalAlbums = item.value
            else if (item.id === 'totalArtists') totalArtists = item.value
            else if (item.id === 'totalSongs') totalSongs = item.value
          })
        } catch (e) {
          try {
            const [albums, artists, songs] = await Promise.all([
              dataProvider.getList('album', {
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'name', order: 'ASC' },
                filter: {},
              }),
              dataProvider.getList('artist', {
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'name', order: 'ASC' },
                filter: {},
              }),
              dataProvider.getList('song', {
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'title', order: 'ASC' },
                filter: {},
              }),
            ])
            totalAlbums = albums?.total || 0
            totalArtists = artists?.total || 0
            totalSongs = songs?.total || 0
          } catch (e2) {
            // ignore
          }
        }

        setHasData(totalAlbums > 0)
        setStats({
          albums: totalAlbums,
          artists: totalArtists,
          songs: totalSongs,
        })

        if (totalAlbums > 0) {
          try {
            const recent = await dataProvider.getList('album', {
              pagination: { page: 1, perPage: 8 },
              sort: { field: 'created_at', order: 'DESC' },
              filter: {},
            })
            setRecentAlbums(recent?.data || [])
          } catch (e) {
            // ignore
          }

          if (config.enableStarRating) {
            try {
              const top = await dataProvider.getList('album', {
                pagination: { page: 1, perPage: 4 },
                sort: { field: 'rating', order: 'DESC' },
                filter: { has_rating: true },
              })
              setTopRatedAlbums(top?.data || [])
            } catch (e) {
              // ignore
            }
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [dataProvider])

  if (loading) {
    return <Loading />
  }

  const statColumns = isMobile ? 6 : isTablet ? 6 : 3
  const albumColumns = isMobile ? 6 : isTablet ? 4 : 3

  return (
    <div className={classes.root}>
      {/* Header */}
      <div className={classes.header}>
        <Typography className={classes.title}>
          {config.welcomeMessage || 'Musik Dashboard'}
        </Typography>
        <Typography className={classes.subtitle}>
          {translate('dashboard.subtitle', 'Deine Musikbibliothek auf einen Blick')}
        </Typography>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <Paper className={classes.nowPlayingCard} elevation={0}>
          {currentTrack.coverArt && (
            <img
              className={classes.nowPlayingCover}
              src={subsonic.getCoverArtUrl(currentTrack, 200)}
              alt={currentTrack.title}
            />
          )}
          <div className={classes.nowPlayingInfo}>
            <div className={classes.nowPlayingLabel}>
              <FaPlay size={10} /> Aktuell läuft
            </div>
            <Typography className={classes.nowPlayingTitle}>
              {currentTrack.title}
            </Typography>
            <Typography className={classes.nowPlayingArtist}>
              {currentTrack.artist}
            </Typography>
          </div>
        </Paper>
      )}

      {/* Stats */}
      {stats && (
        <Grid container spacing={3} className={classes.statsGrid}>
          <Grid item xs={statColumns}>
            <Card className={classes.statCard} elevation={3}>
              <div className={classes.statContent}>
                <div className={`${classes.statIcon} ${classes.statIconAlbums}`}>
                  <FaCompactDisc />
                </div>
                <div>
                  <Typography className={classes.statNumber}>
                    {stats.albums}
                  </Typography>
                  <Typography className={classes.statLabel}>Alben</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          <Grid item xs={statColumns}>
            <Card className={classes.statCard} elevation={3}>
              <div className={classes.statContent}>
                <div className={`${classes.statIcon} ${classes.statIconArtists}`}>
                  <FaMicrophoneAlt />
                </div>
                <div>
                  <Typography className={classes.statNumber}>
                    {stats.artists}
                  </Typography>
                  <Typography className={classes.statLabel}>Künstler</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          <Grid item xs={statColumns}>
            <Card className={classes.statCard} elevation={3}>
              <div className={classes.statContent}>
                <div className={`${classes.statIcon} ${classes.statIconSongs}`}>
                  <FaMusic />
                </div>
                <div>
                  <Typography className={classes.statNumber}>
                    {stats.songs}
                  </Typography>
                  <Typography className={classes.statLabel}>Songs</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          <Grid item xs={statColumns}>
            <Card className={classes.statCard} elevation={3}>
              <div className={classes.statContent}>
                <div className={`${classes.statIcon} ${classes.statIconAvg}`}>
                  <FaCompactDisc />
                </div>
                <div>
                  <Typography className={classes.statNumber}>
                    {stats.albums > 0
                      ? Math.round((stats.songs / stats.albums) * 10) / 10
                      : '-'}
                  </Typography>
                  <Typography className={classes.statLabel}>Songs / Album</Typography>
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Empty State */}
      {!hasData && (
        <div className={classes.emptyState}>
          <FaMusic className={classes.emptyIcon} />
          <Typography className={classes.emptyText}>
            Deine Musikbibliothek ist noch leer
          </Typography>
          <Typography className={classes.emptySubtext}>
            Lege Musikdateien in deinen Musikordner und Navidrome importiert sie automatisch
          </Typography>
        </div>
      )}

      {/* Recently Added */}
      {recentAlbums.length > 0 && (
        <>
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionTitle}>
              <FaClock /> Neu hinzugefügt
            </Typography>
            <Link to="/album/recentlyAdded" className={classes.sectionLink}>
              Alle anzeigen &rarr;
            </Link>
          </div>
          <Grid container spacing={2.5} className={classes.albumGrid}>
            {recentAlbums.slice(0, 8).map((album) => (
              <Grid item key={album.id} xs={albumColumns}>
                <AlbumCard album={album} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Top Rated */}
      {topRatedAlbums.length > 0 && (
        <>
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionTitle}>
              <FaStar /> Top bewertet
            </Typography>
            <Link to="/album/topRated" className={classes.sectionLink}>
              Alle anzeigen &rarr;
            </Link>
          </div>
          <Grid container spacing={2.5} className={classes.albumGrid}>
            {topRatedAlbums.slice(0, 4).map((album) => (
              <Grid item key={album.id} xs={albumColumns}>
                <AlbumCard album={album} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  )
}

const AlbumCard = ({ album }) => {
  const classes = useStyles()
  const coverUrl = subsonic.getCoverArtUrl(album, config.uiCoverArtSize, true)
  const { imgUrl } = useImageUrl(coverUrl)

  const handlePlay = (e) => {
    e.preventDefault()
    e.stopPropagation()
    subsonic.play(album.id, 'album')
  }

  return (
    <Card className={classes.albumCard} elevation={0}>
      <Link to={`/album/${album.id}/show`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={classes.albumCover}>
          {imgUrl && (
            <img
              src={imgUrl}
              alt={album.name}
              className={classes.albumCoverImg}
            />
          )}
          <div className={classes.albumPlayOverlay}>
            <Tooltip title="Abspielen" placement="left">
              <IconButton
                className={classes.albumPlayButton}
                onClick={handlePlay}
                size="small"
              >
                <FaPlay className={classes.albumPlayIcon} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={classes.albumInfo}>
          <Typography className={classes.albumName}>
            {album.name}
          </Typography>
          <Typography className={classes.albumArtist}>
            {album.artist}
          </Typography>
        </div>
      </Link>
    </Card>
  )
}

export default Dashboard
