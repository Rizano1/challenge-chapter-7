const { hashSync, compareSync } = require("bcrypt")
const jwt  = require('jsonwebtoken')
const { user } = require("../models")
const { room } = require("../models")
const { user_room } = require("../models")

exports.protected = (req, res) => {
  console.log(req.user)

  res.send({
    message: 'ok'
  })
}

exports.register = async (req, res) => {
  const data = await user.create({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
    role: req.body.role
  })

  res.status(201).send({
    message: 'User created successfully',
    user: {
      username: data.username,
      role: data.role
    }
  })
}

exports.login = async (req, res) => {
  // query user ke db
  const userData = await user.findOne({
    where: {
      username: req.body.username
    }
  })

  // kalau usernya ga exist, kasih response user not found
  if (!userData){
    return res.status(404).send({
      message: 'User not found'
    })
  }
  
  // kalau passwordnya salah
  // if( hashSync(req.body.password) !== userData.password ){
  if( !compareSync(req.body.password, userData.password) ){
    return res.status(401).send({
      message: 'Incorrect Password'
    })
  }

  const payload = {
    username: userData.username,
    role: userData.role
  }

  const token = jwt.sign(payload, "supersecretkey", { expiresIn: '1d' });

  res.send({
    message: 'Login Success',
    token: `Bearer ${token}`,
    user: payload
  })
}

exports.room = async(req, res) => {
  const data = await room.create({
    name: req.body.name
  })

  res.status(201).send({
    message: 'room created successfully',
    user: {
     name: data.name
    }
  })
}

exports.getRoom = async(req, res) => {
  const data = await room.findAll()
  res.send(data)
}

exports.chooseRoom = async(req, res) => {
  const resp = await user_room.findAll({
    where: {
      roomId: req.body.roomId
    }
  })

  if(resp.length >= 2 || resp[0].userId == req.user.id){
    res.send('cannot choose room')
  }else{
    const data = await user_room.create({
      userId: req.user.id,
      roomId: req.body.roomId
    })
  
    res.status(201).send({
      message: 'room choosed successfully',
      user: {
       userId: data.userId,
       roomId: data.roomId
      }
    })
  }
}