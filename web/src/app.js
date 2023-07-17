import { useState } from 'react'
import { Box, Loader, MantineProvider } from '@mantine/core'
import Topbar from './topbar'
import Sidebar from './sidebar'
import NGL from './ngl'
import api from './api'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [ngldata, setNGLData] = useState()
  const [folder, setFolder] = useState({
    path: undefined,
    list: undefined,
  })

  const fetch = (url, data, callback) => {
    setLoading(true)
    api
      .post(url, data)
      .then((data) => callback(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }

  return (
    <MantineProvider
      withNormalizeCSS={true}
      withGlobalStyles={true}
      theme={{
        colorScheme: 'dark',
        defaultRadius: 3,
        lineHeight: 1,
        components: {
          Button: { defaultProps: { fw: 400 } },
        },
      }}
    >
      <Box className='container'>
        {loading && (
          <Box className='loading'>
            <Loader size='sm' />
          </Box>
        )}
        <Topbar
          onLoad={(folder) => {
            fetch('/list', { folder }, (data) => {
              setFolder({ path: folder, list: data })
            })
          }}
        />
        <Box className='main'>
          <NGL data={ngldata} />
          <Sidebar
            files={folder.list}
            onSelected={(filename) => {
              fetch('/read', { folder: folder.path, filename }, (data) => {
                setNGLData(data)
              })
            }}
          />
        </Box>
      </Box>
    </MantineProvider>
  )
}
