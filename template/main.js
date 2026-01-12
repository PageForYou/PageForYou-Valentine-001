document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mailbox = document.getElementById('mailbox');
    const mailboxContainer = document.getElementById('mailboxContainer');
    const mailboxScreen = document.getElementById('mailbox-screen');
    const appScreen = document.getElementById('app-screen');
    let isOpened = false;

    // 3D Model variables
    let scene, camera, renderer, model, controls;

    // Make mailbox appear from bottom
    function showMailbox() {
        mailboxContainer.style.bottom = '0px';
    }

    // Initialize 3D Model Viewer
    function init3DViewer() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xfff0f5); // Light pink background
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('model-viewer').appendChild(renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Add OrbitControls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;
        
        // Load 3D model
        const loader = new THREE.GLTFLoader();
        loader.load(
            'assets/3d/TestBlender1.glb', // Update with your model filename
            function (gltf) {
                model = gltf.scene;
                scene.add(model);
                
                // Center the model
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.x = -center.x;
                model.position.y = -center.y;
                model.position.z = -center.z;
                
                // Auto-rotate
                model.rotation.y = 0.01;
            },
            undefined,
            function (error) {
                console.error('Error loading 3D model:', error);
            }
        );
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
        
        // Start animation loop
        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        
        if (model) {
            model.rotation.y += 0.005; // Slow rotation
        }
        
        if (controls) {
            controls.update();
        }
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    // Handle mailbox interaction
    function handleMailboxInteraction() {
        if (isOpened) {
            // Show 3D model when mailbox is already open
            document.getElementById('model-viewer').style.display = 'block';
            return;
        }
        
        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        // Open the mailbox
        setTimeout(() => {
            mailbox.style.animation = '';
            mailbox.classList.add('open');
            isOpened = true;
            
            // // Initialize and show 3D model
            // init3DViewer();
            // document.getElementById('model-viewer').style.display = 'block';
        }, 300);
    }

    // Close 3D viewer when clicking outside
    document.addEventListener('click', function(e) {
        const modelViewer = document.getElementById('model-viewer');
        if (isOpened && modelViewer && modelViewer.style.display === 'block' && 
            !e.target.closest('#model-viewer')) {
            modelViewer.style.display = 'none';
        }
    });

    // Event Listeners
    mailbox.addEventListener('click', handleMailboxInteraction);
    
    // Also allow clicking anywhere on screen
    document.addEventListener('click', function(e) {
        if (e.target === mailbox) return; // Prevent double trigger
        handleMailboxInteraction();
    });

    // Start the animation
    setTimeout(showMailbox, 1000);
});