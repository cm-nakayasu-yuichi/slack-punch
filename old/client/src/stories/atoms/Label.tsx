import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { color as appColor } from '../theme'

interface LabelProps {
  children: readonly React.ReactNode[] | string
  weight?: 'regular' | 'bold'
  size?: 'extra-large' | 'medium' | 'small' | 'extra-small'
  color?: 'regular' | 'light'
}

export const Label = ({
  children = 'あのイーハトーヴォのすきとおった風',
  weight = 'regular',
  size = 'medium',
  color = 'regular',
  ...props
}: LabelProps) => {
  const fontWeight = useMemo(() => {
    switch (weight) {
      case 'regular':
        return 400
      case 'bold':
        return 700
    }
  }, [weight])

  let fontSize = useMemo(() => {
    switch (size) {
      case 'extra-large':
        return 18
      case 'medium':
        return 14
      case 'small':
        return 12
      case 'extra-small':
        return 11
    }
  }, [size])

  let fontColor = useMemo(() => {
    switch (color) {
      case 'regular':
        return appColor.black[1]
      case 'light':
        return appColor.black[2]
    }
  }, [color])

  return (
    <Typography
      {...props}
      sx={{
        color: fontColor,
        fontSize: fontSize,
        fontWeight: fontWeight,
      }}
    >
      {children}
    </Typography>
  )
}
