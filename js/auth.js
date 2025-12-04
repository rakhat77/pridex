/**
 * Модуль управления авторизацией и пользовательскими данными
 */
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('pridex_token');
        this.init();
    }
    
    async init() {
        if (this.token) {
            await this.validateToken();
        }
    }
    
    async validateToken() {
        try {
            // В реальном проекте: запрос к API для проверки токена
            // const response = await fetch('/api/auth/validate', {
            //     headers: { 'Authorization': `Bearer ${this.token}` }
            // });
            
            // Имитация проверки
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Если токен валиден, загружаем пользователя
            // this.currentUser = await response.json();
            
            // Для демо - создаем тестового пользователя
            this.currentUser = {
                id: 1,
                email: 'demo@pridex.com',
                username: 'DemoUser',
                balance: 1000.50,
                avatar: null
            };
            
            this.updateUI();
            
        } catch (error) {
            console.error('Token validation failed:', error);
            this.logout();
        }
    }
    
    async login(email, password) {
        try {
            uiManager.toggleLoading(true, 'Вход в систему...');
            
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // В реальном проекте:
            // const response = await fetch('/api/auth/login', {
            //     method: 'POST',
            //     body: JSON.stringify({ email, password }),
            //     headers: { 'Content-Type': 'application/json' }
            // });
            // 
            // const data = await response.json();
            
            const data = {
                success: true,
                user: {
                    id: Date.now(),
                    email,
                    username: email.split('@')[0],
                    balance: 100.00
                },
                token: 'demo_token_' + Date.now()
            };
            
            if (data.success) {
                this.currentUser = data.user;
                this.token = data.token;
                
                // Сохраняем токен
                localStorage.setItem('pridex_token', this.token);
                localStorage.setItem('pridex_user', JSON.stringify(data.user));
                
                this.updateUI();
                uiManager.showNotification('Успешный вход!', 'success');
                
                // Обновляем баланс в реальном времени
                this.startBalanceUpdates();
                
                return true;
            }
            
        } catch (error) {
            uiManager.showNotification('Ошибка входа', 'error');
            return false;
        } finally {
            uiManager.toggleLoading(false);
        }
    }
    
    async register(userData) {
        try {
            uiManager.toggleLoading(true, 'Регистрация...');
            
            // Валидация данных
            if (!this.validateUserData(userData)) {
                throw new Error('Invalid user data');
            }
            
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const data = {
                success: true,
                user: {
                    id: Date.now(),
                    ...userData,
                    balance: 100.00 // Бонус при регистрации
                },
                token: 'demo_token_' + Date.now()
            };
            
            this.currentUser = data.user;
            this.token = data.token;
            
            localStorage.setItem('pridex_token', this.token);
            localStorage.setItem('pridex_user', JSON.stringify(data.user));
            
            this.updateUI();
            uiManager.showNotification('Регистрация успешна!', 'success');
            
            this.startBalanceUpdates();
            
            return true;
            
        } catch (error) {
            uiManager.showNotification('Ошибка регистрации', 'error');
            return false;
        } finally {
            uiManager.toggleLoading(false);
        }
    }
    
    validateUserData(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) return false;
        if (data.password.length < 6) return false;
        if (data.password !== data.confirmPassword) return false;
        return true;
    }
    
    logout() {
        this.currentUser = null;
        this.token = null;
        
        localStorage.removeItem('pridex_token');
        localStorage.removeItem('pridex_user');
        
        this.updateUI();
        uiManager.showNotification('Вы вышли из системы', 'info');
    }
    
    updateUI() {
        const userProfile = document.getElementById('userProfile');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (this.currentUser) {
            // Показываем профиль
            userProfile.style.display = 'flex';
            
            // Обновляем данные
            document.querySelector('.balance-amount').textContent = 
                this.currentUser.balance.toFixed(2);
            
            document.querySelector('.user-profile .avatar i').className = 
                this.currentUser.avatar ? 'fas fa-user-circle' : 'fas fa-user';
            
            // Скрываем кнопки входа/регистрации
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            
        } else {
            // Скрываем профиль
            userProfile.style.display = 'none';
            
            // Показываем кнопки входа/регистрации
            loginBtn.style.display = 'flex';
            registerBtn.style.display = 'flex';
        }
    }
    
    startBalanceUpdates() {
        // Имитация обновления баланса через WebSocket
        setInterval(() => {
            if (this.currentUser) {
                // Случайное изменение баланса (в реальности будет приходить с сервера)
                const change = Math.random() > 0.5 ? 
                    Math.random() * 10 : -Math.random() * 5;
                
                this.currentUser.balance += change;
                this.currentUser.balance = Math.max(0, this.currentUser.balance);
                
                // Обновляем в UI
                document.querySelector('.balance-amount').textContent = 
                    this.currentUser.balance.toFixed(2);
                
                // Сохраняем изменения
                localStorage.setItem('pridex_user', JSON.stringify(this.currentUser));
            }
        }, 30000); // Каждые 30 секунд
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    updateBalance(amount) {
        if (this.currentUser) {
            this.currentUser.balance += amount;
            this.updateUI();
            return true;
        }
        return false;
    }
}

// Глобальный менеджер авторизации
const authManager = new AuthManager();