const timer = document.querySelector('.timer');
const practice = document.querySelector('.practice');
const challenge = document.querySelector('.challenge');
const gameTitle = document.querySelector('.game-title');
const leaderboard = document.querySelector('.leaderboard');
const logout = document.querySelector('.timer');
const paragraph = document.querySelector('.paragraph');
const train = document.querySelector('.train');
const leaderboardScreen = document.getElementById('leaderboard');
const loginBtn = document.querySelector('.login-btn');
let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
let int = null;
let combinedString = "";
let count = 0;
let h = 0;
let m = 0;
let s = 0;
let ms = 0;
const words = [
	'A', 'mobile', 'app', 'developer', 'can', 'use', 'a', 'SDK', 'to', 'integrate', 'with', 'Cognito', 'or', 'directly', 'access', 'server-side', 'APIs.'
]

const leaderboardlist = [
	'Coffee 02:30','Tea 3:00','Milk 5:00','Water 05:30','Juice 03:00','Ace 06:00','Energy 06:30','Chicken 06:45','Beef 07:00','Apple 07:30'
]

if (loginBtn) {
	loginBtn.addEventListener('click', () => {
		window.location.href = '/login';
		}
	);
}

if (leaderboardScreen) {
	createLeaderboard();
}


if(practice){
	practice.addEventListener('click', () => {
		localStorage.setItem('title','Practice');
		window.location.href = '/game';
		}
	)
}

if(challenge){
	challenge.addEventListener('click', () => {
		localStorage.setItem('title','Daily Challenge');
		window.location.href = '/game';
		}
	)
}

if(leaderboard){
	leaderboard.addEventListener('click', () => {
		window.location.href = '/leaderboard';
		}
	)
}

if(timer){

	window.addEventListener('load', () => {
		gameTitle.innerText = localStorage.getItem('title');
		convertArrayToString(words);
		paragraph.textContent = combinedString;
		/*addSpanToCharacters(combinedString);*/
		if(int!==null){
				clearInterval(int);
		}
		int = setInterval(displayTimer,10);
	});
	
	window.addEventListener('keypress', (event) => {
		let character = event.key;
		
		if(combinedString[count] === character){
			console.log('correct');
			if (combinedString[count] !== " ") {
				let temp = combinedString.split('');
				temp[count] = `<span style="color: green;">${combinedString.substring(0, (count+1))}</span>`;
				paragraph.innerHTML = temp.join('');
			}
			count++;
			let dura = `${h}:${m}:${s}`;
			trainSpeed(dura);
			if (count === combinedString.length - 1) {
				console.log('done');
				let duration = `${h}:${m}:${s}`;
				console.log(`${h}:${m}:${s}:${ms}`);
				console.log(convertToMilliSeconds(duration));
			}
		}
		else{
			if (combinedString[count] !== " ") {
				let temp = combinedString.split('');
				temp[count] = `<span style="color: red;">${combinedString[count]}</span>`;
				paragraph.innerHTML = temp.join('');
			}
		}
		
	}
	);
}

function displayTimer(){
	milliseconds+=10;
	if(milliseconds == 1000){
			milliseconds = 0;
			seconds++;
			if(seconds == 60){
					seconds = 0;
					minutes++;
					if(minutes == 60){
							minutes = 0;
							hours++;
					}
			}
	}
	h = hours < 10 ? '0' + hours : hours;
	m = minutes < 10 ? '0' + minutes : minutes;
	s = seconds < 10 ? '0' + seconds : seconds;
	ms = milliseconds < 10 ? '00' + milliseconds : milliseconds < 100 ? '0' + milliseconds : milliseconds;
	timer.innerText = ` ${h} : ${m} : ${s}`;
}

function convertArrayToString(arr){
	for (let i = 0; i < arr.length; i++) {
  combinedString += arr[i] + " ";
	}
	combinedString.trim();
	
}

function convertToMilliSeconds(userTime){
	let a = userTime.split(':');
	//let ms = milliseconds < 10 ? '00' + milliseconds : milliseconds < 100 ? '0' + milliseconds : milliseconds;
	let secs = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

	return ((secs * 1000) + ms); 
}

function convertToSeconds(userTime){
	let a = userTime.split(':');
	let secs = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

	return secs; 
}

function addListItem(item){
	const list = document.querySelector('ol');
	let entry = document.createElement('li');
	entry.appendChild(document.createTextNode(item));
	list.appendChild(entry);
}

function createLeaderboard(){
	for (let item of leaderboardlist) {
		addListItem(item);
	}
}

function trainSpeed(userTime){
	let timeElapsed = convertToSeconds(userTime)
	let cps = Math.round((((count) / timeElapsed)/* * 60*/));
	let timeToFinish = (combinedString.length * cps) - (count * cps);
	train.style.animation = `train ${timeToFinish}s linear infinite`;
}

/*function addSpanToCharacters(input){
	let characters = input.split('');
	let tempWord = '';
	for (let character of characters) {
		tempWord += `<span id="character-${i}">${character}</span>`;
	}
	input = tempWord;
}*/