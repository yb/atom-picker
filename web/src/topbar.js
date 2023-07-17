import { useRef } from 'react'
import { Box, Button, Input, Text } from '@mantine/core'

export default function Topbar({ onLoad }) {
  const ref = useRef()
  return (
    <Box className='top'>
      <Text className='logo'>AtomPicker</Text>
      <Input
        ref={ref}
        className='input'
        size='xs'
        placeholder='Enter the folder path on the server'
      />
      <Button
        size='xs'
        children='Load'
        onClick={() => {
          if (ref.current.value) {
            onLoad(ref.current.value)
          }
        }}
      />
    </Box>
  )
}
