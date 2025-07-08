const images = [
    { id: 1, src: 'https://placehold.co/600x400?text=Foto+1' },
    { id: 2, src: 'https://placehold.co/400x600?text=Foto+2' },
    { id: 3, src: 'https://placehold.co/1200x800?text=Foto+3' },
    { id: 4, src: 'https://placehold.co/800x1200?text=Foto+4' },
    { id: 5, src: 'https://placehold.co/1000x667?text=Foto+5' },
    { id: 6, src: 'https://placehold.co/1024x768?text=Foto+6' },
    { id: 7, src: 'https://placehold.co/1080x1350?text=Foto+7' },
    { id: 8, src: 'https://placehold.co/1080x1080?text=Foto+8' }
  ];
  
  // Mezcla aleatoriamente las imágenes al inicio
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  const imageContainer = document.getElementById('imageContainer');
  
  function renderImages() {
    const shuffled = shuffle([...images]);
    imageContainer.innerHTML = '';
    shuffled.forEach(img => {
      const div = document.createElement('div');
      div.classList.add('image-item');
      div.setAttribute('draggable', true);
      div.setAttribute('data-id', img.id);
  
      const imageElement = document.createElement('img');
      imageElement.src = img.src;
      imageElement.alt = `Foto ${img.id}`;
      imageElement.dataset.full = img.src; // misma imagen para zoom
  
      div.appendChild(imageElement);
      imageContainer.appendChild(div);
    });
  }
  
  renderImages();
  
  // Drag & Drop para mouse
  let dragged;
  
  document.addEventListener('dragstart', e => {
    if (e.target.classList.contains('image-item')) {
      dragged = e.target;
      e.dataTransfer.effectAllowed = 'move';
    }
  });
  
  document.addEventListener('dragover', e => {
    if (e.target.classList.contains('image-item')) {
      e.preventDefault();
    }
  });
  
  document.addEventListener('drop', e => {
    if (e.target.classList.contains('image-item')) {
      e.preventDefault();
      if (dragged !== e.target) {
        const container = dragged.parentNode;
        const draggedIndex = [...container.children].indexOf(dragged);
        const targetIndex = [...container.children].indexOf(e.target);
  
        if (draggedIndex < targetIndex) {
          container.insertBefore(dragged, e.target.nextSibling);
        } else {
          container.insertBefore(dragged, e.target);
        }
      }
    }
  });
  
  // Drag & Drop para touch (móvil)
  let touchDragged = null;
  let movedDuringPress = false;
  let pressTimer = null;
  
  imageContainer.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    const target = e.target.closest('.image-item');
    if (!target) return;
  
    touchDragged = target;
    movedDuringPress = false;
  
    pressTimer = setTimeout(() => {
      if (!movedDuringPress && touchDragged) {
        openZoom(touchDragged.querySelector('img'));
        touchDragged = null;
      }
    }, 500);
  });
  
  imageContainer.addEventListener('touchmove', e => {
    if (!touchDragged) return;
  
    movedDuringPress = true;
  
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
  
    const container = touchDragged.parentNode;
    const children = [...container.children];
  
    for (let child of children) {
      if (child === touchDragged) continue;
  
      const rect = child.getBoundingClientRect();
  
      if (
        currentX > rect.left &&
        currentX < rect.right &&
        currentY > rect.top &&
        currentY < rect.bottom
      ) {
        const draggedIndex = children.indexOf(touchDragged);
        const targetIndex = children.indexOf(child);
  
        if (draggedIndex < targetIndex) {
          container.insertBefore(touchDragged, child.nextSibling);
        } else {
          container.insertBefore(touchDragged, child);
        }
        break;
      }
    }
  });
  
  imageContainer.addEventListener('touchend', e => {
    touchDragged = null;
    clearTimeout(pressTimer);
    pressTimer = null;
  });
  
  imageContainer.addEventListener('touchcancel', e => {
    touchDragged = null;
    clearTimeout(pressTimer);
    pressTimer = null;
  });
  
  // Botón para comprobar orden (solo muestra mensaje)
  document.getElementById('checkOrder').addEventListener('click', () => {
    const currentOrder = [...imageContainer.children].map(div =>
      parseInt(div.getAttribute('data-id'))
    );
    const correctOrder = images.map(img => img.id);
  
    const result = document.getElementById('result');
    if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
      result.textContent = '¡Correcto! 🎉';
      result.style.color = 'green';
    } else {
      result.textContent = 'Orden incorrecto. ¡Inténtadlo de nuevo!';
      result.style.color = 'red';
    }
  });
  
  // --- ZOOM ---
  
  function openZoom(imgEl) {
    const src = imgEl.getAttribute('data-full') || imgEl.src;
  
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
  
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
  
    const fullImage = document.createElement('img');
    fullImage.src = src;
    fullImage.alt = 'Imagen ampliada';
  
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerText = '×';
    closeButton.onclick = () => modalOverlay.remove();
  
    modalContent.appendChild(closeButton);
    modalContent.appendChild(fullImage);
    modalOverlay.appendChild(modalContent);
  
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    };
  
    document.body.appendChild(modalOverlay);
  }
  