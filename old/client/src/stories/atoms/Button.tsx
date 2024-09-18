import React, {useMemo} from 'react'
import {ThemeProvider} from 'emotion-theming'
import {Button as MuiButton, ButtonProps as MuiButtonProps} from '@mui/material'
import {theme} from '../theme'

interface ButtonProps {
  mode?: 'primary' | 'secondary'
  children: string
}

export const Button = ({
  mode,
  children,
  ...props
}: ButtonProps) => {

  const variantValue: MuiButtonProps['variant'] = useMemo(() => {
    switch (mode) {
      case 'primary': return 'contained'
      case 'secondary': return 'outlined'
    }
  }, [mode])

  return (
    <ThemeProvider theme={theme}>
      <MuiButton
        variant={variantValue}
        color={mode}
        {...props}
      >
        {children}
      </MuiButton>
    </ThemeProvider>
  )
}