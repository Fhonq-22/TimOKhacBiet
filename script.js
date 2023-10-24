let score = 0;
let time = 0;
let gameRunning = false;
let differentSquare = 0;
let clickCooldown = false;

function startGame() {
  if (!gameRunning) {
    score = 0;
    time = 20.0;
    gameRunning = true;
    updateScore(0);
    updateTimer(time);
    updateSquares();
    const timer = setInterval(function () {
      time -= 0.01;
      updateTimer(time);
      if (time <= 0) {
        endGame();
        clearInterval(timer);
      }
    }, 10);
  }
}

function updateScore(newScore) {
  document.getElementById("score").textContent = newScore;
}

function updateTimer(newTime) {
  document.getElementById("time").textContent = newTime.toFixed(2);
}

let colorDifference = 32;

function updateSquares() {
  differentSquare = Math.floor(Math.random() * 9) + 1;
  const specialColor = getRandomColor();

  for (let i = 1; i <= 9; i++) {
    const square = document.getElementById(i.toString());

    // Đặt màu mới cho tất cả các ô, không chỉ ô đặc biệt
    const similarColor = getSimilarColor(specialColor, colorDifference);
    square.style.backgroundColor = similarColor;

    (function (i) {
      square.onclick = function () {
        if (i == differentSquare) {
          score++;
          updateScore(score);
          clickCooldown = true;
          setTimeout(function () {
            clickCooldown = false;
          }, 1000);
          updateSquares();
        } else if (!gameRunning) {
          return;
        } else {
          endGame();
        }
      };
    })(i);
  }

  // Đặt lại màu của ô đặc biệt sau khi đã thiết lập màu cho tất cả các ô
  document.getElementById(differentSquare.toString()).style.backgroundColor = specialColor;
}

function getSimilarColor(color, difference) {
  // Lấy giá trị RGB của màu và thay đổi sự khác biệt màu
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  // Thay đổi sự khác biệt màu
  const newR = (r + difference) % 256;
  const newG = (g - difference) % 256;
  const newB = b;

  // Chuyển lại thành màu hex
  const newColor = `#${newR.toString(16)}${newG.toString(16)}${newB.toString(16)}`;

  return newColor;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function endGame() {
  gameRunning = false;
  Swal.fire({
    title: 'Kết thúc trò chơi!',
    text: `Điểm của bạn là ${score}. Thời gian: ${(20 - time).toFixed(2)} giây.`,
    icon: 'info',
    confirmButtonText: 'OK'
  }).then((result) => {
    if (result.isConfirmed) {
      playAgain();
    }
  });
}


function playAgain() {
  gameRunning = false;
  score = 0;
  time = 0;
  updateScore(0);
  updateTimer(0);
  document.getElementById("playAgainButton").style.display = "none"; // Ẩn nút "Chơi lại"
  startGame();
}
