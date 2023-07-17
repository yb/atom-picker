import { useState } from 'react'
import { Box, ScrollArea, Text } from '@mantine/core'
import clsx from 'clsx'

export default function Sidebar({ files, onSelected }) {
  const [selected, setSelected] = useState()
  return (
    <Box className='sidebar'>
      <ScrollArea h='100%' scrollbarSize={8} scrollHideDelay={0}>
        {files === undefined && (
          <Box className='empty'>
            <Text size='xs' children='Please load folder first' />
          </Box>
        )}
        {files?.length === 0 && (
          <Box className='empty'>
            <Text size='xs' children='No files with extension .pdb or .mol2' />
          </Box>
        )}
        {files?.length > 0 &&
          files.map((item) => (
            <Box
              key={item}
              className={clsx('item', item === selected && 'selected')}
              onClick={() => {
                setSelected(item)
                onSelected(item)
              }}
            >
              <Text size='xs' children={item} />
            </Box>
          ))}
      </ScrollArea>
    </Box>
  )
}
