'use strict';

const fs = require('fs');

const express = require('express');
const thmclrx = require('thmclrx');

const router = express.Router();

router.get('/', (req, resp) => {
  resp.render('index');
});

router.post('/extract', (req, resp) => {
  const { file } = req?.files;
  if (!file) {
    resp.status(400).send({
      status: 400,
      message: 'No file uploaded',
    });
    return;
  }

  const maxColorCount = parseInt(req.body['max-color-count']);
  if (isNaN(maxColorCount) || maxColorCount < 1 || maxColorCount > 256) {
    fs.promises.rm(file.path);
    resp.status(400).send({
      status: 400,
      message: 'Invalid max color count',
    });
    return;
  }

  thmclrx.octree(file.path, maxColorCount, (err, colors) => {
    fs.promises.rm(file.path);
    if (err) {
      resp.status(500).send({
        status: 500,
        message: err.message,
      });
      return;
    }

    resp.status(200).send({
      status: 200,
      colors,
    });
  });
});

module.exports = router;
