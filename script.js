// カスタムカーソル
const cursor = document.getElementById('cursor');
const cursorDot = cursor.querySelector('.cursor-dot');
const cursorOutline = cursor.querySelector('.cursor-outline');

let cursorX = 0;
let cursorY = 0;
let dotX = 0;
let dotY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    // ドットは即座に追従
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top = cursorY + 'px';
});

// アウトラインは遅延して追従
function animateCursor() {
    dotX += (cursorX - dotX) * 0.1;
    dotY += (cursorY - dotY) * 0.1;
    
    cursorOutline.style.left = dotX + 'px';
    cursorOutline.style.top = dotY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ホバー効果
const hoverElements = document.querySelectorAll('a, button, .nav-orb, .solution-card');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
    });
});

// 実験的ナビゲーション
const navOrb = document.getElementById('navOrb');
const navMenu = document.getElementById('navMenu');

navOrb.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navOrb.style.transform = navMenu.classList.contains('active') 
        ? 'scale(1.2) rotate(180deg)' 
        : 'scale(1) rotate(0deg)';
});

// パーティクル生成
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = Math.random() * 20 + 20 + 's';
    particlesContainer.appendChild(particle);
}

// スタット数字のカウントアップ
const statNumbers = document.querySelectorAll('.stat-number');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-count'));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCount = () => {
        current += increment;
        if (current < target) {
            element.textContent = current.toFixed(1);
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    };
    
    updateCount();
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(stat => observer.observe(stat));

// 3Dヒーローシーン
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const hero3d = document.getElementById('hero3d');

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
hero3d.appendChild(renderer.domElement);

// 幾何学的な形状の作成
const geometry = new THREE.IcosahedronGeometry(2, 0);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00f5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// パーティクルシステム
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
    color: 0x00f5ff,
    size: 0.02,
    transparent: true,
    opacity: 0.6
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

camera.position.z = 5;

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    
    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.002;
    
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}
animate();

// リサイズ対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// デモセクションのインタラクション
const startDemo = document.getElementById('startDemo');
const resetDemo = document.getElementById('resetDemo');
const aiInput = document.getElementById('aiInput');
const submitQuery = document.getElementById('submitQuery');
const aiOutput = document.getElementById('aiOutput');
const neuralCanvas = document.getElementById('neuralCanvas');
const ctx = neuralCanvas.getContext('2d');

// ニューラルネットワークのビジュアライゼーション
neuralCanvas.width = neuralCanvas.offsetWidth;
neuralCanvas.height = neuralCanvas.offsetHeight;

let neurons = [];
let connections = [];

// ニューロンの初期化
function initNeurons() {
    neurons = [];
    const layers = 4;
    const neuronsPerLayer = [5, 8, 8, 3];
    
    for (let l = 0; l < layers; l++) {
        const layerNeurons = [];
        for (let n = 0; n < neuronsPerLayer[l]; n++) {
            layerNeurons.push({
                x: (l + 1) * (neuralCanvas.width / (layers + 1)),
                y: (n + 1) * (neuralCanvas.height / (neuronsPerLayer[l] + 1)),
                value: Math.random(),
                pulse: 0
            });
        }
        neurons.push(layerNeurons);
    }
    
    // コネクションの作成
    connections = [];
    for (let l = 0; l < layers - 1; l++) {
        for (let n1 = 0; n1 < neurons[l].length; n1++) {
            for (let n2 = 0; n2 < neurons[l + 1].length; n2++) {
                connections.push({
                    from: neurons[l][n1],
                    to: neurons[l + 1][n2],
                    weight: Math.random(),
                    pulse: 0
                });
            }
        }
    }
}

initNeurons();

// ニューラルネットワークの描画
function drawNeuralNetwork() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, neuralCanvas.width, neuralCanvas.height);
    
    // コネクションの描画
    connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = `rgba(0, 245, 255, ${conn.weight * 0.5 + conn.pulse})`;
        ctx.lineWidth = conn.weight * 2 + conn.pulse * 3;
        ctx.stroke();
        
        conn.pulse *= 0.95;
    });
    
    // ニューロンの描画
    neurons.forEach(layer => {
        layer.forEach(neuron => {
            ctx.beginPath();
            ctx.arc(neuron.x, neuron.y, 8 + neuron.pulse * 10, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 245, 255, ${0.8 + neuron.value * 0.2})`;
            ctx.fill();
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            neuron.pulse *= 0.9;
            neuron.value = Math.max(0, Math.min(1, neuron.value + (Math.random() - 0.5) * 0.1));
        });
    });
    
    requestAnimationFrame(drawNeuralNetwork);
}

drawNeuralNetwork();

// デモ機能
let demoActive = false;

startDemo.addEventListener('click', () => {
    demoActive = true;
    startDemo.textContent = '実行中';
    startDemo.disabled = true;
    
    // ランダムなパルスを生成
    setInterval(() => {
        if (demoActive) {
            const randomLayer = Math.floor(Math.random() * neurons.length);
            const randomNeuron = Math.floor(Math.random() * neurons[randomLayer].length);
            neurons[randomLayer][randomNeuron].pulse = 1;
            
            // 関連するコネクションにもパルスを送る
            connections.forEach(conn => {
                if (conn.from === neurons[randomLayer][randomNeuron] || 
                    conn.to === neurons[randomLayer][randomNeuron]) {
                    conn.pulse = 0.5;
                }
            });
        }
    }, 500);
});

resetDemo.addEventListener('click', () => {
    demoActive = false;
    startDemo.textContent = '開始';
    startDemo.disabled = false;
    aiInput.value = '';
    aiOutput.innerHTML = '<div class="output-placeholder">AIの応答がここに表示されます</div>';
    initNeurons();
});

submitQuery.addEventListener('click', () => {
    const query = aiInput.value.trim();
    if (query) {
        // AIの応答をシミュレート
        aiOutput.innerHTML = '<div class="loading">分析中...</div>';
        
        // 全ニューロンを活性化
        neurons.forEach(layer => {
            layer.forEach(neuron => {
                neuron.pulse = 1;
            });
        });
        
        connections.forEach(conn => {
            conn.pulse = 1;
        });
        
        setTimeout(() => {
            const responses = [
                'ご質問の内容について、AIが高度な分析を実行しました。データパターンから興味深い洞察が得られています。',
                'ニューラルネットワークが複雑な計算を完了しました。お客様のニーズに最適化されたソリューションを提案します。',
                '深層学習モデルが応答を生成しました。さらに詳細な分析が必要な場合は、お知らせください。'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            aiOutput.innerHTML = `
                <div class="ai-response">
                    <strong>AI Response:</strong>
                    <p>${randomResponse}</p>
                    <div class="response-meta">
                        <span>処理時間: 0.${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}秒</span>
                        <span>信頼度: ${Math.floor(Math.random() * 15) + 85}%</span>
                    </div>
                </div>
            `;
        }, 2000);
    }
});

// Tiltエフェクト
const tiltElements = document.querySelectorAll('[data-tilt]');
tiltElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// スムーススクロール
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // ナビゲーションメニューを閉じる
            navMenu.classList.remove('active');
            navOrb.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// フォーム送信
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // 送信アニメーション
    const submitButton = contactForm.querySelector('.submit-button');
    submitButton.innerHTML = '<span>送信中...</span>';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.innerHTML = '<span>送信完了！</span>';
        submitButton.style.background = 'linear-gradient(45deg, #00ff00, #00ff88)';
        
        setTimeout(() => {
            contactForm.reset();
            submitButton.innerHTML = '<span>送信</span><div class="submit-glow"></div>';
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 2000);
    }, 1500);
});

// ページロード時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // GSAPアニメーション
    gsap.from('.hero-content', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.stat-card', {
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        delay: 0.5,
        ease: 'power3.out'
    });
});