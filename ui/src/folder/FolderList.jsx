import React from 'react'
import {
  BooleanField,
  Datagrid,
  DateField,
  NumberField,
  ReferenceField,
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
        <ReferenceField source="library_id" reference="library" link={false}>
          <TextField source="name" />
        </ReferenceField>
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
