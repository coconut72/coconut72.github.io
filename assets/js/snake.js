// 贪吃蛇游戏
(function() {
    const canvas = document.getElementById('snake-canvas');
    const startBtn = document.querySelector('.snake-start-btn');
    if (!canvas || !startBtn) return;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = 20;
    let snake, direction, food, score, gameOver, moveQueue, started;
    let gameTimer = null;

    function resetGame() {
        snake = [{x: 10, y: 10}];
        direction = {x: 0, y: 0};
        food = {x: 5, y: 5};
        score = 0;
        gameOver = false;
        moveQueue = [];
        started = false;
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 未开始时灰色遮罩
        if (!started) {
            ctx.fillStyle = 'rgba(30,0,40,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px Inter, Arial';
            ctx.textAlign = 'center';
            ctx.fillText('点击"开始游戏"', canvas.width/2, canvas.height/2);
            ctx.font = '18px Inter, Arial';
            ctx.fillText('方向键控制，R键重开', canvas.width/2, canvas.height/2+36);
            ctx.textAlign = 'start';
            return;
        }
        // 绘制蛇
        ctx.fillStyle = '#ff005c';
        snake.forEach((s, i) => {
            ctx.globalAlpha = i === 0 ? 1 : 0.7;
            ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize-2, gridSize-2);
        });
        ctx.globalAlpha = 1;
        // 绘制食物
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc((food.x+0.5)*gridSize, (food.y+0.5)*gridSize, gridSize/2.5, 0, Math.PI*2);
        ctx.fill();
        // 绘制分数
        ctx.fillStyle = '#fff';
        ctx.font = '18px Inter, Arial';
        ctx.fillText('分数: ' + score, 12, 28);
    }

    function randomFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
        food = newFood;
    }

    function moveSnake() {
        if (moveQueue.length) {
            direction = moveQueue.shift();
        }
        if (direction.x === 0 && direction.y === 0) return;
        const newHead = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
        // 撞墙
        if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
            gameOver = true;
            return;
        }
        // 自咬
        if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
            gameOver = true;
            return;
        }
        snake.unshift(newHead);
        // 吃到食物
        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            randomFood();
        } else {
            snake.pop();
        }
    }

    function gameLoop() {
        if (!started) return;
        if (gameOver) {
            ctx.fillStyle = 'rgba(30,0,40,0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff005c';
            ctx.font = 'bold 32px Inter, Arial';
            ctx.textAlign = 'center';
            ctx.fillText('游戏结束', canvas.width/2, canvas.height/2-10);
            ctx.font = '20px Inter, Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText('分数: ' + score, canvas.width/2, canvas.height/2+30);
            ctx.font = '16px Inter, Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText('点击"开始游戏"重玩', canvas.width/2, canvas.height/2+60);
            ctx.textAlign = 'start';
            startBtn.style.display = '';
            started = false;
            return;
        }
        moveSnake();
        drawBoard();
        gameTimer = setTimeout(gameLoop, 110);
    }

    startBtn.addEventListener('click', function() {
        resetGame();
        started = true;
        startBtn.style.display = 'none';
        drawBoard();
        setTimeout(gameLoop, 300);
    });

    document.addEventListener('keydown', function(e) {
        if (!started) return;
        let d = direction;
        if (e.key === 'ArrowUp' && d.y !== 1) moveQueue.push({x:0, y:-1});
        else if (e.key === 'ArrowDown' && d.y !== -1) moveQueue.push({x:0, y:1});
        else if (e.key === 'ArrowLeft' && d.x !== 1) moveQueue.push({x:-1, y:0});
        else if (e.key === 'ArrowRight' && d.x !== -1) moveQueue.push({x:1, y:0});
    });

    // 初始化
    resetGame();
    drawBoard();
    startBtn.style.display = '';
})(); 