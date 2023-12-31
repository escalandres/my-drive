const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.border = '2px dashed #666';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = e.dataTransfer.files;
    handleFiles(files);
});

dropZone.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
        uploadFiles(files);
    });
    fileInput.click();
});

function generarPath(cadena) {
    const subcadena = "~ / mydrive / ";
    const cadenaSinSubcadena = cadena.replace(subcadena, "");
    const cadenaSinEspacios = cadenaSinSubcadena.replace(/ /g, "");
    let cadenaProcesada = cadenaSinEspacios.slice(0, -1);
    if(cadenaProcesada === "~/mydrive") cadenaProcesada = "";
    return cadenaProcesada;
}

function uploadFiles(files) {
    const formData = new FormData();
    const path = document.getElementById('path').innerText;
    //console.log(path)
    //alert(path)
    const newPath = generarPath(path)
    
    formData.append('ruta',newPath)
    for (const file of files) {
        formData.append('file', file);
    }
    //console.log(formData)
    //alert(newPath)
    closeModal();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3001/upload', true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            //console.log('Archivos subidos con éxito');
            SendAlert('Archivos subidos con éxito','success')
            window.location.href = "/mydrive"
        } else {
            console.error('Error al subir archivos');
            SendAlert('Ocurrió un error al subir los archivos','danger')
        }
    };

    xhr.send(formData);
}

// Función para cerrar el modal
function closeModal() {
    const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
    closeButton.click();
}

document.getElementById('logoutBtn').addEventListener('click',()=>{
    Swal.fire({
        title: '¿Quieres cerrar sesión?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Cerrar sesión'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar una solicitud POST a '/logout'
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Aquí puedes agregar más encabezados según sea necesario
                },
              // Puedes enviar datos en el cuerpo de la solicitud si es necesario
              // body: JSON.stringify({ key: value })
            })
            .then(response => response.json())
            .then(data => {
                // Manejar la respuesta de la solicitud, si es necesario
                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cerrando sesión...',
                showConfirmButton: false,
                timer: 1500
                })
                window.location.href = "/"
            })
            .catch(error => {
              // Manejar errores, si los hay
                console.error('Error:', error);
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                })
            });
        }
    });
})

document.getElementById('createFolderBtn').addEventListener('click',()=>{
    // Supongamos que estás ejecutando esto en un navegador web

    // Datos para la solicitud POST
    const folderName = document.getElementById('folderName').value; // Reemplaza con el nombre de la carpeta que deseas crear
    //alert(folderName)
    // Objeto FormData para enviar el nombre de la carpeta
    // Configuración de la solicitud POST
    const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({folderName: folderName}),
    };

    // Realizar la solicitud POST
    fetch('/create-folder', requestOptions)
    .then(response => response.json())
    .then(data => {
        //console.log(data); // Mensaje de respuesta del servidor
        if(data.success){
            SendAlert('Se ha creado la carpeta','success')
            window.location.href = "/mydrive"
        }
        else{
            SendAlert('Ocurrió un error al crear la carpeta','danger')
        }
    })
    .catch(error => {
        console.error('Error:', error);
        SendAlert('Ocurrió un error al crear la carpeta','danger')
    });

})

// document.addEventListener('DOMContentLoaded', function() {
//     const filesList = document.getElementById('files');
  
//     // Crear una tabla
//     const table = document.createElement('table');
//     table.className = 'table'; // Agregar las clases de Bootstrap si lo deseas
  
//     const tableHead = document.createElement('thead');
//     const headerRow = document.createElement('tr');
//     const headers = ['Nombre', 'Tamaño', 'Última Modificación'];
  
//     headers.forEach(headerText => {
//       const th = document.createElement('th');
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });
  
//     tableHead.appendChild(headerRow);
//     table.appendChild(tableHead);
  
//     const tableBody = document.createElement('tbody');
  
//     // Obtener los elementos <a> de la lista
//     const aElements = filesList.querySelectorAll('a');
  
//     // Crear filas de la tabla utilizando los elementos <a>
//     aElements.forEach(a => {
//       const row = document.createElement('tr');
  
//       // Obtener el contenido del elemento <span class="name">
//       const nameContent = a.querySelector('.name').textContent;
  
//       // Obtener el contenido del elemento <span class="size">
//       const sizeContent = a.querySelector('.size').textContent;
  
//       // Obtener el contenido del elemento <span class="date">
//       const dateContent = a.querySelector('.date').textContent;
  
//       // Crear una celda para el nombre
//       const nameCell = document.createElement('td');
//       nameCell.textContent = nameContent;
  
//       // Crear una celda para el tamaño
//       const sizeCell = document.createElement('td');
//       sizeCell.textContent = sizeContent;
  
//       // Crear una celda para la fecha de modificación
//       const dateCell = document.createElement('td');
//       dateCell.textContent = dateContent;
  
//       // Agregar las celdas a la fila
//       row.appendChild(nameCell);
//       row.appendChild(sizeCell);
//       row.appendChild(dateCell);
  
//       // Crear un enlace
//       const link = document.createElement('a');
//       link.href = a.href;
//       link.appendChild(row);
  
//       // Crear una fila de tabla y agregar el enlace
//       const tableRow = document.createElement('tr');
//       const tableCell = document.createElement('td');
//       tableCell.appendChild(link);
//       tableRow.appendChild(tableCell);
  
//       // Agregar la fila a la tabla
//       tableBody.appendChild(tableRow);
//     });
  
//     table.appendChild(tableBody);
  
//     // Reemplazar el contenido de table-container con la tabla generada
//     const tableContainer = document.getElementById('table-container');
//     tableContainer.innerHTML = ''; // Limpia el contenido previo
//     tableContainer.appendChild(table);
//   });
  