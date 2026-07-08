const slider = document.getElementById("progressBar");
const lenghtDisplay = document.querySelector(".character-text__number");

const checkBoxs = document.querySelectorAll(".check__input");

const passwordField = document.querySelector(".password-field");
const passwordText = document.querySelector(".password-field__text");
const copyBtn = document.querySelector(".password-field__copy-btn");
const copiedLabel = document.querySelector(".password-field__label");

const generateBtn = document.querySelector(".generate-btn");

const strengthLevels = document.querySelectorAll(".range-level");
const levelText = document.getElementById("level-text");

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

let currentPassword = "";

// actualiza el numero del range
slider.addEventListener("input", () => {
  lenghtDisplay.textContent = slider.value;
});

//lee que checkboxs están marcados
function getSelectedTypes() {
  const map = {
    cbox1: "uppercase",
    cbox2: "lowercase",
    cbox3: "numbers",
    cbox4: "symbols",
  };
  const selected = [];

  checkBoxs.forEach((cb) => {
    if (cb.checked) selected.push(map[cb.id]);
  });
  return selected;
}

// Genera la contraseña
function generatePassword(length, types) {
  let allChars = "";
  let password = [];

  // garantizamos al menos 1 carácter de cada tipo marcado
  types.forEach((type) => {
    allChars += CHAR_SETS[type];
    const randomChar =
      CHAR_SETS[type][Math.floor(Math.random() * CHAR_SETS[type].length)];
    password.push(randomChar);
  });

  // rellenamos el resto con el pool combinado de todos los tipos activos
  for (let i = password.length; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // mezclamo
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

// calculamos la fuerza y pinta los niveles
function calculateStrength(length, typesCount) {
  let score = 0;

  if (length >= 8) score++;
  if (length >= 12) score++;
  if (typesCount >= 3) score++;
  if (typesCount === 4) score++;

  return score;
}

function updateStrengthUI(score) {
  strengthLevels.forEach((level) => {
    level.style.backgroundColor = "transparent";
    level.style.borderColor = "var(--white)";
  });

  let color, label, barsToFill;

  if (score <= 1) {
    color = "var(--red-500)";
    label = "LOW";
    barsToFill = 1;
  } else if (score <= 3) {
    color = "var(--yellow-300)";
    label = "MEDIUM";
    barsToFill = 3;
  } else {
    color = "var(--green-200)";
    label = "HIGHT";
    barsToFill = 4;
  }

  for (let i = 0; i < barsToFill; i++) {
    strengthLevels[i].style.backgroundColor = color;
    strengthLevels[i].style.borderColor = color;
  }

  levelText.textContent = label;
  levelText.hidden = false;
}

// Boton GENERATE
generateBtn.addEventListener("click", () => {
  const length = parseInt(slider.value, 10);
  const types = getSelectedTypes();

  if (length === 0 || types.length === 0) return;

  currentPassword = generatePassword(length, types);
  passwordText.textContent = currentPassword;
  //   passwordText.style.color = "var(--white)";

  passwordField.dataset.state = "filled";
  copyBtn.disabled = false;
  copiedLabel.hidden = true;

  updateStrengthUI(calculateStrength(length, types.length));
});

copyBtn.addEventListener("click", () => {
  if (!currentPassword) return;

  navigator.clipboard.writeText(currentPassword).then(() => {
    passwordField.dataset.state = "copied";
    copiedLabel.hidden = false;
  });
});
