const validateLogin = () => {
    const data = localStorage.getItem('token-login')
    if(data === null){
      location.href = '/login'
    }
  }
  
  validateLogin()

  const handleCreateRoom = async () => {
    console.log('I am clicked')
    const roomname = document.getElementById("room-name").value
    const resp = await fetch('http://localhost:8989/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token-login')
      },
      body: JSON.stringify({
        name: roomname
      })
    })
  
    if(resp.status !== 201){
      alert('FAILED TO CREATE NEW ROOM')
    }else{
      alert('NEW ROOM IS CREATED')
      location.reload()
      // getServerData()
    }
  }