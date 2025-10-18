document.addEventListener("DOMContentLoaded", function() {
    const colors = document.querySelectorAll('.color');
    const gridElement = document.querySelector('.grid');
    
    let currentColor = "black";
    
    const activate = (event) => {
      if (event.target.style.backgroundColor && event.target.style.backgroundColor !== 'transparent') {
        event.target.style.backgroundColor = 'transparent';
      } else {
        event.target.style.backgroundColor = currentColor;    
      }
    }
    
    const changeColor = (event) => {
      currentColor = event.target.attributes["data-color"].value;
    }
    
    colors.forEach(color => {
      color.addEventListener("click", changeColor);
    })
    
    for (let i = 0; i < 24 * 24; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      
      gridElement.appendChild(cell);
    }
    
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
      cell.addEventListener('click', activate);
    });
  });