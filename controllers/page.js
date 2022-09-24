const fetch = require("node-fetch")

exports.login = (req, res) => {
  res.render('login')
}

exports.adminDashboard = async(req, res) => {
  const resp = await fetch('http://localhost:8989/room')
  const data = await resp.json()

  res.render('adminDashboard', {room: data})
}