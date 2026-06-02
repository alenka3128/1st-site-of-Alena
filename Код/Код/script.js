/**
 * ===========================================
 * ФАН-САЙТ UTOPIA SHOW - ОСНОВНОЙ СКРИПТ
 * Автор: Архипова Алёна
 * Дата: 2026
 * ===========================================
 */

// Ожидаем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Сайт Utopia Show загружен');
    
    // Инициализация всех модулей
    initLikes();
    initFilters();
    initContactForm();
    initSmoothScroll();
    updateCounters();
});

/**
 * ===========================================
 * МОДУЛЬ ЛАЙКОВ
 * ===========================================
 */

/**
 * Инициализация системы лайков
 * Находит все кнопки лайков и добавляет обработчики событий
 */
function initLikes() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    if (likeButtons.length === 0) {
        console.log('ℹ️ Кнопки лайков не найдены');
        return;
    }
    
    console.log(`👍 Найдено кнопок лайков: ${likeButtons.length}`);
    
    // Восстановление лайков из localStorage
    likeButtons.forEach(button => {
        const id = button.dataset.id;
        if (id) {
            const savedLikes = localStorage.getItem(`like_${id}`);
            const savedState = localStorage.getItem(`liked_${id}`);
            
            const countSpan = button.querySelector('.like-count');
            const heartIcon = button.querySelector('i');
            
            if (savedLikes && countSpan) {
                countSpan.textContent = savedLikes;
            }
            
            if (savedState === 'true' && heartIcon) {
                button.classList.add('liked');
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            }
        }
        
        // Добавление обработчика клика
        button.addEventListener('click', handleLikeClick);
    });
}

/**
 * Обработчик клика по кнопке лайка
 * @param {Event} event - объект события
 */
function handleLikeClick(event) {
    const button = event.currentTarget;
    const countSpan = button.querySelector('.like-count');
    const heartIcon = button.querySelector('i');
    const id = button.dataset.id;
    
    if (!countSpan || !heartIcon) return;
    
    // Текущее количество лайков
    let currentLikes = parseInt(countSpan.textContent) || 0;
    const isLiked = button.classList.contains('liked');
    
    // Анимация клика
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    if (isLiked) {
        // Убираем лайк
        button.classList.remove('liked');
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        currentLikes = Math.max(0, currentLikes - 1);
        
        if (id) localStorage.setItem(`liked_${id}`, 'false');
    } else {
        // Добавляем лайк
        button.classList.add('liked');
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        currentLikes++;
        
        if (id) localStorage.setItem(`liked_${id}`, 'true'); // ИСПРАВЛЕНО
    }
    
    // Обновляем счетчик
    countSpan.textContent = currentLikes;
    if (id) localStorage.setItem(`like_${id}`, currentLikes);
    
    // Обновляем общее количество лайков
    updateTotalLikes();
}

/**
 * ===========================================
 * МОДУЛЬ ФИЛЬТРОВ ГАЛЕРЕИ
 * ===========================================
 */

/**
 * Инициализация фильтров галереи
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const filterValue = this.dataset.filter;
            
            // Фильтруем элементы
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.dataset.category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Обновляем счетчик изображений
            updateImageCounter();
        });
    });
}

/**
 * ===========================================
 * МОДУЛЬ ФОРМЫ ОБРАТНОЙ СВЯЗИ
 * ===========================================
 */

/**
 * Инициализация формы обратной связи
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');
    
    if (!form || !messageDiv) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Получаем значения полей
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Валидация
        if (!name || !email || !message) {
            showFormMessage('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Пожалуйста, введите корректный email', 'error');
            return;
        }
        
        // Имитация отправки
        showFormMessage('Отправка...', 'info');
        
        setTimeout(() => {
            showFormMessage('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
            form.reset();
        }, 1500);
    });
}

/**
 * Проверка корректности email
 * @param {string} email - email для проверки
 * @returns {boolean} - результат проверки
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Показать сообщение в форме
 * @param {string} text - текст сообщения
 * @param {string} type - тип сообщения (success, error, info)
 */
function showFormMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    if (!messageDiv) return;
    
    messageDiv.textContent = text;
    messageDiv.className = 'form-message';
    messageDiv.classList.add(`form-message--${type}`);
    
    // Автоматически скрываем сообщение через 5 секунд
    if (type !== 'info') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
                messageDiv.style.opacity = '1';
            }, 300);
        }, 5000);
    }
}

/**
 * ===========================================
 * МОДУЛЬ СЧЕТЧИКОВ
 * ===========================================
 */

/**
 * Обновление всех счетчиков на странице
 */
function updateCounters() {
    updateImageCounter();
    updateTotalLikes();
}

/**
 * Обновление счетчика изображений
 */
function updateImageCounter() {
    const counterElement = document.getElementById('image-counter');
    if (!counterElement) return;
    
    const visibleItems = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
    const count = visibleItems.length;
    
    const counterSpan = counterElement.querySelector('.counter-value');
    if (counterSpan) {
        counterSpan.textContent = count;
    } else {
        counterElement.textContent = `Изображений: ${count}`;
    }
}

/**
 * Обновление общего количества лайков
 */
function updateTotalLikes() {
    const totalElement = document.getElementById('total-likes');
    if (!totalElement) return;
    
    let total = 0;
    document.querySelectorAll('.like-count').forEach(span => {
        total += parseInt(span.textContent) || 0;
    });
    
    const counterSpan = totalElement.querySelector('.counter-value');
    if (counterSpan) {
        counterSpan.textContent = total;
    } else {
        totalElement.textContent = `Всего лайков: ${total}`;
    }
}

/**
 * ===========================================
 * МОДУЛЬ ПЛАВНОЙ ПРОКРУТКИ
 * ===========================================
 */

/**
 * Инициализация плавной прокрутки для якорей
 */
function initSmoothScroll() {
    // Обработка всех ссылок с якорями
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Если ссылка ведет наверх страницы
            if (href === '#') {
                event.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // Поиск элемента по ID
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Плавная прокрутка к элементу
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ===========================================
 * ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
 * ===========================================
 */

// Функция для получения параметров из URL (для фильтрации на странице галереи)
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Автоматическая фильтрация при загрузке страницы галереи
const categoryParam = getUrlParameter('category');
if (categoryParam && window.location.pathname.includes('gallery.html')) {
    const filterButton = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
    if (filterButton) {
        setTimeout(() => {
            filterButton.click();
        }, 100);
    }
}

// Логирование успешной загрузки
console.log('🎉 Все модули успешно инициализированы');