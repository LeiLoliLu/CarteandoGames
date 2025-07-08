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
  
  // Drag and Drop funcionalidad simple
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
  
  let pressTimer = null;
  let movedDuringPress = false;
  
  function startPressTimer(e) {
    const target = e.target.closest('.image-item');
    if (!target) return;
  
    movedDuringPress = false;
  
    pressTimer = setTimeout(() => {
      if (!movedDuringPress) {
        openZoom(target.querySelector('img'));
      }
    }, 500);
  }
  
  function cancelPressTimer() {
    clearTimeout(pressTimer);
    pressTimer = null;
    movedDuringPress = false;
  }
  
  function markAsMoved() {
    movedDuringPress = true;
  }
  
  // Eventos para zoom
  imageContainer.addEventListener('mousedown', startPressTimer);
  imageContainer.addEventListener('touchstart', startPressTimer);
  
  imageContainer.addEventListener('mouseup', cancelPressTimer);
  imageContainer.addEventListener('mouseleave', cancelPressTimer);
  imageContainer.addEventListener('touchend', cancelPressTimer);
  
  imageContainer.addEventListener('mousemove', markAsMoved);
  imageContainer.addEventListener('touchmove', markAsMoved);
  
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
  