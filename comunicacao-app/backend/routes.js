let router = require('express').Router();
var controller = require('./controller');

// Set default API response
router.get('/', (req, res) => {
  res.json({ API: 'online', gateway: res.ip });
});

router.get('/getData', controller.findData);

router.post('/postData', controller.update);

router.get('/send', (req, res) => {
  res.io.emit('test', {
    msg : "tessste"
  });

  res.json({ teste : "ok"})
});

module.exports = router;