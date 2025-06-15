const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const timer = document.getElementById("timer");
const boomSound = document.getElementById("boomSound");
const tickSound = document.getElementById("tickSound");
const bomb = document.querySelector(".bomb-body");
const themeToggleBtn = document.getElementById("themeToggle");
const led = document.getElementById("led-light");

let timeLeft = 30;
let timerInterval = null;
let defused = false;
let bombResolved = false;
const correctWire = "green";

// Start ticking and countdown
window.addEventListener("DOMContentLoaded", () => {
  tickSound.volume = 0.4;
  tickSound.play().catch(() => {});
  startTimer();
});

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0 && !defused) {
      triggerExplosion();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const seconds = String(Math.max(timeLeft, 0)).padStart(2, "0");
  timer.textContent = `00:${seconds}`;
}

function cutWire(color) {
  if (defused) return;
  if (color === correctWire) {
    defused = true;
    clearInterval(timerInterval);
    tickSound.pause();
    timer.textContent = "DEFUSED";
    display.textContent = "😎 Bomb defused!";
    led.classList.remove("red");
    led.classList.add("green");
    setTimeout(resetCalculatorUI, 2000);
  } else {
    triggerExplosion();
  }
}

function triggerExplosion() {
  clearInterval(timerInterval);
  defused = true;
  tickSound.pause();
  boomSound.play();
  display.textContent = "💥 BOOM!";
  bomb.classList.add("exploded");
  setTimeout(resetCalculatorUI, 2000);
}

function resetCalculatorUI() {
  const wires = document.querySelector(".wires");
  const timerElement = document.getElementById("timer");
  if (wires) wires.remove();
  if (timerElement) timerElement.remove();
  display.textContent = "0";
  bomb.classList.remove("exploded");
  bombResolved = true;

  // ✅ Change LED to green when calculator becomes active
  led.classList.remove("red");
  led.classList.add("green");
}

function handleInput(value) {
  if (!bombResolved && !defused) return;
  if (value === "C") {
    display.textContent = "0";
  } else if (value === "=") {
    try {
      const result = eval(display.textContent);
      display.textContent = result;
    } catch {
      triggerExplosion();
    }
  } else {
    if (display.textContent === "0" || display.textContent.includes("BOOM")) {
      display.textContent = value;
    } else {
      display.textContent += value;
    }
  }
}

buttons.forEach(btn => {
  if (!btn.classList.contains("wire") && btn.id !== "themeToggle") {
    btn.addEventListener("click", () => handleInput(btn.textContent));
  }
});

document.addEventListener("keydown", (e) => {
  if (!bombResolved && !defused) return;
  const key = e.key;
  if (/\d/.test(key)) handleInput(key);
  else if (["+", "-", "*", "/"].includes(key)) handleInput(key);
  else if (key === "Enter") handleInput("=");
  else if (key === "c" || key === "C") handleInput("C");
  else if (key === "Backspace") {
    display.textContent = display.textContent.slice(0, -1) || "0";
  }
});

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});
