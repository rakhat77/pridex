/**
 * Модуль управления играми
 */
class GameManager {
    constructor() {
        this.availableGames = {
            'slots': {
                name: 'Слоты',
                minBet: 1,
                maxBet: 1000,
                demo: true
            },
            'roulette': {
                name: 'Рулетка',
                minBet: 5,
                maxBet: 5000,
                demo: true
            },
            'blackjack': {
                name: 'Блэкджек',
                minBet: 10,
                maxBet: 10000,
                demo: false
            },
            'poker': {
                name: 'Покер',
                minBet: 20,
                maxBet: 20000,
                demo: false
            },
            'crash': {
                name: 'Crash',
                minBet: 1,
                maxBet: 5000,
                demo: true
            }
        };
        
        this.currentGame = null;
        this.gameState = {};
    }
    
    async loadGame(gameId) {
        if (!this.availableGames[gameId]) {
            throw new Error('Game not found');
        }
        
        const game = this.availableGames[gameId];
        
        // Проверяем авторизацию для платных игр
        if (!game.demo && !authManager.getCurrentUser()) {
            uiManager.showNotification('Для этой игры требуется авторизация', 'warning');
            return false;
        }
        
        this.currentGame = gameId;
        
        // Показываем загрузку
        uiManager.toggleLoading(true, `Загрузка ${game.name}...`);
        
        try {
            // В реальном проекте здесь будет загрузка игры
            // через iframe или WebGL инициализация
            await this.initializeGame(gameId);
            
            uiManager.showNotification(`${game.name} загружена!`, 'success');
            return true;
            
        } catch (error) {
            uiManager.showNotification(`Ошибка загрузки: ${error.message}`, 'error');
            return false;
        } finally {
            uiManager.toggleLoading(false);
        }
    }
    
    async initializeGame(gameId) {
        // Имитация инициализации игры
        return new Promise((resolve) => {
            setTimeout(() => {
                this.gameState = {
                    loaded: true,
                    gameId,
                    balance: authManager.getCurrentUser()?.balance || 100,
                    bet: this.availableGames[gameId].minBet
                };
                resolve();
            }, 2000);
        });
    }
    
    placeBet(amount) {
        if (!this.gameState.loaded) {
            throw new Error('Game not loaded');
        }
        
        const game = this.availableGames[this.currentGame];
        
        if (amount < game.minBet || amount > game.maxBet) {
            uiManager.showNotification(`Ставка должна быть от ${game.minBet} до ${game.maxBet}`, 'warning');
            return false;
        }
        
        if (authManager.getCurrentUser() && amount > authManager.getCurrentUser().balance) {
            uiManager.showNotification('Недостаточно средств', 'error');
            return false;
        }
        
        this.gameState.bet = amount;
        
        // В реальном проекте: отправка ставки на сервер
        console.log(`Placing bet: ${amount} on ${game.name}`);
        
        return true;
    }
    
    async play() {
        if (!this.gameState.loaded) {
            throw new Error('Game not loaded');
        }
        
        // Проверяем ставку
        if (!this.gameState.bet) {
            uiManager.showNotification('Сначала сделайте ставку', 'warning');
            return null;
        }
        
        // Имитация игрового процесса
        const result = this.simulateGameResult();
        
        // Обновляем баланс
        if (authManager.getCurrentUser()) {
            const winAmount = result.win ? this.gameState.bet * result.multiplier : -this.gameState.bet;
            authManager.updateBalance(winAmount);
        }
        
        return result;
    }
    
    simulateGameResult() {
        // Простая имитация игрового результата
        // В реальном проекте это будет вычисляться на сервере
        const random = Math.random();
        const game = this.availableGames[this.currentGame];
        
        if (this.currentGame === 'slots') {
            return this.simulateSlots();
        } else if (this.currentGame === 'crash') {
            return this.simulateCrash();
        } else {
            // Общая логика для других игр
            if (random > 0.4) { // 60% шанс на победу
                const multiplier = 1 + Math.random() * 3; // Выигрыш 1x-4x
                return {
                    win: true,
                    multiplier: parseFloat(multiplier.toFixed(2)),
                    amount: this.gameState.bet * multiplier
                };
            } else {
                return {
                    win: false,
                    multiplier: 0,
                    amount: 0
                };
            }
        }
    }
    
    simulateSlots() {
        const symbols = ['7', 'BAR', 'CHERRY', 'BELL', 'DIAMOND'];
        const reels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
        
        // Проверяем комбинации
        const allSame = reels[0] === reels[1] && reels[1] === reels[2];
        const twoSame = reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2];
        
        if (allSame) {
            return {
                win: true,
                multiplier: 10,
                amount: this.gameState.bet * 10,
                reels
            };
        } else if (twoSame) {
            return {
                win: true,
                multiplier: 2,
                amount: this.gameState.bet * 2,
                reels
            };
        } else {
            return {
                win: false,
                multiplier: 0,
                amount: 0,
                reels
            };
        }
    }
    
    simulateCrash() {
        // Имитация игры Crash
        let multiplier = 1.0;
        let crashed = false;
        const crashPoint = 1 + Math.random() * 10; // Случайная точка краха 1x-10x
        
        // Имитация роста множителя
        const interval = setInterval(() => {
            if (multiplier >= crashPoint) {
                crashed = true;
                clearInterval(interval);
                return;
            }
            
            multiplier += 0.1;
            // Здесь можно обновлять UI в реальном времени
        }, 100);
        
        return {
            win: !crashed,
            multiplier: crashed ? 0 : parseFloat(multiplier.toFixed(2)),
            amount: crashed ? 0 : this.gameState.bet * multiplier,
            crashedAt: parseFloat(crashPoint.toFixed(2))
        };
    }
    
    getGameInfo(gameId) {
        return this.availableGames[gameId];
    }
    
    getAvailableGames() {
        return this.availableGames;
    }
}

// Глобальный менеджер игр
const gameManager = new GameManager();