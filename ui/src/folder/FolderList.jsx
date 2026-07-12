import React from 'react'
import {
  BooleanField,
  Datagrid,
  DateField,
  NumberField,
  TextField,
} from 'react-admin'
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined'
import { List, useResourceRefresh } from '../common'

const FolderList = (props) => {
  useResourceRefresh('folder')

  return (
    <List
      {...props}
      exporter={false}
      sort={{ field: 'name', order: 'ASC' }}
      bulkActionButtons={false}
    >
      <Datagrid rowClick={false}>
        <TextField source="name" />
        <TextField source="path" />
        <NumberField source="library_id" />
        <NumberField source="num_audio_files" />
        <NumberField source="num_playlists" />
        <BooleanField source="missing" />
        <DateField source="updated_at" />
        <DateField source="created_at" />
      </Datagrid>
    </List>
  )
}

export default {
  list: FolderList,
  icon: FolderOutlinedIcon,
}
