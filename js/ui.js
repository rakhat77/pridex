/**
 * Модуль управления пользовательским интерфейсом
 */
class UIManager {
    constructor() {
        this.notifications = [];
        this.initNotifications();
    }
    
    initNotifications() {
        // Стили для уведомлений
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--surface-color);
                border-left: 4px solid var(--accent-color);
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius-sm);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 9999;
                transform: translateX(150%);
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                max-width: 350px;
                box-shadow: var(--shadow);
                backdrop-filter: blur(10px);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: var(--success-color);
            }
            
            .notification-error {
                border-left-color: var(--danger-color);
            }
            
            .notification-warning {
                border-left-color: var(--warning-color);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            
            .notification-close:hover {
                color: var(--accent-color);
                transform: scale(1.2);
            }
            
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const notification = {
            id: Date.now(),
            message,
            type,
            duration
        };
        
        this.notifications.push(notification);
        this.renderNotification(notification);
    }
    
    renderNotification(notification) {
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.id = `notification-${notification.id}`;
        
        const icon = this.getNotificationIcon(notification.type);
        
        element.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${notification.message}</span>
            <button class="notification-close" onclick="uiManager.removeNotification(${notification.id})">
                &times;
            </button>
        `;
        
        document.body.appendChild(element);
        
        // Анимация появления
        setTimeout(() => {
            element.classList.add('show');
        }, 10);
        
        // Автоудаление
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, notification.duration);
    }
    
    removeNotification(id) {
        const element = document.getElementById(`notification-${id}`);
        if (element) {
            element.classList.remove('show');
            setTimeout(() => {
                element.remove();
            }, 300);
            
            this.notifications = this.notifications.filter(n => n.id !== id);
        }
    }
    
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
    
    toggleLoading(show, text = 'Загрузка...') {
        const loader = document.getElementById('global-loader') || this.createLoader();
        
        if (show) {
            loader.querySelector('.loader-text').textContent = text;
            loader.style.display = 'flex';
        } else {
            loader.style.display = 'none';
        }
    }
    
    createLoader() {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 14, 42, 0.95);
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            z-index: 99999;
            backdrop-filter: blur(5px);
        `;
        
        loader.innerHTML = `
            <div class="spinner"></div>
            <p class="loader-text" style="margin-top: 20px; color: var(--accent-color);"></p>
        `;
        
        document.body.appendChild(loader);
        
        // Добавляем стили для спиннера
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(79, 195, 247, 0.3);
                border-radius: 50%;
                border-top-color: var(--accent-color);
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        return loader;
    }
}

// Глобальный менеджер UI
const uiManager = new UIManager();