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
const startTime = new Date().getTime();
let shouldLogScore = false;

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
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "/login";
  });
}

if (leaderboardScreen) {
  createLeaderboard();
}


if(practice){

	practice.addEventListener('click', () => {
		localStorage.setItem('title','Practice');
    getWords('/api/practice/').then(words => {
      localStorage.setItem('words', JSON.stringify(words));
    }).finally(() => window.location.href = '/game');
  });
}

if (challenge) {
  challenge.addEventListener("click", () => {
    localStorage.setItem("title", "Daily Challenge");
    getWords('/api/challenge/').then(words => {
      localStorage.setItem('words', JSON.stringify(words));
    }).finally(() => {
      shouldLogScore = true;
      window.location.href = '/game';
    });
  });
}

if (leaderboard) {
  leaderboard.addEventListener("click", () => {
    getLeaderboard().then(leaderboard => {
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }).finally(() => window.location.href = '/leaderboard');
  });
}

if (backBtn) {
	backBtn.addEventListener('click', () => {
		window.location.href = '/';
		}
	);
}

if (logoutBtn) {
	logoutBtn.addEventListener('click', () => {
		window.location.href = '/logout';
		}
	);
}

if (timer) {
  window.addEventListener("load", () => {
    gameTitle.innerText = localStorage.getItem("title");
    convertArrayToString(JSON.parse(localStorage.getItem('words')) || []);
    paragraph.textContent = combinedString;
    /*addSpanToCharacters(combinedString);*/
    if (int !== null) {
      clearInterval(int);
    }
    int = setInterval(displayTimer, 10);
  });

  let correctlyTyped = "";
  window.addEventListener("keypress", (event) => {
    let character = event.key;

    if (combinedString[count] === character) {
      correctlyTyped += character;

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

        if (shouldLogScore) {
          fetch('/api/score/', {
            method: 'post',
            body: JSON.stringify({
              time: duration,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(response => {
            console.log(response);
          }).finally(() => shouldLogScore = false);
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

  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = parseInt((duration / 1000) % 60);
  let minutes = parseInt((duration / (1000 * 60)) % 60);

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return minutes + ":" + seconds + ":" + milliseconds;
}

function convertArrayToString(arr){
  combinedString = arr.join(' ');
}

function convertToSeconds(userTime) {
  let a = userTime.split(":");
  let secs = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

	return secs;
}

function addListItem(item) {
  const list = document.querySelector("ol");
  let entry = document.createElement("li");
  entry.appendChild(document.createTextNode(item));
  list.appendChild(entry);
}

function createLeaderboard() {
  const leaderboardlist = JSON.parse(localStorage.getItem('leaderboard')) || [];
  for (const item of leaderboardlist) {
    addListItem(`${item.username}: ${msToHMS(item.duration)}`);
  }
}

function updateTrain() {
  train.style.transform = `translateX(calc(90vw / ${combinedString.length / (count || 1) }))`;
}

/*function addSpanToCharacters(input){
	let characters = input.split('');
	let tempWord = '';
	for (let character of characters) {
		tempWord += `<span id="character-${i}">${character}</span>`;
	}
	input = tempWord;
}*/
