const container = document.getElementById('container')
const canvas = document.getElementById('canvas1')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d');
let audioSource
let analyser

container.addEventListener('click', function() {
  // let audio1 = new Audio()
  // audio1.src = 'music/mwah_3.mp3'
  const audio1 = document.getElementById('audio1')
  audio1.src = 'music/mwah_3.mp3'
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  audio1.play();
  audioSource = audioContext.createMediaElementSource(audio1)
  // note: analyser exposes audio time and frequency data
  analyser = audioContext.createAnalyser()
  audioSource.connect(analyser)
  analyser.connect(audioContext.destination)
  // note: fftSize number of samples we want in the file. default is 2048
  analyser.fftSize = 512
  const bufferLength = analyser.frequencyBinCount
  // note: converting buffer length to special array that holds special 8-bit integers
  const dataArray = new Uint8Array(bufferLength)

  // const barWidth = (canvas.width/2)/bufferLength;
  // note: can manipulate this!
  const barWidth = 5
  let barHeight
  let x

  function animate() {
    x = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // note: analyser will determine height of each bar
    analyser.getByteFrequencyData(dataArray)
    // note: any canvas particle can go here!
    drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
    requestAnimationFrame(animate)
  }
  animate()
})

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 0.3
    ctx.save()
    ctx.translate(canvas.width/2, canvas.height/2)
    ctx.rotate(i + Math.PI * 8 / bufferLength)
    // const red = i * barHeight/20
    // const green = i * 4
    // const blue = barHeight/2
    // ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')'
    const hue = i * 15
    ctx.fillStyle = 'hsl(' + hue + ',100%, 50%'
    // note: x, y, width, and height of sound bar
    ctx.fillRect(0, 0, barWidth, barHeight)
    // ctx.fillRect(x, canvas.height, barWidth, barHeight)
    x += barWidth
    ctx.restore()
  }
}
