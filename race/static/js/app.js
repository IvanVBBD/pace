const timer = document.querySelector(".timer");
const practice = document.querySelector(".practice");
const challenge = document.querySelector(".challenge");
const gameTitle = document.querySelector(".game-title");
const leaderboard = document.querySelector(".leaderboard");
const logout = document.querySelector(".timer");
const paragraph = document.querySelector(".paragraph");
const train = document.querySelector(".train");
const leaderboardScreen = document.getElementById("leaderboard");
const loginBtn = document.querySelector(".login-btn");
const backBtn = document.querySelector('.back-button');
const logoutBtn = document.querySelector('.logout-button');
const gameOver = document.querySelector('.game-over');
const gameOverText = document.querySelector('.game-over-text');
const content = document.querySelector('.content');
let int = null;
let combinedString = "";
let count = 0;
let incorrect = 0;
let duration = 0;
let startTime = new Date().getTime();

const getWords = async url => {

  try {

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Invalid Response from ${url}`);
    }

    const json = await response.json();
    return json.words;

  } catch (error) {
    console.error(`Could not get ${url}`);
    console.error(error);
    return [];
  }
}

const getLeaderboard = async () => {

  const url = '/api/score/';

  try {

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Invalid Response from ${url}`);
    }

    return await response.json();

  } catch (error) {
    console.error(`Could not get ${url}`);
    console.error(error);
    return [];
  }
};

const startGame = url => {
  getWords(url).then(words => {
    combinedString = words.join(' ');
  }).finally(() => {
    paragraph.textContent = combinedString;
    startTime = new Date().getTime();
    if (int !== null) {
      clearInterval(int);
    }
    int = setInterval(displayTimer, 10);
  });
};

const createLeaderboard = (leaderboard = []) => {
  for (const item of leaderboard) {
    addListItem(`${item.username}: ${msToHMS(item.duration)}`);
  }
};

const addListItem = (item) => {
  const list = document.querySelector("ol");
  let entry = document.createElement("li");
  entry.appendChild(document.createTextNode(item));
  list.appendChild(entry);
};

const updateTrain = () => {
  train.style.transform = `translateX(calc(90vw / ${combinedString.length / (count || 1) }))`;
};

if (leaderboardScreen) {

  getLeaderboard().then(leaderboard => {
    createLeaderboard(leaderboard);
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "/login";
  });
}


if(practice){

	practice.addEventListener('click', () => {
		localStorage.setItem('title','Practice');
    window.location.href = '/game'
  });
}

if (challenge) {
  challenge.addEventListener("click", () => {
    localStorage.setItem("title", "Daily Challenge");
    window.location.href = '/game';
  });
}

if (leaderboard) {
  leaderboard.addEventListener("click", () => {
    localStorage.setItem("title", "Leaderboard");
    window.location.href = '/leaderboard';
  });
}

if (backBtn) {
	backBtn.addEventListener('click', () => {
    localStorage.setItem("title", "Keyboard Racers");
    window.location.href = '/';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.setItem("title", "Keyboard Racers");
		window.location.href = '/logout';
  });
}

if (timer) {
  window.addEventListener("load", () => {
    const title = localStorage.getItem("title");
    gameTitle.innerText = title;

    if (title === 'Daily Challenge') {
      startGame('/api/challenge/');
    }

    if (title === 'Practice') {
      startGame('/api/practice/');
    }
  });

  let correctlyTyped = "";
  window.addEventListener("keypress", (event) => {
    const key = event.key;

    if (combinedString[count] === key) {
      correctlyTyped += key;

      if (combinedString[count] !== " ") {
        let temp = combinedString.split("");
        temp = temp.map((char, index) =>
          index >= correctlyTyped.length
            ? char
            : `<span style="color: green;">${char}</span>`
        );
        paragraph.innerHTML = temp.join("");
      }

      count++;
      updateTrain();

      if (count === combinedString.length) {
        timer.style.display = 'none';
        content.style.display = 'none';
        gameOver.style.display = 'flex';
        gameOverText.textContent += msToHMS(duration);

        if (incorrect > 0) {
          const penalty = 2000 * incorrect;
          gameOverText.textContent += ' \nWith a penalty of: ' + msToHMS(penalty);
          duration += penalty;
        }

        if (localStorage.getItem("title") === 'Daily Challenge') {
          fetch('/api/score/', {
            method: 'post',
            body: JSON.stringify({
              time: duration,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(() => {
            console.log('Game finished');
          });
        }

      }
    } else {
      if (combinedString[count] !== " ") {
        incorrect++;
        let temp = combinedString.split("");
        temp[
          count
        ] = `<span style="color: red;">${combinedString[count]}</span>`;
        paragraph.innerHTML = temp.join("");
      }
    }
  });
}

function displayTimer() {
  duration = new Date().getTime() - startTime;
  timer.innerText = msToHMS(duration);
}

function msToHMS(duration) {

  let milliseconds = parseInt((duration % 1000));
  let seconds = parseInt((duration / 1000) % 60);
  let minutes = parseInt((duration / (1000 * 60)) % 60);

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  milliseconds = (milliseconds < 10) ? "00" + milliseconds : (milliseconds < 100) ? "0" + milliseconds : milliseconds;

  return minutes + ":" + seconds + ":" + milliseconds;
}