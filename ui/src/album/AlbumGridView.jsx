import React from 'react'
import {
  GridList,
  GridListTile,
  Typography,
  IconButton,
  useMediaQuery,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { Link } from 'react-router-dom'
import { linkToRecord, useListContext, Loading } from 'react-admin'
import { withContentRect } from 'react-measure'
import { useDrag } from 'react-dnd'
import subsonic from '../subsonic'
import { FaPlay } from 'react-icons/fa'
import {
  ArtistLinkField,
  OverflowTooltip,
  useImageUrl,
} from '../common'
import config from '../config'
import { DraggableTypes } from '../consts'
import clsx from 'clsx'
import { AlbumDatesField } from './AlbumDatesField.jsx'

const useStyles = makeStyles(
  (theme) => ({
    root: {
      margin: '20px',
      display: 'grid',
    },
    albumArtistName: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
      fontSize: '1em',
    },
    albumName: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: theme.palette.type === 'dark' ? '#eee' : 'black',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    missingAlbum: {
      opacity: 0.3,
    },
    albumVersion: {
      fontSize: '12px',
      color: theme.palette.type === 'dark' ? '#c5c5c5' : '#696969',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    albumSubtitle: {
      fontSize: '12px',
      color: theme.palette.type === 'dark' ? '#c5c5c5' : '#696969',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    link: {
      position: 'relative',
      display: 'block',
      textDecoration: 'none',
      borderRadius: 12,
      overflow: 'hidden',
    },
    albumLink: {
      position: 'relative',
      display: 'block',
      textDecoration: 'none',
      marginTop: theme.spacing(1),
    },
    albumContainer: {
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      backgroundColor: theme.palette.type === 'dark'
        ? 'rgba(255,255,255,0.04)'
        : 'rgba(0,0,0,0.02)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[6],
        '& $floatingPlayButton': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
    },
    floatingPlayButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      opacity: 0,
      transform: 'translateY(8px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'translateY(0) scale(1.1)',
      },
      width: 44,
      height: 44,
      zIndex: 2,
    },
    playIcon: {
      fontSize: 18,
      marginLeft: 2,
    },
    albumPlayButton: { color: 'white' },
  }),
  { name: 'NDAlbumGridView' },
)

const useCoverStyles = makeStyles({
  coverContainer: {
    width: '100%',
    aspectRatio: '1',
    overflow: 'hidden',
  },
  cover: {
    display: 'inline-block',
    width: '100%',
    objectFit: 'contain',
    height: (props) => props.height,
    transition: 'opacity 0.3s ease-in-out',
  },
  coverLoading: {
    opacity: 0,
  },
})

const getColsForWidth = (width) => {
  if (width === 'xs') return 2
  if (width === 'sm') return 3
  if (width === 'md') return 4
  if (width === 'lg') return 6
  return 9
}

const Cover = withContentRect('bounds')(({
  record,
  measureRef,
  contentRect,
}) => {
  // Force height to be the same as the width determined by the GridList
  // noinspection JSSuspiciousNameCombination
  const classes = useCoverStyles({ height: contentRect.bounds.width })
  const [, dragAlbumRef] = useDrag(
    () => ({
      type: DraggableTypes.ALBUM,
      item: { albumIds: [record.id] },
      options: { dropEffect: 'copy' },
    }),
    [record],
  )

  const url = subsonic.getCoverArtUrl(record, config.uiCoverArtSize, true)
  const { imgUrl, loading: imageLoading } = useImageUrl(url)

  return (
    <div ref={measureRef} className={classes.coverContainer}>
      <div ref={dragAlbumRef}>
        <img
          src={imgUrl || undefined}
          alt={record.name}
          className={`${classes.cover} ${imageLoading ? classes.coverLoading : ''}`}
        />
      </div>
    </div>
  )
})

const AlbumGridTile = ({ showArtist, record, basePath, ...props }) => {
  const classes = useStyles()
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'), {
    noSsr: true,
  })
  if (!record) {
    return null
  }
  const computedClasses = clsx(
    classes.albumContainer,
    record.missing && classes.missingAlbum,
  )

  const handlePlay = (e) => {
    e.preventDefault()
    e.stopPropagation()
    subsonic.play(record.id, 'album')
  }

  return (
    <div className={computedClasses}>
      <Link
        className={classes.link}
        to={linkToRecord(basePath, record.id, 'show')}
      >
        <Cover record={record} />
        {isDesktop && (
          <IconButton
            className={classes.floatingPlayButton}
            onClick={handlePlay}
            size="small"
          >
            <FaPlay className={classes.playIcon} />
          </IconButton>
        )}
      </Link>
      <Link
        className={classes.albumLink}
        to={linkToRecord(basePath, record.id, 'show')}
      >
        <span>
          <OverflowTooltip title={record.name}>
            <Typography className={classes.albumName}>{record.name}</Typography>
          </OverflowTooltip>
          {record.tags && record.tags['albumversion'] && (
            <Typography className={classes.albumVersion}>
              {record.tags['albumversion']}
            </Typography>
          )}
        </span>
      </Link>
      {showArtist ? (
        <ArtistLinkField record={record} className={classes.albumSubtitle} />
      ) : (
        <AlbumDatesField record={record} className={classes.albumSubtitle} />
      )}
    </div>
  )
}

const LoadedAlbumGrid = ({ ids, data, basePath, width }) => {
  const classes = useStyles()
  const { filterValues } = useListContext()
  const isArtistView = !!(filterValues && filterValues.artist_id)
  return (
    <div className={classes.root}>
      <GridList
        component={'div'}
        cellHeight={'auto'}
        cols={getColsForWidth(width)}
        spacing={20}
      >
        {ids.map((id) => (
          <GridListTile className={classes.gridListTile} key={id}>
            <AlbumGridTile
              record={data[id]}
              basePath={basePath}
              showArtist={!isArtistView}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}

const AlbumGridView = ({ albumListType, loaded, loading, ...props }) => {
  const hide =
    (loading && albumListType === 'random') || !props.data || !props.ids
  return hide ? <Loading /> : <LoadedAlbumGrid {...props} />
}

const AlbumGridViewWithWidth = withWidth()(AlbumGridView)

export default AlbumGridViewWithWidth
