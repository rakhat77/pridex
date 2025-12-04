/**
 * PrideX Casino - Основной модуль
 * Оптимизирован, читаем, готов к масштабированию
 */

class PrideXApp {
    constructor(config) {
        this.config = config;
        this.currentGame = null;
        this.user = null;
        this.socket = null;
        this.init();
    }

    init() {
        console.log('🚀 PrideX App Initializing...');
        
        // Инициализация компонентов
        this.initUI();
        this.initEventListeners();
        this.initSocket();
        this.checkAuth();
        this.updateLiveStats();
        
        // Старт периодических обновлений
        this.startPeriodicUpdates();
        
        console.log('✅ PrideX App Ready!');
    }

    initUI() {
        // Инициализация темной темы по умолчанию
        document.documentElement.setAttribute('data-theme', 'dark');
        
        // Показываем текущий год в футере
        document.querySelector('footer p').innerHTML = 
            `© ${new Date().getFullYear()} PrideX Casino. Все права защищены.`;
    }

    initEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });

        // Игры в сайдбаре
        document.querySelectorAll('.game-item').forEach(game => {
            game.addEventListener('click', (e) => {
                const gameType = e.currentTarget.dataset.game;
                this.loadGame(gameType);
            });
        });

        // Кнопки игр на главной
        document.querySelectorAll('.btn-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameCard = e.target.closest('.game-card');
                const gameType = gameCard.dataset.game;
                this.loadGame(gameType);
            });
        });

        // Модальные окна
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showModal('loginModal');
        });

        document.getElementById('registerBtn').addEventListener('click', () => {
            this.showModal('registerModal');
        });

        // Закрытие модальных окон
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.hideAllModals();
            });
        });

        // Формы
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });

        // Мобильное меню
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Клик вне модального окна
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });

        // Обновление онлайн-статуса при фокусе
        window.addEventListener('focus', () => {
            this.updateLiveStats();
        });
    }

    initSocket() {
        // Подготовка к WebSocket соединению
        // В реальном проекте здесь будет подключение к WebSocket серверу
        console.log('🔌 WebSocket connection prepared');
        
        // Имитация получения данных в реальном времени
        setInterval(() => {
            this.updateOnlineUsers();
        }, 5000);
    }

    navigateTo(page) {
        console.log(`Navigating to: ${page}`);
        
        // Обновляем активную ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        // В будущем здесь будет загрузка контента через AJAX
        // Для MVP показываем/скрываем элементы
        if (page === 'home') {
            document.getElementById('welcomeScreen').style.display = 'block';
            document.getElementById('gameContainer').style.display = 'none';
        } else {
            // Здесь будет загрузка других страниц
            alert(`Страница "${page}" в разработке!`);
        }
    }

    loadGame(gameType) {
        console.log(`Loading game: ${gameType}`);
        
        // Показываем контейнер игры
        document.getElementById('welcomeScreen').style.display = 'none';
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.style.display = 'block';
        
        // Загружаем игру (в будущем через AJAX)
        gameContainer.innerHTML = `
            <div class="game-header">
                <h2>${this.getGameName(gameType)}</h2>
                <button class="btn-back" onclick="app.navigateTo('home')">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
            </div>
            <div class="game-frame">
                <div class="game-placeholder">
                    <i class="fas fa-${this.getGameIcon(gameType)}"></i>
                    <h3>${this.getGameName(gameType)}</h3>
                    <p>Игра загружается...</p>
                    <div class="loading-spinner"></div>
                    <p class="game-notice">Для запуска игры требуется авторизация</p>
                    <button class="btn-login-game" onclick="app.showModal('loginModal')">
                        <i class="fas fa-sign-in-alt"></i> Войти
                    </button>
                </div>
            </div>
        `;
        
        this.currentGame = gameType;
        
        // Если пользователь авторизован, загружаем реальную игру
        if (this.user) {
            this.loadActualGame(gameType);
        }
    }

    getGameName(gameType) {
        const games = {
            'slots': 'Слоты',
            'roulette': 'Рулетка',
            'blackjack': 'Блэкджек',
            'poker': 'Покер',
            'crash': 'Crash'
        };
        return games[gameType] || 'Игра';
    }

    getGameIcon(gameType) {
        const icons = {
            'slots': 'dice',
            'roulette': 'chess-board',
            'blackjack': 'club',
            'poker': 'spade',
            'crash': 'chart-line'
        };
        return icons[gameType] || 'gamepad';
    }

    async loadActualGame(gameType) {
        // В реальном проекте здесь будет загрузка игры через API
        console.log(`Loading actual game: ${gameType}`);
        
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Здесь будет интеграция с игровым движком
        // Например, вставка iframe или запуск WebGL игры
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        console.log('Login attempt:', email);
        
        // Валидация
        if (!this.validateEmail(email)) {
            this.showNotification('Введите корректный email', 'error');
            return;
        }
        
        // Имитация API запроса
        try {
            // В реальном проекте:
            // const response = await fetch(`${this.config.apiUrl}/auth/login`, {
            //     method: 'POST',
            //     body: JSON.stringify({ email, password }),
            //     headers: { 'Content-Type': 'application/json' }
            // });
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
            
            // Имитация успешного входа
            this.user = {
                id: 1,
                email: email,
                username: email.split('@')[0],
                balance: 1000.00
            };
            
            this.updateUserUI();
            this.hideAllModals();
            this.showNotification('Успешный вход!', 'success');
            
            // Если была выбрана игра, загружаем ее
            if (this.currentGame) {
                this.loadActualGame(this.currentGame);
            }
            
        } catch (error) {
            this.showNotification('Ошибка входа. Проверьте данные.', 'error');
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const username = formData.get('username');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // Валидация
        if (!this.validateEmail(email)) {
            this.showNotification('Введите корректный email', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('Пароль должен быть не менее 6 символов', 'error');
            return;
        }
        
        // Имитация регистрации
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.user = {
                id: 2,
                email: email,
                username: username,
                balance: 100.00 // Бонус при регистрации
            };
            
            this.updateUserUI();
            this.hideAllModals();
            this.showNotification('Регистрация успешна! Добро пожаловать!', 'success');
            
        } catch (error) {
            this.showNotification('Ошибка регистрации', 'error');
        }
    }

    updateUserUI() {
        if (this.user) {
            // Показываем профиль пользователя
            document.getElementById('userProfile').style.display = 'flex';
            document.querySelector('.balance-amount').textContent = 
                this.user.balance.toFixed(2);
            
            // Скрываем кнопки входа/регистрации
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('registerBtn').style.display = 'none';
        }
    }

    checkAuth() {
        // Проверяем, есть ли сохраненный токен
        const token = localStorage.getItem('pridex_token');
        if (token) {
            // В реальном проекте: проверка токена через API
            console.log('Token found, checking auth...');
        }
    }

    updateLiveStats() {
        // Имитация обновления статистики
        const onlineCount = document.getElementById('onlineCount');
        const jackpotAmount = document.getElementById('jackpotAmount');
        
        // Рандомные, но правдоподобные изменения
        const currentOnline = parseInt(onlineCount.textContent.replace(',', ''));
        const newOnline = currentOnline + Math.floor(Math.random() * 100 - 50);
        
        onlineCount.textContent = Math.max(1000, newOnline).toLocaleString();
        
        // Обновление джекпота
        const currentJackpot = parseFloat(jackpotAmount.textContent.replace(/[^0-9.]/g, ''));
        const newJackpot = currentJackpot + Math.random() * 1000;
        jackpotAmount.textContent = `$${newJackpot.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }

    updateOnlineUsers() {
        // В реальном проекте: обновление через WebSocket
        const onlineCount = document.getElementById('onlineCount');
        const change = Math.floor(Math.random() * 20 - 10);
        const current = parseInt(onlineCount.textContent.replace(',', ''));
        const newCount = Math.max(1000, current + change);
        onlineCount.textContent = newCount.toLocaleString();
    }

    startPeriodicUpdates() {
        // Обновление статистики каждые 30 секунд
        setInterval(() => {
            this.updateLiveStats();
        }, 30000);
        
        // Проверка новых сообщений/уведомлений
        setInterval(() => {
            if (this.user) {
                this.checkNotifications();
            }
        }, 60000);
    }

    checkNotifications() {
        // В реальном проекте: проверка уведомлений через WebSocket
        console.log('Checking for notifications...');
    }

    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Добавляем в body
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Удаление по клику
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Автоудаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('mobile-open');
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Методы для работы с API
    async apiRequest(endpoint, method = 'GET', data = null) {
        // Универсальный метод для API запросов
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Добавляем токен, если есть
        const token = localStorage.getItem('pridex_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            method,
            headers,
            credentials: 'include' // Для куков
        };
        
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(`${this.config.apiUrl}${endpoint}`, config);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

// Глобальный объект приложения (временное решение)
let app;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const config = JSON.parse(document.getElementById('app-config').textContent);
    app = new PrideXApp(config);
});