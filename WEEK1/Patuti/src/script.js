 const animationFrames = {
            idle: ["idle-1.png", "idle-2.png"],
            left: ["left-1.png", "left-2.png", "left-3.png", "left-4.png"],
            right: ["right-1.png", "right-2.png", "right-3.png", "right-4.png"],
            jump: ["jump-1.png", "jump-2.png", "jump-3.png", "jump-4.png", "jump-5.png", "jump-6.png", "jump-7.png"],
            dock: ["dock-1.png", "dock-2.png", "dock-3.png", "dock-4.png"]
        };

        let character = null;
        let velocityY = 0;
        let gravity = 0.8;
        let isJumping = false;
        let health = 100;
        let maxHealth = 100;
        let bullets = [];
        let keys = {};
        let frameIndex = 0;
        let animationTimer = 0;
        let currentAnimation = 'idle';
        let bulletSpawner;
        let platformBounds = {};
        let characterBounds = {};
        let onPlatform = true;
        let gameRunning = true;

        function updateCharacterPosition() {
            if (!gameRunning) return;
            
            let charContainer = document.querySelector('.char');
            let platform = document.querySelector('.area');
            
            platformBounds = platform.getBoundingClientRect();
            characterBounds = character.getBoundingClientRect();
            
            let currentLeft = parseInt(character.style.left) || 0;
            let currentTop = parseInt(character.style.top) || 0;
            
            if (isJumping || velocityY !== 0 || !onPlatform) {
                velocityY += gravity;
                let newTop = currentTop + velocityY;
                character.style.top = newTop + 'px';

                let charRect = {
                    left: characterBounds.left + currentLeft,
                    right: characterBounds.left + currentLeft + characterBounds.width,
                    bottom: characterBounds.top + newTop + characterBounds.height
                };

                if (velocityY > 0 && 
                    charRect.bottom >= platformBounds.top && 
                    charRect.bottom <= platformBounds.top + 20 &&
                    charRect.right > platformBounds.left && 
                    charRect.left < platformBounds.right) {
                    
                    character.style.top = (platformBounds.top - characterBounds.height - charContainer.getBoundingClientRect().top) + 'px';
                    velocityY = 0;
                    isJumping = false;
                    onPlatform = true;
                    currentAnimation = 'idle';
                } else if (velocityY > 0) {
                    onPlatform = false;
                }

                // Check if character fell off screen
                if (charRect.bottom > window.innerHeight) {
                    gameOver();
                }
            }

            if (keys['ArrowLeft']) moveLeft();
            if (keys['ArrowRight']) moveRight();
            if (keys['ArrowDown']) crouch();

            if (!keys['ArrowLeft'] && !keys['ArrowRight'] && !keys['ArrowDown'] && !isJumping) {
                currentAnimation = 'idle';
            }

            updatePlatformStatus();
        }

        function updateAnimationFrame() {
            const frames = animationFrames[currentAnimation];
            if (!frames) return;

            animationTimer++;
            if (animationTimer >= 6) { 
                animationTimer = 0;
                frameIndex = (frameIndex + 1) % frames.length;
                character.src = `../images/${frames[frameIndex]}`;
                
                if (currentAnimation === 'left') {
                    character.style.transform = "scaleX(-1)";
                } else {
                    character.style.transform = "scaleX(1)";
                }
            }
        }

        function updatePlatformStatus() {
            let charContainer = document.querySelector('.char');
            let currentLeft = parseInt(character.style.left) || 0;
            let charRect = {
                left: characterBounds.left + currentLeft,
                right: characterBounds.left + currentLeft + characterBounds.width,
                bottom: characterBounds.top + parseInt(character.style.top || 0) + characterBounds.height
            };

            if (Math.abs(charRect.bottom - platformBounds.top) < 10) {
                if (charRect.right > platformBounds.left && charRect.left < platformBounds.right) {
                    onPlatform = true;
                } else {
                    onPlatform = false;
                    if (velocityY === 0) {
                        velocityY = 1; 
                    }
                }
            }
        }

        function moveLeft() {
            let left = parseInt(character.style.left) || 0;
            let newLeft = left - 5;
            if (newLeft > -200) {
                character.style.left = newLeft + 'px';
            }
            if (!isJumping && currentAnimation !== 'left') {
                currentAnimation = 'left';
                frameIndex = 0;
            }
        }

        function moveRight() {
            let left = parseInt(character.style.left) || 0;
            let newLeft = left + 5;
            
            if (newLeft < 200) {
                character.style.left = newLeft + 'px';
            }
            
            if (!isJumping) currentAnimation = 'right';
        }

        function jump() {
            if (!isJumping && onPlatform) {
                velocityY = -15;
                isJumping = true;
                onPlatform = false;
                currentAnimation = 'jump';
                frameIndex = 0;
            }
        }

        function crouch() {
            if (!isJumping && onPlatform) {
                currentAnimation = 'dock';
            }
        }

        function handleKeydown(evt) {
            if (!gameRunning) return;
            
            keys[evt.key] = true;
            if (evt.key === 'ArrowUp' || evt.key === ' ') {
                evt.preventDefault();
                jump();
            }
        }

        function handleKeyup(evt) {
            keys[evt.key] = false;
        }

        function spawnBullet() {
            if (!gameRunning) return;
            
            let bulletType = Math.random() < 0.7 ? 'horizontal' : 'vertical';
            
            let bullet = document.createElement("img");
            bullet.style.position = "absolute";
            
            if (bulletType === 'horizontal') {
                bullet.src = "../images/bullet_h.png";
                bullet.className = "bullet bullet-horizontal";
                bullet.style.left = window.innerWidth + "px";
                bullet.style.top = (Math.random() * (window.innerHeight - 200) + 100) + "px";
                bullet.dataset.type = 'horizontal';
                bullet.dataset.velocityX = -8;
                bullet.dataset.velocityY = 0;
            } else {
                bullet.src = "../images/bullet_v.png";
                bullet.className = "bullet bullet-vertical";
                bullet.style.left = (Math.random() * (window.innerWidth - 100) + 50) + "px";
                bullet.style.top = "-50px";
                bullet.dataset.type = 'vertical';
                bullet.dataset.velocityX = 0;
                bullet.dataset.velocityY = 6;
            }
            
            document.body.appendChild(bullet);
            bullets.push(bullet);
        }

        function moveBullets() {
            if (!gameRunning) return;
            
            bullets.forEach((bullet, index) => {
                let left = parseInt(bullet.style.left);
                let top = parseInt(bullet.style.top);
                let velocityX = parseInt(bullet.dataset.velocityX);
                let velocityY = parseInt(bullet.dataset.velocityY);
                
                bullet.style.left = (left + velocityX) + "px";
                bullet.style.top = (top + velocityY) + "px";

                if (left < -50 || left > window.innerWidth + 50 || 
                    top < -50 || top > window.innerHeight + 50) {
                    bullet.remove();
                    bullets.splice(index, 1);
                    return;
                }

                if (checkCollision(character, bullet)) {
                    health -= 10;
                    bullet.remove();
                    bullets.splice(index, 1);
                    updateHealthBar();
                    document.getElementById("health").textContent = "Health: " + health;
                    
                    // Flash effect when hit
                    character.style.filter = 'sepia(1) saturate(2) hue-rotate(-60deg) brightness(1.2)';
                    setTimeout(() => {
                        character.style.filter = 'none';
                    }, 200);

                    if (health <= 0) {
                        gameOver();
                    }
                }
            });
        }

        function checkCollision(rect1, rect2) {
            let r1 = rect1.getBoundingClientRect();
            let r2 = rect2.getBoundingClientRect();
            return !(r2.left > r1.right || 
                     r2.right < r1.left || 
                     r2.top > r1.bottom ||
                     r2.bottom < r1.top);
        }

        function updateHealthBar() {
            let healthBar = document.getElementById("healthBar");
            let healthPercentage = (health / maxHealth) * 100;
            healthBar.style.width = healthPercentage + "%";
            
            // Change color based on health level
            if (healthPercentage > 60) {
                healthBar.style.background = "linear-gradient(90deg, #00ff00 0%, #7fff00 100%)";
            } else if (healthPercentage > 30) {
                healthBar.style.background = "linear-gradient(90deg, #ffff00 0%, #ffa500 100%)";
            } else {
                healthBar.style.background = "linear-gradient(90deg, #ff0000 0%, #ff4500 100%)";
            }
        }

        function gameOver() {
            gameRunning = false;
            clearInterval(bulletSpawner);
            document.getElementById("gameOverOverlay").style.display = "flex";
        }

        function resetGame() {
            // Reset character position
            character.style.left = "0px";
            character.style.top = "0px";
            
            // Reset game state
            health = maxHealth;
            isJumping = false;
            velocityY = 0;
            onPlatform = true;
            currentAnimation = 'idle';
            gameRunning = true;
            
            // Update UI
            updateHealthBar();
            document.getElementById("health").textContent = "Health: " + health;
            
            // Clear bullets
            bullets.forEach(b => b.remove());
            bullets = [];
            
            // Hide game over screen
            document.getElementById("gameOverOverlay").style.display = "none";
            
            // Restart bullet spawning
            bulletSpawner = setInterval(spawnBullet, 2000);
        }

        function gameLoop() {
            updateCharacterPosition();
            moveBullets();
            updateAnimationFrame();
            requestAnimationFrame(gameLoop);
        }

        window.onload = function () {
            character = document.getElementById("character");
            character.style.left = "0px";
            character.style.top = "0px";
            
            // Initialize health bar
            updateHealthBar();
            
            document.addEventListener("keydown", handleKeydown);
            document.addEventListener("keyup", handleKeyup);
            
            // Add event listener for Play Again button
            document.getElementById("playAgainBtn").addEventListener("click", resetGame);
            
            bulletSpawner = setInterval(spawnBullet, 2000);
            gameLoop();
            
            // Instructions
            console.log("Controls: Arrow keys to move, Up arrow or Space to jump, Down arrow to crouch");
        }