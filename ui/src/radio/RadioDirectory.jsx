import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import StarIcon from '@material-ui/icons/Star'
import SearchIcon from '@material-ui/icons/Search'
import { useDispatch } from 'react-redux'
import { setTrack } from '../actions'
import { songFromRadio } from './helper'
import { RADIO_PLACEHOLDER_IMAGE } from '../consts'

const API_URL = 'https://de1.api.radio-browser.info/json/stations/search'
const FAVORITES_KEY = 'navidrome-radio-favorites'

const useStyles = makeStyles((theme) => ({
  root: { marginBottom: theme.spacing(3) },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    padding: theme.spacing(0, 1),
    flex: '1 1 240px',
    minWidth: 180,
  },
  searchInput: { flex: 1, padding: theme.spacing(0.75) },
  card: {
    height: '100%',
    width: '80%',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: { width: 56, height: 56, margin: theme.spacing(1.5) },
  cardContent: { flex: 1, minWidth: 0, paddingLeft: 0 },
  stationName: { fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  stationMeta: { color: theme.palette.text.secondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  favoriteButton: { color: theme.palette.warning.main },
}))

const RadioDirectory = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('DE')
  const [stations, setStations] = useState([])
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [showFavorites, setShowFavorites] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      limit: '12',
      order: 'clickcount',
      reverse: 'true',
      hidebroken: 'true',
      countrycode: country,
      ...(query.trim() ? { name: query.trim() } : {}),
    })

    setLoading(true)
    setError(false)
    fetch(`${API_URL}?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Radio directory unavailable')
        return response.json()
      })
      .then(setStations)
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(true)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [country, query])

  const playStation = async (station) => {
    const radio = {
      id: station.stationuuid,
      name: station.name,
      streamUrl: station.url_resolved || station.url,
      homePageUrl: station.homepage,
      favicon: station.favicon,
    }
    dispatch(setTrack(await songFromRadio(radio)))
  }

  const toggleFavorite = (station) => {
    const isFavorite = favorites.some(
      (favorite) => favorite.stationuuid === station.stationuuid,
    )
    const nextFavorites = isFavorite
      ? favorites.filter((favorite) => favorite.stationuuid !== station.stationuuid)
      : [...favorites, station]
    setFavorites(nextFavorites)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites))
  }

  const visibleStations = showFavorites ? favorites : stations

  return (
    <section className={classes.root} aria-label="Radiosender entdecken">
      <div className={classes.header}>
        <Typography variant="h6">Sender entdecken</Typography>
        <Typography color="textSecondary">Beliebte Internet-Radios</Typography>
      </div>
      <div className={classes.controls}>
        <div className={classes.search}>
          <SearchIcon color="action" fontSize="small" />
          <InputBase
            className={classes.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sender suchen"
            inputProps={{ 'aria-label': 'Sender suchen' }}
          />
        </div>
        <Select value={country} onChange={(event) => setCountry(event.target.value)} variant="outlined">
          <MenuItem value="DE">Deutschland</MenuItem>
          <MenuItem value="AT">Österreich</MenuItem>
          <MenuItem value="CH">Schweiz</MenuItem>
          <MenuItem value="US">USA</MenuItem>
        </Select>
        <Button
          variant={showFavorites ? 'contained' : 'outlined'}
          color="default"
          startIcon={<StarIcon />}
          onClick={() => setShowFavorites((value) => !value)}
        >
          Favoriten ({favorites.length})
        </Button>
      </div>
      {loading && <CircularProgress size={24} />}
      {!loading && error && (
        <Typography color="textSecondary">Die Senderliste ist momentan nicht erreichbar.</Typography>
      )}
      {!loading && !error && visibleStations.length === 0 && (
        <Typography color="textSecondary">Keine Sender gefunden.</Typography>
      )}
      <Grid container spacing={2}>
        {visibleStations.map((station) => (
          <Grid item xs={12} sm={6} md={4} key={station.stationuuid}>
            <Card className={classes.card} elevation={1}>
              <Avatar className={classes.avatar} src={station.favicon || RADIO_PLACEHOLDER_IMAGE} variant="rounded" />
              <CardContent className={classes.cardContent}>
                <Typography className={classes.stationName}>{station.name}</Typography>
                <Typography className={classes.stationMeta} variant="body2">
                  {station.tags || station.country || 'Internet-Radio'}
                </Typography>
              </CardContent>
              <IconButton
                className={classes.favoriteButton}
                aria-label={
                  favorites.some((favorite) => favorite.stationuuid === station.stationuuid)
                    ? `Favorit entfernen: ${station.name}`
                    : `Als Favorit speichern: ${station.name}`
                }
                onClick={() => toggleFavorite(station)}
              >
                {favorites.some((favorite) => favorite.stationuuid === station.stationuuid) ? (
                  <StarIcon />
                ) : (
                  <StarBorderIcon />
                )}
              </IconButton>
              <IconButton aria-label={`Abspielen: ${station.name}`} onClick={() => playStation(station)}>
                <PlayArrowIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  )
}

export default RadioDirectory
