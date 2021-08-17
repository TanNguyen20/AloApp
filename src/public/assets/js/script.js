const socket = io('/') // Create our socket
const videoGrid = document.getElementById('video-grid') // Find the Video-Grid element
// const options = {
//     // host: "global.xirsys.net",
//     // path: "/_token/channelpath?k=user1&expire=30",
//     // method: "PUT",
//     // headers: {
//     //   "Authorization": "Basic " + Buffer.from("testaccount:092ad88c-e96d-11e6-8a3b-b0db56058b9f").toString("base64")
//     // }
//   };
const myPeer = new Peer({
    config:{
        iceServers: [
            {
                urls: [ "stun:ss-turn1.xirsys.com" ]
            }, 
            {
                username: "YX5ln94dST7Kw3Sfs8h6oO1GApjoofmAlOUA8BTPwLc3ShgqLQMlxL_75dpSqVeOAAAAAGEaYEluaWVubHVhbm5nYW5oY3Q0NjY=",
                credential: "40ff7ba8-fe91-11eb-8e5b-0242ac140004",
                urls: [
                    "turn:ss-turn1.xirsys.com:80?transport=udp",
                    "turn:ss-turn1.xirsys.com:3478?transport=udp",
                    "turn:ss-turn1.xirsys.com:80?transport=tcp",
                    "turn:ss-turn1.xirsys.com:3478?transport=tcp",
                    "turns:ss-turn1.xirsys.com:443?transport=tcp",
                    "turns:ss-turn1.xirsys.com:5349?transport=tcp"
                ]
            }
        ]
    },
    host: "global.xirsys.net",
    path: "/_turn/MyFirstApp",
    debug:2,
}) // Creating a peer element which represents the current user
const myVideo = document.createElement('video') // Create a new video tag to show our video
myVideo.muted = true // Mute ourselves on our end so there is no feedback loop

// Access the user's video and audio
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream) // Display our video to ourselves

    myPeer.on('call', call => { // When we join someone's room we will receive a call from them
        call.answer(stream) // Stream them our video/audio
        const video = document.createElement('video') // Create a video tag for them
        call.on('stream', userVideoStream => { // When we recieve their stream
            addVideoStream(video, userVideoStream) // Display their video to ourselves
        })
    })
    socket.on('user-connected', userId => { // If a new user connect
        connectToNewUser(userId, stream) 
    })
})

myPeer.on('open', id => { // When we first open the app, have us join a room
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) { // This runs when someone joins our room
    const call = myPeer.call(userId, stream) // Call the user who just joined
    // Add their video
    const video = document.createElement('video') 
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    // If they leave, remove their video
    call.on('close', () => {
        video.remove()
    })
}


function addVideoStream(video, stream) {
    video.srcObject = stream 
    video.addEventListener('loadedmetadata', () => { // Play the video as it loads
        video.play()
    })
    videoGrid.append(video) // Append video element to videoGrid
}