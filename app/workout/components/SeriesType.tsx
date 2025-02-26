import React, { useState } from 'react'
import { View } from 'react-native'
import { Dropdown } from 'react-native-paper-dropdown'

const OPTIONS = [
  { label: 'Lineal', value: 'lineal' },
  { label: 'Drop Set', value: 'drop_set' },
  { label: 'Super Set', value: 'super_set' },
  { label: 'Rest Pause', value: 'rest_pause' },
  { label: 'SST', value: 'sst' },
  { label: 'Top Set + Back Off', value: 'top_set_back_off' }
]

interface SeriesTypeProps {
  seriesType: string
  setSeriesType: (seriesType: string) => void
}

export const SeriesType = ({ seriesType, setSeriesType }: SeriesTypeProps) => {
  return (
    <View>
      <Dropdown
        label={seriesType ? '' : 'Series Type'}
        placeholder="Series Type"
        mode="outlined"
        options={OPTIONS}
        value={seriesType}
        onSelect={setSeriesType}
        hideMenuHeader
        statusBarHeight={0}
      />
    </View>
  )
}
