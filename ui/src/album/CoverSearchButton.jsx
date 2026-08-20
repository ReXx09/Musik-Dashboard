import React, { useCallback, useState } from 'react'
import {
  Button,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useNotify, useRefresh } from 'react-admin'
import config from '../config'
import { REST_URL } from '../consts'
import { httpClient } from '../dataProvider'

const useStyles = makeStyles((theme) => ({
  button: { marginTop: theme.spacing(1) },
  image: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    cursor: 'pointer',
    borderRadius: theme.shape.borderRadius,
  },
  choice: { cursor: 'pointer' },
}))

const CoverSearchButton = ({ record }) => {
  const classes = useStyles()
  const notify = useNotify()
  const refresh = useRefresh()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState([])

  const search = useCallback(async () => {
    if (!record.mbzAlbumId) {
      notify('Für dieses Album ist keine MusicBrainz-ID vorhanden.', 'warning')
      return
    }

    setOpen(true)
    setLoading(true)
    try {
      const response = await fetch(
        `https://coverartarchive.org/release/${record.mbzAlbumId}`,
      )
      if (!response.ok) throw new Error('Cover nicht gefunden')
      const data = await response.json()
      const foundImages = (data.images || []).filter((image) => image.image)
      setImages(foundImages)
      if (!foundImages.length) notify('Keine Cover gefunden.', 'warning')
    } catch (error) {
      setImages([])
      notify('Cover-Suche fehlgeschlagen.', 'warning')
    } finally {
      setLoading(false)
    }
  }, [notify, record.mbzAlbumId])

  const saveCover = useCallback(
    async (image) => {
      setSaving(true)
      try {
        const response = await fetch(image.image)
        if (!response.ok) throw new Error('Bild konnte nicht geladen werden')
        const blob = await response.blob()
        const formData = new FormData()
        formData.append('image', blob, `cover.${blob.type.split('/')[1] || 'jpg'}`)
        await httpClient(`${REST_URL}/album/${record.id}/image`, {
          method: 'POST',
          headers: new Headers({}),
          body: formData,
        })
        notify('Cover übernommen.', 'success')
        setOpen(false)
        refresh()
      } catch (error) {
        notify('Cover konnte nicht übernommen werden.', 'warning')
      } finally {
        setSaving(false)
      }
    },
    [notify, record.id, refresh],
  )

  if (!config.enableArtworkUpload && localStorage.getItem('role') !== 'admin') {
    return null
  }

  return (
    <>
      <Button
        className={classes.button}
        startIcon={<SearchIcon />}
        onClick={search}
        size="small"
        variant="outlined"
      >
        Cover suchen
      </Button>
      <Dialog open={open} onClose={() => !saving && setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Cover auswählen</DialogTitle>
        <DialogContent>
          {loading && <CircularProgress />}
          {!loading && !images.length && (
            <Typography color="textSecondary">Keine Cover gefunden.</Typography>
          )}
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={`${image.image}-${index}`}>
                <CardMedia
                  className={classes.image}
                  component="img"
                  image={image.thumbnails?.['500'] || image.image}
                  alt={`Cover ${index + 1}`}
                  onClick={() => !saving && saveCover(image)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>Abbrechen</Button>
          {saving && <CircularProgress size={20} />}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CoverSearchButton
