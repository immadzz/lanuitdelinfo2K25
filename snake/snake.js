// Récupérer le canvas et son contexte 2D
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Définition d'une image pour la nourriture
var imgFood = new Image();

//Définition d'une image pour la tête du serpent
const imgHead = new Image();
imgHead.src = 'img/headRight.png';

//Définition d'une image pour le corp du serpent

const imgBody = new Image();
imgBody.src = 'img/body.png';


// Tableau des images de nourriture disponibles pour la nourriture
const tabFood = ['img/nokia.png', 'img/gameboy.png', 'img/apple.png'];

// Dimensions du canvas
const width = canvas.width;
const height = canvas.height;

// Taille d'une case (chaque segment du serpent et la nourriture font 20px)
const boxSize = 20;

// Vitesse du jeu en millisecondes (100 ms = 10 mises à jour par seconde)
const gameSpeed = 110;

// Le serpent : un tableau d'objets { x, y }
// On initialise le serpent avec un seul segment (la tête)
let snake = [
  { x: 9 * boxSize, y: 10 * boxSize } // Position de départ au milieu du canvas
];

// Direction initiale du serpent
let direction = "RIGHT";

// Score initial
let score = 0;

var Ndirection;
// Sélection de l'élément HTML pour afficher le score
const scoreDisplay = document.getElementById("score");

// Cette variable contiendra l'intervalle qui appelle régulièrement la fonction du jeu
let game;

// Charge une "pomme" aléatoire au démarrage
addEventListener('load', () => {
  alert("Bienvenue dans le jeu du Snake ! Utilisez les flèches du clavier pour diriger le serpent. Bonne chance !");  
  imgFood.src = tabFood[Math.floor(Math.random() * tabFood.length)];
});

/**
 * Dessine un carré de taille boxSize sur le canvas
 * @param {number} x - Coordonnée x
 * @param {number} y - Coordonnée y
 * @param {string} color - Couleur de remplissage
 */
function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, boxSize, boxSize);
}

/**
 * Génère une position aléatoire pour la nourriture
 * @returns {Object} { x, y }
 */
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (height / boxSize)) * boxSize,
  };
}

// Génération d’une première nourriture
let food = spawnFood();

// Écoute des touches du clavier
document.addEventListener("keydown", changeDirection);

/**
 * Change la direction en fonction de la touche appuyée
 * @param {KeyboardEvent} e
 */
function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") {
    Ndirection = "LEFT";
    imgHead.src = 'img/headLeft.png';
  } else if (e.key === "ArrowUp" && direction !== "DOWN") {
    Ndirection = "UP";
    imgHead.src = 'img/headUp.png';
  } else if (e.key === "ArrowRight" && direction !== "LEFT") {
    Ndirection = "RIGHT";
    imgHead.src = 'img/headRight.png';
  } else if (e.key === "ArrowDown" && direction !== "UP") {
    Ndirection = "DOWN";
    imgHead.src = 'img/headDown.png';
  }
}

/**
 * Vérifie si la tête du serpent (head) entre en collision
 * avec un segment du corps (body).
 * @param {Object} head - La nouvelle tête { x, y }
 * @param {Array} body - Les segments du serpent
 * @returns {boolean} true si collision, false sinon
 */
function collisionWithBody(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}
function drawTile(x, y, img) {
  ctx.drawImage(img, x, y, boxSize, boxSize);
}
/*
 * Fonction principale qui dessine et met à jour l'état du jeu
 */
function drawGame() {
  // 1. Efface le canvas (toute la zone de dessin)
  direction = Ndirection;
  ctx.clearRect(0, 0, width, height);

  const tabImg = Array 
  // 2. Dessiner la nourriture

  // Alternativement, on peut dessiner un simple carré rouge :
  //
 drawTile(food.x, food.y, imgFood);

  // 3. Coordonnées de la tête du serpent (segment 0)
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Mise à jour de la position selon la direction
  if (direction === "LEFT")  snakeX -= boxSize;
  if (direction === "RIGHT") snakeX += boxSize;
  if (direction === "UP")    snakeY -= boxSize;
  if (direction === "DOWN")  snakeY += boxSize;

  // 4. Vérifier si le serpent mange la nourriture
  if (snake[0].x === food.x && snake[0].y === food.y) {
    // Incrémente le score
    score++;
    scoreDisplay.textContent = `Score : ${score}`;
    imgFood.src = tabFood[Math.floor(Math.random() * tabFood.length)]
    // Génère une nouvelle nourriture
    food = spawnFood();

    // Le serpent grandit => on ne retire pas le dernier segment
  } else {
    // 5. On enlève le dernier segment (la queue) pour simuler le mouvement
    snake.pop();
  }

  // Préparer la nouvelle tête
  let newHead = { x: snakeX, y: snakeY };

  // 6a. Collision avec les murs ?
  if (
    snakeX < 0 ||
    snakeX >= width ||
    snakeY < 0 ||
    snakeY >= height
  ) {
    // Fin du jeu
    clearInterval(game);
    alert(`Game Over ! Votre score est de : ${score}
      Voulez-vous rejouer ?`);
    snake = [
  { x: 9 * boxSize, y: 10 * boxSize }];
  game = setInterval(drawGame, gameSpeed);
  Ndirection = "";
    return;
  }

  // 6b. Collision avec le corps ?
  if (collisionWithBody(newHead, snake)) {
    // Fin du jeu
    clearInterval(game);
    alert(`Game Over ! Votre score est de : ${score}
      Voulez-vous rejouer ?`);
    snake = [
  { x: 9 * boxSize, y: 10 * boxSize }];
  game = setInterval(drawGame, gameSpeed);
  Ndirection = "";

    return;
  }

  // On ajoute la nouvelle tête au début du tableau
  snake.unshift(newHead);

  // 7. Dessiner le serpent
  for (let i = 0; i < snake.length; i++) {
    // La tête est plus claire (lime), le reste est vert
     drawTile(snake[i].x, snake[i].y, i === 0 ? imgHead : imgBody);
  }
}

// Lance la boucle du jeu
game = setInterval(drawGame, gameSpeed);