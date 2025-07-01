// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面动画
    initPageAnimations();
    
    // 初始化滚动效果
    initScrollEffects();
    
    // 初始化图片懒加载
    initLazyLoading();
    
    // 初始化页面特定功能
    initPortfolioFeatures();
    initContactForm();
    initSocialLinks();
});

// 页面动画初始化
function initPageAnimations() {
    // 为需要动画的元素添加fade-in类
    const animatedElements = document.querySelectorAll('.work-item, .skill-category, .section-header');
    
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.animationDelay = `${index * 0.1}s`;
    });
    
    // 触发动画
    setTimeout(() => {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
    }, 100);
}

// 滚动效果初始化
function initScrollEffects() {
    // 导航栏滚动效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 导航栏背景透明度变化
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 平滑滚动到锚点
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 图片懒加载初始化
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 降级处理：直接加载所有图片
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// 工具函数：防抖
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 页面加载动画
window.addEventListener('load', function() {
    // 页面完全加载后的动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 控制台日志（开发环境）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('设计师作品集网站已加载完成');
    console.log('当前页面:', window.location.pathname);
}

// 作品集页面功能
function initPortfolioFeatures() {
    // 作品筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // 更新按钮状态
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // 筛选作品
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease-in-out';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 作品详情模态框
    const modal = document.getElementById('projectModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        const portfolioLinks = document.querySelectorAll('.portfolio-link');

        // 打开模态框
        portfolioLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 获取项目数据
                const projectData = getProjectData(this.closest('.portfolio-item'));
                
                // 更新模态框内容
                updateModalContent(projectData);
                
                // 显示模态框
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        // 关闭模态框
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // 点击模态框外部关闭
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// 获取项目数据
function getProjectData(portfolioItem) {
    const title = portfolioItem.querySelector('h3').textContent;
    const category = portfolioItem.querySelector('p').textContent;
    const categoryType = portfolioItem.getAttribute('data-category');
    
    const projectData = {
        title: title,
        category: category,
        categoryType: categoryType,
        date: '2024年',
        description: {
            overview: '这是一个详细的项目描述，包含了项目的背景、目标和解决方案。',
            challenge: '项目中遇到的主要挑战包括用户需求的多样性、技术限制和预算约束等。',
            process: '设计过程包括用户研究、概念设计、原型制作、用户测试和最终实现等阶段。',
            result: '最终项目获得了良好的用户反馈，提升了用户体验和业务指标。'
        },
        images: ['../assets/img/project-detail.jpg']
    };
    
    return projectData;
}

// 更新模态框内容
function updateModalContent(data) {
    const modal = document.getElementById('projectModal');
    
    // 更新标题
    modal.querySelector('.project-info h2').textContent = data.title;
    
    // 更新分类和日期
    const projectMeta = modal.querySelector('.project-meta');
    projectMeta.innerHTML = `
        <span class="project-category">${data.category}</span>
        <span class="project-date">${data.date}</span>
    `;
    
    // 更新描述
    const projectDescription = modal.querySelector('.project-description');
    projectDescription.innerHTML = `
        <h3>项目概述</h3>
        <p>${data.description.overview}</p>
        
        <h3>设计挑战</h3>
        <p>${data.description.challenge}</p>
        
        <h3>设计过程</h3>
        <p>${data.description.process}</p>
        
        <h3>最终成果</h3>
        <p>${data.description.result}</p>
    `;
    
    // 更新图片（如果有的话）
    if (data.images && data.images.length > 0) {
        const projectGallery = modal.querySelector('.project-gallery img');
        projectGallery.src = data.images[0];
        projectGallery.alt = data.title;
    }
}

// 联系表单功能
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // 实时表单验证
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });

        // 字符计数（用于项目描述）
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.addEventListener('input', function() {
                const length = this.value.length;
                const minLength = 20;
                
                // 更新字符计数
                let counter = this.parentNode.querySelector('.char-counter');
                if (!counter) {
                    counter = document.createElement('div');
                    counter.className = 'char-counter';
                    counter.style.cssText = `
                        font-size: 12px;
                        color: #666;
                        text-align: right;
                        margin-top: 5px;
                    `;
                    this.parentNode.appendChild(counter);
                }
                
                counter.textContent = `${length}/${minLength} 字符`;
                
                // 颜色变化
                if (length >= minLength) {
                    counter.style.color = '#27ae60';
                } else {
                    counter.style.color = '#666';
                }
            });
        }

        // 项目类型选择联动
        const projectTypeSelect = document.getElementById('project-type');
        const budgetSelect = document.getElementById('budget');
        
        if (projectTypeSelect && budgetSelect) {
            projectTypeSelect.addEventListener('change', function() {
                const projectType = this.value;
                
                // 重置预算选择
                budgetSelect.value = '';
                
                // 根据项目类型设置默认预算范围
                if (projectType === 'ui-design' || projectType === 'ux-design') {
                    budgetSelect.querySelector('option[value="10k-50k"]').selected = true;
                } else if (projectType === 'brand-design') {
                    budgetSelect.querySelector('option[value="under-10k"]').selected = true;
                } else if (projectType === 'web-design') {
                    budgetSelect.querySelector('option[value="50k-100k"]').selected = true;
                }
            });
        }
    }
}

// 表单提交处理
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // 验证所有字段
    if (!validateForm(form)) {
        return;
    }
    
    // 显示提交状态
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '发送中...';
    submitBtn.disabled = true;
    
    // 模拟表单提交
    setTimeout(() => {
        showSuccessMessage('消息发送成功！我会在24小时内回复您。');
        
        // 重置表单
        form.reset();
        
        // 恢复按钮状态
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// 表单验证
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// 字段验证
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // 清除之前的错误
    clearFieldError(e);
    
    // 必填字段验证
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }
    
    // 邮箱验证
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '请输入有效的邮箱地址');
            return false;
        }
    }
    
    // 项目描述长度验证
    if (fieldName === 'message' && value) {
        if (value.length < 20) {
            showFieldError(field, '项目描述至少需要20个字符');
            return false;
        }
    }
    
    return true;
}

// 显示字段错误
function showFieldError(field, message) {
    // 移除之前的错误信息
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // 添加错误样式
    field.style.borderColor = '#e74c3c';
    
    // 创建错误信息元素
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    errorElement.textContent = message;
    
    // 插入错误信息
    field.parentNode.appendChild(errorElement);
}

// 清除字段错误
function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = '#e5e5e5';
}

// 显示成功消息
function showSuccessMessage(message) {
    // 创建成功消息元素
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    successElement.textContent = message;
    
    // 添加到页面
    document.body.appendChild(successElement);
    
    // 3秒后自动移除
    setTimeout(() => {
        successElement.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.parentNode.removeChild(successElement);
            }
        }, 300);
    }, 3000);
}

// 社交媒体链接处理
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.querySelector('span:last-child').textContent;
            showSocialInfo(platform);
        });
    });
}

// 显示社交媒体信息
function showSocialInfo(platform) {
    const messages = {
        '微信': '请扫描二维码或搜索微信号：designer_portfolio',
        'LinkedIn': '访问我的LinkedIn主页：linkedin.com/in/designer',
        '微博': '关注我的微博：@设计师作品集',
        'Instagram': '关注我的Instagram：@designer_portfolio'
    };
    
    const message = messages[platform] || '请通过其他方式联系我';
    showSuccessMessage(message);
}

// 添加动画样式
const additionalStyles = `
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

// 将动画样式添加到页面
const style = document.createElement('style');
style.textContent = additionalStyles;
document.head.appendChild(style); 