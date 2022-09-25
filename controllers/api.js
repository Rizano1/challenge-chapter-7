const { hashSync, compareSync } = require("bcrypt")
const jwt  = require('jsonwebtoken')
const { where } = require("sequelize")
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

  if(resp.length >= 2){
    res.send('room full')

  }else if(resp.length > 0 && resp[0].userId == req.user.id){
    res.send('already choose this room')
  }else{
    const data = await user_room.create({
      userId: req.user.id,
      roomId: req.body.roomId
    })

    res.status(201).send({
      message: 'choosed successfully',
      user: {
       userId: data.userId,
       roomId: data.roomId
      }
    })
  }


}

exports.chooseHand = async(req, res) => {
  const roomData = await room.findOne({
    where: {id: req.body.roomId},
    include: {model: user}
  })

  const resp = await user_room.findAll({
    where: {
      roomId: req.body.roomId
    },
    include
  })

  console.log(roomData)


  if(roomData.player_1_1 != null && roomData.player_1_2 != null && roomData.player_1_3 != null){
    roomData.player_2_1 = req.body.firstChoice
    roomData.player_2_2 = req.body.secondChoice
    roomData.player_2_3 = req.body.thirdChoice

  }else{
    roomData.player_1_1 = req.body.firstChoice
    roomData.player_1_2 = req.body.secondChoice
    roomData.player_1_3 = req.body.thirdChoice
  }

  roomData.save()

  if(roomData.player_2_1 != null && roomData.player_2_2 != null && roomData.player_2_3 != null){
    let player1Result = 0
    let player2Result = 0
    const player1 = [roomData.player_1_1, roomData.player_1_2, roomData.player_1_3]
    const player2 = [roomData.player_2_1, roomData.player_2_2, roomData.player_2_3]

    for(i = 0; i < 3; i++){
      if (player1[i] == player2[i]){
        player1Result++
        player2Result++
      } else if (player2[i] == 'gunting' && player1[i] == 'batu'){
        player1Result++
      } else if (player2[i] == 'gunting' && player1[i] == 'kertas'){
        player2Result++
      } else if (player2[i] == 'batu' && player1[i] == 'kertas'){
        player1Result++
      } else if (player2[i] == 'batu' && player1[i] == 'guting'){
        player2Result++
      } else if (player2[i] == 'kertas' && player1[i] == 'gunting'){
        player1Result++
      } else {
        player2Result++
      }
    }
 
   if (player1Result == player2Result){
    roomData.result = 'DRAW'
   }else if (player1Result < player2Result){
    roomData.result = `${req.user.username} WIN`
   }else if (player1Result > player2Result){
    roomData.result = `${req.user.username} LOSE`
   }

  }
  
  roomData.save()

  res.send(roomData.result)
}