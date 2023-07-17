import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Code, Text } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { Shape, Stage } from 'ngl'
import copy from 'copy-to-clipboard'

export default function NGL({ data }) {
  const ngl = useRef()
  const stage = useRef()
  const size = useViewportSize()

  // picked state
  const [picked, setPicked] = useState(new Map())

  // picked atoms
  const atoms = useMemo(() => {
    const atoms = Array.from(picked.values())
    return {
      count: atoms.length,
      content: atoms
        .map((atom) => `:${atom.resno}@${atom.atomname}`)
        .join('\n'),
    }
  }, [picked])

  // on atom picking
  const picking = (_, pick) => {
    console.log(pick)
    if (pick?.atom) {
      setPicked((state) => {
        const picked = new Map(state)
        if (picked.has(pick.atom.index)) picked.delete(pick.atom.index)
        else picked.set(pick.atom.index, pick.atom)
        return picked
      })
    }
    if (pick?.object?.shape?.name === 'picked') {
      setPicked((state) => {
        const picked = new Map(state)
        picked.delete(pick.component.parameters.atom.index)
        return picked
      })
    }
  }

  // create stage
  useEffect(() => {
    if (ngl.current && !stage.current) {
      stage.current = new Stage(ngl.current, { backgroundColor: '#1A1B1E' })
      stage.current.mouseControls.remove('clickPick-left')
      stage.current.mouseControls.add('clickPick-left', picking)
    }
  }, [ngl.current])

  // window resize
  useEffect(() => {
    if (stage.current) stage.current.handleResize()
  }, [size])

  // load file
  useEffect(() => {
    if (data && stage.current) {
      const blob = new Blob([data.raw], { type: 'text/plain' })
      stage.current.removeAllComponents()
      stage.current.loadFile(blob, { ext: data.ext }).then((o) => {
        o.addRepresentation('cartoon', { sele: 'protein' })
        o.addRepresentation('ball+stick', {
          sele: 'not ( protein or water )',
          colorScheme: 'element',
          multipleBond: 'symmetric',
          scale: 1.2,
        })
        const sele = data.mol ?? 'not ( protein or water )'
        const pos = o.getCenter(sele)
        o.autoView(pos.x === 0 && pos.y === 0 && pos.z === 0 ? undefined : sele)
      })
      setPicked(new Map())
    }
  }, [data])

  // updata picked atom
  useEffect(() => {
    if (stage.current) {
      for (const comp of stage.current.getComponentsByName('picked').list) {
        stage.current.removeComponent(comp)
      }
      for (const atom of Array.from(picked.values())) {
        const ball = new Shape('picked')
        const position = [atom.x, atom.y, atom.z]
        const color = [0.984, 0.776, 0.184]
        ball.addSphere(position, color, 0.5, atom.qualifiedName())
        stage.current
          .addComponentFromObject(ball, { atom })
          .addRepresentation('buffer', { opacity: 0.6 })
      }
    }
  }, [picked])

  // render
  return (
    <Box className='ngl'>
      <Box ref={ngl} w='100%' h='100%' />
      {atoms.count > 0 && (
        <Box className='picked'>
          <Text
            children={`Picked ${atoms.count} atoms:`}
            c='dimmed'
            size='xs'
          />
          <Code
            children={atoms.content}
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.5,
            }}
          />
          <Button
            children='Copy'
            color='gray'
            size='xs'
            compact={true}
            uppercase={true}
            onClick={() => {
              copy(atoms.content, { format: 'text/plain' })
            }}
          />
        </Box>
      )}
    </Box>
  )
}
