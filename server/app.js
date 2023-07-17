#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const helpers = require('yargs/helpers')
const yargs = require('yargs/yargs')
const express = require('express')

// Create server instance
const app = express()
const arg = yargs(helpers.hideBin(process.argv)).argv
const port = arg.port || 3000

// Use middleware
app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'html')))

// Read matching files in a directory
app.post('/api/list', (req, res) => {
  const files = glob.sync('*.{pdb,mol2}', { cwd: req.body.folder })
  res.json(files.sort())
})

// Read file data
app.post('/api/read', (req, res) => {
  const filepath = path.join(req.body.folder, req.body.filename)
  const data = fs.readFileSync(filepath, { encoding: 'utf8' })
  res.json({
    name: req.body.filename,
    mol: arg.mol,
    ext: path.extname(filepath).substring(1),
    raw: data,
  })
})

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.message)
})

// Start
app.listen(port, () => {
  console.log(`Welcome to ${chalk.yellow('Atom Picker')}`)
  console.log(chalk.cyan(`Ready on http://localhost:${port}`))
})
